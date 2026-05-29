import { Module } from '@nestjs/common';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule, RecommendationModule],
})
export class AppModule {}
