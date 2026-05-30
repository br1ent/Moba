<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'easy'
  }
})

const emit = defineEmits(['update:modelValue'])

const difficulties = [
  { value: 'easy', label: '入门' },
  { value: 'hard', label: '专家' },
  { value: 'nightmare', label: '你最好不要碰！' }
]

const dropdownRef = ref(null)

function select(value) {
  emit('update:modelValue', value)
  closeDropdown()
}

function getLabel(value) {
  return difficulties.find(d => d.value === value)?.label || '入门'
}

function closeDropdown() {
  if (dropdownRef.value) {
    dropdownRef.value.removeAttribute('open')
  }
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
})
</script>

<template>
  <details ref="dropdownRef" class="dropdown">
    <summary class="btn btn-outline w-48 justify-between">
      <span>{{ getLabel(modelValue) }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>
    <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-48 p-2 shadow-lg mt-1">
      <li v-for="diff in difficulties" :key="diff.value">
        <a @click="select(diff.value)" :class="{ 'active': modelValue === diff.value }">
          {{ diff.label }}
        </a>
      </li>
    </ul>
  </details>
</template>

<style scoped>
</style>
