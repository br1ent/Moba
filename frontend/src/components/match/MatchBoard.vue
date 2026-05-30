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

const emit = defineEmits(['start', 'match', 'cancel'])

const userStore = useUserStore()
const difficulty = ref('easy')
const matchStatus = ref('ready')

const opponent = ref({
  avatar: '',
  username: '',
  rank_score: 0
})

const opponentType = computed(() => props.mode === 'single' ? 'ai' : 'player')

const buttonText = computed(() => {
  if (props.mode === 'single') return '开始游戏'
  const texts = {
    ready: '开始匹配',
    matching: '取消匹配',
    matched: '匹配成功'
  }
  return texts[matchStatus.value]
})

const buttonClass = computed(() => {
  if (props.mode === 'single') return 'btn-info'
  const classes = {
    ready: 'btn-info',
    matching: 'btn-error',
    matched: 'btn-success'
  }
  return classes[matchStatus.value]
})

const buttonDisabled = computed(() => {
  return props.mode === 'multi' && matchStatus.value === 'matched'
})

function handleStart() {
  if (props.mode === 'single') {
    emit('start', {
      mode: props.mode,
      difficulty: difficulty.value
    })
  } else {
    if (matchStatus.value === 'ready') {
      matchStatus.value = 'matching'
      emit('match', {
        mode: props.mode,
        status: 'matching'
      })
    } else if (matchStatus.value === 'matching') {
      matchStatus.value = 'ready'
      opponent.value = { avatar: '', username: '', rank_score: 0 }
      emit('cancel', {
        mode: props.mode,
        status: 'ready'
      })
    }
  }
}

function setMatchStatus(status) {
  matchStatus.value = status
}

function setOpponent(data) {
  opponent.value = data
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
    <!-- 标题 -->
    <h1 class="text-3xl font-bold mb-12">{{ mode === 'single' ? '单人游戏' : '匹配大厅' }}</h1>

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
          :match-status="matchStatus"
          :opponent-avatar="opponent.avatar"
          :opponent-name="opponent.username"
          :opponent-rank-score="opponent.rank_score"
          v-model="difficulty"
        />
      </div>
    </div>

    <!-- 按钮 -->
    <button
      class="btn btn-lg px-16"
      :class="[buttonClass, { 'btn-disabled': buttonDisabled }]"
      :disabled="buttonDisabled"
      @click="handleStart"
    >
      <span v-if="matchStatus === 'matching'" class="loading loading-spinner loading-sm mr-2"></span>
      {{ buttonText }}
    </button>
  </div>
</template>

<style scoped>
</style>
