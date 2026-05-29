import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { LivestreamService } from './livestream.service';

@Controller('v1/livestream')
export class LivestreamController {
  constructor(private readonly livestreamService: LivestreamService) {}

  @Post('start')
  async startLivestream(@Body() { userId, title }: any) {
    return this.livestreamService.startLivestream(userId, title);
  }

  @Get(':livestreamId')
  async getLivestream(@Param('livestreamId') livestreamId: string) {
    return this.livestreamService.getLivestream(livestreamId);
  }

  @Post(':livestreamId/end')
  async endLivestream(@Param('livestreamId') livestreamId: string) {
    return this.livestreamService.endLivestream(livestreamId);
  }
}
