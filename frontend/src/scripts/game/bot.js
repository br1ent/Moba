import { PLAYER_SIZE, PLAYER_SPEED } from './config.js'

export class Bot {
  constructor(color) {
    this.x = 0
    this.y = 0
    this.targetX = 0
    this.targetY = 0
    this.isMoving = false
    this.color = color || getRandomColor()
  }

  init(canvasWidth, canvasHeight, excludeX, excludeY) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.spawnAtSafePosition(excludeX, excludeY)
    this.pickNewTarget()
  }

  spawnAtSafePosition(excludeX, excludeY) {
    const minDist = PLAYER_SIZE * 3
    let attempts = 0
    const maxAttempts = 100

    do {
      this.x = Math.random() * (this.canvasWidth - PLAYER_SIZE * 2) + PLAYER_SIZE
      this.y = Math.random() * (this.canvasHeight - PLAYER_SIZE * 2) + PLAYER_SIZE
      attempts++

      if (attempts >= maxAttempts) break

      const dx = this.x - excludeX
      const dy = this.y - excludeY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist >= minDist) break
    } while (true)
  }

  pickNewTarget() {
    this.targetX = Math.random() * (this.canvasWidth - PLAYER_SIZE * 2) + PLAYER_SIZE
    this.targetY = Math.random() * (this.canvasHeight - PLAYER_SIZE * 2) + PLAYER_SIZE
    this.isMoving = true
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
