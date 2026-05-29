import { Injectable } from '@nestjs/common';
import { createLogger } from '@memegag/logger';
import prisma from '@memegag/database';

const logger = createLogger('BotDetectionService');

interface BotScore {
  isBotProbability: number;
  suspiciousBehaviors: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

@Injectable()
export class BotDetectionService {
  async detectBot(userId: string): Promise<BotScore> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          posts: { select: { createdAt: true }, orderBy: { createdAt: 'desc' }, take: 20 },
          reactions: { select: { createdAt: true }, orderBy: { createdAt: 'desc' }, take: 50 },
        },
      });

      if (!user) {
        return { isBotProbability: 0, suspiciousBehaviors: [], riskLevel: 'low' };
      }

      let score = 0;
      const suspiciousBehaviors: string[] = [];

      // Check 1: Account age
      const accountAgeDays = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      if (accountAgeDays < 1) {
        score += 0.3;
        suspiciousBehaviors.push('Very new account');
      }

      // Check 2: Posting frequency
      const recentPosts = user.posts;
      if (recentPosts.length > 10) {
        const timeSpan = Math.max(
          1,
          (Date.now() - recentPosts[recentPosts.length - 1].createdAt.getTime()) /
            (1000 * 60)
        );
        const postsPerHour = (recentPosts.length / timeSpan) * 60;
        if (postsPerHour > 5) {
          score += 0.3;
          suspiciousBehaviors.push('Unusually high posting frequency');
        }
      }

      // Check 3: Avatar set
      if (!user.avatar) {
        score += 0.1;
        suspiciousBehaviors.push('No profile picture');
      }

      // Check 4: Bio empty
      if (!user.bio || user.bio.length < 10) {
        score += 0.1;
        suspiciousBehaviors.push('Empty or minimal bio');
      }

      // Check 5: Reaction patterns
      const recentReactions = user.reactions;
      if (recentReactions.length > 30) {
        const timeSpan = Math.max(
          1,
          (Date.now() - recentReactions[recentReactions.length - 1].createdAt.getTime()) /
            (1000 * 60)
        );
        const reactionsPerHour = (recentReactions.length / timeSpan) * 60;
        if (reactionsPerHour > 10) {
          score += 0.25;
          suspiciousBehaviors.push('Bot-like engagement pattern');
        }
      }

      // Check 6: No interactions with other users
      if (user.posts.length === 0 && user.reactions.length === 0) {
        score += 0.2;
        suspiciousBehaviors.push('No activity');
      }

      const riskLevel = score > 0.6 ? 'high' : score > 0.3 ? 'medium' : 'low';

      return {
        isBotProbability: Math.min(score, 1),
        suspiciousBehaviors,
        riskLevel,
      };
    } catch (error) {
      logger.error({ error, userId }, 'Failed to detect bot');
      throw error;
    }
  }
}
