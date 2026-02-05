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

  async update(id: string, userId: string, data: any) {
    return this.prisma.application.update({
      where: { id },
      data: {
        ...data,
        // Auto-set timestamps based on status
        ...(data.status === 'INTERVIEW' && !data.interviewDate && { interviewDate: new Date() }),
        ...(data.status === 'OFFER' && !data.offerReceivedAt && { offerReceivedAt: new Date() }),
        ...(data.status === 'REJECTED' && !data.rejectedAt && { rejectedAt: new Date() }),
      },
    });
  }

  async delete(id: string, userId: string) {
    return this.prisma.application.delete({
      where: { id },
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
