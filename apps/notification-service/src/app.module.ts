import { Module } from '@nestjs/common';
import { NotificationModule } from './modules/notification/notification.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule, NotificationModule],
})
export class AppModule {}
