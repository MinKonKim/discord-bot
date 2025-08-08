import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { userService } from '../services/user-service'
import { GuildSession, OverWatchPlayerDump } from '../sessionData'
import { getPlayerNicknameById } from '../utils/discord-utils'
import { toPrismaTier } from '../utils/string-utils'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('입력')
    .setDescription('자신의 포지션과 티어를 입력합니다. 입력은 여러번 가능합니다!😀')
    .addStringOption(option =>
      option
        .setName('포지션')
        .setDescription('탱, 딜, 힐 중 하나')
        .setRequired(true)
        .addChoices(
          { name: '탱', value: '탱' },
          { name: '딜', value: '딜' },
          { name: '힐', value: '힐' }
        )
    )
    .addStringOption(option =>
      option
        .setName('티어')
        .setDescription('브론즈 ~ 챔피언 중 하나')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async execute(interaction: ChatInputCommandInteraction, guildSession: GuildSession) {
    if (!guildSession.collecting) {
      return interaction.reply({
        content: '❌ `/시작` 명령어로 먼저 수집을 시작해주세요.',
        ephemeral: true,
      })
    }

    if (!interaction.guild) {
      return interaction.reply({
        content: '❌ 이 명령어는 서버에서만 사용할 수 있습니다.',
        ephemeral: true,
      })
    }

    const userId = interaction.user.id
    const nickname = await getPlayerNicknameById(interaction, userId)
    const position = interaction.options.getString('포지션', true)
    const tierString = interaction.options.getString('티어', true)
    const tier = toPrismaTier(tierString)

    if (!tier) {
      return interaction.reply({
        content: `❌ 유효하지 않은 티어 값입니다: ${tierString}`,
        ephemeral: true,
      })
    }

    try {
      const existingPlayer = await userService.getPlayerByNickname(nickname)

      const playerData: OverWatchPlayerDump = {
        nickname,
        tankTier: existingPlayer?.tankTier || null,
        dpsTier: existingPlayer?.dpsTier || null,
        healTier: existingPlayer?.healTier || null,
      }

      if (position === '탱') playerData.tankTier = tier
      if (position === '딜') playerData.dpsTier = tier
      if (position === '힐') playerData.healTier = tier

      await userService.upsertPlayer(playerData)
      guildSession.joinedPlayers.set(userId, playerData)
      await interaction.reply({
        content: `✅ ${nickname}님의 ${position} 포지션 티어가 **${tierString}**(으)로 저장되었습니다.`,
        flags: MessageFlags.Ephemeral,
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: '❌ 정보를 저장하는 동안 오류가 발생했습니다.',
        flags: MessageFlags.Ephemeral,
      })
    }
  },
}
