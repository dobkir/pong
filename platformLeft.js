game.platformLeft = {
  width: 40,
  height: 164,
  x: 0,
  y: (game.height - 164) / 2,
  velocity: 6,
  vY: 0,  // Y-axis movement velocity
  ball: game.ball,

  startBall() {
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

  // Offset on the y-axis to obtain the correct bounce angle of the ball
  getTouchOffset(collideCoordinate) {
    // Get the down half part from the place of a collide
    let diff = (this.y + this.height) - collideCoordinate
    // Get the top half part from the place of a collide
    let offset = this.height - diff
    let result = 2 * offset / this.height
    return result - 1
  },

  collideCanvasBounds() {
    // Change of coordinates on next render
    const y = this.y + this.vY

    // Platform sides
    const platformTopSide = y
    const platformBottomSide = platformTopSide + this.height

    // Canvas sides
    const canvasTopSide = 0
    const canvasBottomSide = game.height

    if (platformTopSide <= canvasTopSide || platformBottomSide >= canvasBottomSide) {
      this.vY = 0
    }
  }
}
