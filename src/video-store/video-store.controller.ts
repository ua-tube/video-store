import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { VideoStoreService } from './video-store.service';
import { UserId } from '../common/decorators';
import { OptionalAuthUserGuard } from '../common/guards';

@Controller('video-store')
export class VideoStoreController {
  constructor(private readonly videoStoreService: VideoStoreService) {}

  @UseGuards(OptionalAuthUserGuard)
  @Get('videos/:videoId')
  getVideo(
    @Param('videoId', ParseUUIDPipe) videoId: string,
    @UserId() userId?: string,
  ) {
    return this.videoStoreService.getVideo(videoId, userId);
  }
}
