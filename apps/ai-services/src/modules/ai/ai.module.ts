import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { MemeGenerationService } from './meme-generation.service';
import { ImageAnalysisService } from './image-analysis.service';
import { TextGenerationService } from './text-generation.service';

@Module({
  controllers: [AIController],
  providers: [MemeGenerationService, ImageAnalysisService, TextGenerationService],
  exports: [MemeGenerationService, ImageAnalysisService, TextGenerationService],
})
export class AIModule {}
