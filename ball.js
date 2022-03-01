game.ball = {
  width: 40,
  height: 40,
  x: 40,
  y: (game.height - 40) / 2,
  velocity: 6,
  vX: 0,  // X-axis movement velocity
  vY: 0,  // Y-axis movement velocity

  start() {
    this.vX = this.velocity
    // The random movement of a ball along the Y-axis
    this.vY = game.random(-this.velocity, this.velocity)
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
}