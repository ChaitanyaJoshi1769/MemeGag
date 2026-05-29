import { Controller, Post, Body } from '@nestjs/common';
import { MemeGenerationService } from './meme-generation.service';
import { ImageAnalysisService } from './image-analysis.service';
import { TextGenerationService } from './text-generation.service';

@Controller('v1/ai')
export class AIController {
  constructor(
    private readonly memeGeneration: MemeGenerationService,
    private readonly imageAnalysis: ImageAnalysisService,
    private readonly textGeneration: TextGenerationService
  ) {}

  @Post('generate-meme')
  async generateMeme(@Body() { prompt, style }: { prompt: string; style?: string }) {
    return this.memeGeneration.generateMeme(prompt, style);
  }

  @Post('analyze-image')
  async analyzeImage(@Body() { imageUrl }: { imageUrl: string }) {
    return this.imageAnalysis.analyzeImage(imageUrl);
  }

  @Post('generate-caption')
  async generateCaption(@Body() { imageUrl }: { imageUrl: string }) {
    return this.imageAnalysis.generateCaption(imageUrl);
  }

  @Post('generate-text')
  async generateText(@Body() { prompt, maxTokens }: { prompt: string; maxTokens?: number }) {
    return this.textGeneration.generateText(prompt, maxTokens);
  }
}
