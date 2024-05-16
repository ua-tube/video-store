import { Controller } from '@nestjs/common';
import { HistoryService } from './history.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UpdateVideoMetrics } from './dto';

@Controller()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @EventPattern('update_video_metrics')
  async handleUpdateVideoMetrics(@Payload() payload: UpdateVideoMetrics) {
    return this.historyService.updateVideoMetrics(payload);
  }
}
