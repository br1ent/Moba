import { SHOOT_COOLDOWN } from './config.js'
import { Player } from './player.js'
import { Bullet } from './bullet.js'

export class GameEngine {
  constructor(canvas, avatarUrl) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.player = new Player(avatarUrl)
    this.bullets = []
    this.mousePos = { x: 0, y: 0 }
    this.lastShootTime = 0
    this.animationId = null
    this.onExit = null
  }

  async init() {
    this.resize()
    await this.player.loadAvatar()
    this.player.init(this.canvas.width, this.canvas.height)
    this.gameLoop()
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
