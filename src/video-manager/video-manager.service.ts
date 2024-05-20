import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma';
import {
  SetVideoIsReady,
  UnregisterVideo,
  UpdateVideoMetricsDto,
  UpdateVideoResourcesDto,
  UpsertVideo,
} from './dto';

@Injectable()
export class VideoManagerService {
  private readonly logger = new Logger(VideoManagerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsertVideo(payload: UpsertVideo) {
    const video = await this.findVideo(payload.id, true);

    if (video) {
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
    } else {
      try {
        await this.prisma.video.create({
          data: {
            id: payload.id,
            creatorId: payload.creatorId,
            title: payload.title,
            description: payload.description,
            tags: payload.tags,
            visibility: payload.visibility,
            isPublishedWithPublic: false,
            status: 'Preparing',
            createdAt: payload.createdAt,
            Metrics: { create: { viewsCount: 0 } },
          },
        });
        this.logger.log(`Video (${payload.id}) is created`);
      } catch {
        this.logger.error(
          `An error occurred when creating video (${payload.id})`,
        );
      }
    }
  }

  async unregisterVideo(payload: UnregisterVideo) {
    const video = await this.findVideo(payload.videoId, true);

    if (!video || video.status === 'Unregistered') return;

    await this.prisma.video.update({
      where: { id: payload.videoId },
      data: { status: 'Unregistered' },
    });
  }

  async setVideoIsReady(payload: SetVideoIsReady) {
    const video = await this.findVideo(payload.videoId);

    if (video.status === 'Preparing') {
      this.logger.log(
        `Updating video (${payload.videoId}) to be in ready state`,
      );


      await this.prisma.$transaction(async (tx) => {
        await tx.video.update({
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

        await tx.processedVideo.deleteMany({
          where: { videoId: payload.videoId },
        });

        await tx.processedVideo.createMany({
          data: payload.videos,
        });
      });
    } else {
      this.logger.warn(`Video (${payload.videoId}) is not in preparing state`);
    }
  }

  async updateVideoResources(payload: UpdateVideoResourcesDto) {
    const video = await this.findVideo(payload.videoId, false, {
      processedVideos: true,
      metrics: false,
    });

    if (video.status !== 'Preparing') {
      this.logger.warn('This video already prepared');
      return;
    }

    let videos = payload.merge
      ? [...payload.videos, ...video.ProcessedVideos]
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
    const video = await this.findVideo(payload.videoId, false, {
      processedVideos: false,
      metrics: true,
    });

    if (
      !video.Metrics.viewsCountUpdatedAt ||
      payload.updatedAt > video.Metrics.viewsCountUpdatedAt
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

  private async findVideo(
    videoId: string,
    returnNullInsteadOfError = false,
    include = { processedVideos: false, metrics: false },
  ) {
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
      select: {
        status: true,
        ProcessedVideos: include.processedVideos,
        Metrics: include.metrics,
      },
    });

    if (!video) {
      if (returnNullInsteadOfError) return null;

      this.logger.error(`Video (${videoId}) not found`);
      throw new BadRequestException(`Video (${videoId}) not found`);
    }

    return video;
  }
}
