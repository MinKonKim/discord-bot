import { Tier } from '@prisma/client'

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

/**
 * 한글 티어를 Prisma Tier Enum으로 변환
 */
export function toPrismaTier(tierString: string): Tier | null {
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
export function getRandomTier(): Tier {
  const values = Object.values(TIER_MAP)
  return values[Math.floor(Math.random() * values.length)]
}
