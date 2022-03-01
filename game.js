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

  // Preload the images
  preloadSprites(callback) {
    let loadedSprites = 0
    let requiredSprites = Object.keys(this.sprites).length;

    for (let key in this.sprites) {
      this.sprites[key] = new Image()
      this.sprites[key].src = `img/${key}.png`

      // Continue only when all sprites are loaded
      this.sprites[key].addEventListener("load", () => {
        // On the fact of each upload, I'll make an increment that 
        // means one more image has been currently uploaded
        ++loadedSprites
        if (loadedSprites >= requiredSprites) {
          callback()
        }
      })
    }
  },

  // Render all preloaded images
  renderSprites() {
    Object.keys(this.sprites).forEach(sprite => {
      this.context.drawImage(
        this.sprites[sprite],
        this[sprite].x,
        this[sprite].y,
        this[sprite].width,
        this[sprite].height
      )
    });
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
    this.preloadSprites(() => {
      this.runGame()
    })
  },
}

window.addEventListener('load', () => {
  game.startGame()
})
