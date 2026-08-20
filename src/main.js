import './style.css'

class DeskCompanion {
  constructor() {
    this.computer = document.getElementById('computer')
    this.leftEye = document.getElementById('leftEye')
    this.rightEye = document.getElementById('rightEye')
    this.mouth = document.getElementById('mouth')
    this.status = document.getElementById('computerStatus')

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    this.idleTimer = null
    this.blinkTimer = null
    this.frame = null
    this.target = { eyeX: 0, eyeY: 0, tiltX: 0, tiltY: 0, glowX: 0, glowY: 0 }

    this.neutralMouth = 'M132 194 Q180 207 228 194'
    this.smileMouth = 'M132 199 Q180 180 228 199'

    this.handlePointerMove = this.handlePointerMove.bind(this)
    this.handleInteraction = this.handleInteraction.bind(this)
    this.handleMotionPreference = this.handleMotionPreference.bind(this)

    this.init()
  }

  init() {
    if (!this.computer) return

    this.computer.addEventListener('click', this.handleInteraction)
    this.prefersReducedMotion.addEventListener('change', this.handleMotionPreference)
    this.updateInputMode()
  }

  handleMotionPreference() {
    this.updateInputMode()
  }

  updateInputMode() {
    window.removeEventListener('pointermove', this.handlePointerMove)
    window.clearTimeout(this.idleTimer)
    window.clearTimeout(this.blinkTimer)

    if (this.prefersReducedMotion.matches) {
      this.resetExpression()
      this.setStatus('Resting')
      return
    }

    if (this.hasFinePointer.matches) {
      window.addEventListener('pointermove', this.handlePointerMove, { passive: true })
    }

    this.scheduleBlink()
  }

  handlePointerMove(event) {
    if (!this.computer || event.pointerType === 'touch') return

    const bounds = this.computer.getBoundingClientRect()
    const centerX = bounds.left + bounds.width / 2
    const centerY = bounds.top + bounds.height / 2
    const deltaX = event.clientX - centerX
    const deltaY = event.clientY - centerY
    const distance = Math.max(Math.hypot(deltaX, deltaY), 1)
    const reach = Math.min(distance / Math.max(bounds.width * 0.7, 1), 1)
    const directionX = deltaX / distance
    const directionY = deltaY / distance

    this.target = {
      eyeX: directionX * reach * 3,
      eyeY: directionY * reach * 3,
      tiltX: directionX * reach * 1.2,
      tiltY: directionY * reach * -1,
      glowX: directionX * reach * 7,
      glowY: directionY * reach * 6,
    }

    this.mouth?.setAttribute('d', this.neutralMouth)
    this.setStatus('Tracking')
    this.computer.dataset.state = 'tracking'
    this.queueFrame()

    window.clearTimeout(this.idleTimer)
    this.idleTimer = window.setTimeout(() => this.setIdle(), 1100)
  }

  queueFrame() {
    if (this.frame) return

    this.frame = window.requestAnimationFrame(() => {
      const { eyeX, eyeY, tiltX, tiltY, glowX, glowY } = this.target

      this.computer.style.setProperty('--eye-x', `${eyeX}px`)
      this.computer.style.setProperty('--eye-y', `${eyeY}px`)
      this.computer.style.setProperty('--tilt-x', `${tiltX}deg`)
      this.computer.style.setProperty('--tilt-y', `${tiltY}deg`)
      this.computer.style.setProperty('--glow-x', `${glowX}px`)
      this.computer.style.setProperty('--glow-y', `${glowY}px`)
      this.frame = null
    })
  }

  setIdle() {
    this.target = { eyeX: 0, eyeY: 0, tiltX: 0, tiltY: 0, glowX: 0, glowY: 0 }
    this.mouth?.setAttribute('d', this.smileMouth)
    this.setStatus('Resting')
    this.computer.dataset.state = 'resting'
    this.queueFrame()
  }

  handleInteraction() {
    if (!this.rightEye || !this.mouth) return

    this.setStatus('Hello')
    this.computer.dataset.state = 'hello'
    this.rightEye.setAttribute('ry', '1')
    this.mouth.setAttribute('d', this.smileMouth)

    window.setTimeout(() => {
      this.rightEye?.setAttribute('ry', '7')
      this.setIdle()
    }, 650)
  }

  scheduleBlink() {
    if (this.prefersReducedMotion.matches || !this.leftEye || !this.rightEye) return

    const delay = 3800 + Math.random() * 2800
    this.blinkTimer = window.setTimeout(() => {
      this.leftEye.setAttribute('ry', '1')
      this.rightEye.setAttribute('ry', '1')

      window.setTimeout(() => {
        this.leftEye?.setAttribute('ry', '7')
        this.rightEye?.setAttribute('ry', '7')
        this.scheduleBlink()
      }, 110)
    }, delay)
  }

  resetExpression() {
    this.target = { eyeX: 0, eyeY: 0, tiltX: 0, tiltY: 0, glowX: 0, glowY: 0 }
    this.leftEye?.setAttribute('ry', '7')
    this.rightEye?.setAttribute('ry', '7')
    this.mouth?.setAttribute('d', this.smileMouth)
    this.computer.dataset.state = 'resting'
    this.queueFrame()
  }

  setStatus(value) {
    if (this.status) this.status.textContent = value
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DeskCompanion()
})
