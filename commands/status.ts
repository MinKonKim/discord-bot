import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'

module.exports = {
  data: new SlashCommandBuilder().setName('상태').setDescription('봇의 현재 상태를 확인합니다'),

  async execute(interaction: ChatInputCommandInteraction) {
    const uptime = process.uptime()
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)

    const embed = new EmbedBuilder()
      .setTitle('🤖 봇 상태')
      .addFields(
        { name: '업타임', value: `${hours}시간 ${minutes}분`, inline: true },
        {
          name: '서버 수',
          value: `${interaction.client.guilds.cache.size}개`,
          inline: true,
        },
        {
          name: '사용자 수',
          value: `${interaction.client.users.cache.size}명`,
          inline: true,
        }
      )
      .setColor(0x00ae86)
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}
