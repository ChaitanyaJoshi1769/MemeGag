import { Module } from '@nestjs/common';
import { LivestreamModule } from './modules/livestream/livestream.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule, LivestreamModule],
})
export class AppModule {}
