-- CreateTable
CREATE TABLE "public"."Player" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "tankTier" TEXT,
    "deelTier" TEXT,
    "healTier" TEXT,
    "discord_id" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_nickname_key" ON "public"."Player"("nickname");
