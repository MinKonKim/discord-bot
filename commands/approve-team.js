// interactions/approve_teams.js
module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return
    if (interaction.customId === 'approve_teams') {
      await interaction.update({ content: '✅ 팀이 확정되었습니다!', components: [] })
    }
  },
}
