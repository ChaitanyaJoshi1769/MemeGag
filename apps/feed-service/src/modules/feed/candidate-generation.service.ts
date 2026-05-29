import { Injectable } from '@nestjs/common';
import { createLogger } from '@memegag/logger';
import prisma from '@memegag/database';

const logger = createLogger('CandidateGenerationService');

@Injectable()
export class CandidateGenerationService {
  /**
   * Generate candidates for "For You" feed
   * Uses multiple strategies to get diverse content
   */
  async generateForYouCandidates(userId: string, limit: number): Promise<any[]> {
    try {
      const candidates = new Map();

      // Strategy 1: Get trending posts (50%)
      const trendingPosts = await this.getTrendingCandidates(Math.ceil(limit * 0.5));
      trendingPosts.forEach((post) => candidates.set(post.id, post));

      // Strategy 2: Get posts from followed users (30%)
      const followingPosts = await this.getFollowingCandidates(userId, Math.ceil(limit * 0.3));
      followingPosts.forEach((post) => candidates.set(post.id, post));

      // Strategy 3: Get posts from similar interests (20%)
      const similarPosts = await this.getSimilarInterestCandidates(userId, Math.ceil(limit * 0.2));
      similarPosts.forEach((post) => candidates.set(post.id, post));

      // Return diverse set of candidates
      return Array.from(candidates.values()).slice(0, limit);
    } catch (error) {
      logger.error({ error, userId }, 'Failed to generate For You candidates');
      throw error;
    }
  }

  /**
   * Get trending posts from last 24 hours
   */
  private async getTrendingCandidates(limit: number): Promise<any[]> {
    const trendingThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { gte: trendingThreshold },
      },
      orderBy: [{ likeCount: 'desc' }, { commentCount: 'desc' }],
      take: limit,
      include: { user: true, metadata: true },
    });
  }

  /**
   * Get posts from followed users
   */
  private async getFollowingCandidates(userId: string, limit: number): Promise<any[]> {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    if (followingIds.length === 0) {
      return [];
    }

    return prisma.post.findMany({
      where: {
        userId: { in: followingIds },
        status: 'PUBLISHED',
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      include: { user: true, metadata: true },
    });
  }

  /**
   * Get posts based on similar interests
   * This is a placeholder - in production, use embeddings and vector similarity
   */
  private async getSimilarInterestCandidates(userId: string, limit: number): Promise<any[]> {
    // Get user's recent interactions to determine interests
    const recentPosts = await prisma.post.findMany({
      where: {
        reactions: {
          some: {
            userId,
          },
        },
      },
      take: 5,
      select: { tags: true, communityId: true },
    });

    const tags = Array.from(new Set(recentPosts.flatMap((p) => p.tags.map((t) => t.tag))));
    const communityIds = Array.from(new Set(recentPosts.map((p) => p.communityId).filter(Boolean)));

    const whereCondition: any = {
      status: 'PUBLISHED',
      OR: [],
    };

    if (tags.length > 0) {
      whereCondition.OR.push({
        tags: {
          some: {
            tag: { in: tags },
          },
        },
      });
    }

    if (communityIds.length > 0) {
      whereCondition.OR.push({
        communityId: { in: communityIds },
      });
    }

    if (whereCondition.OR.length === 0) {
      return [];
    }

    return prisma.post.findMany({
      where: whereCondition,
      orderBy: { publishedAt: 'desc' },
      take: limit,
      include: { user: true, metadata: true },
    });
  }
}
