game.platformRight = {
  width: 40,
  height: 164,
  x: game.width - 40,
  y: (game.height - 164) / 2,
  velocity: 6,
  vY: 0,  // Y-axis movement velocity
  ball: game.ball,

  moveArtificialIntelligence() {
    // this.vY = this.velocity
    this.vY = Math.abs(this.ball.vY)

    const diff = this.y - this.ball.y
    if (diff < 0 && diff < -this.height * 0.5) { // move down
      this.y = this.y + this.ball.vY
    } else if (diff > 0 && diff > this.height * 0.5) { // move up
      this.y = this.y - this.ball.vY
    } else {
      this.y = this.y  // stay put
    }
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