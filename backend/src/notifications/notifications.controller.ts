import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('test-reminder-email')
  async testReminderEmail(@CurrentUser() user: any) {
    const testData = {
      title: 'Follow up on Google Application',
      applicationTitle: 'Senior Software Engineer at Google',
      applicationId: 'test-id-123',
      description: 'Remember to send a follow-up email to the recruiter',
      reminderDate: new Date(),
    };

    return this.notificationsService.sendReminderEmail(user.email, testData);
  }

  @Post('test-weekly-summary')
  async testWeeklySummary(@CurrentUser() user: any) {
    const testData = {
      userName: user.firstName || 'User',
      total: 15,
      newThisWeek: 3,
      interviews: 2,
      offers: 1,
    };

    return this.notificationsService.sendWeeklySummary(user.email, testData);
  }
}