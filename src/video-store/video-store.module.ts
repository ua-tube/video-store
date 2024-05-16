import { Module } from '@nestjs/common';
import { VideoStoreService } from './video-store.service';
import { VideoStoreController } from './video-store.controller';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule],
  controllers: [VideoStoreController],
  providers: [VideoStoreService],
})
export class VideoStoreModule {}
