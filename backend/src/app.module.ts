import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ApplicationsModule } from './applications/applications.module';
import { RemindersModule } from './reminders/reminders.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CvsModule } from './cvs/cvs.module'; 
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ApplicationsModule,
    RemindersModule,
    AnalyticsModule,
    CvsModule,              
    SubscriptionsModule,
    NotificationsModule,
    StorageModule,
  ],
})
export class AppModule {}