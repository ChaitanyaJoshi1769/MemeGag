import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { PresenceService } from './presence.service';
import { CommentService } from './comment.service';

@Module({
  providers: [RealtimeGateway, PresenceService, CommentService],
  exports: [PresenceService, CommentService],
})
export class RealtimeModule {}
