import { ProcessedVideo } from '@prisma/client';

export class SetVideoIsPublished {
  videoId: string;
  videos: Array<ProcessedVideo>;
}
