import './style.css'

class MacFaceIcon {
  constructor() {
    this.leftEye = document.getElementById('leftEye')
    this.rightEye = document.getElementById('rightEye')
    this.mouth = document.getElementById('mouth')
    this.macFace = document.getElementById('macFace')
    
    this.idleTimer = null
    this.isIdle = false
    this.IDLE_DELAY = 1500

    this.neutralMouth = "M 80 130 Q 120 140 160 130"
    this.smileMouth = "M 80 135 Q 120 120 160 135"
    
    this.init()
  }

  init() {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this))
    this.startIdleTimer()
  }

  handleMouseMove(event) {
    if (!this.macFace || !this.leftEye || !this.rightEye) return

    this.clearIdleTimer()
    
    if (this.isIdle) {
      this.setNeutralExpression()
      this.isIdle = false
    }

    const faceRect = this.macFace.getBoundingClientRect()
    const faceCenterX = faceRect.left + faceRect.width / 2
    const faceCenterY = faceRect.top + faceRect.height / 2

    const mouseX = event.clientX
    const mouseY = event.clientY

    const deltaX = mouseX - faceCenterX
    const deltaY = mouseY - faceCenterY

    const maxMovement = 2
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const normalizedDistance = Math.min(distance / 200, 1)

    const eyeOffsetX = (deltaX / distance) * normalizedDistance * maxMovement
    const eyeOffsetY = (deltaY / distance) * normalizedDistance * maxMovement

    this.leftEye.setAttribute('cx', 90 + eyeOffsetX)
    this.leftEye.setAttribute('cy', 90 + eyeOffsetY)
    this.rightEye.setAttribute('cx', 150 + eyeOffsetX)
    this.rightEye.setAttribute('cy', 90 + eyeOffsetY)

    this.startIdleTimer()
  }

  startIdleTimer() {
    this.clearIdleTimer()
    this.idleTimer = setTimeout(() => {
      this.setIdleExpression()
    }, this.IDLE_DELAY)
  }

  clearIdleTimer() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer)
      this.idleTimer = null
    }
  }

  setIdleExpression() {
    this.isIdle = true
    
    this.leftEye.setAttribute('cx', 90)
    this.leftEye.setAttribute('cy', 90)
    this.rightEye.setAttribute('cx', 150)
    this.rightEye.setAttribute('cy', 90)
    
    this.mouth.setAttribute('d', this.smileMouth)
  }

  setNeutralExpression() {
    this.mouth.setAttribute('d', this.neutralMouth)
  }
}

class TabNavigation {
  constructor() {
    this.tabButtons = document.querySelectorAll('.tab-button')
    this.tabContents = document.querySelectorAll('.tab-content')
    this.init()
  }

  init() {
    this.tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const targetTab = e.target.getAttribute('data-tab')
        this.switchTab(targetTab)
      })
    })
  }

  switchTab(targetTab) {
    this.tabButtons.forEach(button => {
      button.classList.remove('active')
      if (button.getAttribute('data-tab') === targetTab) {
        button.classList.add('active')
      }
    })

    this.tabContents.forEach(content => {
      content.classList.remove('active')
      if (content.id === targetTab) {
        content.classList.add('active')
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MacFaceIcon()
  new TabNavigation()
})
