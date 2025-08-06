import { ChatInputCommandInteraction } from 'discord.js'
import { GuildSession } from '../sessionData'
import { getPlayerNicknameById } from '../utils/discord-utils'

// commands/list-participants.js
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('참여인원')
    .setDescription('현재 팀 빌딩에 참여한 인원 목록을 보여줍니다.'),

  async execute(interaction: ChatInputCommandInteraction, guildSession: GuildSession) {
    const joinedPlayers = guildSession.joinedPlayers

    if (!interaction.guild) {
      return interaction.reply({
        content: '❌ 이 명령어는 서버에서만 사용할 수 있습니다.',
        ephemeral: true,
      })
    }

    if (joinedPlayers.size === 0) {
      return interaction.reply({
        content: '아직 참여한 인원이 없습니다.',
      })
    }

    let playerList = '## 참여자 명단\n'

    for (const userId of joinedPlayers.keys()) {
      const nickname = await getPlayerNicknameById(interaction, userId)
      if (nickname) {
        playerList += `- ${nickname} 참여\n`
      } else {
        playerList += `- <@${userId}> (정보 없음)\n`
      }
    }

    await interaction.reply(playerList)
  },
}
