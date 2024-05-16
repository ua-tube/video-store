export class UpdateVideoMetricsDto {
  videoId: string;
  viewsCount: number | string | bigint;
  updatedAt: Date;
}
