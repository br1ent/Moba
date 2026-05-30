<script setup>
import MatchBoard from '@/components/match/MatchBoard.vue'

function handleStart(options) {
  console.log('开始匹配:', options)
  // TODO: 实现多人匹配逻辑
}
</script>

<template>
  <MatchBoard mode="multi" @start="handleStart" />
</template>

<style scoped>
</style>
