// commands/모킹.js
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('모킹')
    .setDescription('테스트용 가짜 유저 정보 입력')
    .addIntegerOption(opt =>
      opt
        .setName('수')
        .setDescription('생성할 유저 수 (최대 12)')
        .setMinValue(1)
        .setMaxValue(12)
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const count = interaction.options.getInteger('수')

    const roles = ['탱', '딜', '힐']
    const tiers = [
      '브론즈',
      '실버',
      '골드',
      '플래티넘',
      '다이아몬드',
      '마스터',
      '그랜드마스터',
      '챔피언',
    ]

    for (let i = 1; i <= count; i++) {
      const id = `mock-${i}`
      const role = roles[Math.floor(Math.random() * roles.length)]
      const tier = tiers[Math.floor(Math.random() * tiers.length)]

      client.playerData.set(id, {
        id,
        username: `테스트유저${i}`,
        role,
        tier,
      })
    }

    await interaction.reply({
      content: `${count}명의 테스트 유저가 생성되었습니다.`,
      ephemeral: true,
    })
  },
}
