import { VideoStatus, VideoVisibility } from '@prisma/client';

export class CreateVideoDto {
  id: string;
  title: string;
  description: string;
  tags: string;
  creatorId: string;
  lengthSeconds: number;
  visibility: VideoVisibility;
  status: VideoStatus;
  createdAt: Date;
}
