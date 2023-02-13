const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const GAP_X = 10
const LINE_WIDTH = 15
const RADIUS_BALL = 20
const HEIGHT_PADDLE = 200
const SPEED_BALL = 10
const mouse = { x: 0, y: 0 }

const field = {
  width: window.innerWidth,
  height: window.innerHeight,
  draw: function () {
    ctx.fillStyle = "#286047"
    ctx.fillRect(0, 0, this.width, this.height)
  }
}

const line = {
  width: LINE_WIDTH,
  height: field.height,
  center: field.width / 2 - LINE_WIDTH / 2,
  draw: function () {
    ctx.fillStyle = "#fff"
    ctx.fillRect(this.center, 0, this.width, this.height)
  }
}

const leftPaddle = {
  height: HEIGHT_PADDLE,
  width: line.width,
  positionX: GAP_X,
  positionY: 0,
  _move: function () {
    this.positionY = mouse.y - this.height / 2
  },
  draw: function () {
    ctx.fillStyle = "#fff"
    ctx.fillRect(this.positionX, this.positionY, this.width, this.height)
    this._move()
  }
}

const rightPaddle = {
  height: HEIGHT_PADDLE,
  width: line.width,
  positionX: field.width - line.width - GAP_X,
  positionY: 250,
  speed: 5,
  _move: function () {
    if (this.positionY + this.height / 2 < ball.positionY + ball.radius) {
      this.positionY += this.speed
    } else {
      this.positionY -= this.speed
    }
  },
  _speedUp: function () {
    this.speed += 3
  },
  draw: function () {
    ctx.fillStyle = "#fff"
    ctx.fillRect(this.positionX, this.positionY, this.width, this.height)
    this._move()
  }
}

const ball = {
  positionX: 0,
  positionY: 0,
  radius: RADIUS_BALL,
  speed: SPEED_BALL,
  directionX: 1,
  directionY: 1,
  _reverseX: function () {
    this.directionX *= -1
  },
  _reverseY: function () {
    this.directionY *= -1
  },
  _changeDirection: function () {
    if (
      this.positionX > field.width - this.radius - rightPaddle.width - GAP_X
    ) {
      if (
        this.positionY + this.radius > rightPaddle.positionY &&
        this.positionY - this.radius < rightPaddle.positionY + rightPaddle.height
      ) {
        this._reverseX()
      } else {
        score.increaseHumanPoints()
        this._pointUp()
      }
    }

    if (this.positionX < this.radius + leftPaddle.width + GAP_X) {
      if (
        this.positionY + this.radius > leftPaddle.positionY &&
        this.positionY - this.radius < leftPaddle.positionY + leftPaddle.height
      ) {
        this._reverseX()
      } else {
        score.increaseComputerPoints()
        this._pointUp()
      }
    }

    if (
      this.positionY - this.radius < 0 && this.directionY < 0 || 
      this.positionY > field.height - this.radius && this.directionY > 0
    ) {
      this._reverseY()
    }
  },
  _speedUp: function () {
    this.speed++
  },
  _pointUp: function () {
    this._speedUp()
    rightPaddle._speedUp()
    this.positionX = field.width / 2
    this.positionY = field.height / 2
  },
  _move: function () {
    this.positionX += this.directionX * this.speed
    this.positionY += this.directionY * this.speed
  },
  draw: function () {
    ctx.fillStyle = "#fff"
    ctx.beginPath()
    ctx.arc(this.positionX, this.positionY, this.radius, 0, 2 * Math.PI)
    ctx.fill()
    this._changeDirection()
    this._move()
  }
}

const score = {
  human: 0,
  computer: 0,
  increaseHumanPoints: function () {
    this.human++
  },
  increaseComputerPoints: function () {
    this.computer++
  },
  draw: function () {
    ctx.font = "bold 72px Arial"
    ctx.fontAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillStyle = "#01341D"
    ctx.fillText(this.human, field.width / 4, 50)
    ctx.fillText(this.computer, field.width - field.width / 4, 50)
  }
}

const setup = () => {
  canvas.width = ctx.width = field.width
  canvas.height = ctx.height = field.height
}

const draw = () => {
  field.draw()
  line.draw()
  leftPaddle.draw()
  rightPaddle.draw()
  score.draw()
  ball.draw()
}

window.animateFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 1000 / 60)
    }
  )
})()

const main = () => {
  animateFrame(main)
  draw()
}

canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.pageX
  mouse.y = e.pageY
})

setup()
main()