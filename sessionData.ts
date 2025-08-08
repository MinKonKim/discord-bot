import { Collection } from '@discordjs/collection'
import { OverWatchPlayer } from '@prisma/client'
import { Client } from 'discord.js'

export enum OverwatchTier {
  브론즈 = 1,
  실버 = 2,
  골드 = 3,
  플래티넘 = 4,
  다이아몬드 = 5,
  마스터 = 6,
  그랜드마스터 = 7,
  챔피언 = 8,
}

// export interface Player {
//   nickname: string | null;
//   tankTier: OverwatchTier | null;
//   dpsTier: OverwatchTier | null;
//   healTier: OverwatchTier | null;
// }

export interface OverWatchPlayerClient extends Client {
  players: { [key: string]: OverWatchPlayer }
  collecting: boolean
}

export type OverWathPlayerDump = Omit<OverWatchPlayer, 'id' | 'createdAt'>

export interface GuildSession {
  collecting: boolean
  joinedPlayers: Collection<string, OverWathPlayerDump>
  // 추후 팀 정보, 매칭 상태 등 추가 가능
}

export type Role = 'tank' | 'dps' | 'heal'
export interface PlayerWithRole extends OverWatchPlayer {
  assignedRole: Role
  score: number
}

export interface Team {
  players: PlayerWithRole[]
  totalScore: number
  avgScore: number
}
