import { Injectable } from '@nestjs/common';
import { createLogger } from '@memegag/logger';
import prisma from '@memegag/database';

const logger = createLogger('LivestreamService');

@Injectable()
export class LivestreamService {
  async startLivestream(userId: string, title: string) {
    try {
      const livestream = await prisma.livestream.create({
        data: {
          userId,
          title,
          status: 'LIVE',
          startedAt: new Date(),
        },
      });
      return { success: true, livestreamId: livestream.id, ingestUrl: 'rtmp://localhost/live' };
    } catch (error) {
      logger.error({ error }, 'Failed to start livestream');
      throw error;
    }
  }

  async getLivestream(livestreamId: string) {
    try {
      const livestream = await prisma.livestream.findUnique({
        where: { id: livestreamId },
      });
      return livestream;
    } catch (error) {
      logger.error({ error }, 'Failed to get livestream');
      throw error;
    }
  }

  async endLivestream(livestreamId: string) {
    try {
      const livestream = await prisma.livestream.update({
        where: { id: livestreamId },
        data: { status: 'ENDED', endedAt: new Date() },
      });
      return { success: true, livestream };
    } catch (error) {
      logger.error({ error }, 'Failed to end livestream');
      throw error;
    }
  }
}
