import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import config from '@memegag/config';
import { createLogger } from '@memegag/logger';

const logger = createLogger('PresenceService');

@Injectable()
export class PresenceService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(config.REDIS_URL);
  }

  async setUserOnline(userId: string, socketId: string): Promise<void> {
    try {
      await this.redis.setex(
        `presence:${userId}`,
        3600, // 1 hour expiry
        JSON.stringify({
          userId,
          socketId,
          status: 'online',
          timestamp: Date.now(),
        })
      );
      logger.info({ userId }, 'User set online');
    } catch (error) {
      logger.error({ error, userId }, 'Failed to set user online');
    }
  }

  async setUserOffline(userId: string): Promise<void> {
    try {
      await this.redis.del(`presence:${userId}`);
      logger.info({ userId }, 'User set offline');
    } catch (error) {
      logger.error({ error, userId }, 'Failed to set user offline');
    }
  }

  async updateUserPresence(userId: string, data: any): Promise<void> {
    try {
      await this.redis.setex(
        `presence:${userId}`,
        3600,
        JSON.stringify({
          userId,
          status: data.status || 'online',
          lastActivity: Date.now(),
          ...data,
        })
      );
    } catch (error) {
      logger.error({ error, userId }, 'Failed to update presence');
    }
  }

  async getUserPresence(userId: string): Promise<any> {
    try {
      const data = await this.redis.get(`presence:${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get user presence');
      return null;
    }
  }

  async getOnlineUsers(): Promise<string[]> {
    try {
      const keys = await this.redis.keys('presence:*');
      return keys.map((key) => key.replace('presence:', ''));
    } catch (error) {
      logger.error({ error }, 'Failed to get online users');
      return [];
    }
  }
}
