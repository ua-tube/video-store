import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma';
import {
  CreateVideoDto,
  SetVideoIsPublished,
  UnregisterVideo,
  UpdateVideoDto,
} from './dto';

@Injectable()
export class VideoManagerService {
  private readonly logger = new Logger(VideoManagerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createVideo(payload: CreateVideoDto) {
    this.logger.log(`Create video (${payload.id}) is called`);

    const video = await this.prisma.video.findUnique({
      where: { id: payload.id },
      select: { id: true },
    });

    if (video) {
      this.logger.warn(`Video (${payload.id}) already created`);
      return;
    }

    try {
      await this.prisma.video.create({
        data: {
          id: payload.id,
          creatorId: payload.creatorId,
          title: payload.title,
          description: payload.description,
          tags: payload.tags,
          visibility: payload.visibility,
          lengthSeconds: payload.lengthSeconds,
          status: 'Preparing',
          createdAt: payload.createdAt,
          metrics: { create: { viewsCount: 0 } },
        },
      });
      this.logger.log(`Video (${payload.id}) is created`);
    } catch {
      this.logger.error(
        `An error occurred when creating video (${payload.id})`,
      );
    }
  }

  async updateVideo(payload: UpdateVideoDto) {
    this.logger.log(`Update video (${payload.id}) is called`);

    const video = await this.prisma.video.findUnique({
      where: { id: payload.id },
      select: { id: true },
    });

    if (!video) {
      this.logger.warn(`Video (${payload.id}) does not exists`);
      return;
    }

    try {
      await this.prisma.video.update({
        where: { id: payload.id },
        data: {
          title: payload.title,
          description: payload.description,
          tags: payload.tags,
          thumbnailUrl: payload.thumbnailUrl,
          previewThumbnailUrl: payload.previewThumbnailUrl,
          visibility: payload.visibility,
          lengthSeconds: payload?.lengthSeconds,
        },
      });
      this.logger.log(`Video (${payload.id}) is updated`);
    } catch {
      this.logger.error(
        `An error occurred when updating video (${payload.id})`,
      );
    }
  }

  async unregisterVideo(payload: UnregisterVideo) {
    this.logger.log(`Unregister video (${payload.videoId}) is called`);

    const video = await this.prisma.video.findUnique({
      where: { id: payload.videoId },
      select: { status: true },
    });

    if (!video) {
      this.logger.warn(`Video (${payload.videoId}) does not exists`);
      return;
    }

    if (video.status === 'Unregistered') {
      this.logger.warn(`Video (${payload.videoId}) is unregistered`);
      return;
    }

    await this.prisma.video.update({
      where: { id: payload.videoId },
      data: { status: 'Unregistered' },
    });
  }

  async setVideoIsPublished(payload: SetVideoIsPublished) {
    this.logger.log(`Set video (${payload.videoId}) is published is called`);

    const video = await this.prisma.video.findUnique({
      where: { id: payload.videoId },
      select: {
        status: true,
        visibility: true,
      },
    });

    if (!video) {
      this.logger.warn(`Video (${payload.videoId}) does not exists`);
      return;
    }

    if (video.status === 'Preparing') {
      this.logger.log(`Updating video (${payload.videoId}) to be published`);

      await this.prisma.$transaction(async (tx) => {
        await tx.video.update({
          where: { id: payload.videoId },
          data: {
            status: 'Published',
            statusUpdatedAt: new Date(),
          },
        });
      });
    } else {
      this.logger.warn(`Video (${payload.videoId}) is not in preparing state`);
    }
  }
}
