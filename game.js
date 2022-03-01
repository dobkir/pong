const CANVAS = document.querySelector(".canvas")
const HELP = document.querySelector(".help")

const KEYS = {
  ESCAPE: 27,
  SPACE: 32,
  UP: 38,
  DOWN: 40,
  H: 72,
  P: 80,
  R: 82,
}

const game = {
  width: innerWidth,
  height: innerHeight,
  context: null,
  gameRun: true,
  gamePause: false,
  level: null,
  platformLeft: null,
  platformRight: null,
  ball: null,
  scorePlayer: 0,
  scoreComputer: 0,
  winningScore: 11,
  sprites: {
    platformLeft: null,
    platformRight: null,
    ball: null,
  },
  sounds: {
    bump: null,
    fail: null,
    victory: null,
  },

  initCanvas() {
    let realWidth = window.innerWidth * window.devicePixelRatio
    let realHeight = window.innerHeight * window.devicePixelRatio
    let maxHeight = this.height
    let maxWidth = this.width
    /* 
     *  Always fully fit the width
     *  It means that the final width is maxWidth, then the proportion is fair:
     *  realWidth / realHeight
     *  maxWidth / resultHeight
     *  resultHeight = maxWidth * realHeight / realWidth
     *  Round down and cut off everything above maxWidth
     */
    this.height = Math.min(Math.floor(maxWidth * realHeight / realWidth), maxHeight)
    CANVAS.width = this.width
    CANVAS.height = this.height
    CANVAS.style = 'background-color: #141414;'
  },

  initContext() {
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

  hideMouseCursor() {
    /*
     *  The disappearance of the cursor if it is not used 
     *  for 3 seconds after the last click or moving
     */
    let mouseTimer = null, cursorVisible = true;

    function disappearCursor() {
      mouseTimer = null;
      document.body.style.cursor = "none";
      cursorVisible = false;
    }

    document.onmousemove = function () {
      if (mouseTimer) {
        window.clearTimeout(mouseTimer);
      }
      if (!cursorVisible) {
        document.body.style.cursor = "default";
        cursorVisible = true;
      }
      mouseTimer = window.setTimeout(disappearCursor, 3000);
    };
  },

  setLevel() {
    this.toggleHelpIcon()
    function chooseLevel(event) {
      if (event.target.name === 'modalChooseButton') {
        this.level = event.target.value;
        this.startGame()
        document.body.removeEventListener('click', chooseLevel)
      }
    }
    !this.level && document.body.addEventListener('click', chooseLevel.bind(game))
  },

  setLevelSettings() {
    this.setLevel()
    this.modalWindow.content = this.modalChoosingLevel
    !this.level && this.modalWindow.openModal()

    if (this.level === 'beginner') {
      this.ball.velocity = 6
      this.setLocalStorage('level', 'beginner')
      this.modalWindow.closeModal()
    } else if (this.level === 'gamer') {
      this.ball.velocity = 8
      this.setLocalStorage('level', 'gamer')
      this.modalWindow.closeModal()
    } else if (this.level === 'professional') {
      this.ball.velocity = 10
      this.platformLeft.velocity = 8
      this.setLocalStorage('level', 'professional')
      this.modalWindow.closeModal()
    }

  },

  toggleHelpIcon() {
    if (HELP.classList.contains('hidden')) {
      HELP.classList.remove('hidden')
    } else {
      HELP.classList.add('hidden')
    }
  },

  setKeyboardKeyEvents() {
    // Moving the left platform
    window.addEventListener('keydown', event => {
      if (event.keyCode === KEYS.SPACE) {
        this.platformLeft.startBall()
      } else if (event.keyCode === KEYS.UP || event.keyCode === KEYS.DOWN) {
        this.platformLeft.start(event.keyCode)
      }
    })
    // Stop the left platform
    window.addEventListener('keyup', event => {
      this.platformLeft.stop()
    })
    // Paused and unpaused the game
    window.addEventListener('keydown', e => {
      if (!this.gamePause && e.keyCode === KEYS.P) {
        document.body.addEventListener('click', this.confirmRestartGame.bind(game))
        this.pausedGame()
      } else if (this.gamePause && (e.keyCode === KEYS.P || e.keyCode === KEYS.ESCAPE)) {
        document.body.removeEventListener('click', this.confirmRestartGame.bind(game))
        this.unpausedGame()
      }
    })
    // Hard restart the current game
    window.addEventListener('keydown', e => {
      if (e.keyCode === KEYS.R) {
        this.restartGame()
      }
    })
  },

  // Preload images and sounds
  preloadResouses(callback) {
    let loadedSprites = 0
    let loadedSounds = 0
    let requiredResourses = Object.keys(this.sprites).length
    requiredResourses += Object.keys(this.sounds).length

    // Checking up that all sprites and sounds are loaded, and only then run a game
    let onResourceLoad = () => {
      // On the fact of each upload, I'll make an increment that 
      // means one more image and sound have been currently uploaded
      ++loadedSprites
      ++loadedSounds
      if (loadedSprites && loadedSounds >= requiredResourses) {
        callback()
      }
    }

    this.preloadSprites(onResourceLoad)
    this.preloadAudio(onResourceLoad)
  },

  preloadSprites(onResourceLoad) {
    for (let key in this.sprites) {
      this.sprites[key] = new Image()
      this.sprites[key].src = `img/${key}.png`
      // Continue only when all sprites are loaded
      this.sprites[key].addEventListener('load', onResourceLoad)
    }
  },

  preloadAudio(onResourceLoad) {
    for (let key in this.sounds) {
      this.sounds[key] = new Audio("sounds/" + key + ".mp3")
      this.sounds[key].addEventListener("canplaythrough", onResourceLoad, { once: true })
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
        this[sprite].height,
      )
    })
    // Render scores
    this.context.fillText('Your score: ' + this.scorePlayer, 70, 28)
    this.context.fillText('Computer score: ' + this.scoreComputer, this.width - 260, 28)
    // Dividing line
    for (var i = 10; i < game.height; i += 45) {
      this.context.fillRect(game.width / 2 - 1.5, i, 3, 30)
    }
  },

  addScorePlayer() {
    ++this.scorePlayer
    if (this.scorePlayer >= this.winningScore) {
      this.endGame(this.modalWinning)
    } else {
      this.setLocalStorage('scorePlayer', this.scorePlayer)
      game.reloadGame()
    }
  },

  addScoreComputer() {
    ++this.scoreComputer
    if (this.scoreComputer >= this.winningScore) {
      this.endGame(this.modalLosing)
    } else {
      this.setLocalStorage('scoreComputer', this.scoreComputer)
      game.reloadGame()
    }
  },

  clearLocalStorage() {
    this.setLocalStorage('scorePlayer', 0)
    this.setLocalStorage('scoreComputer', 0)
    this.setLocalStorage('level', 0)
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
    this.getLocalStorage()
    this.hideMouseCursor()

    this.initCanvas()
    this.initContext()
    this.setKeyboardKeyEvents()

    this.setTextFont()
    this.level && this.setKeyboardKeyEvents()

    HELP.addEventListener('click', this.clickToOpenHelp.bind(game))
    this.keysHelpModal()
  },

  startGame() {
    this.initGame()
    this.preloadResouses(() => {
      this.runGame()
    })
  },

  confirmEndGame(event) {
    if (event.target.value === 'mainMenu') {
      this.reloadGame()
    }
    document.body.removeEventListener('click', this.confirmEndGame)
  },

  endGame(messageType) {
    if (!this.modalWindow.content && this.gameRun) {
      this.modalWindow.content = messageType
      this.modalWindow.openModal()
      this.clearLocalStorage()
      this.gameRun = false

      document.body.addEventListener('click', this.confirmEndGame.bind(game))
    }
  },

  pausedGame() {
    this.gameRun = false
    this.gamePause = true
    this.modalWindow.content = this.modalGamePaused
    this.modalWindow.openModal()
  },

  unpausedGame() {
    this.modalWindow.closeModal()
    this.gamePause = false
    this.gameRun = true
    this.runGame()
  },

  confirmRestartGame(event) {
    if (event.target.value === 'restartGame') {
      this.modalWindow.closeModal()
      this.restartGame()
    }
    document.body.removeEventListener('click', this.confirmRestartGame)
  },

  restartGame() {
    this.clearLocalStorage()
    this.reloadGame()
  },

  clearParameters() {
    this.platformLeft = game.platformLeft
    this.platformRight = game.platformRight
    this.ball = game.ball
    this.scorePlayer = 0
    this.scoreComputer = 0
  },

  closeModalWindow(event) {
    if (this.level && this.modalWindow.content && event.target.value === 'closeModal') {
      this.modalWindow.closeModal()
    } else if (!this.level && this.modalWindow.content === this.modalHelpTutorial) {
      this.modalWindow.closeModal()
      this.modalWindow.content = this.modalChoosingLevel
      this.modalWindow.openModal()
    }
    document.body.removeEventListener('click', this.closeModalWindow)
  },

  openHelpTutorial() {
    this.modalWindow.content = this.modalHelpTutorial
    this.modalWindow.openModal()
    document.body.addEventListener('click', this.closeModalWindow.bind(game))
    HELP.addEventListener('click', this.clickToCloseHelp.bind(game))
  },

  closeHelpTutorial() {
    this.modalWindow.closeModal()
    this.modalWindow.content = this.modalChoosingLevel
    this.modalWindow.openModal()
  },

  keysHelpModal() {
    // Open and close Help Tutorial
    window.addEventListener('keydown', e => {
      if (!this.modalWindow.content && e.keyCode === KEYS.H) {
        this.openHelpTutorial()
      } else if (this.modalWindow.content === this.modalChoosingLevel && e.keyCode === KEYS.H) {
        this.modalWindow.closeModal()
        this.modalWindow.content = this.modalHelpTutorial
        this.modalWindow.openModal()
      } else if (this.modalWindow.content === this.modalHelpTutorial && (e.keyCode === KEYS.H || e.keyCode === KEYS.ESCAPE)) {
        this.closeHelpTutorial()
      }
    })
  },

  clickToOpenHelp(event) {
    event.preventDefault()
    event.stopPropagation()
    document.body.addEventListener('click', this.closeModalWindow.bind(game))
    if (!this.modalWindow.content && event.target.classList.contains('help')) {
      this.openHelpTutorial()
    } else if (this.modalWindow.content && this.modalWindow.content !== this.modalHelpTutorial && event.target.classList.contains('help')) {
      this.modalWindow.closeModal()
      this.modalWindow.content = this.modalHelpTutorial
      this.modalWindow.openModal()

    }
    HELP.addEventListener('click', this.clickToCloseHelp.bind(game))
    HELP.removeEventListener('click', this.clickToOpenHelp)
  },

  clickToCloseHelp(event) {
    if (this.level && this.modalWindow.content === this.modalHelpTutorial && event.target.classList.contains('help')) {
      this.closeHelpTutorial()
    } else if (!this.level && this.modalWindow.content === this.modalHelpTutorial && event.target.classList.contains('help')) {
      this.closeModalWindow()
    }
    HELP.addEventListener('click', this.clickToOpenHelp.bind(game))
    HELP.removeEventListener('click', this.clickToCloseHelp)
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
    this.level =
      localStorage.getItem('level') === null ||
        localStorage.getItem('level') == 0 ?
        this.setLevelSettings() :
        this.preloadResouses(() => {
          this.runGame()
        })
  },
}

window.addEventListener('load', () => {
  game.initGame()
  console.log('click key "P" to pause')
  console.log('click key "R" to hard restart the game')
})
