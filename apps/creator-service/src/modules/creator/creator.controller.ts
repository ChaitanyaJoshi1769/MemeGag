import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { CreatorService } from './creator.service';

@Controller('v1/creator')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Get(':userId')
  async getCreatorProfile(@Param('userId') userId: string) {
    return this.creatorService.getCreatorProfile(userId);
  }

  @Put(':userId')
  async updateCreatorProfile(@Param('userId') userId: string, @Body() data: any) {
    return this.creatorService.updateCreatorProfile(userId, data);
  }

  @Get(':userId/analytics')
  async getCreatorAnalytics(@Param('userId') userId: string) {
    return this.creatorService.getCreatorAnalytics(userId);
  }

  @Post(':userId/payout')
  async requestPayout(@Param('userId') userId: string, @Body() data: any) {
    return this.creatorService.requestPayout(userId, data);
  }
}
