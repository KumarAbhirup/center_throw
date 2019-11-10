/* eslint-disable no-use-before-define */
/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const gfx = {}
const sfx = {}

let scaleFactor
let scaledWidth
let scaledHeight
let scaledMouseX
let scaledMouseY
const pixelsPerMeter = 160
const gameState = 'playing'
let dtTimer = 0

function preload() {
  gfx.background = loadImage('https://i.ibb.co/PCnsSVr/background.png')
  gfx.heart = loadImage('https://i.ibb.co/2nKYDyY/heart.png')
  gfx.heartGrey = loadImage('https://i.ibb.co/2t6VWjC/heart-Grey.png')
  gfx.star = loadImage('https://i.ibb.co/3cg8c55/star.png')
  gfx.dirt = loadImage('https://i.ibb.co/KXW90vY/dirt.png')
  gfx.info = loadImage('https://i.ibb.co/C1x9Lyx/info.png')
  gfx.player = loadImage('https://i.ibb.co/cCVyXJf/player.png')
  gfx.obstacle = loadImage('https://i.ibb.co/gTZ8Pqq/obstacle.png')

  sfx.grapple = loadSound('https://objects.koji-cdn.com/52fec6a8-e0dc-45d0-a326-cb1bf8e40b9d/life.wav')
  sfx.jump = loadSound('https://objects.koji-cdn.com/52fec6a8-e0dc-45d0-a326-cb1bf8e40b9d/life.wav')
  sfx.star = loadSound('https://objects.koji-cdn.com/52fec6a8-e0dc-45d0-a326-cb1bf8e40b9d/life.wav')
  sfx.obstacleHit = loadSound('https://objects.koji-cdn.com/52fec6a8-e0dc-45d0-a326-cb1bf8e40b9d/life.wav')
  masterVolume(0.4)

  swingPoints.preload()
}

function setup() {
  const canvas = createCanvas(window.innerWidth, window.innerHeight)

  strokeJoin(ROUND)
  scaleFactor = height / 900
  scaledWidth = width / scaleFactor
  scaledHeight = height / scaleFactor

  menu.load()
  player.load()
  ground.load()
  swingPoints.load()
  obstacles.load()
  stars.load()
  info.load()
  gameOver.load()
}

function update() {
  scaledMouseX = (mouseX - width / 2) / scaleFactor + scaledWidth / 2
  scaledMouseY = (mouseY - height / 2) / scaleFactor + scaledHeight / 2
  const fixedDt = 1 / 60
  dtTimer += min(1 / frameRate(), 1 / 10)
  while (dtTimer > 0) {
    dtTimer -= fixedDt
    fixedUpdate(fixedDt)
  }
}

function fixedUpdate(dt) {
  switch (gameState) {
    case 'playing':
      player.update(dt)
      ground.update(dt)
      swingPoints.update(dt)
      obstacles.update(dt)
      stars.update(dt)
      info.update(dt)
      gameOver.update(dt)
      break
    case 'gameOver':
      info.update(dt)
      gameOver.update(dt)
      break
  }
}

function mousePressed() {
  switch (gameState) {
    case 'menu':
      menu.mousePressed()
      break
    case 'playing':
      player.mousePressed()
      break
    case 'gameOver':
      gameOver.mousePressed()
      break
  }
}
function touchStarted() {
  if (touches.length === 1) {
    mousePressed()
  }
}

function mouseReleased() {
  switch (gameState) {
    case 'playing':
      player.mouseReleased()
      break
  }
}
function touchEnded() {
  if (touches.length === 0) {
    mouseReleased()
  }
}

function draw() {
  update()
  noStroke()
  background(255)
  push()
  translate(width / 2, height / 2)
  scale(scaleFactor, scaleFactor)
  translate(-scaledWidth / 2, -scaledHeight / 2)
  switch (gameState) {
    case 'menu':
      menu.draw()
      window.setAppView('mainMenu')
      break
    case 'playing':
    case 'gameOver':
      image(gfx.background, -2, -2, scaledWidth + 4, 900 + 4)
      cam.set()
      ground.draw()
      obstacles.draw()
      swingPoints.draw()
      player.draw()
      stars.draw()
      cam.reset()

      // score
      fill(0)
      textSize(64)
      textAlign(CENTER, CENTER)
      text(player.score, scaledWidth / 2, 80)

      // hp
      for (let i = -1; i <= 1; i++) {
        const img = i + 1 < player.lives ? gfx.heart : gfx.heartGrey
        image(img, scaledWidth / 2 + i * 40 - 16, 120)
      }

      info.draw()
      gameOver.draw()
      break
  }
  pop()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  scaleFactor = height / 900
  scaledWidth = width / scaleFactor
  scaledHeight = height / scaleFactor
}