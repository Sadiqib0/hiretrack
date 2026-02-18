import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class RemindersService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

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

  // ⬇️ THIS METHOD MUST BE INSIDE THE CLASS
  async sendDueReminders() {
    const now = new Date();
    const dueReminders = await this.prisma.reminder.findMany({
      where: {
        reminderDate: {
          lte: now,
        },
        isSent: false,
        isCompleted: false,
      },
      include: {
        user: true,
        application: {
          select: {
            id: true,
            jobTitle: true,
            company: true,
          },
        },
      },
    });

    console.log(`📧 Found ${dueReminders.length} due reminders`);

    for (const reminder of dueReminders) {
      try {
        await this.notificationsService.sendReminderEmail(
          reminder.user.email,
          {
            title: reminder.title,
            description: reminder.description,
            reminderDate: reminder.reminderDate,
            applicationTitle: `${reminder.application.jobTitle} at ${reminder.application.company}`,
            applicationId: reminder.application.id,
          },
        );

        // Mark as sent
        await this.prisma.reminder.update({
          where: { id: reminder.id },
          data: {
            isSent: true,
            sentAt: new Date(),
          },
        });

        console.log(`✅ Reminder email sent for: ${reminder.title}`);
      } catch (error) {
        console.error(`❌ Failed to send reminder ${reminder.id}:`, error);
      }
    }

    return { processed: dueReminders.length };
  }
} // ⬅️ Class ends here