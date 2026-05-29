import { Injectable } from '@nestjs/common';
import prisma from '@memegag/database';
import { createLogger } from '@memegag/logger';

const logger = createLogger('CommentService');

@Injectable()
export class CommentService {
  async createComment(data: any) {
    try {
      const comment = await prisma.comment.create({
        data: {
          postId: data.postId,
          userId: data.userId,
          content: data.content,
          status: 'PENDING_MODERATION',
        },
        include: { user: true },
      });

      logger.info({ commentId: comment.id }, 'Comment created');
      return comment;
    } catch (error) {
      logger.error({ error }, 'Failed to create comment');
      throw error;
    }
  }

  async getPostComments(postId: string, limit: number = 50) {
    try {
      return await prisma.comment.findMany({
        where: {
          postId,
          status: 'PUBLISHED',
        },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      logger.error({ error }, 'Failed to get comments');
      throw error;
    }
  }

  async addCommentLike(commentId: string, userId: string) {
    try {
      const reaction = await prisma.reaction.create({
        data: {
          userId,
          targetId: commentId,
          targetType: 'comment',
          type: 'LIKE',
        },
      });

      // Update like count
      await prisma.comment.update({
        where: { id: commentId },
        data: { likeCount: { increment: 1 } },
      });

      return reaction;
    } catch (error) {
      logger.error({ error }, 'Failed to add comment like');
      throw error;
    }
  }
}
