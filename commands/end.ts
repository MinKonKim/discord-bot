import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { GuildSession } from '../sessionData'

module.exports = {
  data: new SlashCommandBuilder().setName('종료').setDescription('모든 정보를 초기화합니다.'),

  async execute(interaction: ChatInputCommandInteraction, guildSession: GuildSession) {
    guildSession.joinedPlayers.clear()
    guildSession.collecting = false

    await interaction.reply('모든 데이터가 초기화되었습니다.')
  },
}
