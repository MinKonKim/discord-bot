require('dotenv').config()
const { REST, Routes } = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')

const token = process.env.DISCORD_TOKEN
const clientId = process.env.CLIENT_ID
const guildId = process.env.GUILD_ID
const isGlobal = process.env.GLOBAL_DEPLOY === 'true'

const commands = []
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON())
  } else {
    console.warn(`[WARNING] '${file}'에 data나 execute가 없음`)
  }
}

const rest = new REST().setToken(token)

;(async () => {
  try {
    if (isGlobal) {
      console.log('⚙️ 전역 명령어 등록 중...')
      await rest.put(Routes.applicationCommands(clientId), { body: commands })
      console.log('✅ 전역 명령어 등록 완료!')
    } else {
      console.log(`⚙️ 길드 명령어 등록 중... (길드 ID: ${guildId})`)
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
      console.log('✅ 길드 명령어 등록 완료!')
    }
  } catch (error) {
    console.error(error)
  }
})()
