import { SHOOT_COOLDOWN, DIFFICULTY_BOT_COUNT, DIFFICULTY_BOT_SHOOT_INTERVAL } from './config.js'
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
  }

  async init() {
    this.resize()
    await this.player.loadAvatar()
    this.player.init(this.canvas.width, this.canvas.height)
    this.createBots()
    this.gameLoop()
  }

  createBots() {
    const count = DIFFICULTY_BOT_COUNT[this.difficulty] || DIFFICULTY_BOT_COUNT.easy
    const shootInterval = DIFFICULTY_BOT_SHOOT_INTERVAL[this.difficulty] || DIFFICULTY_BOT_SHOOT_INTERVAL.easy
    this.bots = []

    for (let i = 0; i < count; i++) {
      const bot = new Bot(null, shootInterval)
      bot.init(this.canvas.width, this.canvas.height, this.player.x, this.player.y)
      this.bots.push(bot)
    }
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
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
  }

  handleRightClick(x, y) {
    this.player.moveTo(x, y)
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
