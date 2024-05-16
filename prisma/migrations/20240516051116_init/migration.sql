-- CreateEnum
CREATE TYPE "video_statuses" AS ENUM ('Preparing', 'Ready', 'Published', 'Unregistered');

-- CreateEnum
CREATE TYPE "video_visibilities" AS ENUM ('Private', 'Unlisted', 'Public');

-- CreateTable
CREATE TABLE "creators" (
    "id" UUID NOT NULL,
    "display_name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "thumbnail_url" TEXT,

    CONSTRAINT "creators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" UUID NOT NULL,
    "creator_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT,
    "thumbnail_url" TEXT,
    "preview_thumbnail_url" TEXT,
    "visibility" "video_visibilities" NOT NULL,
    "is_published_with_public" BOOLEAN NOT NULL,
    "status" "video_statuses" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "status_updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processed_videos" (
    "id" UUID NOT NULL,
    "video_file_id" UUID NOT NULL,
    "videoId" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "size" BIGINT NOT NULL,
    "length_seconds" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "processed_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos_metrics" (
    "video_id" UUID NOT NULL,
    "views_count" BIGINT NOT NULL,
    "views_count_updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "videos_metrics_pkey" PRIMARY KEY ("video_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "creators_nickname_key" ON "creators"("nickname");

-- CreateIndex
CREATE INDEX "videos_creator_id_idx" ON "videos"("creator_id");

-- CreateIndex
CREATE INDEX "videos_visibility_idx" ON "videos"("visibility");

-- CreateIndex
CREATE INDEX "videos_created_at_idx" ON "videos"("created_at");

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "creators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processed_videos" ADD CONSTRAINT "processed_videos_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos_metrics" ADD CONSTRAINT "videos_metrics_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
