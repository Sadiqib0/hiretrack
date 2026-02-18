import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create email transporter
    // For development, we'll use Ethereal (fake SMTP)
    // For production, use Gmail, SendGrid, etc.
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
      // Production: Use real SMTP
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Development: Use Ethereal (test account)
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('📧 Email service initialized with Ethereal');
      console.log('📧 Preview URLs will be logged to console');
    }
  }

  async sendReminderEmail(to: string, data: any) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || '"HireTrack" <noreply@hiretrack.com>',
        to,
        subject: `Reminder: ${data.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">📅 Reminder from HireTrack</h2>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">${data.title}</h3>
              <p><strong>Application:</strong> ${data.applicationTitle}</p>
              ${data.description ? `<p>${data.description}</p>` : ''}
              <p><strong>Reminder Date:</strong> ${new Date(data.reminderDate).toLocaleString()}</p>
            </div>
            <p>Don't forget to follow up on your application!</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/applications/${data.applicationId}" 
               style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
              View Application
            </a>
            <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
              This is an automated reminder from HireTrack
            </p>
          </div>
        `,
      });

      console.log('📧 Email sent:', info.messageId);
      
      // Preview URL for development
      if (process.env.NODE_ENV !== 'production') {
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
      }

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendWeeklySummary(to: string, data: any) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || '"HireTrack" <noreply@hiretrack.com>',
        to,
        subject: '📊 Your Weekly Application Summary',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">📊 Weekly Summary</h2>
            <p>Hi ${data.userName},</p>
            <p>Here's your job application summary for this week:</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px;"><strong>Total Applications:</strong></td>
                  <td style="padding: 10px; text-align: right;">${data.total}</td>
                </tr>
                <tr>
                  <td style="padding: 10px;"><strong>New This Week:</strong></td>
                  <td style="padding: 10px; text-align: right;">${data.newThisWeek}</td>
                </tr>
                <tr>
                  <td style="padding: 10px;"><strong>Interviews:</strong></td>
                  <td style="padding: 10px; text-align: right;">${data.interviews}</td>
                </tr>
                <tr>
                  <td style="padding: 10px;"><strong>Offers:</strong></td>
                  <td style="padding: 10px; text-align: right;">${data.offers}</td>
                </tr>
              </table>
            </div>

            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/analytics" 
               style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              View Full Analytics
            </a>

            <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
              You're receiving this because you have weekly summaries enabled in your settings.
            </p>
          </div>
        `,
      });

      console.log('📧 Weekly summary sent:', info.messageId);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
      }

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Failed to send weekly summary:', error);
      throw error;
    }
  }
}