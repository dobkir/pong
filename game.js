const game = {
  width: 960,
  height: 640,
  context: null,
  gameRun: true,
  gamePause: false,
  gameOver: false,
  leftPlatform: null,
  rightPlatform: null,
  ball: null,


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

  // Preload the images
  preloadSprites() {
    this.leftPlatform = new Image()
    this.leftPlatform.src = 'img/leftPLatform.png'

    this.rightPlatform = new Image()
    this.rightPlatform.src = 'img/rightPLatform.png'

    this.ball = new Image()
    this.ball.src = 'img/ball.png'
  },

  // Render all preloaded images
  renderSprites() {
    this.context.drawImage(this.leftPlatform, 0, (game.height / 2) - (112 / 2), 40, 112)
    this.context.drawImage(this.rightPlatform, game.width - 40, (game.height / 2) - (112 / 2), 40, 112)
    this.context.drawImage(this.ball, (game.width / 2) - (40 / 2), (game.height / 2) - (40 / 2), 40, 40)
  },

  // Start of the animation
  runGame() {
    // When running is true, it means that the game is running
    if (this.gameRun) {
      window.requestAnimationFrame(() => {
        this.renderSprites()
        // Calls itself recursively for each frame of the animation
        this.runGame()
      });
    }
  },

  // Initialization of all components the game required
  initGame() {
    this.initCanvas()
  },

  random(min, max) {
    // Get a random integer in a given range
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  startGame() {
    this.initGame()
    this.preloadSprites()
    this.runGame()
  },
}

window.addEventListener('load', () => {
  game.startGame()
})
