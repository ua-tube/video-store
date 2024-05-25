import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma';
import {
  CreateVideoDto,
  SetVideoIsReady,
  UnregisterVideo,
  UpdateVideoDto,
  UpdateVideoMetricsDto,
  UpdateVideoResourcesDto,
} from './dto';

@Injectable()
export class VideoManagerService {
  private readonly logger = new Logger(VideoManagerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createVideo(payload: CreateVideoDto) {
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
          isPublishedWithPublic: false,
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

  async setVideoIsReady(payload: SetVideoIsReady) {
    const video = await this.prisma.video.findUnique({
      where: { id: payload.videoId },
      select: { status: true },
    });

    if (!video) {
      this.logger.warn(`Video (${payload.videoId}) does not exists`);
      return;
    }

    if (video.status === 'Preparing') {
      this.logger.log(
        `Updating video (${payload.videoId}) to be in ready state`,
      );

      await this.prisma.video.update({
        where: { id: payload.videoId },
        data: {
          title: payload.title,
          description: payload.description,
          tags: payload.tags,
          thumbnailUrl: payload.thumbnailUrl,
          previewThumbnailUrl: payload.thumbnailUrl,
          visibility: payload.visibility,
          status: 'Ready',
          statusUpdatedAt: new Date(),
        },
      });
    } else {
      this.logger.warn(`Video (${payload.videoId}) is not in preparing state`);
    }
  }

  async updateVideoResources(payload: UpdateVideoResourcesDto) {
    const video = await this.prisma.video.findUnique({
      where: { id: payload.videoId },
      select: {
        status: true,
        processedVideos: true,
      },
    });

    if (!video) {
      this.logger.warn(`Video (${payload.videoId}) does not exists`);
      return;
    }

    if (video.status !== 'Preparing') {
      this.logger.warn('This video already prepared');
      return;
    }

    let videos = payload.merge
      ? [...payload.videos, ...video.processedVideos]
      : payload.videos;

    if (payload.merge) {
      const set = new Set();
      videos = videos.filter((item) => {
        if (!set.has(item.id)) {
          set.add(item.id);
          return true;
        }
        return false;
      }, set);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.processedVideo.deleteMany({
        where: { videoId: payload.videoId },
      });
      await tx.processedVideo.createMany({
        data: videos,
      });
    });
  }

  async updateVideoMetrics(payload: UpdateVideoMetricsDto) {
    const videoMetrics = await this.prisma.videoMetrics.findUnique({
      where: { videoId: payload.videoId },
    });

    if (!videoMetrics) {
      this.logger.warn(`Video metrics (${payload.videoId}) does not exists`);
      return;
    }

    if (
      !videoMetrics.viewsCountUpdatedAt ||
      payload.updatedAt > videoMetrics.viewsCountUpdatedAt
    ) {
      await this.prisma.videoMetrics.update({
        where: { videoId: payload.videoId },
        data: {
          viewsCount: BigInt(payload.viewsCount),
          viewsCountUpdatedAt: payload.updatedAt,
        },
      });
      this.logger.log(`Video (${payload.videoId}) metrics updated`);
    }
  }
}
