/*
  Warnings:

  - You are about to drop the column `is_published_with_public` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the `processed_videos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "processed_videos" DROP CONSTRAINT "processed_videos_video_id_fkey";

-- AlterTable
ALTER TABLE "videos" DROP COLUMN "is_published_with_public";

-- DropTable
DROP TABLE "processed_videos";
