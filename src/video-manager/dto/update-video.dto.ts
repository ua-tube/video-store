import { VideoStatus, VideoVisibility } from '@prisma/client';

export class UpdateVideoDto {
  id: string;
  title: string;
  description: string;
  tags: string;
  thumbnailUrl: string;
  previewThumbnailUrl: string;
  visibility: VideoVisibility;
  status: VideoStatus;
  lengthSeconds?: number;
}
