import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class VideoStoreService {
  constructor(private readonly prisma: PrismaService) {}

  async getVideo(videoId: string, creatorId?: string) {
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
      include: {
        creator: true,
        processedVideos: true,
        metrics: true,
      },
    });

    if (!video) throw new BadRequestException('Video not found');

    if (video.visibility === 'Private' && creatorId !== video.creatorId) {
      throw new ForbiddenException('Is not your video');
    }

    return {
      ...video,
      processedVideos: video.processedVideos.map((v) => ({
        ...v,
        size: v.size.toString(),
      })),
      metrics: {
        viewsCount: video.metrics.viewsCount.toString(),
      },
    };
  }
}
