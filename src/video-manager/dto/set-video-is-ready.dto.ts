import { ProcessedVideo, VideoVisibility } from '@prisma/client';

export class SetVideoIsReady {
  videoId: string;
  title: string;
  description: string;
  tags: string;
  thumbnailUrl?: string;
  previewThumbnailUrl?: string;
  visibility: VideoVisibility;
  videos: Array<ProcessedVideo>;
}
