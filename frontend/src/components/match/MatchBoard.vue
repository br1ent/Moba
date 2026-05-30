<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import PlayerCard from './PlayerCard.vue'
import OpponentCard from './OpponentCard.vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'single',
    validator: (value) => ['single', 'multi'].includes(value)
  },
  aiAvatar: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['start'])

const userStore = useUserStore()
const difficulty = ref('easy')

const opponentType = computed(() => props.mode === 'single' ? 'ai' : 'player')

function handleStart() {
  emit('start', {
    mode: props.mode,
    difficulty: difficulty.value
  })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
    <!-- 标题 -->
    <h1 class="text-3xl font-bold mb-12">匹配大厅</h1>

    <!-- 匹配区域 -->
    <div class="flex items-center gap-16 mb-12">
      <!-- 玩家卡片 -->
      <div class="flex flex-col items-center">
        <span class="badge badge-lg badge-primary mb-4">你</span>
        <PlayerCard
          v-if="userStore.user"
          :avatar="userStore.user.avatar"
          :username="userStore.user.username"
          :rank-score="userStore.user.rank_score"
        />
      </div>

      <!-- VS 分隔 -->
      <div class="flex flex-col items-center">
        <span class="text-4xl font-bold text-primary">VS</span>
      </div>

      <!-- 对手卡片 -->
      <div class="flex flex-col items-center">
        <span class="badge badge-lg badge-secondary mb-4">
          {{ mode === 'single' ? 'AI' : '对手' }}
        </span>
        <OpponentCard
          :type="opponentType"
          :ai-avatar="aiAvatar"
          :ai-name="'Bot'"
          v-model="difficulty"
        />
      </div>
    </div>

    <!-- 开始游戏按钮 -->
    <button class="btn btn-primary btn-lg px-16" @click="handleStart">
      开始游戏
    </button>
  </div>
</template>

<style scoped>
</style>
