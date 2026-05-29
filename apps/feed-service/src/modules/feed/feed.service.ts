import { Injectable } from '@nestjs/common';
import { createLogger } from '@memegag/logger';
import prisma from '@memegag/database';
import { Post, PaginatedResponse } from '@memegag/shared-types';
import { RankingService } from './ranking.service';
import { CandidateGenerationService } from './candidate-generation.service';

const logger = createLogger('FeedService');

@Injectable()
export class FeedService {
  constructor(
    private readonly rankingService: RankingService,
    private readonly candidateGenerationService: CandidateGenerationService
  ) {}

  async getForYouFeed(userId: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<Post>> {
    try {
      const offset = (page - 1) * limit;

      // Generate candidates
      const candidates = await this.candidateGenerationService.generateForYouCandidates(userId, limit * 3);

      // Rank candidates
      const rankedPosts = await this.rankingService.rankPosts(candidates, userId);

      // Get paginated results
      const posts = rankedPosts.slice(offset, offset + limit);

      const total = await prisma.post.count({
        where: { status: 'PUBLISHED' },
      });

      return {
        items: posts as Post[],
        total,
        page,
        pageSize: limit,
        hasNextPage: offset + limit < total,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      logger.error({ error, userId }, 'Failed to generate For You feed');
      throw error;
    }
  }

  async getFollowingFeed(userId: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<Post>> {
    try {
      const offset = (page - 1) * limit;

      // Get user's following list
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });

      const followingIds = following.map((f) => f.followingId);

      // Get posts from following users
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where: {
            userId: { in: followingIds },
            status: 'PUBLISHED',
          },
          orderBy: { publishedAt: 'desc' },
          skip: offset,
          take: limit,
          include: { user: true, community: true },
        }),
        prisma.post.count({
          where: {
            userId: { in: followingIds },
            status: 'PUBLISHED',
          },
        }),
      ]);

      return {
        items: posts as Post[],
        total,
        page,
        pageSize: limit,
        hasNextPage: offset + limit < total,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      logger.error({ error, userId }, 'Failed to generate Following feed');
      throw error;
    }
  }

  async getTrendingFeed(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Post>> {
    try {
      const offset = (page - 1) * limit;
      const trendingThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where: {
            status: 'PUBLISHED',
            publishedAt: { gte: trendingThreshold },
          },
          orderBy: [{ likeCount: 'desc' }, { commentCount: 'desc' }],
          skip: offset,
          take: limit,
          include: { user: true, community: true },
        }),
        prisma.post.count({
          where: {
            status: 'PUBLISHED',
            publishedAt: { gte: trendingThreshold },
          },
        }),
      ]);

      return {
        items: posts as Post[],
        total,
        page,
        pageSize: limit,
        hasNextPage: offset + limit < total,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to generate Trending feed');
      throw error;
    }
  }

  async getHotFeed(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Post>> {
    try {
      const offset = (page - 1) * limit;
      const hotThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where: {
            status: 'PUBLISHED',
            publishedAt: { gte: hotThreshold },
          },
          orderBy: [
            { viewCount: 'desc' },
            { likeCount: 'desc' },
            { shareCount: 'desc' },
          ],
          skip: offset,
          take: limit,
          include: { user: true, community: true },
        }),
        prisma.post.count({
          where: {
            status: 'PUBLISHED',
            publishedAt: { gte: hotThreshold },
          },
        }),
      ]);

      return {
        items: posts as Post[],
        total,
        page,
        pageSize: limit,
        hasNextPage: offset + limit < total,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to generate Hot feed');
      throw error;
    }
  }

  async getFreshFeed(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Post>> {
    try {
      const offset = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where: { status: 'PUBLISHED' },
          orderBy: { publishedAt: 'desc' },
          skip: offset,
          take: limit,
          include: { user: true, community: true },
        }),
        prisma.post.count({ where: { status: 'PUBLISHED' } }),
      ]);

      return {
        items: posts as Post[],
        total,
        page,
        pageSize: limit,
        hasNextPage: offset + limit < total,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to generate Fresh feed');
      throw error;
    }
  }

  async getCommunityFeed(
    communityId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Post>> {
    try {
      const offset = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where: {
            communityId,
            status: 'PUBLISHED',
          },
          orderBy: { publishedAt: 'desc' },
          skip: offset,
          take: limit,
          include: { user: true, community: true },
        }),
        prisma.post.count({
          where: {
            communityId,
            status: 'PUBLISHED',
          },
        }),
      ]);

      return {
        items: posts as Post[],
        total,
        page,
        pageSize: limit,
        hasNextPage: offset + limit < total,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      logger.error({ error, communityId }, 'Failed to generate Community feed');
      throw error;
    }
  }
}
