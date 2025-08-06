import { ChatInputCommandInteraction } from 'discord.js'
import { GuildSession } from '../sessionData'

// commands/팀빌딩.js
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('팀빌딩')
    .setDescription('현재 참여자들로 팀을 구성합니다.'),

  async execute(interaction: ChatInputCommandInteraction, client: any, guildSession: GuildSession) {
    // const joinedUsers = [...guildSession.joinedPlayers.keys()].map(id => ({
    //   userId: id,
    //   ...guildSession.joinedPlayers.keys()
    // }))
    // const result = buildTeams(joinedUsers)
    // if (result.needsApproval) {
    //   const row = new ActionRowBuilder().addComponents(
    //     new ButtonBuilder()
    //       .setCustomId('approve_teams')
    //       .setLabel('진행할까요?')
    //       .setStyle(ButtonStyle.Primary)
    //   )
    //   return interaction.reply({ content: result.message, components: [row] })
    // }
    // await interaction.reply(result.message)
  },
}
