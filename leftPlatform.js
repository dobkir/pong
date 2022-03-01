game.leftPlatform = {
  dx: 0,
  dy: 0,
  frame: 0,
  speed: 6,
  x: game.width / 2 - 20,
  y: game.height - 85,
  width: 40,
  height: 40,

  start(direction) {
    if (direction === KEYS.LEFT) {
      this.dx = -this.velocity
    } else if (direction === KEYS.RIGHT) {
      this.dx = this.velocity
    } else if (direction === KEYS.DOWN) {
      this.dx = this.velocity
    }
  },

  stop() {
    this.dx = 0
    this.dy = 0
  },

  move() {
    if (this.dx) {
      this.x += this.dx
    } else if (this.dy) {
      this.x += this.dy
    }
  },
  // Offset on the x-axis to obtain the correct bounce angle of the ball

  getTouchOffset(x) {
    let diff = (this.x + this.width) - x;
    let offset = this.width - diff;
    let result = 2 * offset / this.width;
    return result - 1;
  },

  collideCanvasBounds() {
    // Change of coordinates on next render
    const x = this.x + this.dx;

    // Platform sides
    const platformLeftSide = x;
    const platformRightSide = platformLeftSide + this.width;

    // Canvas sides
    const canvasLeftSide = 0;
    const canvasRightSide = game.width;

    if (platformLeftSide < canvasLeftSide || platformRightSide > canvasRightSide) {
      this.dx = 0;
    }
  }
}