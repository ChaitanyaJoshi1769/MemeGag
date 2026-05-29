import { Injectable } from '@nestjs/common';
import { createLogger } from '@memegag/logger';
import prisma from '@memegag/database';

const logger = createLogger('RecommendationService');

@Injectable()
export class RecommendationService {
  async getPersonalizedRecommendations(userId: string) {
    try {
      const posts = await prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
      return { recommendations: posts };
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get recommendations');
      throw error;
    }
  }

  async getTrendingTopics() {
    try {
      const posts = await prisma.post.findMany({
        where: { status: 'TRENDING' },
        orderBy: { viewCount: 'desc' },
        take: 10,
      });
      return { trending: posts };
    } catch (error) {
      logger.error({ error }, 'Failed to get trending');
      throw error;
    }
  }

  async getSimilarPosts(postId: string) {
    try {
      const post = await prisma.post.findUnique({ where: { id: postId } });
      const similar = await prisma.post.findMany({
        where: { type: post?.type, status: 'PUBLISHED' },
        take: 10,
      });
      return { similar };
    } catch (error) {
      logger.error({ error, postId }, 'Failed to get similar posts');
      throw error;
    }
  }
}
