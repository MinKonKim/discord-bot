const { SlashCommandBuilder } = require('discord.js')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('목데이터')
    .setDescription('테스트용 목데이터를 데이터베이스에 삽입합니다.'),
  async execute(interaction) {
    try {
      const createdPlayer = await prisma.player.create({
        data: {
          nickname: interaction.member.nickname || interaction.user.username,
          tankTier: '플래티넘',
          deelTier: '골드',
          healTier: '실버',
        },
      })

      await interaction.reply(`✅ 목데이터 삽입 완료!\n닉네임: ${createdPlayer.nickname}`)
    } catch (error) {
      console.error(error)
      await interaction.reply(`❌ 삽입 실패: ${error.message}`)
    }
  },
}
