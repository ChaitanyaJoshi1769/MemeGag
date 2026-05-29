import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  async trackEvent(@Body() data: any) {
    return this.analyticsService.trackEvent(data);
  }

  @Get('dashboard')
  async getDashboard(@Query('userId') userId: string) {
    return this.analyticsService.getDashboard(userId);
  }
}
