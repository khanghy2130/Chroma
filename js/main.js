function setup() {
  createCanvas(600, 600);

  if (__skip__) {
    IMAGES_AMOUNT = 1;
    START_SCENE.t = 221;
  }

  // configs
  pixelDensity(1); // nKA
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER);
  strokeJoin(ROUND);
  angleMode(DEGREES); // KA
  textSize(40);

  TEXTURE_LOADER.createMasks();
  START_SCENE.titleSetup();

  initializeGridData();
  print(CORES);
}

function draw() {
  if (scene === "PLAY") {
    background(BG_COLOR);

    ///// test render
    for (let i = 0; i < CORES.length; i++) {
      noStroke();
      // render core index
      fill(255);
      textSize(30);
      text(i, CORES[i].points[0][0], CORES[i].points[0][1] + SCALER * 2);

      // render shape
      for (let j = 0; j < CORES[i].shapes.length; j++) {
        const shape = CORES[i].shapes[j];
        if (shape === null) continue;

        fill(60 + j * 30, 100);
        beginShape();
        for (let k = 0; k < shape.points.length; k++) {
          vertex(shape.points[k][0], shape.points[k][1]);
        }
        endShape(CLOSE);
        fill(255, 255, 0, 50);
        circle(shape.centerPos[0], shape.centerPos[1], 10);

        // show neighbors
        if (dist(mouseX, mouseY, shape.centerPos[0], shape.centerPos[1]) < 10) {
          for (let nb = 0; nb < shape.nShapes.length; nb++) {
            const nShape = shape.nShapes[nb];
            if (!nShape) continue;
            fill("red");
            circle(nShape.centerPos[0], nShape.centerPos[1], 10);
          }
        }
      }
    }

    // render grid lines
    stroke(GRID_COLOR);
    strokeWeight(2);
    for (let i = 0; i < GRID_LINES.length; i++) {
      const l = GRID_LINES[i];
      if (l === null) continue;
      line(l[0][0], l[0][1], l[1][0], l[1][1]);
    }

    fill(255);
    text(frameRate().toFixed(1), 50, 30);
  } else if (scene === "START") {
    START_SCENE.render();
  } else if (scene === "END") {
  }

  SCENE_TRANSITION.update();
}

function mouseClicked() {
  if (scene === "PLAY") {
  } else if (scene === "START") {
    START_SCENE.mouseClicked();
  } else if (scene === "END") {
  }
}
