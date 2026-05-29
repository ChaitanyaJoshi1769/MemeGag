import { Injectable } from '@nestjs/common';
import { createLogger } from '@memegag/logger';
import prisma from '@memegag/database';
import { CreateNotificationRequest } from '@memegag/shared-types';
import { EmailService } from './email.service';
import { PushNotificationService } from './push-notification.service';

const logger = createLogger('NotificationService');

@Injectable()
export class NotificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly pushService: PushNotificationService
  ) {}

  async sendNotification(req: CreateNotificationRequest) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: req.userId,
          type: req.type,
          actorId: req.actorId,
          targetId: req.targetId,
          targetType: req.targetType,
          message: req.message,
          deepLink: req.deepLink,
        },
      });

      // Send via multiple channels
      await Promise.all([
        this.sendViaEmail(req.userId, req.message),
        this.sendViaPush(req.userId, req.message),
      ]);

      return { notificationId: notification.id, sent: true };
    } catch (error) {
      logger.error({ error }, 'Failed to send notification');
      throw error;
    }
  }

  async sendBulkNotifications(userIds: string[], notification: any) {
    try {
      const results = await Promise.all(
        userIds.map((userId) =>
          this.sendNotification({
            userId,
            ...notification,
          })
        )
      );

      return { sentCount: results.length, results };
    } catch (error) {
      logger.error({ error }, 'Failed to send bulk notifications');
      throw error;
    }
  }

  private async sendViaEmail(userId: string, message: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (user) {
        await this.emailService.send(user.email, 'Notification from MemeGag', message);
      }
    } catch (error) {
      logger.warn({ error, userId }, 'Failed to send email notification');
    }
  }

  private async sendViaPush(userId: string, message: string) {
    try {
      await this.pushService.sendPushNotification(userId, message);
    } catch (error) {
      logger.warn({ error, userId }, 'Failed to send push notification');
    }
  }
}
