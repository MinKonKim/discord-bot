import { Collection } from '@discordjs/collection'
import { Client, Events, GatewayIntentBits } from 'discord.js'
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { GuildSession, OverWatchPlayerDump } from './sessionData'

// 타입 안전성을 위한 CustomClient 클래스 정의
export class CustomClient extends Client {
  commands = new Collection<string, any>()
  guildSessions = new Collection<string, GuildSession>() // guildId -> session
  getGuildSession(guildId: string): GuildSession {
    if (!this.guildSessions.has(guildId)) {
      this.guildSessions.set(guildId, {
        collecting: false,
        joinedPlayers: new Collection<string, OverWatchPlayerDump>(),
      })
    }
    return this.guildSessions.get(guildId)!
  }
}

const client = new CustomClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

// 명령어 로더 수정 (.ts와 .js 파일 모두 로드)
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith('.ts') || file.endsWith('.js'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)

  if (command.data && command.execute) {
    client.commands.set(command.data.name, command)
  } else {
    console.log(`[WARNING] ${filePath} 파일에 data 또는 execute 속성이 없습니다.`)
  }
}

client.once(Events.ClientReady, c => {
  console.log(`✅ Logged in as ${c.user.tag}`)
})

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return

  const command = client.commands.get(interaction.commandName)
  if (!command) {
    console.error(`${interaction.commandName}에 해당하는 명령어를 찾을 수 없습니다.`)
    return
  }

  try {
    const guildSession = client.getGuildSession(interaction.guildId!) // 길드 세션
    await command.execute(interaction, guildSession)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: '명령어 실행 중 오류가 발생했습니다!',
        ephemeral: true,
      })
    } else {
      await interaction.reply({ content: '명령어 실행 중 오류가 발생했습니다!', ephemeral: true })
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
