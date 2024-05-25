-- DropForeignKey
ALTER TABLE "processed_videos" DROP CONSTRAINT "processed_videos_video_id_fkey";

-- DropForeignKey
ALTER TABLE "videos" DROP CONSTRAINT "videos_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "videos_metrics" DROP CONSTRAINT "videos_metrics_video_id_fkey";

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "creators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processed_videos" ADD CONSTRAINT "processed_videos_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos_metrics" ADD CONSTRAINT "videos_metrics_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
