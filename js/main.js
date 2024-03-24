var dummies = []; // { x, y, r }

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

    // render points ///
    strokeWeight(10);
    stroke(250);
    for (let i = 0; i < CORES.length; i++) {
      const points = CORES[i].points;
      for (let j = 0; j < points.length; j++) {
        const pos = points[j];
        point(pos[0], pos[1]);
      }
    }

    // render shapes ////
    noStroke();
    for (let i = 0; i < CORES.length; i++) {
      // render core index
      fill(255);
      textSize(30);
      text(i, CORES[i].points[0][0], CORES[i].points[0][1] + SCALER * 2);

      for (let j = 0; j < CORES[i].shapes.length; j++) {
        const shape = CORES[i].shapes[j];
        if (shape === null) continue;

        fill(60 + j * 30, 100);
        beginShape();
        for (let k = 0; k < shape.points.length; k++) {
          vertex(shape.points[k][0], shape.points[k][1]);
        }
        endShape(CLOSE);
      }
    }

    for (let i = 0; i < dummies.length; i++) {
      const shape = dummies[i];
      push(); // pushMatrix();

      shape.x += 0.1;
      shape.y += 0.1;
      shape.r += 1;
      translate(shape.x, shape.y);
      rotate(shape.r);
      image(shape.img, 0, 0, 100, 100);

      pop(); // popMatrix();
    }

    fill(255);
    text(frameRate().toFixed(1), 50, 30);
  } else if (scene === "START") {
    START_SCENE.render();
  } else if (scene === "END") {
  }

  SCENE_TRANSITION.update();
}
