import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { VideoStoreService } from './video-store.service';
import { UserId } from '../common/decorators';

@Controller('video-store')
export class VideoStoreController {
  constructor(private readonly videoStoreService: VideoStoreService) {}

  @Get('videos/:videoId')
  getVideo(
    @Param('videoId', ParseUUIDPipe) videoId: string,
    @UserId() userId?: string,
  ) {
    return this.videoStoreService.getVideo(videoId, userId);
  }
}
