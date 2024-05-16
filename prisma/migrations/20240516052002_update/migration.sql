/*
  Warnings:

  - You are about to drop the column `videoId` on the `processed_videos` table. All the data in the column will be lost.
  - Added the required column `video_id` to the `processed_videos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "processed_videos" DROP CONSTRAINT "processed_videos_videoId_fkey";

-- AlterTable
ALTER TABLE "processed_videos" DROP COLUMN "videoId",
ADD COLUMN     "video_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "processed_videos_video_id_idx" ON "processed_videos"("video_id");

-- AddForeignKey
ALTER TABLE "processed_videos" ADD CONSTRAINT "processed_videos_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
