<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import MatchBoard from '@/components/match/MatchBoard.vue'
import GameCanvas from '@/components/game/GameCanvas.vue'

const userStore = useUserStore()
const botAvatar = '/media/avatar/bot.jpg'
const gameStarted = ref(false)

const userAvatar = computed(() => userStore.user?.avatar || '')

function handleStart(options) {
  gameStarted.value = true
}

function handleExit() {
  gameStarted.value = false
}
</script>

<template>
  <GameCanvas v-if="gameStarted" :avatar="userAvatar" @exit="handleExit" />
  <MatchBoard v-else mode="single" :ai-avatar="botAvatar" @start="handleStart" />
</template>

<style scoped>
</style>
