<script setup>
import { ref } from 'vue'
import MatchBoard from '@/components/match/MatchBoard.vue'

const matchBoardRef = ref(null)
let matchTimer = null

function handleMatch(options) {
  console.log('开始匹配:', options)
  
  // 模拟匹配过程，2秒后匹配成功
  matchTimer = setTimeout(() => {
    if (matchBoardRef.value) {
      // 模拟对手数据
      const opponentData = {
        avatar: '/media/avatar/default.png',
        username: '玩家' + Math.floor(Math.random() * 10000),
        rank_score: Math.floor(Math.random() * 1000) + 800
      }
      matchBoardRef.value.setOpponent(opponentData)
      matchBoardRef.value.setMatchStatus('matched')
    }
  }, 2000)
}

function handleCancel(options) {
  console.log('取消匹配:', options)
  
  // 清除匹配定时器
  if (matchTimer) {
    clearTimeout(matchTimer)
    matchTimer = null
  }
}
</script>

<template>
  <MatchBoard ref="matchBoardRef" mode="multi" @match="handleMatch" @cancel="handleCancel" />
</template>

<style scoped>
</style>
