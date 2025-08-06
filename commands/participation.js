// commands/참여.js
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder().setName('참여').setDescription('팀 빌딩에 참여합니다.'),

  async execute(interaction, client, guildSession) {
    const userId = interaction.user.id
    const user = guildSession.players[userId]

    if (!user) {
      return interaction.reply({
        content: '❌ 먼저 `/입력` 명령어로 포지션과 티어를 입력해주세요.',
        ephemeral: true,
      })
    }

    guildSession.joinedPlayers.add(userId)
    await interaction.reply(
      `✅ 참여 완료!\n- 탱: ${user.tankTier || '미입력'} / 딜: ${user.dpsTier || '미입력'} / 힐: ${user.healTier || '미입력'}`
    )
  },
}
