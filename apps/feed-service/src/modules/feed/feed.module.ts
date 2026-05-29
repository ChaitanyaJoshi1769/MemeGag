import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { RankingService } from './ranking.service';
import { CandidateGenerationService } from './candidate-generation.service';

@Module({
  controllers: [FeedController],
  providers: [FeedService, RankingService, CandidateGenerationService],
  exports: [FeedService],
})
export class FeedModule {}
