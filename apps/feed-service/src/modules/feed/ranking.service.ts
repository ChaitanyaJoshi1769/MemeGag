import { Injectable } from '@nestjs/common';
import { createLogger } from '@memegag/logger';
import { Post } from '@memegag/shared-types';

const logger = createLogger('RankingService');

interface RankingScore {
  postId: string;
  score: number;
}

@Injectable()
export class RankingService {
  /**
   * Rank posts using ML-inspired scoring
   */
  async rankPosts(posts: any[], userId?: string): Promise<Post[]> {
    try {
      const scores: RankingScore[] = posts.map((post) => ({
        postId: post.id,
        score: this.calculateScore(post, userId),
      }));

      // Sort by score descending
      scores.sort((a, b) => b.score - a.score);

      // Return sorted posts
      return scores.map((score) => posts.find((p) => p.id === score.postId));
    } catch (error) {
      logger.error({ error }, 'Failed to rank posts');
      throw error;
    }
  }

  /**
   * Calculate ranking score for a post
   */
  private calculateScore(post: any, userId?: string): number {
    let score = 0;

    // Engagement velocity (recent engagement is weighted more)
    const ageInHours = (Date.now() - post.publishedAt.getTime()) / (1000 * 60 * 60);
    const engagementVelocity = (post.likeCount + post.commentCount) / Math.max(ageInHours, 1);
    score += engagementVelocity * 10;

    // Like and comment engagement
    score += post.likeCount * 5;
    score += post.commentCount * 8;
    score += post.shareCount * 15;

    // View count
    score += post.viewCount * 0.5;

    // Creator trust (verified creators get boost)
    if (post.user?.isVerified) {
      score *= 1.2;
    }

    // Post originality
    if (post.metadata?.originality) {
      score *= 1 + post.metadata.originality / 100;
    }

    // Avoid duplicates
    if (post.metadata?.isDuplicate) {
      score *= 0.5;
    }

    // Positive sentiment boost
    if (post.metadata?.sentiment === 'positive') {
      score *= 1.1;
    }

    // Decay older posts
    const decayFactor = Math.exp(-ageInHours / 168); // 1 week half-life
    score *= decayFactor;

    // Add small random component for diversity
    score += Math.random() * 10;

    return score;
  }
}
