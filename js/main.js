function preload() {
  sounds.buttonClicked = loadSound("../sounds/battle-swing.mp3");
  sounds.piecePlaced = loadSound("./sounds/hit-splat.mp3");
  sounds.shapeCleared = loadSound("./sounds/water-bubble.mp3");
}

// KA
// sounds.buttonClicked = getSound("rpg/battle-swing");
// sounds.piecePlaced = getSound("rpg/hit-splat");
// sounds.shapeCleared = getSound("rpg/water-bubble");
// sounds.buttonClicked.audio.preservesPitch = false;
// sounds.piecePlaced.audio.preservesPitch = false;
// sounds.shapeCleared.audio.preservesPitch = false;
// function _playSound(sound, rate){
//   sound.audio.currentTime = 0;
//   sound.audio.playbackRate = 1 + rate;
//   playSound(sound);
// }

// nKA
function _playSound(sound, rate) {
  sound.currentTime = 0;
  sound.playbackRate = 1 + rate;
  sound.play();
}
// nKA

let scaleFactor = 1;
let canvas;
function setup() {
  // nKA
  canvas = createCanvas(600, 600, document.getElementById("game-canvas"));
  windowResized();

  // nKA
  if (__skip__) {
    IMAGES_AMOUNT = 1;
    START_SCENE.t = 453;
    TEXTURE_LOADER.LOAD_SPEED = 5000;
  }

  // nKA
  sounds.buttonClicked.preservesPitch = false;
  sounds.piecePlaced.preservesPitch = false;
  sounds.shapeCleared.preservesPitch = false;

  // configs
  pixelDensity(1); // nKA
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  strokeJoin(ROUND);
  angleMode(DEGREES); // KA
  textSize(40);
  textFont("monospace"); // textFont(createFont("monospace")); // KA

  TEXTURE_LOADER.createMasks();
  START_SCENE.titleSetup();
}

let _mouseX, _mouseY;
function draw() {
  _mouseX = floor(mouseX / scaleFactor);
  _mouseY = floor(mouseY / scaleFactor);
  touchCountdown--;
  cursor(ARROW);
  if (scene === "PLAY") {
    PLAY_SCENE.render();
  } else if (scene === "START") {
    START_SCENE.render();
  } else if (scene === "END") {
    END_SCENE.render();
  }

  SCENE_TRANSITION.update();
}

// KA
function touchEnded() {
  if (touchCountdown > 0) return;
  else touchCountdown = 5;

  if (scene === "PLAY") {
    PLAY_SCENE.mouseClicked();
  } else if (scene === "START") {
    START_SCENE.mouseClicked();
  } else if (scene === "END") {
    END_SCENE.mouseClicked();
  }
}

// nKA
function windowResized() {
  viewportWidth = Math.min(window.innerWidth, window.innerHeight);
  scaleFactor = viewportWidth / 600;
  canvas.elt.style.transform = "scale(" + scaleFactor + ")";
}
