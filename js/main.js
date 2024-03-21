var dummies = []; // { x, y, r }

function setup() {
  createCanvas(600, 600);

  // configs
  pixelDensity(1); // nKA
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER);
  strokeJoin(ROUND);
  textSize(40);

  TEXTURE_LOADER.createMasks();

  initializeGridData();
  print(CORES);
}

function draw() {
  if (TEXTURE_LOADER.isLoading) {
    TEXTURE_LOADER.renderLoadscreen();
    return;
  }

  background(30);

  /*
  for (var i=0; i <4;i++){
    var sqVariations = TEXTURE_LOADER.squareImages[i];
    var trglVariations = TEXTURE_LOADER.triangleImages[i];
    for (var j=0; j <3;j++){
      image(sqVariations[j], 
            100 + i*80, 50 + j*150, 
      80, 80);
      image(trglVariations[j], 
            100 + i*80, 135 + j*150, 
      80, 80);
    }
  }
  */

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

  for (var i = 0; i < dummies.length; i++) {
    const shape = dummies[i];
    push(); // pushMatrix();

    shape.x += 0.1;
    shape.y += 0.1;
    shape.r += 0.01;
    translate(shape.x, shape.y);
    rotate(shape.r);
    image(shape.img, 0, 0, 100, 100);

    pop(); // popMatrix();
  }

  fill(255);
  text(frameRate().toFixed(1), 50, 30);
}

/*

// render points ///
strokeWeight(10);
stroke(250);
for (let i=0; i < CORES.length; i++){
  const points = CORES[i].points;
  for (let j=0; j < points.length; j++){
    const pos = points[j];
    point(pos[0], pos[1]);
  }
}

// render shapes ////
noStroke();
for (let i=0; i < CORES.length; i++){
  
  // render core index
  fill(255);
  textSize(30);
  text(i, CORES[i].points[0][0], CORES[i].points[0][1] + SCALER*2);
  
  for (let j=0; j < CORES[i].shapes.length; j++){
    const shape = CORES[i].shapes[j];
    if (shape === null) continue;
    
    fill(60 + j*30, 100);
    beginShape();
    for (let k=0; k < shape.points.length; k++){
      vertex(
        shape.points[k][0],
        shape.points[k][1]
      );
    }
    endShape(CLOSE);
  }
}


*/
