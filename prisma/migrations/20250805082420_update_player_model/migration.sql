/*
  Warnings:

  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Tier" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHAMPION');

-- DropTable
DROP TABLE "public"."Player";

-- CreateTable
CREATE TABLE "public"."OverWatchPlayer" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "tankTier" "public"."Tier",
    "dpsTier" "public"."Tier",
    "healTier" "public"."Tier",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OverWatchPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OverWatchPlayer_nickname_key" ON "public"."OverWatchPlayer"("nickname");
