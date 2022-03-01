game.ball = {
  width: 40,
  height: 40,
  x: 40,
  y: (game.height - 40) / 2,
  velocity: 4,
  vX: 0,  // X-axis movement velocity
  vY: 0,  // Y-axis movement velocity

  start() {
    this.vX = this.velocity
    // The random movement of a ball along the Y-axis
    this.vY = this.random(-this.velocity, this.velocity)
  },

  move() {
    if (this.vX) {
      this.x += this.vX
    }
    // The random movement of a ball along the x-axis
    if (this.vY) {
      this.y += this.vY
    }
  },

  // The handler of a colliding ball with canvas bounds
  collideCanvasBounds() {
    // Change of coordinates on next render
    const x = this.x + this.vX
    const y = this.y + this.vY

    // Ball sides
    const ballLeftSide = x
    const ballRightSide = ballLeftSide + this.width
    const ballTopSide = y
    const ballBottomSide = ballTopSide + this.height

    // Canvas sides
    const canvasLeftSide = 0
    const canvasRightSide = game.width
    const canvasTopSide = 0;
    const canvasBottomSide = game.height

    if (ballLeftSide < canvasLeftSide) {
      game.addScoreComputer()
    } else if (ballRightSide > canvasRightSide) {
      game.addScorePlayer()
    } else if (ballTopSide < canvasTopSide) {
      this.y = 0
      this.vY = this.velocity
    } else if (ballBottomSide > canvasBottomSide) {
      this.y = canvasBottomSide - this.height
      this.vY = -this.velocity
    }
  },

  random(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    // Get a random integer in a given range
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
}
