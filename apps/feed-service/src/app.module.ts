import { Module } from '@nestjs/common';
import { FeedModule } from './modules/feed/feed.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule, FeedModule],
})
export class AppModule {}
