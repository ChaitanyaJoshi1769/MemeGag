import { Module } from '@nestjs/common';
import { ModerationModule } from './modules/moderation/moderation.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule, ModerationModule],
})
export class AppModule {}
