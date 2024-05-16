import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { UpdateVideoMetrics } from './dto';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async updateVideoMetrics(payload: UpdateVideoMetrics) {
    const video = await this.prisma.video.findUnique({
      where: { id: payload.videoId },
      select: { status: true },
    });

    if (!video || video.status === 'Unregistered')
      throw new BadRequestException();

    await this.prisma.videoMetrics.update({
      where: { videoId: payload.videoId },
      data: {
        viewsCount: BigInt(payload.viewsCount),
        viewsCountUpdatedAt: payload.updatedAt,
      },
    });

    this.logger.log(`Metrics updated for video (${payload.videoId})`);
  }
}
