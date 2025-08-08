import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { GuildSession } from '../sessionData'

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

    const playerList = Array.from(joinedPlayers.values())
      .map(player => {
        const positions = []
        if (player.tankTier) positions.push(`🛡️탱커: ${player.tankTier}`)
        if (player.dpsTier) positions.push(`⚔️딜러: ${player.dpsTier}`)
        if (player.healTier) positions.push(`🧑‍⚕️힐러: ${player.healTier}`)
        return `- ${player.nickname} \t (${positions.join(', ')})`
      })
      .join('\n')

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('참여자 명단')
      .setDescription(playerList || '참가자 없음')
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}
