const PLAY_SCENE = {
  activePlusDot: null,

  // Piece: {type, flyer, placeables}
  pieces: [],
  pieceBtns: [],
  selectedPieceIndex: null,
  hoveredPlaceable: null,
  placeableGenIndex: 0, // 3 would be done

  pendingCheckClear: false,
  // {shape, progress(0 to 1)}
  placementFlashers: [],
  // {shape, progress(0 to 1), hasCleared}
  clearFlasers: [],
  numFlashers: [], // { pos, addedScore, progress(0 to 1)}
  multIsActive: false,
  multColorIndex: null,

  refreshMult: function () {
    this.multIsActive = false;
    const prevColorIndex = this.multColorIndex;
    while (prevColorIndex === this.multColorIndex) {
      this.multColorIndex = randomInt(0, 4);
    }
    animations.multScaler = 2;
  },

  initializeGame: function () {
    totalAdded = 0;
    totalScore = 0;
    multiplier = 2.0;
    adder = 0;
    temporaryAdder = 0;
    scoreCheckIndex = 0;
    turnsCount = 0;
    animations = {
      resultDelay: 0,
      scoreScaler: 1,
      adderScaler: 1,
      multScaler: 1,
    };

    this.placeableGenIndex = 0;
    this.selectedPieceIndex = null;
    this.pendingCheckClear = false;
    this.placementFlashers = [];
    this.clearFlasers = [];
    this.numFlashers = [];
    this.multColorIndex = null;
    this.refreshMult();

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
    noStroke();
    for (let i = this.placementFlashers.length - 1; i >= 0; i--) {
      const fl = this.placementFlashers[i];
      fl.progress = min(1, fl.progress + FLASHER_SPEED);
      fill(255, sin(fl.progress * 180) * 255);
      beginShape();
      for (let v = 0; v < fl.shape.points.length; v++) {
        vertex(fl.shape.points[v][0], fl.shape.points[v][1]);
      }
      endShape(CLOSE);
      if (fl.progress >= 1) this.placementFlashers.splice(i, 1);
    }
  },

  renderClearFlashers: function () {
    // set up clearing after placing animation
    if (this.pendingCheckClear && this.placementFlashers.length === 0) {
      this.pendingCheckClear = false;
      this.clearShapes();
    }
    for (let i = this.clearFlasers.length - 1; i >= 0; i--) {
      const fl = this.clearFlasers[i];
      if (fl.delay-- > 0) continue;

      // flasher cover
      if (fl.progress < 1) {
        fl.progress = min(1, fl.progress + FLASHER_SPEED);
        fill(LIGHT_COLOR, sin(fl.progress * 180) * 255);
        beginShape();
        for (let v = 0; v < fl.shape.points.length; v++) {
          vertex(fl.shape.points[v][0], fl.shape.points[v][1]);
        }
        endShape(CLOSE);
        if (fl.progress >= 1) this.clearFlasers.splice(i, 1);
      }

      // actually clear & set up numFlashers
      if (!fl.hasCleared && fl.progress >= 0.5) {
        fl.hasCleared = true;
        fl.shape.renderData = null;
        this.triggerClear();
        /// clear sound here
        this.numFlashers.push({
          pos: fl.shape.centerPos,
          addedScore:
            "+" +
            (adder + temporaryAdder * (this.multIsActive ? multiplier : 1)),
          progress: 0,
        });
      }
    }
  },

  renderNumFlashers: function () {
    textSize(20);
    for (let i = this.numFlashers.length - 1; i >= 0; i--) {
      const fl = this.numFlashers[i];
      fl.progress += 0.018; // text duration
      fill(LIGHT_COLOR, min(255, (1 - fl.progress) * 1500));
      text(fl.addedScore, fl.pos[0], fl.pos[1]);
      if (fl.progress >= 1) this.numFlashers.splice(i, 1);
    }
  },

  renderTotalScore: function () {
    textSize(40 * animations.scoreScaler);
    animations.scoreScaler = max(1, animations.scoreScaler - TEXT_SHRINK_SPEED);
    fill(DARK_COLOR);
    rect(75, 55, 110, 50, 10);
    fill(LIGHT_COLOR);
    text(animations.resultDelay > 0 ? "+" + totalAdded : totalScore, 75, 57);
  },

  renderScoreCheck: function () {
    fill(DARK_COLOR);
    rect(525, 58, 120, 75, 10);
    textSize(40);
    fill(LIGHT_COLOR);
    text(SCORE_CHECK_AMOUNTS[scoreCheckIndex], 525, 50);
    textSize(20);
    fill(LIGHT_COLOR); /// flash when <2 left
    text(10 - (turnsCount % 10) + " left", 525, 80);
  },

  renderMultiplier: function () {
    const spinTime = frameCount * (this.multIsActive ? 10 : 1);
    fill(SHAPES_COLORS[this.multColorIndex][0]);
    arc(70, 400, 85, 85, spinTime, spinTime + 50);
    arc(70, 400, 85, 85, spinTime + 180, spinTime + 230);
    fill(DARK_COLOR);
    ellipse(70, 400, 80, 80);
    fill(SHAPES_COLORS[this.multColorIndex][0]);
    textSize(28 * animations.multScaler);
    animations.multScaler = max(1, animations.multScaler - TEXT_SHRINK_SPEED);
    text("x" + multiplier.toFixed(1), 70, 400);
  },

  renderAdder: function () {
    const spinTime = -frameCount * (1 + adder * 0.01);
    fill(LIGHT_COLOR);
    arc(530, 400, 85, 85, spinTime - 50, spinTime);
    arc(530, 400, 85, 85, spinTime - 230, spinTime - 180);
    fill(DARK_COLOR);
    ellipse(530, 400, 80, 80);
    fill(LIGHT_COLOR);
    textSize(28 * animations.adderScaler);
    animations.adderScaler = max(1, animations.adderScaler - TEXT_SHRINK_SPEED);
    text("+" + (adder + temporaryAdder), 530, 400);
  },

  triggerClear: function () {
    animations.resultDelay = CLEAR_RESULT_DURATION;
    temporaryAdder += 10;
    totalAdded += adder + temporaryAdder * (this.multIsActive ? multiplier : 1);

    // trigger animations
    animations.adderScaler = 2;
    animations.scoreScaler = 1.5;
  },

  updateAnimations: function () {
    // animations completed
    if (animations.resultDelay-- === 0) {
      temporaryAdder = 0; // reset to base adder
      animations.adderScaler = 2;
      totalScore += totalAdded;
      animations.scoreScaler = 2;
      if (this.multIsActive) this.refreshMult();
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

    noStroke();
    this.updateAnimations();
    this.renderTotalScore();
    this.renderScoreCheck();
    this.renderMultiplier();
    this.renderAdder();

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

    noStroke();
    this.renderNumFlashers();
    this.renderClearFlashers();

    ///// render frame rate
    fill(255);
    noStroke();
    textSize(20);
    text(frameRate() > 55, 300, 580);
  },

  mouseClicked: function () {
    // placing a piece (hovering on placeable & no more flashers)
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
      this.pendingCheckClear = true;
      turnsCount++;
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

  clearShapes: function () {
    const checkedShapes = {};
    const groups = [];
    for (let i = 0; i < ALL_SHAPES.length; i++) {
      checkShape(ALL_SHAPES[i], checkedShapes, groups, [], true);
    }

    let clearedShapes = [];
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (group.length >= 4) clearedShapes = clearedShapes.concat(group);
    }
    clearedShapes.sort(function (shapeA, shapeB) {
      return shapeA.centerPos[0] - shapeB.centerPos[0];
    });
    for (let i = 0; i < clearedShapes.length; i++) {
      // activate mult
      if (clearedShapes[i].renderData.colorIndex === this.multColorIndex) {
        this.multIsActive = true;
      }
      this.clearFlasers.push({
        delay: i * CLEAR_DELAY,
        shape: clearedShapes[i],
        progress: 0,
        textProgress: 0,
      });
    }
    totalAdded = 0; // reset added sum from last turn
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
