import { VideoVisibility } from '@prisma/client';

export class UpsertVideo {
  id: string;
  creatorId: string;
  title?: string;
  description?: string;
  tags?: string;
  thumbnailUrl?: string;
  previewThumbnailUrl?: string;
  visibility?: VideoVisibility;
  createdAt?: Date;
}
