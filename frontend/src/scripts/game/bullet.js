import { BULLET_SIZE, BULLET_SPEED } from './config.js'

export class Bullet {
  constructor(x, y, targetX, targetY) {
    this.x = x
    this.y = y

    const dx = targetX - x
    const dy = targetY - y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 1) {
      this.vx = 0
      this.vy = 0
    } else {
      this.vx = (dx / dist) * BULLET_SPEED
      this.vy = (dy / dist) * BULLET_SPEED
    }
  }

  update() {
    this.x += this.vx
    this.y += this.vy
  }

  isOutOfBounds(canvasWidth, canvasHeight) {
    return (
      this.x < -BULLET_SIZE ||
      this.x > canvasWidth + BULLET_SIZE ||
      this.y < -BULLET_SIZE ||
      this.y > canvasHeight + BULLET_SIZE
    )
  }

  render(ctx) {
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(this.x, this.y, BULLET_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()
  }
}
