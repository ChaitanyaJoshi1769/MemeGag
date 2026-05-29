import { Injectable } from '@nestjs/common';
import { createLogger } from '@memegag/logger';

const logger = createLogger('ContentAnalysisService');

interface ContentAnalysis {
  toxicityScore: number;
  hateSpeechScore: number;
  spamScore: number;
  nsfwScore: number;
  misinformationScore: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

@Injectable()
export class ContentAnalysisService {
  private readonly toxicityKeywords = [
    'hate',
    'violence',
    'kill',
    'harm',
    'abuse',
    'toxic',
    'racist',
    'sexist',
  ];

  private readonly spamPatterns = [
    /\b(click here|buy now|limited offer)\b/i,
    /https?:\/\/[^\s]+/g,
    /\b([a-zA-Z0-9]{2,})\1{2,}\b/,
  ];

  async analyze(content: string, contentType: string): Promise<ContentAnalysis> {
    try {
      const toxicityScore = this.analyzeToxicity(content);
      const hateSpeechScore = this.analyzeHateSpeech(content);
      const spamScore = this.analyzeSpam(content);
      const nsfwScore = this.analyzeNSFW(content, contentType);
      const misinformationScore = this.analyzeMisinformation(content);
      const sentiment = this.analyzeSentiment(content);

      return {
        toxicityScore,
        hateSpeechScore,
        spamScore,
        nsfwScore,
        misinformationScore,
        sentiment,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to analyze content');
      throw error;
    }
  }

  private analyzeToxicity(content: string): number {
    let score = 0;

    // Check for toxic keywords
    const lowerContent = content.toLowerCase();
    const toxicMatches = this.toxicityKeywords.filter((keyword) =>
      lowerContent.includes(keyword)
    ).length;

    score += (toxicMatches / this.toxicityKeywords.length) * 0.5;

    // Check for aggressive patterns
    const capsLockRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capsLockRatio > 0.5) {
      score += 0.3;
    }

    // Check for repeated characters
    if (/(.)\1{3,}/.test(content)) {
      score += 0.2;
    }

    return Math.min(score, 1);
  }

  private analyzeHateSpeech(content: string): number {
    // Placeholder - in production, use ML model
    const hateSpeechIndicators = ['hate', 'discriminate', 'inferior', 'superior'];
    const matches = hateSpeechIndicators.filter((word) =>
      content.toLowerCase().includes(word)
    ).length;

    return Math.min(matches * 0.3, 1);
  }

  private analyzeSpam(content: string): number {
    let score = 0;

    // Check spam patterns
    for (const pattern of this.spamPatterns) {
      if (pattern.test(content)) {
        score += 0.3;
      }
    }

    // Check for repeated mentions
    const mentionCount = (content.match(/@\w+/g) || []).length;
    if (mentionCount > 5) {
      score += 0.4;
    }

    // Check for hashtag spam
    const hashtagCount = (content.match(/#\w+/g) || []).length;
    if (hashtagCount > 10) {
      score += 0.3;
    }

    return Math.min(score, 1);
  }

  private analyzeNSFW(content: string, contentType: string): number {
    // Placeholder - in production, use vision model for images/videos
    if (contentType !== 'text') {
      return 0.1; // Default low score, should use ML model
    }

    const nsfwWords = ['explicit', 'nude', 'sexual', 'adult'];
    const matches = nsfwWords.filter((word) =>
      content.toLowerCase().includes(word)
    ).length;

    return Math.min(matches * 0.25, 1);
  }

  private analyzeMisinformation(content: string): number {
    // Placeholder - in production, fact-check against knowledge base
    const misinformationIndicators = [
      'fake',
      'hoax',
      'false',
      'conspiracy',
      'conspiracy theory',
    ];

    const matches = misinformationIndicators.filter((word) =>
      content.toLowerCase().includes(word)
    ).length;

    return Math.min(matches * 0.2, 1);
  }

  private analyzeSentiment(content: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['good', 'great', 'love', 'awesome', 'excellent'];
    const negativeWords = ['bad', 'hate', 'terrible', 'awful', 'horrible'];

    const lowerContent = content.toLowerCase();
    const positiveCount = positiveWords.filter((word) =>
      lowerContent.includes(word)
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      lowerContent.includes(word)
    ).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }
}
