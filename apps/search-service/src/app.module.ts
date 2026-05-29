import { Module } from '@nestjs/common';
import { SearchModule } from './modules/search/search.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule, SearchModule],
})
export class AppModule {}
