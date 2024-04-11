function setup() {
  createCanvas(600, 600);

  if (__skip__) {
    IMAGES_AMOUNT = 1;
    START_SCENE.t = 453;
    TEXTURE_LOADER.LOAD_SPEED = 5000;
  }

  // configs
  ///frameRate(30); ///
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

function draw() {
  touchCountdown--;
  cursor(ARROW);
  if (scene === "PLAY") {
    PLAY_SCENE.render();
  } else if (scene === "START") {
    START_SCENE.render();
  } else if (scene === "END") {
    background("darkblue");
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
  }
}
