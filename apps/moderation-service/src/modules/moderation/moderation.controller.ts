import { Controller, Post, Body } from '@nestjs/common';
import { ModerationService } from './moderation.service';

@Controller('v1/moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('analyze')
  async analyzeContent(@Body() { content, contentType }: { content: string; contentType: string }) {
    return this.moderationService.analyzeContent(content, contentType);
  }

  @Post('flag-content')
  async flagContent(@Body() { targetId, targetType, reason }: any) {
    return this.moderationService.flagContent(targetId, targetType, reason);
  }

  @Post('resolve-report')
  async resolveReport(
    @Body() { reportId, decision, notes }: { reportId: string; decision: string; notes?: string }
  ) {
    return this.moderationService.resolveReport(reportId, decision, notes);
  }
}
