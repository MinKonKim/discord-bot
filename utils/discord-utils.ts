import { ChatInputCommandInteraction } from 'discord.js'

/**
 * Discord 사용자 ID를 이용해 서버(길드)별 닉네임 또는 사용자 이름을 가져옵니다.
 * @param client - Discord 클라이언트 인스턴스
 * @param interaction - 인터렉션
 * @returns 사용자의 닉네임 또는 사용자 이름
 */
export const getPlayerNicknameById = async (
  interaction: ChatInputCommandInteraction,
  userId: string
): Promise<string> => {
  if (!interaction || !interaction.guild) {
    return '길드가 없습니다.'
  }
  const member = await interaction.guild?.members.fetch(userId)

  if (!member) {
    return interaction.user.username
  }

  return member.nickname!
}
