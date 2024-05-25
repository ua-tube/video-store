import { Controller } from '@nestjs/common';
import { VideoManagerService } from './video-manager.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  CreateVideoDto,
  SetVideoIsReady,
  UnregisterVideo,
  UpdateVideoDto,
  UpdateVideoMetricsDto,
  UpdateVideoResourcesDto,
} from './dto';
import { ackMessage } from '../common/utils';

@Controller()
export class VideoManagerController {
  constructor(private readonly videoManagerService: VideoManagerService) {}

  @EventPattern('create_video')
  async handleCreateVideo(
    @Payload() payload: CreateVideoDto,
    @Ctx() context: RmqContext,
  ) {
    await this.videoManagerService.createVideo(payload);
    ackMessage(context);
  }

  @EventPattern('update_video')
  async handleUpdateVideo(
    @Payload() payload: UpdateVideoDto,
    @Ctx() context: RmqContext,
  ) {
    await this.videoManagerService.updateVideo(payload);
    ackMessage(context);
  }

  @EventPattern('unregister_video')
  async handleUnregisterVideo(
    @Payload() payload: UnregisterVideo,
    @Ctx() context: RmqContext,
  ) {
    await this.videoManagerService.unregisterVideo(payload);
    ackMessage(context);
  }

  @EventPattern('set_video_is_ready')
  async handleSetVideoIsReady(
    @Payload() payload: SetVideoIsReady,
    @Ctx() context: RmqContext,
  ) {
    await this.videoManagerService.setVideoIsReady(payload);
    ackMessage(context);
  }

  @EventPattern('update_video_resources')
  async handleUpdateVideoResources(
    @Payload() payload: UpdateVideoResourcesDto,
    @Ctx() context: RmqContext,
  ) {
    await this.videoManagerService.updateVideoResources(payload);
    ackMessage(context);
  }

  @EventPattern('update_video_metrics')
  async handleUpdateVideoMetrics(
    @Payload() payload: UpdateVideoMetricsDto,
    @Ctx() context: RmqContext,
  ) {
    await this.videoManagerService.updateVideoMetrics(payload);
    ackMessage(context);
  }
}
