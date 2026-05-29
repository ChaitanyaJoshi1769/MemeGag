import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { EmailService } from './email.service';
import { PushNotificationService } from './push-notification.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, EmailService, PushNotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
