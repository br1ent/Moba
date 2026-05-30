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
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="card bg-base-200 shadow-lg w-64">
    <div class="card-body items-center text-center p-6">
      <!-- AI 头像 -->
      <div class="avatar" :class="{ 'placeholder': !aiAvatar }">
        <div class="w-24 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
          <img v-if="aiAvatar" :src="aiAvatar" :alt="aiName" />
          <div v-else class="bg-neutral text-neutral-content w-24 h-24 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- AI 名字 -->
      <h2 class="card-title mt-4">{{ aiName }}</h2>

      <!-- 难度选择 (仅 AI 模式) -->
      <div v-if="type === 'ai'" class="mt-4">
        <DifficultySelect :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />
      </div>

      <!-- 等待匹配 (玩家模式预留) -->
      <div v-else class="mt-4">
        <span class="loading loading-dots loading-md"></span>
        <p class="text-sm text-base-content/60 mt-2">等待匹配...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
