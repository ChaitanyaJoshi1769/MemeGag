import { Controller, Post, Body } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('v1/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  async uploadMedia(@Body() { url, type }: any) {
    return this.mediaService.processMedia(url, type);
  }

  @Post('optimize')
  async optimizeImage(@Body() { imageUrl }: any) {
    return this.mediaService.optimizeImage(imageUrl);
  }

  @Post('transcode-video')
  async transcodeVideo(@Body() { videoUrl }: any) {
    return this.mediaService.transcodeVideo(videoUrl);
  }
}
