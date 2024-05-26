/*
  Warnings:

  - Added the required column `created_at` to the `processed_videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "processed_videos" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL;
