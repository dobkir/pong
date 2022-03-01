const KEYS = {
  SPACE: 32,
  UP: 38,
  DOWN: 40,
}

const game = {
  // width: 960,
  // height: 640,
  width: innerWidth,
  height: innerHeight,
  context: null,
  gameRun: true,
  gamePause: false,
  gameOver: false,
  platformLeft: null,
  platformRight: null,
  ball: null,
  scorePlayer: 0,
  scoreComputer: 0,
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

  setTextFont() {
    this.context.fillStyle = "#fafafa"
    this.context.font = "22px Arial"
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
    // Scale canvas
    this.context.scale(innerWidth / this.width, innerHeight / this.height)
    // Render sprites 
    Object.keys(this.sprites).forEach(sprite => {
      this.context.drawImage(
        this.sprites[sprite],
        this[sprite].x,
        this[sprite].y,
        this[sprite].width,
        this[sprite].height,
      )
    })
    // Render scores
    this.context.fillText("Your score: " + this.scorePlayer, 70, 28)
    this.context.fillText("Computer score: " + this.scoreComputer, this.width - 260, 28)
    // Dividing line
    for (var i = 10; i < game.height; i += 45) {
      this.context.fillRect(game.width / 2 - 1.5, i, 3, 30)
    }
  },

  addScorePlayer() {
    ++this.scorePlayer
    if (this.scorePlayer == 5) {
      this.endGame('You won this game!')
    } else {
      this.setLocalStorage('scorePlayer', this.scorePlayer)
    }
    game.reloadGame()
  },

  addScoreComputer() {
    ++this.scoreComputer
    if (this.scoreComputer === 5) {
      this.endGame('You lose this game!')
    } else {
      this.setLocalStorage('scoreComputer', this.scoreComputer)
    }
    game.reloadGame()
  },

  clearAllScores() {
    this.setLocalStorage('scorePlayer', 0)
    this.setLocalStorage('scoreComputer', 0)
  },

  updateState() {
    this.collideRightPlatform()
    this.collideLeftPlatform()
    this.platformLeft.collideCanvasBounds()
    this.platformRight.collideCanvasBounds()
    this.ball.collideCanvasBounds()
    this.platformRight.moveArtificialIntelligence()
    this.platformLeft.move()
    this.ball.move()
  },

  collideLeftPlatform() {
    if (this.ball.isSpritesCollide(this.platformLeft)) {
      this.ball.bumpLeftPlatform()
    }
  },

  collideRightPlatform() {
    if (this.ball.isSpritesCollide(this.platformRight)) {
      this.ball.bumpRightPlatform()
    }
  },

  reloadGame() {
    this.gameRun = false
    window.location.reload()
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
    this.getLocalStorage()
    this.setTextFont()
  },

  startGame() {
    this.initGame()
    this.preloadSprites(() => {
      this.runGame()
    })
  },

  endGame(messageType) {
    this.clearAllScores()
    if (this.gameRun) {
      this.gameRun = false
      this.gameOver = true
      alert(messageType)
    }
  },

  // Set scores to Local Storage
  setLocalStorage(scoreType, score) {
    localStorage.setItem(scoreType, score)
  },

  // Get scores from Local Storage
  getLocalStorage() {
    this.scorePlayer =
      localStorage.getItem('scorePlayer') !== null ?
        localStorage.getItem('scorePlayer') :
        0
    this.scoreComputer =
      localStorage.getItem('scoreComputer') !== null ?
        localStorage.getItem('scoreComputer') :
        0
  },
}

window.addEventListener('load', () => {
  game.startGame()
})
