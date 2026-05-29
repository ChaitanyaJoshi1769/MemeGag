export interface FeedGenerationParams {
  userId?: string;
  feedType: 'for-you' | 'following' | 'trending' | 'hot' | 'fresh' | 'community';
  page?: number;
  limit?: number;
  communityId?: string;
}

export interface FeedRankingFactors {
  engagementVelocity: number;
  likeWeight: number;
  commentWeight: number;
  shareWeight: number;
  viewWeight: number;
  creatorTrustWeight: number;
  originalityWeight: number;
  sentimentWeight: number;
  ageDecayFactor: number;
  diversityBoost: number;
}

export const DEFAULT_RANKING_FACTORS: FeedRankingFactors = {
  engagementVelocity: 10,
  likeWeight: 5,
  commentWeight: 8,
  shareWeight: 15,
  viewWeight: 0.5,
  creatorTrustWeight: 1.2,
  originalityWeight: 1.0,
  sentimentWeight: 1.1,
  ageDecayFactor: 168, // 1 week half-life
  diversityBoost: 10,
};

export class FeedScorer {
  constructor(private factors: FeedRankingFactors = DEFAULT_RANKING_FACTORS) {}

  scorePost(post: any): number {
    let score = 0;

    // Engagement velocity
    const ageInHours = (Date.now() - post.publishedAt.getTime()) / (1000 * 60 * 60);
    const engagementVelocity =
      (post.likeCount + post.commentCount) / Math.max(ageInHours, 1);
    score += engagementVelocity * this.factors.engagementVelocity;

    // Engagement signals
    score += post.likeCount * this.factors.likeWeight;
    score += post.commentCount * this.factors.commentWeight;
    score += post.shareCount * this.factors.shareWeight;
    score += post.viewCount * this.factors.viewWeight;

    // Creator signals
    if (post.user?.isVerified) {
      score *= this.factors.creatorTrustWeight;
    }

    // Content quality
    if (post.metadata?.originality) {
      score *= 1 + post.metadata.originality / 100;
    }

    if (post.metadata?.isDuplicate) {
      score *= 0.5;
    }

    // Sentiment
    if (post.metadata?.sentiment === 'positive') {
      score *= this.factors.sentimentWeight;
    }

    // Age decay
    const decayFactor = Math.exp(-ageInHours / this.factors.ageDecayFactor);
    score *= decayFactor;

    // Diversity
    score += Math.random() * this.factors.diversityBoost;

    return score;
  }

  rankPosts(posts: any[]): any[] {
    return posts
      .map((post) => ({ post, score: this.scorePost(post) }))
      .sort((a, b) => b.score - a.score)
      .map((item) => item.post);
  }
}
