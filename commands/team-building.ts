import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { GuildSession } from '../sessionData'
import { buildTeams } from '../utils/build-teams'
import { formatPlayers } from '../utils/string-utils'

// commands/팀빌딩.js

module.exports = {
  data: new SlashCommandBuilder()
    .setName('팀빌딩')
    .setDescription('현재 참여자들로 팀을 구성합니다.'),

  async execute(interaction: ChatInputCommandInteraction, guildSession: GuildSession) {
    const joinedPlayers = guildSession.joinedPlayers

    const result = buildTeams(joinedPlayers)

    if ('error' in result!) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('팀 빌딩 실패')
            .setDescription(result.error),
        ],
      })
      return
    }

    const { teamA, teamB } = result

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('팀 빌딩 결과')
      .addFields(
        {
          name: `팀 A `,
          value: formatPlayers(teamA.players),
          inline: true,
        },
        {
          name: `팀 B`,
          value: formatPlayers(teamB.players),
          inline: true,
        }
      )
      .setFooter({ text: '매칭 완료! 즐거운 게임 되세요!' })

    await interaction.reply({ embeds: [embed] })
  },
}
