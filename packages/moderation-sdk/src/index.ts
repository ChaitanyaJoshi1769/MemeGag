export interface ModerationAnalysis {
  toxicityScore: number;
  hateSpeechScore: number;
  spamScore: number;
  nsfwScore: number;
  misinformationScore: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

export interface ContentPolicy {
  maxToxicityScore: number;
  maxHateSpeechScore: number;
  maxSpamScore: number;
  maxNsfwScore: number;
  requiresManualReview: boolean;
  autoRemoveThreshold: number;
}

export const DEFAULT_POLICY: ContentPolicy = {
  maxToxicityScore: 0.7,
  maxHateSpeechScore: 0.6,
  maxSpamScore: 0.8,
  maxNsfwScore: 0.5,
  requiresManualReview: true,
  autoRemoveThreshold: 0.9,
};

export class ModerationPolicy {
  constructor(private policy: ContentPolicy = DEFAULT_POLICY) {}

  evaluate(analysis: ModerationAnalysis): {
    approved: boolean;
    action: 'approve' | 'review' | 'remove' | 'ban';
    reason?: string;
  } {
    // Auto remove critical content
    if (
      analysis.toxicityScore > this.policy.autoRemoveThreshold ||
      analysis.hateSpeechScore > this.policy.autoRemoveThreshold
    ) {
      return {
        approved: false,
        action: 'ban',
        reason: 'Critical toxicity or hate speech detected',
      };
    }

    // Queue for review if multiple scores are high
    const violatingScores = [
      analysis.toxicityScore > this.policy.maxToxicityScore,
      analysis.hateSpeechScore > this.policy.maxHateSpeechScore,
      analysis.spamScore > this.policy.maxSpamScore,
      analysis.nsfwScore > this.policy.maxNsfwScore,
    ].filter(Boolean).length;

    if (violatingScores > 1) {
      return {
        approved: false,
        action: 'remove',
        reason: 'Multiple policy violations detected',
      };
    }

    if (violatingScores > 0 || (this.policy.requiresManualReview && analysis.severity === 'high')) {
      return {
        approved: false,
        action: 'review',
        reason: 'Flagged for manual review',
      };
    }

    return {
      approved: true,
      action: 'approve',
    };
  }
}
