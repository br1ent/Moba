import { PLAYER_SIZE, PLAYER_SPEED } from './config.js'
import { Bullet } from './bullet.js'

export class Bot {
  constructor(color, shootInterval) {
    this.x = 0
    this.y = 0
    this.targetX = 0
    this.targetY = 0
    this.isMoving = false
    this.color = color || getRandomColor()
    this.shootInterval = shootInterval || 1500
    this.lastShootTime = Date.now() + Math.random() * this.shootInterval
    this.canvasWidth = 0
    this.playAreaHeight = 0
  }

  init(canvasWidth, playAreaHeight, excludeX, excludeY) {
    this.canvasWidth = canvasWidth
    this.playAreaHeight = playAreaHeight
    this.spawnAtSafePosition(excludeX, excludeY)
    this.pickNewTarget()
  }

  spawnAtSafePosition(excludeX, excludeY) {
    const half = PLAYER_SIZE / 2
    const minDist = PLAYER_SIZE * 3
    let attempts = 0
    const maxAttempts = 100

    do {
      this.x = Math.random() * (this.canvasWidth - PLAYER_SIZE) + half
      this.y = Math.random() * (this.playAreaHeight - PLAYER_SIZE) + half
      attempts++

      if (attempts >= maxAttempts) break

      const dx = this.x - excludeX
      const dy = this.y - excludeY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist >= minDist) break
    } while (true)
  }

  pickNewTarget() {
    const half = PLAYER_SIZE / 2
    this.targetX = Math.random() * (this.canvasWidth - PLAYER_SIZE) + half
    this.targetY = Math.random() * (this.playAreaHeight - PLAYER_SIZE) + half
    this.isMoving = true
  }

  tryShoot() {
    const now = Date.now()
    if (now - this.lastShootTime < this.shootInterval) return null
    this.lastShootTime = now

    const angle = Math.random() * Math.PI * 2
    const targetX = this.x + Math.cos(angle) * 100
    const targetY = this.y + Math.sin(angle) * 100

    return new Bullet(this.x, this.y, targetX, targetY, this.color)
  }

  update() {
    if (!this.isMoving) {
      this.pickNewTarget()
      return
    }

    const dx = this.targetX - this.x
    const dy = this.targetY - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < PLAYER_SPEED) {
      this.x = this.targetX
      this.y = this.targetY
      this.isMoving = false
    } else {
      this.x += (dx / dist) * PLAYER_SPEED
      this.y += (dy / dist) * PLAYER_SPEED
    }
  }

  render(ctx) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, PLAYER_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(this.x, this.y, PLAYER_SIZE / 2, 0, Math.PI * 2)
    ctx.stroke()
  }
}

const BOT_COLORS = [
  '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
  '#1abc9c', '#e67e22', '#3498db', '#e84393',
  '#00b894', '#fdcb6e', '#6c5ce7'
]

function getRandomColor() {
  return BOT_COLORS[Math.floor(Math.random() * BOT_COLORS.length)]
}
