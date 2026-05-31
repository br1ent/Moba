import { SHOOT_COOLDOWN, DIFFICULTY_BOT_COUNT, DIFFICULTY_BOT_SHOOT_INTERVAL, HUD_HEIGHT, MAX_HEALTH, PLAYER_SIZE, BULLET_SIZE, BULLET_DAMAGE, SKILLS } from './config.js'
import { Player } from './player.js'
import { Bullet } from './bullet.js'
import { Bot } from './bot.js'
import { SkillSystem } from './skill.js'

export class GameEngine {
  constructor(canvas, avatarUrl, difficulty) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.player = new Player(avatarUrl)
    this.bullets = []
    this.bots = []
    this.mousePos = { x: 0, y: 0 }
    this.mousePosInitialized = false
    this.lastShootTime = 0
    this.animationId = null
    this.onExit = null
    this.difficulty = difficulty || 'easy'
    this.health = MAX_HEALTH
    this.playAreaHeight = 0
    this.onHealthChange = null
    this.skillSystem = new SkillSystem(this.difficulty)
    this.effects = []
    this.onSkillUpdate = null
  }

  async init() {
    this.resize()
    this.mousePos = { x: this.canvas.width / 2, y: this.playAreaHeight / 2 }
    await this.player.loadAvatar()
    this.player.init(this.canvas.width, this.playAreaHeight)
    this.createBots()
    this.gameLoop()
  }

  createBots() {
    const count = DIFFICULTY_BOT_COUNT[this.difficulty] || DIFFICULTY_BOT_COUNT.easy
    const shootInterval = DIFFICULTY_BOT_SHOOT_INTERVAL[this.difficulty] || DIFFICULTY_BOT_SHOOT_INTERVAL.easy
    this.bots = []

    for (let i = 0; i < count; i++) {
      const bot = new Bot(null, shootInterval)
      bot.init(this.canvas.width, this.playAreaHeight, this.player.x, this.player.y)
      this.bots.push(bot)
    }
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
    this.playAreaHeight = this.canvas.height - HUD_HEIGHT
    this.player.canvasWidth = this.canvas.width
    this.player.playAreaHeight = this.playAreaHeight
  }

  gameLoop() {
    this.update()
    this.render()
    this.animationId = requestAnimationFrame(() => this.gameLoop())
  }

  update() {
    const now = Date.now()
    
    this.player.update()
    this.player.updateShield(now)

    for (const bot of this.bots) {
      bot.update()
      const bullet = bot.tryShoot()
      if (bullet) {
        this.bullets.push(bullet)
      }
    }

    this.checkCollisions()

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].update()
      if (this.bullets[i].isOutOfBounds(this.canvas.width, this.canvas.height)) {
        this.bullets.splice(i, 1)
      }
    }

    for (let i = this.effects.length - 1; i >= 0; i--) {
      this.effects[i].update()
      if (this.effects[i].isDead()) {
        this.effects.splice(i, 1)
      }
    }

    if (this.onSkillUpdate) {
      this.onSkillUpdate()
    }
  }

  checkCollisions() {
    const half = PLAYER_SIZE / 2
    const bulletHalf = BULLET_SIZE / 2
    const hitDist = half + bulletHalf

    for (let i = 0; i < this.bots.length; i++) {
      for (let j = i + 1; j < this.bots.length; j++) {
        this.checkBallCollision(this.bots[i], this.bots[j])
      }
    }

    this.checkPlayerBotCollision()

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i]

      if (b.isPlayerBullet) {
        for (let j = this.bots.length - 1; j >= 0; j--) {
          const bot = this.bots[j]
          const dx = b.x - bot.x
          const dy = b.y - bot.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < hitDist) {
            this.bullets.splice(i, 1)
            
            const pushAngle = Math.atan2(dy, dx)
            bot.x -= Math.cos(pushAngle) * 15
            bot.y -= Math.sin(pushAngle) * 15
            bot.x = Math.max(half, Math.min(bot.x, this.canvas.width - half))
            bot.y = Math.max(half, Math.min(bot.y, this.playAreaHeight - half))
            
            this.effects.push(new BulletHitEffect(b.x, b.y))
            break
          }
        }
      } else {
        const dx = b.x - this.player.x
        const dy = b.y - this.player.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < hitDist) {
          this.bullets.splice(i, 1)
          
          if (this.player.shieldActive) {
            this.player.shieldActive = false
            this.effects.push(new ShieldBreakEffect(this.player.x, this.player.y))
          } else {
            this.health = Math.max(0, this.health - BULLET_DAMAGE)
            if (this.onHealthChange) {
              this.onHealthChange(this.health)
            }
            
            const pushAngle = Math.atan2(dy, dx)
            this.player.x -= Math.cos(pushAngle) * 15
            this.player.y -= Math.sin(pushAngle) * 15
            this.player.x = Math.max(half, Math.min(this.player.x, this.canvas.width - half))
            this.player.y = Math.max(half, Math.min(this.player.y, this.playAreaHeight - half))
          }
        }
      }
    }
  }

  checkPlayerBotCollision() {
    const half = PLAYER_SIZE / 2
    const minDist = PLAYER_SIZE

    for (const bot of this.bots) {
      const dx = bot.x - this.player.x
      const dy = bot.y - this.player.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < minDist && dist > 0) {
        const nx = dx / dist
        const ny = dy / dist
        const overlap = minDist - dist

        this.player.x -= nx * overlap / 2
        this.player.y -= ny * overlap / 2
        bot.x += nx * overlap / 2
        bot.y += ny * overlap / 2

        this.player.x = Math.max(half, Math.min(this.player.x, this.canvas.width - half))
        this.player.y = Math.max(half, Math.min(this.player.y, this.playAreaHeight - half))
        bot.x = Math.max(half, Math.min(bot.x, this.canvas.width - half))
        bot.y = Math.max(half, Math.min(bot.y, this.playAreaHeight - half))

        this.effects.push(new BounceTrailEffect(this.player.x, this.player.y, bot.x, bot.y))
      }
    }
  }

  checkBallCollision(ball1, ball2) {
    const dx = ball2.x - ball1.x
    const dy = ball2.y - ball1.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const minDist = PLAYER_SIZE

    if (dist < minDist && dist > 0) {
      const nx = dx / dist
      const ny = dy / dist
      const overlap = minDist - dist

      ball1.x -= nx * overlap / 2
      ball1.y -= ny * overlap / 2
      ball2.x += nx * overlap / 2
      ball2.y += ny * overlap / 2

      const half = PLAYER_SIZE / 2
      ball1.x = Math.max(half, Math.min(ball1.x, this.canvas.width - half))
      ball1.y = Math.max(half, Math.min(ball1.y, this.playAreaHeight - half))
      ball2.x = Math.max(half, Math.min(ball2.x, this.canvas.width - half))
      ball2.y = Math.max(half, Math.min(ball2.y, this.playAreaHeight - half))

      this.effects.push(new BounceTrailEffect(ball1.x, ball1.y, ball2.x, ball2.y))
    }
  }

  render() {
    const ctx = this.ctx

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    for (const effect of this.effects) {
      effect.render(ctx)
    }

    for (const bot of this.bots) {
      bot.render(ctx)
    }

    for (const bullet of this.bullets) {
      bullet.render(ctx)
    }

    this.player.render(ctx)
  }

  handleFlash() {
    const now = Date.now()
    if (!this.skillSystem.canUseFlash(now)) return false

    const dx = this.mousePos.x - this.player.x
    const dy = this.mousePos.y - this.player.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 1) return false

    const flashDist = SKILLS.FLASH_DISTANCE
    const ratio = flashDist / dist
    const newX = this.player.x + dx * ratio
    const newY = this.player.y + dy * ratio

    this.effects.push(new FlashEffect(this.player.x, this.player.y, this.player.avatarImg, this.player.avatarLoaded))
    
    this.skillSystem.useFlash(now)
    this.player.flashTo(newX, newY)
    
    return true
  }

  handleShield() {
    const now = Date.now()
    if (!this.skillSystem.canUseShield(now)) return false

    this.skillSystem.useShield(now)
    this.player.activateShield(now)
    return true
  }

  handlePotion() {
    if (!this.skillSystem.canUsePotion()) return false

    this.skillSystem.usePotion()
    this.health = MAX_HEALTH
    if (this.onHealthChange) {
      this.onHealthChange(this.health)
    }
    return true
  }

  getSkillState() {
    const now = Date.now()
    return {
      flashCooldownPercent: this.skillSystem.getFlashCooldownPercent(now),
      shieldCooldownPercent: this.skillSystem.getShieldCooldownPercent(now),
      flashRemaining: this.skillSystem.getFlashRemainingSeconds(now),
      shieldRemaining: this.skillSystem.getShieldRemainingSeconds(now),
      potionUses: this.skillSystem.potion.uses
    }
  }

  setHealth(value) {
    this.health = Math.max(0, Math.min(MAX_HEALTH, value))
    if (this.onHealthChange) this.onHealthChange(this.health)
  }

  handleRightClick(x, y) {
    if (y < this.playAreaHeight) {
      this.player.moveTo(x, y)
    }
  }

  handleMouseMove(x, y) {
    this.mousePos.x = x
    this.mousePos.y = y
    this.mousePosInitialized = true
  }

  handleShoot() {
    if (!this.mousePosInitialized) return
    
    const now = Date.now()
    if (now - this.lastShootTime < SHOOT_COOLDOWN) return
    this.lastShootTime = now

    const bullet = new Bullet(
      this.player.x,
      this.player.y,
      this.mousePos.x,
      this.mousePos.y,
      '#fff',
      true
    )
    this.bullets.push(bullet)
  }

  handleStop() {
    this.player.stop()
  }

  handleExit() {
    if (this.onExit) this.onExit()
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }
}

class FlashEffect {
  constructor(x, y, avatarImg, avatarLoaded) {
    this.x = x
    this.y = y
    this.alpha = 0.6
    this.life = 18
    this.maxLife = 18
    this.avatarImg = avatarImg
    this.avatarLoaded = avatarLoaded
  }

  update() {
    this.life--
    this.alpha = 0.6 * (this.life / this.maxLife)
  }

  isDead() {
    return this.life <= 0
  }

  render(ctx) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, this.alpha)
    
    ctx.beginPath()
    ctx.arc(this.x, this.y, PLAYER_SIZE / 2, 0, Math.PI * 2)
    ctx.clip()

    if (this.avatarLoaded && this.avatarImg) {
      ctx.drawImage(
        this.avatarImg,
        this.x - PLAYER_SIZE / 2,
        this.y - PLAYER_SIZE / 2,
        PLAYER_SIZE,
        PLAYER_SIZE
      )
    } else {
      ctx.fillStyle = '#4a90d9'
      ctx.fillRect(
        this.x - PLAYER_SIZE / 2,
        this.y - PLAYER_SIZE / 2,
        PLAYER_SIZE,
        PLAYER_SIZE
      )
    }
    ctx.restore()

    ctx.save()
    ctx.globalAlpha = Math.max(0, this.alpha * 0.5)
    ctx.strokeStyle = '#4a90d9'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(this.x, this.y, PLAYER_SIZE / 2 + 3, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
}

class ShieldBreakEffect {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.alpha = 1
    this.life = 20
    this.maxLife = 20
    this.particles = []
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i
      this.particles.push({
        x: Math.cos(angle) * (PLAYER_SIZE / 2 + 10),
        y: Math.sin(angle) * (PLAYER_SIZE / 2 + 10),
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3
      })
    }
  }

  update() {
    this.life--
    this.alpha = this.life / this.maxLife
    for (const p of this.particles) {
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.95
      p.vy *= 0.95
    }
  }

  isDead() {
    return this.life <= 0
  }

  render(ctx) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, this.alpha)
    
    ctx.fillStyle = '#3498db'
    for (const p of this.particles) {
      ctx.beginPath()
      ctx.arc(this.x + p.x, this.y + p.y, 4, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.strokeStyle = '#5dade2'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(this.x, this.y, PLAYER_SIZE / 2 + 10, 0, Math.PI * 2)
    ctx.stroke()
    
    ctx.restore()
  }
}

class BounceTrailEffect {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.alpha = 0.8
    this.life = 10
    this.maxLife = 10
  }

  update() {
    this.life--
    this.alpha = 0.8 * (this.life / this.maxLife)
  }

  isDead() {
    return this.life <= 0
  }

  render(ctx) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, this.alpha)
    
    ctx.strokeStyle = '#f39c12'
    ctx.lineWidth = 3
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(this.x1, this.y1)
    ctx.lineTo(this.x2, this.y2)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = '#f39c12'
    ctx.beginPath()
    ctx.arc(this.x1, this.y1, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(this.x2, this.y2, 4, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }
}

class BulletHitEffect {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.alpha = 1
    this.life = 8
    this.maxLife = 8
  }

  update() {
    this.life--
    this.alpha = this.life / this.maxLife
  }

  isDead() {
    return this.life <= 0
  }

  render(ctx) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, this.alpha)
    
    ctx.fillStyle = '#e74c3c'
    ctx.beginPath()
    ctx.arc(this.x, this.y, BULLET_SIZE, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }
}
