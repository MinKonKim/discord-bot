import { Tier } from '@prisma/client'
import fs from 'node:fs'
import path from 'node:path'
import { Player } from './build-teams'

const imageMap: Record<string, string> = {
  브론즈: 'overwatch_bronze.png',
  실버: 'overwatch_silver.png',
  골드: 'overwatch_gold.png',
  플래티넘: 'overwatch_platinum.png',
  다이아몬드: 'overwatch_diamond.png',
  마스터: 'overwatch_master.png',
  그랜드마스터: 'overwatch_grandmaster.png',
  챔피언: 'overwatch_champion.png',
}

/** 한글 → Prisma Tier 매핑 */
export const TIER_MAP: Record<string, Tier> = {
  브론즈: Tier.BRONZE,
  실버: Tier.SILVER,
  골드: Tier.GOLD,
  플래티넘: Tier.PLATINUM,
  다이아몬드: Tier.DIAMOND,
  마스터: Tier.MASTER,
  그랜드마스터: Tier.GRANDMASTER,
  챔피언: Tier.CHAMPION,
}

export const getImagePathByTier = (tier: string): string => {
  const imagePath = path.join(process.cwd(), 'images', imageMap[tier])
  if (!fs.existsSync(imagePath)) {
    console.error('이미지 파일을 찾을 수 없습니다 : ', imagePath)
    return ''
  }
  return imagePath
}

/**
 * 한글 티어를 Prisma Tier Enum으로 변환
 */
export const toPrismaTier = (tierString: string): Tier | null => {
  if (!tierString) return null

  const normalized = tierString.trim()
  const prismaTier = TIER_MAP[normalized]

  if (!prismaTier) {
    console.error(`Invalid tier string: ${tierString}`)
    return null
  }

  return prismaTier
}

/**
 * Prisma Tier 중 랜덤 추출
 */
export const getRandomTier = (): Tier => {
  const values = Object.values(TIER_MAP)
  return values[Math.floor(Math.random() * values.length)]
}

export const getRoleImage = (role: 'tank' | 'dps' | 'heal' | null): string => {
  switch (role) {
    case 'tank':
      return '🛡️' // 실제 이미지 URL로 변경
    case 'dps':
      return '🔫' // 실제 이미지 URL로 변경
    case 'heal':
      return '💀' // 실제 이미지 URL로 변경
    default:
      return ''
  }
}

export const getTireImageByScore = (score: number): string => {
  if (score <= 1) return '<:overwatch_bronze:1403311989459255397>'
  if (score <= 2) return '<:overwatch_silver:1403312009096724553>'
  if (score <= 3) return '<:overwatch_gold:1403311998212771940>'
  if (score <= 4) return '<:overwatch_platinum:1403312007297372183>'
  if (score <= 5) return '<:overwatch_diamond:1403311996090187786>'
  if (score <= 6) return '<:overwatch_master:1403312004374200391>'
  if (score <= 7) return '<:overwatch_grandmaster:1403312001253638205>'
  return '<:overwatch_champion:1403311993087197334>'
}
// 팀원 문자열 생성 함수
export const formatPlayers = (players: Player[]) =>
  players
    .map(
      p => `• **${p.nickname}** \t(${getRoleImage(p.assignedRole)})-${getTireImageByScore(p.score)}`
    )
    .join('\n')
