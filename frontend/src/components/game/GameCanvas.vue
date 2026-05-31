<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { GameEngine } from '@/scripts/game/gameEngine.js'
import { MAX_HEALTH } from '@/scripts/game/config.js'

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
const health = ref(MAX_HEALTH)
let engine = null

function handleExit() {
  emit('exit')
}

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
    engine.onHealthChange = (value) => { health.value = value }
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
  <div class="game-container">
    <button class="back-btn" @click="handleExit">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      返回
    </button>

    <canvas
      ref="canvasRef"
      class="game-canvas"
      @contextmenu="handleContextMenu"
      @mousemove="handleMouseMove"
    ></canvas>
  </div>
</template>

<style scoped>
.game-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 4rem);
  background: #000;
}

.game-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.back-btn {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
}
</style>
