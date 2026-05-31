import { SKILLS } from './config.js'

export class SkillSystem {
  constructor(difficulty) {
    this.difficulty = difficulty || 'easy'
    
    this.flash = {
      lastUse: -SKILLS.FLASH_COOLDOWN,
      cooldown: SKILLS.FLASH_COOLDOWN
    }
    
    this.shield = {
      lastUse: -SKILLS.SHIELD_COOLDOWN,
      cooldown: SKILLS.SHIELD_COOLDOWN
    }
    
    this.potion = {
      uses: SKILLS.POTION_USES[this.difficulty] || 1
    }
  }

  canUseFlash(now) {
    return (now - this.flash.lastUse) >= this.flash.cooldown
  }

  canUseShield(now) {
    return (now - this.shield.lastUse) >= this.shield.cooldown
  }

  canUsePotion() {
    return this.potion.uses > 0
  }

  useFlash(now) {
    if (!this.canUseFlash(now)) return false
    this.flash.lastUse = now
    return true
  }

  useShield(now) {
    if (!this.canUseShield(now)) return false
    this.shield.lastUse = now
    return true
  }

  usePotion() {
    if (!this.canUsePotion()) return false
    this.potion.uses--
    return true
  }

  getFlashCooldownPercent(now) {
    if (this.canUseFlash(now)) return 0
    const elapsed = now - this.flash.lastUse
    return 1 - (elapsed / this.flash.cooldown)
  }

  getShieldCooldownPercent(now) {
    if (this.canUseShield(now)) return 0
    const elapsed = now - this.shield.lastUse
    return 1 - (elapsed / this.shield.cooldown)
  }

  getFlashRemainingSeconds(now) {
    if (this.canUseFlash(now)) return 0
    const remaining = this.flash.cooldown - (now - this.flash.lastUse)
    return Math.ceil(remaining / 1000)
  }

  getShieldRemainingSeconds(now) {
    if (this.canUseShield(now)) return 0
    const remaining = this.shield.cooldown - (now - this.shield.lastUse)
    return Math.ceil(remaining / 1000)
  }
}
