function setup() {
  createCanvas(600, 600);

  if (__skip__) {
    IMAGES_AMOUNT = 1;
    START_SCENE.t = 221;
    TEXTURE_LOADER.LOAD_SPEED = 5000;
  }

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

function draw() {
  cursor(ARROW);
  if (scene === "PLAY") {
    PLAY_SCENE.render();
  } else if (scene === "START") {
    START_SCENE.render();
  } else if (scene === "END") {
  }

  SCENE_TRANSITION.update();
}

function mouseClicked() {
  if (scene === "PLAY") {
    PLAY_SCENE.mouseClicked();
  } else if (scene === "START") {
    START_SCENE.mouseClicked();
  } else if (scene === "END") {
  }
}
