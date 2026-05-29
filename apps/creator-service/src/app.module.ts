import { Module } from '@nestjs/common';
import { CreatorModule } from './modules/creator/creator.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule, CreatorModule],
})
export class AppModule {}
