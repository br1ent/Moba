<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { GameEngine } from '@/scripts/game/gameEngine.js'
import { MAX_HEALTH } from '@/scripts/game/config.js'
import flashIcon from '@/assets/game/flash.svg'
import shieldIcon from '@/assets/game/shield.svg'
import potionIcon from '@/assets/game/potion.svg'

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
const gameOver = ref(false)
const gameResult = ref(null)
const gameDuration = ref('00:00')
let engine = null

const skillState = reactive({
  flashCooldownPercent: 0,
  shieldCooldownPercent: 0,
  flashRemaining: 0,
  shieldRemaining: 0,
  potionUses: 1
})

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

function updateSkillState() {
  if (!engine) return
  const state = engine.getSkillState()
  skillState.flashCooldownPercent = state.flashCooldownPercent
  skillState.shieldCooldownPercent = state.shieldCooldownPercent
  skillState.flashRemaining = state.flashRemaining
  skillState.shieldRemaining = state.shieldRemaining
  skillState.potionUses = state.potionUses
}

function handleKeyDown(e) {
  if (gameOver.value) return
  
  if (e.key === 'q' || e.key === 'Q') {
    engine.handleShoot()
  }
  if (e.key === 's' || e.key === 'S') {
    engine.handleStop()
  }
  if (e.key === 'Escape') {
    engine.handleExit()
  }
  if (e.key === 'd' || e.key === 'D') {
    engine.handleFlash()
  }
  if (e.key === 'f' || e.key === 'F') {
    engine.handleShield()
  }
  if (e.key === 'g' || e.key === 'G') {
    engine.handlePotion()
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
    engine.onSkillUpdate = updateSkillState
    engine.onGameOver = (result, duration) => {
      gameOver.value = true
      gameResult.value = result
      gameDuration.value = duration
    }
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

    <div class="hud-overlay">
      <div class="health-section">
        <div class="health-bar-bg">
          <div class="health-bar-fill" :style="{ width: (health / MAX_HEALTH * 100) + '%' }"></div>
          <span class="health-text">{{ health }}/{{ MAX_HEALTH }}</span>
        </div>
      </div>
      
      <div class="skills-section">
        <div class="skill-item">
          <div class="skill-icon-wrapper">
            <img :src="flashIcon" alt="闪现" class="skill-icon" />
            <div v-if="skillState.flashCooldownPercent > 0" class="cooldown-overlay" :style="{ height: (skillState.flashCooldownPercent * 100) + '%' }"></div>
            <span v-if="skillState.flashCooldownPercent > 0" class="cooldown-text">{{ skillState.flashRemaining }}</span>
          </div>
          <span class="skill-key">D</span>
        </div>
        
        <div class="skill-item">
          <div class="skill-icon-wrapper">
            <img :src="shieldIcon" alt="屏障" class="skill-icon" />
            <div v-if="skillState.shieldCooldownPercent > 0" class="cooldown-overlay" :style="{ height: (skillState.shieldCooldownPercent * 100) + '%' }"></div>
            <span v-if="skillState.shieldCooldownPercent > 0" class="cooldown-text">{{ skillState.shieldRemaining }}</span>
          </div>
          <span class="skill-key">F</span>
        </div>
        
        <div class="skill-item">
          <div class="skill-icon-wrapper" :class="{ 'used-up': skillState.potionUses <= 0 }">
            <img :src="potionIcon" alt="血瓶" class="skill-icon" />
            <div v-if="skillState.potionUses <= 0" class="used-overlay"></div>
          </div>
          <span class="skill-key">G</span>
          <span class="skill-count" v-if="skillState.potionUses > 0">x{{ skillState.potionUses }}</span>
        </div>
      </div>
    </div>

    <div v-if="gameOver" class="game-over-overlay">
      <div class="game-over-card">
        <h1 class="result-title" :class="gameResult">
          {{ gameResult === 'win' ? '你胜利了！' : '你失败了！' }}
        </h1>
        <div class="duration-section">
          <span class="duration-label">游戏时长</span>
          <span class="duration-value">{{ gameDuration }}</span>
        </div>
        <button class="return-btn" @click="handleExit">返回</button>
      </div>
    </div>
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

.hud-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: #1a1a2e;
  border-top: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  z-index: 5;
}

.health-section {
  flex: 1;
  max-width: 350px;
}

.health-bar-bg {
  position: relative;
  width: 100%;
  height: 28px;
  background: #333;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #444;
}

.health-bar-fill {
  height: 100%;
  background: linear-gradient(to bottom, #2ecc71, #27ae60);
  transition: width 0.3s ease;
}

.health-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}

.skills-section {
  display: flex;
  gap: 16px;
  align-items: center;
}

.skill-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;
}

.skill-icon-wrapper {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #555;
  cursor: pointer;
  transition: border-color 0.2s;
}

.skill-icon-wrapper:hover {
  border-color: #888;
}

.skill-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cooldown-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(52, 152, 219, 0.7);
  transition: height 0.1s linear;
}

.cooldown-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

.used-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
}

.used-up {
  border-color: #333;
  opacity: 0.6;
}

.skill-key {
  color: #888;
  font-size: 12px;
  font-weight: bold;
}

.skill-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.game-over-card {
  background: #fff;
  border-radius: 16px;
  padding: 48px 64px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  min-width: 320px;
}

.result-title {
  font-size: 42px;
  font-weight: bold;
  margin-bottom: 28px;
}

.result-title.win {
  color: #2ecc71;
}

.result-title.lose {
  color: #e74c3c;
}

.duration-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 36px;
  padding: 16px 24px;
  background: #f5f5f5;
  border-radius: 10px;
}

.duration-label {
  color: #888;
  font-size: 14px;
}

.duration-value {
  color: #333;
  font-size: 32px;
  font-weight: bold;
  font-family: monospace;
}

.return-btn {
  padding: 14px 56px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
}

.return-btn:hover {
  background: linear-gradient(135deg, #2980b9, #2471a3);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.5);
}
</style>
