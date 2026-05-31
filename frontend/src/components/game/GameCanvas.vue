<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { GameEngine } from '@/scripts/game/gameEngine.js'

const props = defineProps({
  avatar: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    default: 'easy'
  }
})

const emit = defineEmits(['exit'])

const canvasRef = ref(null)
let engine = null

function handleContextMenu(e) {
  e.preventDefault()
  const rect = canvasRef.value.getBoundingClientRect()
  engine.handleRightClick(e.clientX - rect.left, e.clientY - rect.top)
}

function handleMouseMove(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  engine.handleMouseMove(e.clientX - rect.left, e.clientY - rect.top)
}

function handleKeyDown(e) {
  if (e.key === 'q' || e.key === 'Q') {
    engine.handleShoot()
  }
  if (e.key === 's' || e.key === 'S') {
    engine.handleStop()
  }
  if (e.key === 'Escape') {
    engine.handleExit()
  }
}

function handleResize() {
  if (engine) engine.resize()
}

onMounted(() => {
  nextTick(async () => {
    engine = new GameEngine(canvasRef.value, props.avatar, props.difficulty)
    engine.onExit = () => emit('exit')
    await engine.init()

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
  })
})

onUnmounted(() => {
  if (engine) engine.destroy()
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="w-full h-[calc(100vh-4rem)] block"
    @contextmenu="handleContextMenu"
    @mousemove="handleMouseMove"
  ></canvas>
</template>
