<script setup>
import DifficultySelect from './DifficultySelect.vue'

const props = defineProps({
  type: {
    type: String,
    default: 'ai',
    validator: (value) => ['ai', 'player'].includes(value)
  },
  aiAvatar: {
    type: String,
    default: ''
  },
  aiName: {
    type: String,
    default: 'Bot'
  },
  modelValue: {
    type: String,
    default: 'easy'
  },
  matchStatus: {
    type: String,
    default: 'ready',
    validator: (value) => ['ready', 'matching', 'matched'].includes(value)
  },
  opponentAvatar: {
    type: String,
    default: ''
  },
  opponentName: {
    type: String,
    default: ''
  },
  opponentRankScore: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="card bg-base-200 shadow-lg w-64">
    <div class="card-body items-center text-center p-6">
      <!-- 头像 -->
      <div class="avatar">
        <div class="w-24 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
          <img
            :src="type === 'ai' ? aiAvatar : (matchStatus === 'matched' && opponentAvatar ? opponentAvatar : '/media/avatar/default.png')"
            :alt="type === 'ai' ? aiName : (matchStatus === 'matched' && opponentName ? opponentName : '对手')"
          />
        </div>
      </div>

      <!-- 名字 -->
      <h2 class="card-title mt-4">
        <template v-if="type === 'ai'">{{ aiName }}</template>
        <template v-else-if="matchStatus === 'matched' && opponentName">{{ opponentName }}</template>
        <template v-else>你的对手</template>
      </h2>

      <!-- AI 难度选择 -->
      <div v-if="type === 'ai'" class="mt-4">
        <DifficultySelect :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />
      </div>

      <!-- 对手天梯分 (匹配成功才显示) -->
      <div v-if="type === 'player' && matchStatus === 'matched'" class="mt-4">
        <div class="badge badge-primary badge-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          天梯分: {{ opponentRankScore }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
