import { Injectable } from '@nestjs/common';
import { createLogger } from '@memegag/logger';
import prisma from '@memegag/database';

const logger = createLogger('SearchService');

@Injectable()
export class SearchService {
  async searchPosts(query: string, limit: number = 20) {
    try {
      if (!query || query.length < 2) {
        return { results: [], total: 0 };
      }

      const results = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { some: { tag: { contains: query, mode: 'insensitive' } } } },
          ],
          status: 'PUBLISHED',
        },
        include: { user: true, community: true },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });

      return {
        results,
        total: results.length,
      };
    } catch (error) {
      logger.error({ error, query }, 'Post search failed');
      throw error;
    }
  }

  async searchUsers(query: string, limit: number = 20) {
    try {
      if (!query || query.length < 2) {
        return { results: [], total: 0 };
      }

      const results = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { displayName: { contains: query, mode: 'insensitive' } },
          ],
          status: 'ACTIVE',
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          bio: true,
          isVerified: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return {
        results,
        total: results.length,
      };
    } catch (error) {
      logger.error({ error, query }, 'User search failed');
      throw error;
    }
  }

  async searchCommunities(query: string, limit: number = 20) {
    try {
      if (!query || query.length < 2) {
        return { results: [], total: 0 };
      }

      const results = await prisma.community.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { creator: { select: { username: true, avatar: true } } },
        orderBy: { memberCount: 'desc' },
        take: limit,
      });

      return {
        results,
        total: results.length,
      };
    } catch (error) {
      logger.error({ error, query }, 'Community search failed');
      throw error;
    }
  }

  async searchHashtags(query: string, limit: number = 20) {
    try {
      if (!query || query.length < 2) {
        return { results: [], total: 0 };
      }

      const results = await prisma.postTag.findMany({
        where: {
          tag: { contains: query, mode: 'insensitive' },
        },
        distinct: ['tag'],
        select: { tag: true },
        orderBy: { tag: 'asc' },
        take: limit,
      });

      return {
        results: results.map((t) => t.tag),
        total: results.length,
      };
    } catch (error) {
      logger.error({ error, query }, 'Hashtag search failed');
      throw error;
    }
  }

  async getTrendingHashtags(limit: number = 20) {
    try {
      const trendingThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const results = await prisma.postTag.groupBy({
        by: ['tag'],
        where: {
          post: {
            publishedAt: { gte: trendingThreshold },
            status: 'PUBLISHED',
          },
        },
        _count: {
          tag: true,
        },
        orderBy: {
          _count: {
            tag: 'desc',
          },
        },
        take: limit,
      });

      return {
        results: results.map((r) => ({
          tag: r.tag,
          count: r._count.tag,
        })),
        total: results.length,
      };
    } catch (error) {
      logger.error({ error }, 'Trending hashtags fetch failed');
      throw error;
    }
  }
}
