game.ball = {
  width: 40,
  height: 40,
  x: 40,
  y: (game.height - 40) / 2,
  velocity: 8,
  vX: 0,  // X-axis movement velocity
  vY: 0,  // Y-axis movement velocity

  start() {
    this.vX = this.velocity
    // The random movement of a ball along the Y-axis
    this.vY = this.random(1, 10)
  },

  move() {
    if (this.vX) {
      this.x += this.vX
    }
    // The random movement of a ball along the Y-axis
    if (this.vY) {
      this.y += this.vY
    }
  },

  isSpritesCollide(element) {
    // Change of coordinates on next render
    const x = this.x + this.vX
    const y = this.y + this.vY

    // Checking the collision event of the ball and the block
    if (x + this.width > element.x &&
      x < element.x + element.width &&
      y + this.height > element.y &&
      y < element.y + element.height) {
      console.log(game.ball.velocity)
      return true
    }
    return false
  },

  // Bumping the ball off the right platform
  // Here I reverse a movement by the x-axis direction of the ball. 
  // In this case, the angle of movement is also mirrored to the opposite angle.
  bumpRightPlatform() {
    game.sounds.bump.play()
    this.vX *= -1
  },

  // Bumping the ball off the platform
  bumpLeftPlatform() {
    game.sounds.bump.play()
    // Если делать отскок под зеркальным углом, как у bumpRightPlatform(),
    // то не получится управлять углом отскока. Поэтому делаю особый метод
    // для платформы игрока, где угол отскока зависит от точки касания мячом
    // платформы
    if (game.platformLeft.vY) {
      this.y += game.platformLeft.vY
    }
    // If the ball moving right, bumpPlatform() shouldn't act
    if (this.vX < 0) {
      // Here I reverse a movement by the X-axis direction of the ball. 
      // In this case, the angle of movement is also mirrored to the opposite angle.
      this.vX = this.velocity
      // The further from the center is the collision of the ball, 
      // and the platform occurs, then the sharper the angle of rebound.

      // The coordinates of the point where the ball touches a platform
      let collideCoordinate = this.y + this.width / 2
      // Offset on the y-axis to obtain the correct bounce angle of the ball from the platform
      this.vY = this.velocity * game.platformLeft.getTouchOffset(collideCoordinate)
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
      game.gameRun = false
      game.sounds.fail.play()
      setTimeout(() => game.addScoreComputer(), 1000)
    } else if (ballRightSide >= canvasRightSide) {
      game.gameRun = false
      game.sounds.victory.play()
      setTimeout(() => game.addScorePlayer(), 1400)
    } else if (ballTopSide <= canvasTopSide) {
      game.sounds.bump.play()
      this.y = 0
      this.vY = this.velocity + 1.5
      console.log(game.ball.velocity)
    } else if (ballBottomSide >= canvasBottomSide) {
      game.sounds.bump.play()
      this.y = canvasBottomSide - this.height
      this.vY = -this.velocity - 1.5
      console.log(game.ball.velocity)
    }
  },

  random(min, max) {
    // Get a random integer in a given range
    return Math.floor(Math.random() * (max - min + 1) + min)
  },
}
