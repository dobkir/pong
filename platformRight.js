game.platformRight = {
  width: 40,
  height: 148,
  x: game.width - 40,
  y: (game.height - 148) / 2,
  velocity: 6,
  vY: 0,  // Y-axis movement velocity
  ball: game.ball,

  moveArtificialIntelligence() {
    // this.vY = this.velocity
    this.vY = Math.abs(this.ball.vY)

    if (this.ball.y < this.y + this.height / 2) {
      this.y = this.y - this.ball.vY
    }
    else {
      this.y = this.y + this.ball.vY
    }
    if (50 < this.y && this.y < game.height - this.height - 50) {
      this.y = this.y
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

    if (platformTopSide < canvasTopSide || platformBottomSide > canvasBottomSide) {
      this.vY = 0
    }
  }
}