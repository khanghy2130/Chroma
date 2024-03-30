const PLAY_SCENE = {
  activePlusDot: null,
  generatedPlaceables: [], // placeables[] for each of the pieces. multiple from one square

  initializeGame: function () {
    ////// add dummy shapes
    for (let i = 0; i < ALL_SQUARES.length; i++) {
      ALL_SQUARES[i].renderData = getNewShapeRenderData(
        ALL_SQUARES[i],
        randomInt(0, 4)
      );
    }
    for (let i = 0; i < ALL_TRIANGLES.length; i++) {
      ALL_TRIANGLES[i].renderData = getNewShapeRenderData(
        ALL_TRIANGLES[i],
        randomInt(0, 4)
      );
    }
  },

  render: function () {
    background(BG_COLOR);

    // render grid lines
    stroke(GRID_COLOR);
    strokeWeight(3);
    for (let i = 0; i < GRID_LINES.length; i++) {
      const l = GRID_LINES[i];
      if (l === null) continue;
      line(l[0][0], l[0][1], l[1][0], l[1][1]);
    }

    ///// render all square
    for (let i = 0; i < ALL_SQUARES.length; i++) {
      renderShape(ALL_SQUARES[i], SQUARE_SIZE);
    }
    for (let i = 0; i < ALL_TRIANGLES.length; i++) {
      renderShape(ALL_TRIANGLES[i], TRIANGLE_SIZE);
    }

    //// all plus dots
    // fill(255, 200);
    // noStroke();
    // for (let i = 0; i < PLUS_DOTS.length; i++) {
    //   const pd = PLUS_DOTS[i];
    //   circle(pd.pos[0], pd.pos[1], 20);
    //   if (dist(mouseX, mouseY, pd.pos[0], pd.pos[1]) < 10) {
    //     for (let j = 0; j < pd.shapes.length; j++) {
    //       const sh = pd.shapes[j];
    //       beginShape();
    //       for (let v = 0; v < sh.points.length; v++) {
    //         vertex(sh.points[v][0], sh.points[v][1]);
    //       }
    //       endShape(CLOSE);
    //     }
    //   }
    // }

    ///// render frame rate
    fill(255);
    text(frameRate().toFixed(1), 50, 30);
  },

  mouseClicked: function () {},
};

function renderShape(shape, size) {
  push(); // pushMatrix(); // KA
  translate(shape.centerPos[0], shape.centerPos[1]);
  rotate(GRID_ORI[shape.shapeIndex] + shape.renderData.textureOri);
  image(shape.renderData.img, 0, 0, size, size);
  pop(); // popMatrix(); // KA
}
