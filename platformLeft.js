game.platformLeft = {
  width: 40,
  height: 112,
  x: 0,
  y: (game.height - 112) / 2,
  velocity: 6,
  vY: 0,  // Y-axis movement velocity
  ball: game.ball,

  startBall() {
    console.log(game.ball)
    console.log(this.ball)
    console.log('Start the ball')
    // if a ball on the platform
    if (this.ball) {
      // then activate start() function
      this.ball.start()
      // and there is no ball on the platform now
      this.ball = null
    }
  },

  start(direction) {

    if (direction === KEYS.UP) {
      this.vY = -this.velocity
    } else if (direction === KEYS.DOWN) {
      this.vY = this.velocity
    }
  },

  stop() {
    this.vY = 0
  },

  move() {
    if (this.vY) {
      this.y += this.vY
      // When a ball is on the platform, then they moving together.
      if (this.ball) {
        this.ball.y += this.vY
      }
    }
  },
}
