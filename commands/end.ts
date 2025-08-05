import { ChatInputCommandInteraction } from 'discord.js'
import { CustomClient } from '..'

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder().setName('종료').setDescription('모든 정보를 초기화합니다.'),

  async execute(interaction: ChatInputCommandInteraction, client: CustomClient) {
    client.joinedPlayers.clear()
    client.collecting = false
    await interaction.reply('모든 데이터가 초기화되었습니다.')
  },
}
