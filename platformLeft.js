game.platformLeft = {
  width: 40,
  height: 112,
  x: 0,
  y: (game.height - 112) / 2,
  speed: 6,
  dy: 0,


  start(direction) {
    if (direction === KEYS.UP) {
      this.dy = -this.speed
    } else if (direction === KEYS.DOWN) {
      this.dy = this.speed
    }
  },

  stop() {
    this.dy = 0
  },

  move() {
    if (this.dy) {
      this.y += this.dy
    }
  },
}