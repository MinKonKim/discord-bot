import { OverWatchPlayer, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const userService = {
  async upsertPlayer(
    playerData: Omit<OverWatchPlayer, 'id' | 'createdAt'>
  ): Promise<OverWatchPlayer> {
    return prisma.overWatchPlayer.upsert({
      where: { nickname: playerData.nickname },
      update: playerData,
      create: playerData,
    })
  },

  async getPlayerById(id: string): Promise<OverWatchPlayer | null> {
    return prisma.overWatchPlayer.findUnique({ where: { id } })
  },

  async getPlayerByNickname(nickname: string): Promise<OverWatchPlayer | null> {
    return prisma.overWatchPlayer.findUnique({ where: { nickname } })
  },
}
