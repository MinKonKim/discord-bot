import { Collection } from '@discordjs/collection'
import { Tier } from '@prisma/client'
import { OverWatchPlayerDump } from '../sessionData'

export type Player = {
  nickname: string
  assignedRole: 'tank' | 'dps' | 'heal' | null
  score: number
}

type Team = {
  players: Player[]
  totalScore: number
  avgScore: number
}

type Result = { teamA: Team; teamB: Team } | { error: string }

const tierScore: Record<Tier, number> = {
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4,
  DIAMOND: 5,
  MASTER: 6,
  GRANDMASTER: 7,
  CHAMPION: 8,
}

function getAssignedRoleAndScore(player: OverWatchPlayerDump, position: string): Player | null {
  if (position === 'tank' && player.tankTier) {
    return { nickname: player.nickname, assignedRole: 'tank', score: tierScore[player.tankTier] }
  }
  if (position === 'dps' && player.dpsTier) {
    return { nickname: player.nickname, assignedRole: 'dps', score: tierScore[player.dpsTier] }
  }
  if (position === 'heal' && player.healTier) {
    return { nickname: player.nickname, assignedRole: 'heal', score: tierScore[player.healTier] }
  }
  return { nickname: player.nickname, assignedRole: null, score: 0 }
}

// 랜덤 선택 함수 (중복 없이 n개 선택)
function pickRandom<T>(array: T[], n: number): T[] {
  const result: T[] = []
  const cloned = [...array]
  while (result.length < n && cloned.length > 0) {
    const idx = Math.floor(Math.random() * cloned.length)
    result.push(cloned[idx])
    cloned.splice(idx, 1)
  }
  return result
}

const selectPlayers = (
  allPlayers: Collection<string, OverWatchPlayerDump>
): OverWatchPlayerDump[] | null => {
  const players = allPlayers.map(p => p)

  const tanks = players.filter(p => p.tankTier !== null)
  if (tanks.length < 2) return null
  const selectedTanks = tanks.length === 2 ? tanks : pickRandom(tanks, 2)

  // 탱커 제외한 딜 후보
  const dpsCandidates = players.filter(
    p => p.dpsTier !== null && !selectedTanks.some(t => t.nickname === p.nickname)
  )
  if (dpsCandidates.length < 4) return null
  const selectedDps = dpsCandidates.length === 4 ? dpsCandidates : pickRandom(dpsCandidates, 4)

  // 탱커, 딜 제외한 힐 후보
  const excludedIds = new Set([...selectedTanks, ...selectedDps].map(p => p.nickname))
  const healCandidates = players.filter(p => p.healTier !== null && !excludedIds.has(p.nickname))
  if (healCandidates.length < 4) return null
  const selectedHeals = healCandidates.length === 4 ? healCandidates : pickRandom(healCandidates, 4)

  return [...selectedTanks, ...selectedDps, ...selectedHeals]
}

/**
 * 팀 밸런싱 함수
 * selectedPlayers 배열은 아래 역할 순서로 정렬되어 있어야 함
 * 탱커 2명, 딜러 4명, 힐러 4명 (총 10명)
 */
function balanceTeams(selectedPlayers: Player[]): Result {
  if (selectedPlayers.length !== 10) {
    return { error: '10명의 플레이어가 필요합니다.' }
  }

  // 역할별 분리 (배열 slice로 간단하게 분리)
  const tanks = selectedPlayers.slice(0, 2)
  const dps = selectedPlayers.slice(2, 6).sort((a, b) => a.score - b.score) // 오름차순 정렬
  const heals = selectedPlayers.slice(6, 10).sort((a, b) => a.score - b.score) // 오름차순 정렬

  // 1. 탱커 각 팀에 1명씩 배정
  const teamA: Player[] = [tanks[0]]
  const teamB: Player[] = [tanks[1]]

  // 강한 탱커 팀과 약한 탱커 팀 구분
  let strongTankTeam = tanks[0].score >= tanks[1].score ? teamA : teamB
  let weakTankTeam = tanks[0].score >= tanks[1].score ? teamB : teamA

  // 2. 딜러 배정 (낮은 점수 딜러는 강한 탱커 팀, 높은 점수 딜러는 약한 탱커 팀)
  // 번갈아 배치: 낮은 점수 → 강한 탱커 팀, 높은 점수 → 약한 탱커 팀
  // dps 배열: [lowest, ..., highest] 순 정렬 상태
  strongTankTeam.push(dps[0])
  weakTankTeam.push(dps[3])
  strongTankTeam.push(dps[1])
  weakTankTeam.push(dps[2])

  // 3. 팀별 점수 계산 함수
  const calcTeamScore = (team: Player[]): number =>
    team.reduce((sum, player) => sum + player.score, 0)

  const getAvgScore = (team: Player[]): number => calcTeamScore(team) / team.length

  const teamAScore = getAvgScore(teamA)
  const teamBScore = getAvgScore(teamB)

  // 4. 힐러 배정 (평균 점수가 높은 팀에 낮은 점수 힐러, 낮은 팀에 높은 점수 힐러)
  // 힐러 배열도 오름차순 정렬
  if (teamAScore >= teamBScore) {
    teamA.push(heals[0], heals[2])
    teamB.push(heals[3], heals[1])
  } else {
    teamA.push(heals[3], heals[1])
    teamB.push(heals[0], heals[2])
  }

  // 5. 최종 점수 및 평균 계산
  const finalizeTeam = (players: Player[]): Team => {
    const totalScore = calcTeamScore(players)
    const avgScore = totalScore / players.length
    return { players, totalScore, avgScore }
  }

  return {
    teamA: finalizeTeam(teamA),
    teamB: finalizeTeam(teamB),
  }
}

export const buildTeams = (joinedPlayers: Collection<string, OverWatchPlayerDump>) => {
  let step = 0
  const selectedPlayers = selectPlayers(joinedPlayers)
  step += 1
  console.log(` ${step} 단계: 선택된 유저목록:`, selectedPlayers?.map(p => p.nickname) || 'None')

  if (selectedPlayers && selectedPlayers.length < 10) {
    return { error: '팀 빌딩을 위한 플레이어가 충분하지 않습니다. 최소 10명이 필요합니다.' }
  }
  const tankPlayers: Player[] = selectedPlayers
    ?.slice(0, 2)
    .map(p => getAssignedRoleAndScore(p, 'tank'))
    .filter(p => p !== null) as Player[]

  const dpsPlayers: Player[] = selectedPlayers
    ?.slice(2, 6)
    .map(p => getAssignedRoleAndScore(p, 'dps'))
    .filter(p => p !== null) as Player[]

  const healPlayers: Player[] = selectedPlayers
    ?.slice(6, 10)
    .map(p => getAssignedRoleAndScore(p, 'heal'))
    .filter(p => p !== null) as Player[]

  step += 1
  const assignedPlayers = [...tankPlayers, ...dpsPlayers, ...healPlayers].filter(p => p !== null)

  if (assignedPlayers.length < 10) {
    return { error: '할당된 플레이어 수가 올바르지 않습니다.' }
  } else {
    console.log(
      ` ${step} 단계: 할당된 유저목록:`,
      assignedPlayers.map(p => p.nickname)
    )
  }

  const result = balanceTeams(assignedPlayers)
  step += 1
  console.log(` ${step} 단계: 팀 빌딩 결과:`, result)
  return result
}
