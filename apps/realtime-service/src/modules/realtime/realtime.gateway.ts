import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { createLogger } from '@memegag/logger';
import { PresenceService } from './presence.service';
import { CommentService } from './comment.service';

const logger = createLogger('RealtimeGateway');

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly presenceService: PresenceService,
    private readonly commentService: CommentService
  ) {}

  afterInit() {
    logger.info('WebSocket gateway initialized');
  }

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      await this.presenceService.setUserOnline(userId, client.id);
      client.join(`user:${userId}`);
      this.server.emit('user:online', { userId });
    }
    logger.info({ clientId: client.id, userId }, 'Client connected');
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      await this.presenceService.setUserOffline(userId);
      this.server.emit('user:offline', { userId });
    }
    logger.info({ clientId: client.id }, 'Client disconnected');
  }

  @SubscribeMessage('comment:new')
  async handleNewComment(client: Socket, data: any) {
    try {
      const comment = await this.commentService.createComment(data);
      client.broadcast.emit('comment:added', comment);
      return { success: true, comment };
    } catch (error) {
      logger.error({ error }, 'Failed to create comment');
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('comment:typing')
  handleTyping(client: Socket, data: { postId: string; userId: string }) {
    client.broadcast.emit('comment:typing', data);
  }

  @SubscribeMessage('presence:update')
  async handlePresenceUpdate(client: Socket, data: any) {
    const userId = client.handshake.query.userId as string;
    await this.presenceService.updateUserPresence(userId, data);
    this.server.emit('presence:updated', { userId, ...data });
  }

  @SubscribeMessage('post:view')
  async handlePostView(client: Socket, data: { postId: string }) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.server.emit('post:viewed', { postId, userId });
    }
  }

  notifyNewComment(comment: any) {
    this.server.emit('comment:new', comment);
  }

  notifyCommentLike(commentId: string, userId: string) {
    this.server.emit('comment:liked', { commentId, userId });
  }

  notifyPostEngagement(postId: string, engagement: any) {
    this.server.emit('post:engagement', { postId, ...engagement });
  }
}
