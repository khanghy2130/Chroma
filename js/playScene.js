const PLAY_SCENE = {
  activePlusDot: null,

  pieces: [],
  pieceBtns: [],
  selectedPieceIndex: null,

  initializeGame: function () {
    // make piece buttons
    if (this.pieceBtns.length === 0) {
      const btnWidth = width / 3;
      const btnHeight = 130;
      const btnY = height - btnHeight / 2;
      this.pieceBtns = [
        new Btn(
          btnWidth / 2,
          btnY,
          btnWidth * 0.95,
          btnHeight * 0.9,
          (x, y) => {
            ////////// center point for reference
            stroke(255);
            strokeWeight(10);
            point(x, y);
          },
          () => this.pieceBtnClicked(0)
        ),
        new Btn(
          btnWidth / 2 + btnWidth,
          btnY,
          btnWidth * 0.95,
          btnHeight * 0.9,
          null,
          () => this.pieceBtnClicked(1)
        ),
        new Btn(
          btnWidth / 2 + btnWidth * 2,
          btnY,
          btnWidth * 0.95,
          btnHeight * 0.9,
          null,
          () => this.pieceBtnClicked(2)
        ),
      ];
    }

    // generate 3 pieces
    for (let i = 0; i < 3; i++) {
      this.pieces[i] = generatePiece(i);
      print(this.pieces[i]); //////
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

    // render piece flyers & piece buttons
    for (let i = 0; i < 3; i++) {
      // render piece flyer
      push(); // pushMatrix(); // KA
      const flyer = this.pieces[i].flyer;
      translate(flyer.pos[0], flyer.pos[1]);
      rotate(flyer.r);
      scale(flyer.scaling);
      // render each fshape
      for (let f = 0; f < flyer.fShapes.length; f++) {
        const fShape = flyer.fShapes[f];
        push(); // pushMatrix(); // KA
        translate(fShape.pos[0], fShape.pos[1]);
        rotate(fShape.r + fShape.renderData.textureOri);
        image(
          fShape.renderData.img,
          0,
          0,
          fShape.renderData.size,
          fShape.renderData.size
        );
        if (fShape.renderData.sealIndex > 0) {
          //// render seal
        }
        pop(); // popMatrix(); // KA
      }
      pop(); // popMatrix(); // KA

      // update flyer animation
      // is selected piece?
      if (i === this.selectedPieceIndex) {
        ///////
      } else {
        // grow to default scaling
        if (flyer.scaling < FLYER_UNSELECTED_SCALING) {
          flyer.scaling = min(
            FLYER_UNSELECTED_SCALING,
            flyer.scaling + FLYER_SIZE_SPEED
          );
        }
      }

      this.pieceBtns[i].render(); // render button frame
    }

    ///// render frame rate
    fill(255);
    noStroke();
    textSize(40);
    text(frameRate().toFixed(3), 80, 50);
  },

  mouseClicked: function () {
    ///// block input here

    // piece button clicked
    for (let i = 0; i < this.pieceBtns.length; i++) {
      if (this.pieceBtns[i].isHovered) return this.pieceBtns[i].clicked();
    }
  },

  pieceBtnClicked: function (pieceIndex) {
    print(pieceIndex);
  },
};

// render shapes on grid only
function renderShape(shape) {
  push(); // pushMatrix(); // KA
  translate(shape.centerPos[0], shape.centerPos[1]);
  rotate(GRID_ORI[shape.shapeIndex] + shape.renderData.textureOri);
  image(
    shape.renderData.img,
    0,
    0,
    shape.renderData.size,
    shape.renderData.size
  );
  pop(); // popMatrix(); // KA
}
