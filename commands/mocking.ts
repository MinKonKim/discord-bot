import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { GuildSession } from '../sessionData'
import { getRandomTier } from '../utils/string-utils'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('모킹')
    .setDescription('테스트용 가짜 유저 정보 입력')
    .addIntegerOption(option =>
      option
        .setName('수')
        .setDescription('생성할 유저 수 (최대 12)')
        .setMinValue(1)
        .setMaxValue(12)
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction, guildSession: GuildSession) {
    const count = interaction.options.getInteger('수') || 1

    for (let i = 1; i <= count; i++) {
      const id = i.toString()

      guildSession.joinedPlayers.set(id, {
        nickname: `유저${i}`,
        dpsTier: getRandomTier(),
        healTier: getRandomTier(),
        tankTier: getRandomTier(),
      })
    }

    await interaction.reply({
      content: `${count}명의 테스트 유저가 생성되었습니다.`,
      ephemeral: true,
    })
  },
}
