import { Injectable } from '@nestjs/common';
import { createLogger } from '@memegag/logger';
import prisma from '@memegag/database';

const logger = createLogger('AnalyticsService');

@Injectable()
export class AnalyticsService {
  async trackEvent(data: any) {
    try {
      const event = await prisma.analyticsEvent.create({
        data: {
          userId: data.userId,
          eventType: data.eventType,
          eventName: data.eventName,
          properties: data.properties || {},
          sessionId: data.sessionId,
          deviceId: data.deviceId,
        },
      });
      return { success: true, eventId: event.id };
    } catch (error) {
      logger.error({ error }, 'Failed to track event');
      throw error;
    }
  }

  async getDashboard(userId: string) {
    try {
      const events = await prisma.analyticsEvent.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: 100,
      });
      return { events, total: events.length };
    } catch (error) {
      logger.error({ error }, 'Failed to get dashboard');
      throw error;
    }
  }
}
