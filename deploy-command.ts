require('dotenv').config()
const { REST, Routes } = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')

const token = process.env.DISCORD_TOKEN
const clientId = process.env.CLIENT_ID
const guildId = process.env.GUILD_ID

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
    console.log(`🎯 [등록 시작] ${commands.length}개 명령어를 Discord에 등록합니다.`)

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })

    console.log('✅ 성공적으로 등록 완료!')
  } catch (error) {
    console.error(error)
  }
})()
