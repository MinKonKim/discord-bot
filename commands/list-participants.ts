import { ChatInputCommandInteraction } from 'discord.js'
import { CustomClient } from '..'
import { getPlayerNicknameById } from '../utils/discord-utils'

// commands/list-participants.js
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('참여인원')
    .setDescription('현재 팀 빌딩에 참여한 인원 목록을 보여줍니다.'),

  async execute(interaction: ChatInputCommandInteraction, client: CustomClient) {
    const joinedPlayers = client.joinedPlayers

    if (!interaction.guild) {
      return interaction.reply({
        content: '',
      })
    }

    if (joinedPlayers.size === 0) {
      return interaction.reply({
        content: '아직 참여한 인원이 없습니다.',
      })
    }

    let playerList = '## 참여자 명단\n'

    for (const userId of joinedPlayers) {
      const user = await client.users.fetch(userId)
      const nickname = await getPlayerNicknameById(client, interaction.guild?.id!, userId)
      //       if (player) {
      //         playerList += `- ${username} (탱: ${player.tankTier || '미입력'} / 딜: ${
      //           player.dpsTier || '미입력'
      //         } / 힐: ${player.healTier || '미입력'})
      // `
      //       } else {
      //         // This case should ideally not happen if logic is consistent
      //         playerList += `- ${username} (정보 없음)
      // `
      //       }
    }

    await interaction.reply(playerList)
  },
}
