function setup() {
  createCanvas(600, 600);

  // configs
  pixelDensity(1); // nKA
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER);
  strokeJoin(ROUND);
  angleMode(DEGREES); // KA
  textSize(40);

  TEXTURE_LOADER.createMasks();

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
        fill("yellow");
        circle(shape.centerPos[0], shape.centerPos[1], 10);
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
