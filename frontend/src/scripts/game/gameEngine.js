import { SHOOT_COOLDOWN, DIFFICULTY_BOT_COUNT, DIFFICULTY_BOT_SHOOT_INTERVAL, HUD_HEIGHT, MAX_HEALTH } from './config.js'
import { Player } from './player.js'
import { Bullet } from './bullet.js'
import { Bot } from './bot.js'

export class GameEngine {
  constructor(canvas, avatarUrl, difficulty) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.player = new Player(avatarUrl)
    this.bullets = []
    this.bots = []
    this.mousePos = { x: 0, y: 0 }
    this.lastShootTime = 0
    this.animationId = null
    this.onExit = null
    this.difficulty = difficulty || 'easy'
    this.health = MAX_HEALTH
    this.playAreaHeight = 0
    this.onHealthChange = null
  }

  async init() {
    this.resize()
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
  }

  gameLoop() {
    this.update()
    this.render()
    this.animationId = requestAnimationFrame(() => this.gameLoop())
  }

  update() {
    this.player.update()

    for (const bot of this.bots) {
      bot.update()
      const bullet = bot.tryShoot()
      if (bullet) {
        this.bullets.push(bullet)
      }
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].update()
      if (this.bullets[i].isOutOfBounds(this.canvas.width, this.canvas.height)) {
        this.bullets.splice(i, 1)
      }
    }
  }

  render() {
    const ctx = this.ctx

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    for (const bot of this.bots) {
      bot.render(ctx)
    }

    for (const bullet of this.bullets) {
      bullet.render(ctx)
    }

    this.player.render(ctx)

    this.renderHUD(ctx)
  }

  renderHUD(ctx) {
    const y = this.playAreaHeight

    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, y, this.canvas.width, HUD_HEIGHT)

    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(this.canvas.width, y)
    ctx.stroke()

    const barWidth = 200
    const barHeight = 20
    const barX = (this.canvas.width - barWidth) / 2
    const barY = y + (HUD_HEIGHT - barHeight) / 2

    ctx.fillStyle = '#333'
    ctx.fillRect(barX, barY, barWidth, barHeight)

    const healthPercent = this.health / MAX_HEALTH
    const healthColor = healthPercent > 0.5 ? '#2ecc71' : healthPercent > 0.25 ? '#f39c12' : '#e74c3c'
    ctx.fillStyle = healthColor
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight)

    ctx.strokeStyle = '#666'
    ctx.lineWidth = 1
    ctx.strokeRect(barX, barY, barWidth, barHeight)

    ctx.fillStyle = '#fff'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${this.health}/${MAX_HEALTH}`, barX + barWidth / 2, barY + barHeight / 2)
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
  }

  handleShoot() {
    const now = Date.now()
    if (now - this.lastShootTime < SHOOT_COOLDOWN) return
    this.lastShootTime = now

    const bullet = new Bullet(
      this.player.x,
      this.player.y,
      this.mousePos.x,
      this.mousePos.y
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
