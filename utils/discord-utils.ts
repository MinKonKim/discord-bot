import { Client } from 'discord.js';

/**
 * Discord 사용자 ID를 이용해 서버(길드)별 닉네임 또는 사용자 이름을 가져옵니다.
 * @param client - Discord 클라이언트 인스턴스
 * @param guildId - 서버(길드) ID
 * @param userId - 사용자 ID
 * @returns 사용자의 닉네임 또는 사용자 이름
 */
export async function getPlayerNicknameById(
  client: Client,
  guildId: string,
  userId: string
): Promise<string> {
  try {
    const guild = await client.guilds.fetch(guildId);
    const member = await guild.members.fetch(userId);
    return member.nickname || member.user.username;
  } catch (error) {
    // 사용자가 서버에 없거나 다른 오류가 발생하면 전역 사용자 이름을 가져옵니다.
    console.warn(
      `Could not fetch member ${userId} from guild ${guildId}. Falling back to global username.`
    );
    try {
      const user = await client.users.fetch(userId);
      return user.username;
    } catch (userFetchError) {
      console.error(`Failed to fetch user ${userId}:`, userFetchError);
      return '(알 수 없는 사용자)';
    }
  }
}
