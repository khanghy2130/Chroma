const PLAY_SCENE = {
  activePlusDot: null,

  // {type, placeables, centerPos, flyers}
  // FLYER: { shapeType, default:{offsetCenterPos, r}, pos, tPos, r, tR}[]}
  // t = target (follow centerPos OR be fitting)
  pieces: [],
  pieceBtns: [],

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
          null,
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
      this.pieces[i] = this.generatePiece();
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

    // render piece buttons
    for (let i = 0; i < this.pieceBtns.length; i++) {
      this.pieceBtns[i].render();
    }

    ///// render frame rate
    fill(255);
    noStroke();
    text(frameRate().toFixed(1), 50, 30);
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

  generatePiece: function () {
    // determine type
    const randomNum = random(100);
    let shapesCountIndex;
    // 10%, 35%, 55%
    if (randomNum < 10) shapesCountIndex = 0;
    else if (randomNum < 10 + 35) shapesCountIndex = 1;
    else shapesCountIndex = 2;
    const type = getRandomItem(PIECE_TYPES[shapesCountIndex]);

    //// return {type, placeables*, centerPos, flyers}
    return { type: type };
  },
};

function renderShape(shape, size) {
  push(); // pushMatrix(); // KA
  translate(shape.centerPos[0], shape.centerPos[1]);
  rotate(GRID_ORI[shape.shapeIndex] + shape.renderData.textureOri);
  image(shape.renderData.img, 0, 0, size, size);
  pop(); // popMatrix(); // KA
}
