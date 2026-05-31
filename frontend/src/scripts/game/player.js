import { PLAYER_SIZE, PLAYER_SPEED } from './config.js'

export class Player {
  constructor(avatarUrl) {
    this.x = 0
    this.y = 0
    this.targetX = 0
    this.targetY = 0
    this.isMoving = false
    this.avatarUrl = avatarUrl
    this.avatarImg = null
    this.avatarLoaded = false
  }

  async loadAvatar() {
    try {
      this.avatarImg = await loadImage(this.avatarUrl)
      this.avatarLoaded = true
    } catch {
      this.avatarLoaded = false
    }
  }

  init(canvasWidth, canvasHeight) {
    this.x = Math.random() * (canvasWidth - PLAYER_SIZE * 2) + PLAYER_SIZE
    this.y = Math.random() * (canvasHeight - PLAYER_SIZE * 2) + PLAYER_SIZE
    this.targetX = this.x
    this.targetY = this.y
    this.isMoving = false
  }

  moveTo(x, y) {
    this.targetX = x
    this.targetY = y
    this.isMoving = true
  }

  stop() {
    this.isMoving = false
  }

  update() {
    if (!this.isMoving) return

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
    ctx.save()
    ctx.beginPath()
    ctx.arc(this.x, this.y, PLAYER_SIZE / 2, 0, Math.PI * 2)
    ctx.clip()

    if (this.avatarLoaded) {
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

    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(this.x, this.y, PLAYER_SIZE / 2, 0, Math.PI * 2)
    ctx.stroke()
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
