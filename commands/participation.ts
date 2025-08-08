import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { userService } from '../services/user-service'
import { GuildSession, OverWatchPlayerDump } from '../sessionData'
import { getPlayerNicknameById } from '../utils/discord-utils'

module.exports = {
  data: new SlashCommandBuilder().setName('참여').setDescription('팀 빌딩에 참여합니다.'),

  async execute(interaction: ChatInputCommandInteraction, guildSession: GuildSession) {
    const userId = interaction.user.id
    const nickname = await getPlayerNicknameById(interaction, userId)
    //db에 있는 유저 정보 가져오기
    const existingPlayer = await userService.getPlayerByNickname(nickname)
    if (!existingPlayer) {
      return interaction.reply({
        content: '❌ 먼저 `/입력` 명령어로 포지션과 티어를 입력해주세요.',
        flags: MessageFlags.Ephemeral,
      })
    }

    const playerData: OverWatchPlayerDump = {
      nickname,
      tankTier: existingPlayer?.tankTier || null,
      dpsTier: existingPlayer?.dpsTier || null,
      healTier: existingPlayer?.healTier || null,
    }

    guildSession.joinedPlayers.set(userId, playerData)
    await interaction.reply(
      `✅ 참여 완료!\n- 탱: ${existingPlayer.tankTier || '미입력'} / 딜: ${existingPlayer.dpsTier || '미입력'} / 힐: ${existingPlayer.healTier || '미입력'}`
    )
  },
}
