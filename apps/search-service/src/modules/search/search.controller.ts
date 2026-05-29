import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('v1/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('posts')
  async searchPosts(@Query('q') query: string, @Query('limit') limit: number = 20) {
    return this.searchService.searchPosts(query, limit);
  }

  @Get('users')
  async searchUsers(@Query('q') query: string, @Query('limit') limit: number = 20) {
    return this.searchService.searchUsers(query, limit);
  }

  @Get('communities')
  async searchCommunities(@Query('q') query: string, @Query('limit') limit: number = 20) {
    return this.searchService.searchCommunities(query, limit);
  }

  @Get('hashtags')
  async searchHashtags(@Query('q') query: string, @Query('limit') limit: number = 20) {
    return this.searchService.searchHashtags(query, limit);
  }

  @Get('trending')
  async getTrendingHashtags(@Query('limit') limit: number = 20) {
    return this.searchService.getTrendingHashtags(limit);
  }
}
