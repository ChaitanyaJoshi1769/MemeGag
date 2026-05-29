import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationRequest } from '@memegag/shared-types';

@Controller('v1/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  async sendNotification(@Body() req: CreateNotificationRequest) {
    return this.notificationService.sendNotification(req);
  }

  @Post('send-bulk')
  async sendBulk(@Body() { userIds, notification }: any) {
    return this.notificationService.sendBulkNotifications(userIds, notification);
  }
}
