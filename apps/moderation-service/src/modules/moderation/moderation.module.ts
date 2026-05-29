import { Module } from '@nestjs/common';
import { ModerationController } from './moderation.controller';
import { ModerationService } from './moderation.service';
import { ContentAnalysisService } from './content-analysis.service';
import { BotDetectionService } from './bot-detection.service';

@Module({
  controllers: [ModerationController],
  providers: [ModerationService, ContentAnalysisService, BotDetectionService],
  exports: [ModerationService],
})
export class ModerationModule {}
