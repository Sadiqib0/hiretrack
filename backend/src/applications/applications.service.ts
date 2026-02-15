import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.application.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: string, filters?: any) {
    return this.prisma.application.findMany({
      where: {
        userId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.company && { company: { contains: filters.company, mode: 'insensitive' } }),
      },
      include: {
        cv: true,
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.application.findFirst({
      where: { id, userId },
      include: { cv: true, reminders: true },
    });
  }

  // --- FIXED UPDATE FUNCTION ---
  async update(id: string, userId: string, data: any) {
    // 1. Destructure 'data' to remove fields that Prisma doesn't want to see in the update body.
    // This specifically removes 'userId' and 'id' which caused your "Unknown argument" error.
    const { 
      id: _id, 
      userId: _userId, 
      createdAt, 
      updatedAt, 
      cv, 
      reminders, 
      ...updateData 
    } = data;

    return this.prisma.application.update({
      // 2. Added userId to 'where' for better security
      where: { id, userId },
      data: {
        ...updateData,
        // 3. Keep your existing logic for auto-setting timestamps based on status
        ...(updateData.status === 'INTERVIEW' && !updateData.interviewDate && { interviewDate: new Date() }),
        ...(updateData.status === 'OFFER' && !updateData.offerReceivedAt && { offerReceivedAt: new Date() }),
        ...(updateData.status === 'REJECTED' && !updateData.rejectedAt && { rejectedAt: new Date() }),
      },
    });
  }
  // ------------------------------

  async delete(id: string, userId: string) {
    return this.prisma.application.delete({
      where: { id, userId }, // Best practice to include userId here too
    });
  }

  async getStats(userId: string) {
    const applications = await this.prisma.application.findMany({
      where: { userId },
    });

    const total = applications.length;
    const byStatus = {
      APPLIED: applications.filter(a => a.status === 'APPLIED').length,
      INTERVIEW: applications.filter(a => a.status === 'INTERVIEW').length,
      OFFER: applications.filter(a => a.status === 'OFFER').length,
      REJECTED: applications.filter(a => a.status === 'REJECTED').length,
    };

    const responseRate = total > 0 
      ? ((byStatus.INTERVIEW + byStatus.OFFER + byStatus.REJECTED) / total) * 100 
      : 0;

    const interviewRate = total > 0 
      ? ((byStatus.INTERVIEW + byStatus.OFFER) / total) * 100 
      : 0;

    return {
      total,
      byStatus,
      responseRate: responseRate.toFixed(2),
      interviewRate: interviewRate.toFixed(2),
    };
  }
}