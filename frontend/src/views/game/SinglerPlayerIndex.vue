<script setup>
import MatchBoard from '@/components/match/MatchBoard.vue'

const botAvatar = '/media/avatar/bot.jpg'

function handleStart(options) {
  console.log('开始游戏:', options)
  // TODO: 跳转到游戏页面或启动游戏
}
</script>

<template>
  <MatchBoard mode="single" :ai-avatar="botAvatar" @start="handleStart" />
</template>

<style scoped>
</style>
