import { OverWatchPlayer } from '@prisma/client'

const tierScore: { [key: string]: number } = {
  브론즈: 1,
  실버: 2,
  골드: 3,
  플래티넘: 4,
  다이아몬드: 5,
  마스터: 6,
  그랜드마스터: 7,
  챔피언: 8,
}
interface User extends OverWatchPlayer {
  id: string
  nickname: string
}
interface RolePlayer extends User {
  role: '탱' | '딜' | '힐'
  tierScore: number
}
function buildTeams(users: User[]): { message: string; needsApproval: boolean } {
  const rolePlayers: { [key: string]: RolePlayer[] } = { 탱: [], 딜: [], 힐: [] }
  for (const user of users) {
    if (user.tankTier) {
      rolePlayers['탱'].push({ ...user, role: '탱', tierScore: tierScore[user.tankTier] })
    }
    if (user.dpsTier) {
      rolePlayers['딜'].push({ ...user, role: '딜', tierScore: tierScore[user.dpsTier] })
    }
    if (user.healTier) {
      rolePlayers['힐'].push({ ...user, role: '힐', tierScore: tierScore[user.healTier] })
    }
  }
  if (
    rolePlayers['탱'].length < 2 ||
    rolePlayers['딜'].length < 4 ||
    rolePlayers['힐'].length < 4
  ) {
    return { message: '❌ 팀 빌딩에 필요한 인원이 부족합니다.', needsApproval: false }
  }
  // 간단한 팀 나누기 로직
  const teamA: RolePlayer[] = [],
    teamB: RolePlayer[] = [],
    pushToTeam = (arr: RolePlayer[], count: number) => arr.splice(0, count)
  teamA.push(...pushToTeam(rolePlayers['탱'], 1))
  teamB.push(...pushToTeam(rolePlayers['탱'], 1))
  teamA.push(...pushToTeam(rolePlayers['딜'], 2))
  teamB.push(...pushToTeam(rolePlayers['딜'], 2))
  teamA.push(...pushToTeam(rolePlayers['힐'], 2))
  teamB.push(...pushToTeam(rolePlayers['힐'], 2))
  const average = (team: RolePlayer[]) =>
    Math.round((team.reduce((acc, cur) => acc + cur.tierScore, 0) / team.length) * 10) / 10
  const aAvg = average(teamA)
  const bAvg = average(teamB)
  const gap = Math.abs(aAvg - bAvg)
  const format = (team: RolePlayer[]) =>
    team.map(p => `- ${p.nickname} (${p.role}/${p.tierScore})`).join('\n')
  const message = `**✅ 팀 A** (평균 티어: ${aAvg})\n${format(teamA)}\n\n**✅ 팀 B** (평균 티어: ${bAvg})\n${format(teamB)}`
  return {
    message: gap >= 1.5 ? `⚠️ 두 팀의 티어 차이가 큽니다.\n${message}` : message,
    needsApproval: gap >= 1.5,
  }
}
export default buildTeams
