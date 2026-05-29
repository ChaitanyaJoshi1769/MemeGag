import { Module } from '@nestjs/common';
import { AIModule } from './modules/ai/ai.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule, AIModule],
})
export class AppModule {}
