import { Module } from '@nestjs/common';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule, RealtimeModule],
})
export class AppModule {}
