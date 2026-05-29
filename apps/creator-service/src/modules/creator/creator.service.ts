import { Injectable } from '@nestjs/common';
import { createLogger } from '@memegag/logger';
import prisma from '@memegag/database';

const logger = createLogger('CreatorService');

@Injectable()
export class CreatorService {
  async getCreatorProfile(userId: string) {
    try {
      const profile = await prisma.creatorProfile.findUnique({
        where: { userId },
      });
      return profile || { error: 'Profile not found' };
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get creator profile');
      throw error;
    }
  }

  async updateCreatorProfile(userId: string, data: any) {
    try {
      const profile = await prisma.creatorProfile.update({
        where: { userId },
        data,
      });
      return profile;
    } catch (error) {
      logger.error({ error, userId }, 'Failed to update creator profile');
      throw error;
    }
  }

  async getCreatorAnalytics(userId: string) {
    try {
      const analyticsEvent = await prisma.analyticsEvent.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: 100,
      });
      return { events: analyticsEvent };
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get analytics');
      throw error;
    }
  }

  async requestPayout(userId: string, data: any) {
    try {
      const payout = await prisma.creatorPayout.findUnique({
        where: { userId },
      });
      return { success: true, payout };
    } catch (error) {
      logger.error({ error, userId }, 'Failed to process payout');
      throw error;
    }
  }
}
