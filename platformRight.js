game.platformRight = {
  width: 40,
  height: 148,
  x: game.width - 40,
  y: (game.height - 148) / 2,
  velocity: 6,
  vY: 0,  // Y-axis movement velocity
  ball: game.ball,

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