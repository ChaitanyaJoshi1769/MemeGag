import { Module } from '@nestjs/common';
import { MediaModule } from './modules/media/media.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule, MediaModule],
})
export class AppModule {}
