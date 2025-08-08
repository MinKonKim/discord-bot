import { Tier } from '@prisma/client'
import fs from 'node:fs'
import path from 'node:path'
import { PlayerWithRole } from '../sessionData'

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

export const formatPlayer = (p: PlayerWithRole) => {
  const tier =
    p.assignedRole === 'tank' ? p.tankTier : p.assignedRole === 'dps' ? p.dpsTier : p.healTier
  return `${p.nickname} (${p.assignedRole.toUpperCase()} - ${tier})`
}
