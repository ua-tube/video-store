import { Controller } from '@nestjs/common';
import { VideoManagerService } from './video-manager.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  CreateVideoDto,
  SetVideoIsPublished,
  UnregisterVideo,
  UpdateVideoDto,
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

  @EventPattern('set_video_is_published')
  async handleSetVideoIsPublished(
    @Payload() payload: SetVideoIsPublished,
    @Ctx() context: RmqContext,
  ) {
    await this.videoManagerService.setVideoIsPublished(payload);
    ackMessage(context);
  }
}
