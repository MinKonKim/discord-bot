/*
  Warnings:

  - You are about to drop the column `discord_id` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Player" DROP COLUMN "discord_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
