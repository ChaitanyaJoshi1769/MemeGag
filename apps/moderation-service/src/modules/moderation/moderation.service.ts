import { Injectable } from '@nestjs/common';
import { createLogger } from '@memegag/logger';
import prisma from '@memegag/database';
import { ContentAnalysisService } from './content-analysis.service';
import { BotDetectionService } from './bot-detection.service';

const logger = createLogger('ModerationService');

@Injectable()
export class ModerationService {
  constructor(
    private readonly contentAnalysis: ContentAnalysisService,
    private readonly botDetection: BotDetectionService
  ) {}

  async analyzeContent(content: string, contentType: string) {
    try {
      const analysis = await this.contentAnalysis.analyze(content, contentType);

      return {
        toxicity: analysis.toxicityScore,
        hateSpeech: analysis.hateSpeechScore,
        spam: analysis.spamScore,
        nsfw: analysis.nsfwScore,
        misinformation: analysis.misinformationScore,
        sentiment: analysis.sentiment,
        severity: this.calculateSeverity(analysis),
        recommendation: this.getModeratorAction(analysis),
      };
    } catch (error) {
      logger.error({ error }, 'Failed to analyze content');
      throw error;
    }
  }

  async flagContent(targetId: string, targetType: string, reason: string) {
    try {
      const report = await prisma.moderationReport.create({
        data: {
          targetId,
          targetType,
          reason,
          reporterId: 'system',
          status: 'PENDING',
        },
      });

      logger.info({ reportId: report.id, targetId }, 'Content flagged');

      return {
        reportId: report.id,
        status: 'pending_review',
      };
    } catch (error) {
      logger.error({ error }, 'Failed to flag content');
      throw error;
    }
  }

  async resolveReport(reportId: string, decision: string, notes?: string) {
    try {
      const report = await prisma.moderationReport.update({
        where: { id: reportId },
        data: {
          status: 'RESOLVED',
          decision: decision as any,
          decisionNotes: notes,
          resolvedAt: new Date(),
        },
      });

      logger.info({ reportId, decision }, 'Report resolved');

      return {
        reportId: report.id,
        decision: report.decision,
        resolved: true,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to resolve report');
      throw error;
    }
  }

  private calculateSeverity(analysis: any): 'low' | 'medium' | 'high' | 'critical' {
    const avgScore =
      (analysis.toxicityScore +
        analysis.hateSpeechScore +
        analysis.spamScore +
        analysis.nsfwScore) /
      4;

    if (avgScore > 0.8) return 'critical';
    if (avgScore > 0.6) return 'high';
    if (avgScore > 0.4) return 'medium';
    return 'low';
  }

  private getModeratorAction(analysis: any): string {
    if (analysis.toxicityScore > 0.9 || analysis.hateSpeechScore > 0.9) {
      return 'AUTO_REMOVE_AND_BAN';
    }
    if (analysis.toxicityScore > 0.7 || analysis.hateSpeechScore > 0.7) {
      return 'AUTO_REMOVE_REQUIRE_REVIEW';
    }
    if (analysis.toxicityScore > 0.5 || analysis.spamScore > 0.8) {
      return 'QUEUE_FOR_REVIEW';
    }
    return 'APPROVE';
  }
}
