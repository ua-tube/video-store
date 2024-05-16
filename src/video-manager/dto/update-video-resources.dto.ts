import { ProcessedVideo } from '@prisma/client';

export class UpdateVideoResourcesDto {
  videoId: string;
  videos: Array<ProcessedVideo>;
  merge: boolean;
  updatedAt: Date;
}
