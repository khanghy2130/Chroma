const PLAY_SCENE = {
  activePlusDot: null,

  // Piece: {type, flyer, placeables}
  pieces: [],
  pieceBtns: [],
  selectedPieceIndex: null,
  hoveredPlaceable: null,

  turnsCount: 0,
  placeableGenIndex: 0, // 3 would be done

  // {shape, progress(0 to 1)}
  placementFlashers: [],
  // {shape, progress(0 to 1), textProgress(0 to 1)}
  clearFlasers: [],

  initializeGame: function () {
    this.turnsCount = 0;
    this.placeableGenIndex = 0;
    this.selectedPieceIndex = null;
    this.placementFlashers = [];

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
      this.pieces[i] = generatePiece(i);
    }

    // spawn shapes on board
    for (let i = 0; i < SHAPES_COLORS.length; i++) {
      let randomShape = null;
      // make sure to pick a shape without neighbor
      while (randomShape === null) {
        randomShape = getRandomItem(ALL_SHAPES);
        for (let nb = 0; nb < randomShape.nShapes.length; nb++) {
          if (
            randomShape.nShapes[nb] &&
            randomShape.nShapes[nb].renderData !== null
          ) {
            randomShape = null; // not this one
            break;
          }
        }
      }
      randomShape.renderData = newRenderData(
        shapeIsSquare(randomShape),
        false,
        i
      );
    }
  },

  renderPieces: function () {
    for (let i = 0; i < 3; i++) {
      this.pieceBtns[i].render(); // render button frame
    }
    // have selected piece rendered last
    const pieceIndices = [0, 1, 2];
    if (this.selectedPieceIndex !== null) {
      pieceIndices.splice(pieceIndices.indexOf(this.selectedPieceIndex), 1);
      pieceIndices.push(this.selectedPieceIndex);
    }
    for (let i = 0; i < pieceIndices.length; i++) {
      // render piece flyer
      push(); // pushMatrix(); // KA
      const flyer = this.pieces[pieceIndices[i]].flyer;
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
      let targetPos = flyer.default.pos;
      let targetRotation = flyer.r;
      // is selected piece?
      if (pieceIndices[i] === this.selectedPieceIndex) {
        // grow to normal scaling
        if (flyer.scaling < 1) {
          flyer.scaling = min(1, flyer.scaling + FLYER_SCALING_SPEED);
        }

        // is hovered on placeable?
        if (this.hoveredPlaceable !== null) {
          targetPos = this.hoveredPlaceable.pos;
          // rotation shortcut
          if (abs(this.hoveredPlaceable.r - flyer.r) > 180) {
            if (this.hoveredPlaceable.r > flyer.r) {
              flyer.r += 360;
            } else flyer.r -= 360;
          }
          targetRotation = this.hoveredPlaceable.r;
        } else {
          targetPos = [mouseX, mouseY];
        }
      }
      // piece not selected?
      else {
        // grow to default scaling
        if (flyer.scaling < FLYER_UNSELECTED_SCALING) {
          flyer.scaling = min(
            FLYER_UNSELECTED_SCALING,
            flyer.scaling + FLYER_SCALING_SPEED
          );
        } else if (flyer.scaling > FLYER_UNSELECTED_SCALING) {
          flyer.scaling = max(
            FLYER_UNSELECTED_SCALING,
            flyer.scaling - FLYER_SCALING_SPEED
          );
        }
        targetRotation = flyer.default.r;
      }

      // update pos
      const distX = abs(targetPos[0] - flyer.pos[0]);
      const distY = abs(targetPos[1] - flyer.pos[1]);
      if (distX !== 0 || distY !== 0) {
        // minimum speed
        const speedX = max(distX * FLYER_MOVE_SPEED, 1);
        const speedY = max(distY * FLYER_MOVE_SPEED, 1);
        // going left vs right
        if (flyer.pos[0] < targetPos[0]) {
          flyer.pos[0] = min(targetPos[0], flyer.pos[0] + speedX);
        } else {
          flyer.pos[0] = max(targetPos[0], flyer.pos[0] - speedX);
        }
        // going down vs up
        if (flyer.pos[1] < targetPos[1]) {
          flyer.pos[1] = min(targetPos[1], flyer.pos[1] + speedY);
        } else {
          flyer.pos[1] = max(targetPos[1], flyer.pos[1] - speedY);
        }
      }

      // update rotation
      if (targetRotation > flyer.r) {
        flyer.r = min(flyer.r + FLYER_ROTATE_SPEED, targetRotation);
      } else if (targetRotation < flyer.r) {
        flyer.r = max(flyer.r - FLYER_ROTATE_SPEED, targetRotation);
      }
    }
  },

  checkHoverPlaceables: function () {
    if (this.selectedPieceIndex === null) return;
    const placeables = this.pieces[this.selectedPieceIndex].placeables;
    for (let i = 0; i < placeables.length; i++) {
      const placeable = placeables[i];
      // check hover
      if (
        this.hoveredPlaceable === null &&
        dist(mouseX, mouseY, placeable.pos[0], placeable.pos[1]) <
          PLACEABLE_DIAMETER * 1 // hover range
      ) {
        this.hoveredPlaceable = placeable;
        break;
      }
    }
  },

  renderPlacedShapes: function () {
    for (let i = 0; i < ALL_SHAPES.length; i++) {
      const shape = ALL_SHAPES[i];
      if (shape.renderData === null) continue;
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
      ///// render seal
      pop(); // popMatrix(); // KA
    }
  },

  renderPlacementFlashers: function () {
    for (let i = this.placementFlashers.length - 1; i >= 0; i--) {
      const fl = this.placementFlashers[i];
      fl.progress += 0.08;
      fill(255, sin(fl.progress * 180) * 255);
      beginShape();
      for (let v = 0; v < fl.shape.points.length; v++) {
        vertex(fl.shape.points[v][0], fl.shape.points[v][1]);
      }
      endShape(CLOSE);
      if (fl.progress >= 1) this.placementFlashers.splice(i, 1);
    }
  },

  render: function () {
    // reset
    this.hoveredPlaceable = null;

    background(BG_COLOR);
    generatePlaceables();
    this.checkHoverPlaceables();
    this.renderPlacementFlashers();
    this.renderPlacedShapes();

    // render grid lines
    stroke(GRID_COLOR);
    strokeWeight(2);
    for (let i = 0; i < GRID_LINES.length; i++) {
      const l = GRID_LINES[i];
      if (l === null) continue;
      line(l[0][0], l[0][1], l[1][0], l[1][1]);
    }

    this.renderPieces();

    // render red dots
    if (this.selectedPieceIndex !== null) {
      stroke(255, 255, 0);
      strokeWeight(10);
      if (this.hoveredPlaceable) {
        point(this.hoveredPlaceable.pos[0], this.hoveredPlaceable.pos[1]);
      } else {
        const placeables = this.pieces[this.selectedPieceIndex].placeables;
        for (let i = 0; i < placeables.length; i++) {
          const placeable = placeables[i];
          point(placeable.pos[0], placeable.pos[1]);
        }
      }
    }

    ///// render frame rate
    fill(255);
    noStroke();
    textSize(40);
    text(frameRate().toFixed(3), 80, 50);
  },

  mouseClicked: function () {
    // placing a piece
    if (this.hoveredPlaceable !== null) {
      const flyer = this.pieces[this.selectedPieceIndex].flyer;
      // apply renderData to real shapes
      for (let i = 0; i < flyer.fShapes.length; i++) {
        const shape = this.hoveredPlaceable.shapes[i];
        const renderData = flyer.fShapes[i].renderData;
        shape.renderData = renderData;
        renderData.textureOri +=
          this.hoveredPlaceable.r +
          flyer.fShapes[i].r -
          GRID_ORI[shape.shapeIndex];
        this.placementFlashers.push({
          shape: shape,
          progress: 0,
        });
      }
      this.pieces[this.selectedPieceIndex] = generatePiece(
        this.selectedPieceIndex
      );
      this.selectedPieceIndex = null;
      this.placeableGenIndex = 0; // trigger recalculate
      this.turnsCount++;
      this.clearShapes(); //// do this after animation

      return;
    }

    // piece button clicked
    for (let i = 0; i < this.pieceBtns.length; i++) {
      if (this.pieceBtns[i].isHovered) return this.pieceBtns[i].clicked();
    }
  },

  pieceBtnClicked: function (pieceIndex) {
    // cancel if still calculating placeables
    if (this.placeableGenIndex < 4 || this.outOfSpace) return;
    this.selectedPieceIndex =
      this.selectedPieceIndex !== pieceIndex ? pieceIndex : null;
  },

  // clear all same color 4+ shapes group(s). add to animation
  clearShapes: function () {
    const checkedShapes = {};
    const groups = [];
    for (let i = 0; i < ALL_SHAPES.length; i++) {
      checkShape(ALL_SHAPES[i], checkedShapes, groups, [], true);
    }
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (group.length >= 4) {
        for (let j = 0; j < group.length; j++) {
          const shape = group[j];
          shape.renderData = null;
        }
      }
    }
  },
};

function checkShape(
  shape,
  checkedShapes,
  groups,
  currentGroup,
  doesAddToGroups
) {
  // empty or already checked
  if (shape.renderData === null || checkedShapes[shape.shapeID]) return;

  checkedShapes[shape.shapeID] = true; // mark checked
  currentGroup.push(shape); // add self to group
  if (doesAddToGroups) groups.push(currentGroup);
  for (let nb = 0; nb < shape.nShapes.length; nb++) {
    const nShape = shape.nShapes[nb];
    // jump to that shape if same color
    if (
      nShape &&
      nShape.renderData !== null &&
      nShape.renderData.colorIndex === shape.renderData.colorIndex
    ) {
      checkShape(nShape, checkedShapes, groups, currentGroup);
    }
  }
}
