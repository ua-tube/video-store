import { Controller } from '@nestjs/common';
import { VideoManagerService } from './video-manager.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  SetVideoIsReady,
  UnregisterVideo,
  UpdateVideoMetricsDto,
  UpdateVideoResourcesDto,
  UpsertVideo,
} from './dto';

@Controller()
export class VideoManagerController {
  constructor(private readonly videoManagerService: VideoManagerService) {}

  @EventPattern('upsert_video')
  async handleUpsertVideo(@Payload() payload: UpsertVideo) {
    await this.videoManagerService.upsertVideo(payload);
  }

  @EventPattern('unregister_video')
  async handleUnregisterVideo(@Payload() payload: UnregisterVideo) {
    await this.videoManagerService.unregisterVideo(payload);
  }

  @EventPattern('set_video_is_ready')
  async handleSetVideoIsReady(@Payload() payload: SetVideoIsReady) {
    await this.videoManagerService.setVideoIsReady(payload);
  }

  @EventPattern('update_video_resources')
  async handleUpdateVideoResources(
    @Payload() payload: UpdateVideoResourcesDto,
  ) {
    await this.videoManagerService.updateVideoResources(payload);
  }

  @EventPattern('update_video_metrics')
  async handleUpdateVideoMetrics(@Payload() payload: UpdateVideoMetricsDto) {
    await this.videoManagerService.updateVideoMetrics(payload);
  }
}
