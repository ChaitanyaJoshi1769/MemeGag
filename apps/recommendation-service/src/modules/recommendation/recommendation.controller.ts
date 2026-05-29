import { Controller, Get, Query } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('v1/recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('for-user')
  async getRecommendations(@Query('userId') userId: string) {
    return this.recommendationService.getPersonalizedRecommendations(userId);
  }

  @Get('trending')
  async getTrendingTopics() {
    return this.recommendationService.getTrendingTopics();
  }

  @Get('similar-posts')
  async getSimilarPosts(@Query('postId') postId: string) {
    return this.recommendationService.getSimilarPosts(postId);
  }
}
