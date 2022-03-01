const KEYS = {
  SPACE: 32,
  UP: 38,
  DOWN: 40,
}

const game = {
  width: 960,
  height: 640,
  context: null,
  gameRun: true,
  gamePause: false,
  gameOver: false,
  platformLeft: null,
  platformRight: null,
  ball: null,
  sprites: {
    platformLeft: null,
    platformRight: null,
    ball: null,
  },


  initCanvas() {
    const CANVAS = document.createElement('canvas')
    CANVAS.classList.add('game-canvas')
    CANVAS.width = this.width
    CANVAS.height = this.height
    CANVAS.style = 'background-color: #141414;'
    document.body.appendChild(CANVAS)

    if (CANVAS.getContext) {
      this.context = CANVAS.getContext('2d')
    } else {
      alert('To display the content, please update your browser.')
    }
  },

  setKeyboardKeyEvents() {
    // Moving the left platform
    window.addEventListener("keydown", event => {
      if (event.keyCode === KEYS.SPACE) {
        this.platformLeft.startBall()
      } else if (event.keyCode === KEYS.UP || event.keyCode === KEYS.DOWN) {
        this.platformLeft.start(event.keyCode)
      }
    })
    // Stop the left platform
    window.addEventListener("keyup", event => {
      this.platformLeft.stop()
    })
  },

  // Preload the images
  preloadSprites(callback) {
    let loadedSprites = 0
    let requiredSprites = Object.keys(this.sprites).length;
    let onImageLoad = () => {
      // On the fact of each upload, I'll make an increment that 
      // means one more image has been currently uploaded
      ++loadedSprites
      if (loadedSprites >= requiredSprites) {
        callback()
      }
    }

    for (let key in this.sprites) {
      this.sprites[key] = new Image()
      this.sprites[key].src = `img/${key}.png`
      // Continue only when all sprites are loaded
      this.sprites[key].addEventListener("load", onImageLoad)
    }
  },

  // Render all preloaded images
  renderSprites() {
    // Clear sprites rectangles before each new rendering
    this.context.clearRect(0, 0, this.width, this.height)
    // Render sprites 
    Object.keys(this.sprites).forEach(sprite => {
      this.context.drawImage(
        this.sprites[sprite],
        this[sprite].x,
        this[sprite].y,
        this[sprite].width,
        this[sprite].height
      )
    })
  },

  collideBallAndPlatform(obj1, obj2) {
    if (obj1.x + obj1.width > obj2.x &&
      obj1.x < obj2.x + obj2.width &&
      obj1.y + obj1.height > obj2.y &&
      obj1.y < obj2.y + obj2.height) {
      return true;
    }
    else {
      return false;
    }
  },

  updateState() {
    if ((this.collideBallAndPlatform(this.platformLeft, this.ball) && this.ball.vX < 0) ||
      (this.collideBallAndPlatform(this.platformRight, this.ball) && this.ball.vX > 0)) {
      this.ball.vX = -this.ball.vX
    }
    // Coordinate increment
    this.ball.x += this.ball.vX
    this.ball.y += this.ball.vY
    this.platformLeft.collideCanvasBounds()
    this.platformRight.collideCanvasBounds()
    this.ball.collideCanvasBounds()
    this.platformRight.moveArtificialIntelligence()
    this.platformLeft.move()
    this.ball.move()
  },

  // Start of the animation
  runGame() {
    // When running is true, it means that the game is running
    if (this.gameRun) {
      window.requestAnimationFrame(() => {
        this.updateState()
        this.renderSprites()
        // Calls itself recursively for each frame of the animation
        this.runGame()
      })
    }
  },

  // Initialization of all components the game required
  initGame() {
    this.initCanvas()
    this.setKeyboardKeyEvents()
  },

  startGame() {
    this.initGame()
    this.preloadSprites(() => {
      this.runGame()
    })
  },
}

window.addEventListener('load', () => {
  game.startGame()
})
