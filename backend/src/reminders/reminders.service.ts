import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemindersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    try {
      // Ensure reminderDate is a valid Date object
      const reminderDate = new Date(data.reminderDate);
      
      // Validate date
      if (isNaN(reminderDate.getTime())) {
        throw new Error('Invalid reminder date');
      }
  
      return this.prisma.reminder.create({
        data: {
          userId,
          applicationId: data.applicationId,
          title: data.title,
          description: data.description || '',
          reminderDate: reminderDate,
        },
        include: {
          application: {
            select: {
              jobTitle: true,
              company: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  }

  async findAll(userId: string) {
    return this.prisma.reminder.findMany({
      where: { userId },
      include: {
        application: {
          select: {
            jobTitle: true,
            company: true,
          },
        },
      },
      orderBy: { reminderDate: 'asc' },
    });
  }

  async findUpcoming(userId: string) {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    return this.prisma.reminder.findMany({
      where: {
        userId,
        reminderDate: {
          gte: now,
          lte: nextWeek,
        },
        isSent: false,
        isCompleted: false,
      },
      include: {
        application: {
          select: {
            jobTitle: true,
            company: true,
          },
        },
      },
      orderBy: { reminderDate: 'asc' },
    });
  }

  async markComplete(id: string, userId: string) {
    return this.prisma.reminder.update({
      where: { id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
      },
    });
  }

  async delete(id: string, userId: string) {
    return this.prisma.reminder.delete({
      where: { id },
    });
  }
}