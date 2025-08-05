import { Tier } from '@prisma/client'

/**
 * 한글 티어 문자열을 Prisma Tier Enum 값으로 변환합니다.
 * @param tierString - 사용자가 선택한 한글 티어 (예: "브론즈")
 * @returns Prisma Tier Enum (예: Tier.BRONZE) 또는 변환 실패 시 null
 */
export function toPrismaTier(tierString: string): Tier | null {
  const tierMap: { [key: string]: Tier } = {
    브론즈: Tier.BRONZE,
    실버: Tier.SILVER,
    골드: Tier.GOLD,
    플래티넘: Tier.PLATINUM,
    다이아몬드: Tier.DIAMOND,
    마스터: Tier.MASTER,
    그랜드마스터: Tier.GRANDMASTER,
    챔피언: Tier.CHAMPION,
  }

  const prismaTier = tierMap[tierString]

  if (!prismaTier) {
    console.error(`Invalid tier string received: ${tierString}`)
    return null
  }

  return prismaTier
}
