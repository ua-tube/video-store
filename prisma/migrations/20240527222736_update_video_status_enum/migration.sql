/*
  Warnings:

  - The values [Ready] on the enum `video_statuses` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "video_statuses_new" AS ENUM ('Preparing', 'Published', 'Unregistered');
ALTER TABLE "videos" ALTER COLUMN "status" TYPE "video_statuses_new" USING ("status"::text::"video_statuses_new");
ALTER TYPE "video_statuses" RENAME TO "video_statuses_old";
ALTER TYPE "video_statuses_new" RENAME TO "video_statuses";
DROP TYPE "video_statuses_old";
COMMIT;
