import { ChatInputCommandInteraction } from 'discord.js'
import { GuildSession } from '../sessionData'

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('시작')
    .setDescription('플레이어 정보 수집을 시작합니다.'),

  async execute(interaction: ChatInputCommandInteraction, guildSession: GuildSession) {
    guildSession.collecting = true

    await interaction.reply(
      '✅ 팀 빌딩을 위한 정보 수집을 시작합니다.\n`/입력` 명령어로 자신의 포지션과 티어를 등록해주세요!'
    )
  },
}
