import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('v1/feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('for-you')
  async getForYouFeed(
    @Query('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.feedService.getForYouFeed(userId, page, limit);
  }

  @Get('following')
  async getFollowingFeed(
    @Query('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.feedService.getFollowingFeed(userId, page, limit);
  }

  @Get('trending')
  async getTrendingFeed(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.feedService.getTrendingFeed(page, limit);
  }

  @Get('hot')
  async getHotFeed(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.feedService.getHotFeed(page, limit);
  }

  @Get('fresh')
  async getFreshFeed(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.feedService.getFreshFeed(page, limit);
  }

  @Get('community/:communityId')
  async getCommunityFeed(
    @Query('communityId') communityId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.feedService.getCommunityFeed(communityId, page, limit);
  }
}
