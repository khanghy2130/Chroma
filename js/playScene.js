const PLAY_SCENE = {
  popupMessage: "",
  gameEnded: false,
  finalClearAll: false,
  outOfSpace: false,
  turnsLeft: 0,
  activePlusDot: null,

  // Piece: {type, flyer, placeables}
  pieces: [],
  pieceBtns: [],
  selectedPieceIndex: null,
  hoveredPlaceable: null,
  confirmHoveredPlaceable: null, // for touchscreen
  placeableGenIndex: 0, // 3 would be done

  isClearing: false,
  pendingScoreCheck: false,
  pendingCheckClear: false,
  // {shape, progress(0 to 1)}
  placementFlashers: [],
  // {shape, progress(0 to 1), hasCleared}
  clearFlasers: [],
  numFlashers: [], // { pos, addedScore, progress(0 to 1)}
  sealFlashers: [], // { pos, progress }
  multIsActive: false,
  multColorIndex: null,
  plusDot: null,

  refreshMult: function () {
    this.multIsActive = false;
    const prevColorIndex = this.multColorIndex;
    while (prevColorIndex === this.multColorIndex) {
      this.multColorIndex = randomInt(0, 4);
    }
    animations.multScaler = 2;
  },
  refreshPlusDot: function () {
    // look for a different pos than current
    const prevPlusDot = this.plusDot;
    const remainingPositions = PLUS_DOTS.slice(0);
    while (remainingPositions.length > 0) {
      const newPlusDotIndex = randomInt(0, remainingPositions.length);
      let newPlusDot = remainingPositions[newPlusDotIndex];
      // not previous one
      if (prevPlusDot !== newPlusDot) {
        // check if not surrounded
        let isSurrounded = true;
        for (let i = 0; i < newPlusDot.shapes.length; i++) {
          if (
            newPlusDot.shapes[i].renderData === null ||
            newPlusDot.shapes[i].renderData.willBeCleared
          ) {
            isSurrounded = false;
            break;
          }
        }
        if (!isSurrounded) {
          this.plusDot = newPlusDot;
          break;
        }
      }
      remainingPositions.splice(newPlusDotIndex, 1);
    }
    this.addSealFlasher(this.plusDot.pos); // spawn animation
  },
  checkCollectPlus: function () {
    let isSurrounded = true;
    for (let i = 0; i < this.plusDot.shapes.length; i++) {
      if (this.plusDot.shapes[i].renderData === null) {
        isSurrounded = false;
        break;
      }
    }
    if (isSurrounded) {
      animations.adderScaler = 2;
      adder += 10;
      this.refreshPlusDot();
      return true;
    }
    return false;
  },

  initializeGame: function () {
    TUTORIAL.index = 0;

    startTime = Date.now(); // timer
    totalAdded = 0;
    totalScore = 0;
    multiplier = 2.0;
    adder = 0;
    temporaryAdder = 0;

    scoreCheckIndex = 0;
    animations = {
      resultDelay: 0,
      scoreCheckCountDown: 0,
      scoreScaler: 1,
      adderScaler: 1,
      multScaler: 1,
    };

    this.popupMessage = "";
    this.gameEnded = false;
    this.finalClearAll = false;
    this.outOfSpace = false;
    this.placeableGenIndex = 0;
    this.selectedPieceIndex = null;
    this.pendingCheckClear = false;
    this.pendingScoreCheck = false;
    this.isClearing = false;
    this.confirmHoveredPlaceable = null;

    this.placementFlashers = [];
    this.clearFlasers = [];
    this.numFlashers = [];
    this.sealFlashers = [];

    this.multColorIndex = null;
    this.refreshMult();
    this.turnsLeft = TURNS_PER_CHECK;
    this.plusDotIndex = null;
    this.refreshPlusDot();

    // make piece buttons (if no pieces)
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

    // reset each shape
    for (let i = 0; i < ALL_SHAPES.length; i++) {
      const shape = ALL_SHAPES[i];
      shape.renderData = null;
      if (shape.portalNeighbor) shape.portalNeighbor = null;
    }

    // reset portal lines
    activePortalLines = [];
    for (let i = 0; i < PORTAL_LINES.length; i++) {
      PORTAL_LINES[i].isActive = false;
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
      randomShape.renderData = newRenderData(shapeIsSquare(randomShape), i);
    }
  },

  spawnPortal: function () {
    // infinite-loop protect loop
    for (let ilp = 0; ilp < 1000; ilp++) {
      const PLIndex = randomInt(0, PORTAL_LINES.length);
      const thisPL = getPortalLine(PLIndex);
      // skip if this portal is already active
      if (thisPL.isActive) {
        continue;
      }
      // chance to skip if 1 of adjacent portals is also active
      else if (
        getPortalLine(PLIndex - 1).isActive ||
        getPortalLine(PLIndex + 1).isActive
      ) {
        if (random() < 0.9) {
          continue;
        }
      }
      const parnerPL = getPortalLine(PLIndex + 9); // plus half of total portals

      thisPL.isActive = true;
      parnerPL.isActive = true;
      activePortalLines.push(thisPL);
      activePortalLines.push(parnerPL);
      thisPL.shape.portalNeighbor = parnerPL.shape;
      parnerPL.shape.portalNeighbor = thisPL.shape;
      // spawn flashers
      for (let i = 0; i <= 1; i += 0.2) {
        this.addSealFlasher([
          thisPL.gridLine[1][0] +
            (thisPL.gridLine[0][0] - thisPL.gridLine[1][0]) * i,
          thisPL.gridLine[1][1] +
            (thisPL.gridLine[0][1] - thisPL.gridLine[1][1]) * i,
        ]);
      }
      for (let i = 0; i <= 1; i += 0.2) {
        this.addSealFlasher([
          parnerPL.gridLine[1][0] +
            (parnerPL.gridLine[0][0] - parnerPL.gridLine[1][0]) * i,
          parnerPL.gridLine[1][1] +
            (parnerPL.gridLine[0][1] - parnerPL.gridLine[1][1]) * i,
        ]);
      }
      break;
    }
    this.clearShapes(); // check clear again
  },

  renderPieces: function () {
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
        image(fShape.renderData.img, 0, 0, SHAPE_SIZE, SHAPE_SIZE);
        // render special
        if (fShape.renderData.special === "X") {
          rotate(-flyer.r - fShape.r - fShape.renderData.textureOri);
          noStroke();
          ellipse(0, 0, SEAL_SIZE, SEAL_SIZE);
          stroke(LIGHT_COLOR);
          line(-5, -5, 5, 5);
          line(-5, 5, 5, -5);
        } else if (fShape.renderData.special === "CHROMA") {
          // change texture after a bit
          if (frameCount % 30 === 0) {
            fShape.renderData.img = getRandomItem(
              (fShape.renderData.isSquare
                ? TEXTURE_LOADER.squareImages
                : TEXTURE_LOADER.triangleImages)[randomInt(0, 4)]
            );
            fShape.renderData.textureOri = fShape.renderData.isSquare
              ? randomInt(0, 4) * 90
              : randomInt(0, 3) * 120;
          }
          noStroke();
          ellipse(0, 0, 10, 10);
        }
        pop(); // popMatrix(); // KA
      }
      pop(); // popMatrix(); // KA

      // update flyer animation
      let targetPos = flyer.default.pos;
      let targetRotation = flyer.r;
      // is selected piece?
      if (pieceIndices[i] === this.selectedPieceIndex) {
        // check to show tooltip: no space
        if (
          this.placeableGenIndex > 3 &&
          this.pieces[pieceIndices[i]].placeables.length === 0
        ) {
          tooltip.set("No possible placement.", [265, 50]);
        }

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
        cursor(HAND);
        break;
      }
    }
  },

  renderPlacedShapes: function () {
    fill(DARK_COLOR);
    strokeWeight(5);
    for (let i = 0; i < ALL_SHAPES.length; i++) {
      const shape = ALL_SHAPES[i];
      if (shape.renderData === null) continue;
      push(); // pushMatrix(); // KA
      translate(shape.centerPos[0], shape.centerPos[1]);
      rotate(GRID_ORI[shape.shapeIndex] + shape.renderData.textureOri);
      image(shape.renderData.img, 0, 0, SHAPE_SIZE, SHAPE_SIZE);
      // render special
      if (shape.renderData.special === "X") {
        rotate(-GRID_ORI[shape.shapeIndex] - shape.renderData.textureOri);
        noStroke();
        ellipse(0, 0, SEAL_SIZE, SEAL_SIZE);
        stroke(LIGHT_COLOR);
        line(-5, -5, 5, 5);
        line(-5, 5, 5, -5);
        // tooltip
        if (
          PLAY_SCENE.selectedPieceIndex === null &&
          dist(mouseX, mouseY, shape.centerPos[0], shape.centerPos[1]) <
            SEAL_SIZE / 2
        ) {
          tooltip.set(
            "Clear this shape\nto increase\nMULTIPLIER by 0.1",
            [230, 85]
          );
        }
      } else if (shape.renderData.special === "CHROMA") {
        // change texture after a bit
        if (frameCount % 30 === 0) {
          shape.renderData.img = getRandomItem(
            (shape.renderData.isSquare
              ? TEXTURE_LOADER.squareImages
              : TEXTURE_LOADER.triangleImages)[randomInt(0, 4)]
          );
          shape.renderData.textureOri = shape.renderData.isSquare
            ? randomInt(0, 4) * 90
            : randomInt(0, 3) * 120;
        }
        noStroke();
        ellipse(0, 0, 10, 10);
        // tooltip
        if (
          PLAY_SCENE.selectedPieceIndex === null &&
          dist(mouseX, mouseY, shape.centerPos[0], shape.centerPos[1]) <
            SEAL_SIZE / 2
        ) {
          tooltip.set(
            "This shape matches color\nwith all adjacents.",
            [280, 60]
          );
        }
      }
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
      if (this.turnsLeft === 0) this.pendingScoreCheck = true;
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
        _playSound(sounds.shapeCleared, temporaryAdder * 0.1);
        this.numFlashers.push({
          pos: fl.shape.centerPos,
          addedScore:
            "+" +
            floor(
              adder + temporaryAdder * (this.multIsActive ? multiplier : 1)
            ),
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
    rect(75, 55, 130, 60, 10);
    fill(LIGHT_COLOR);
    text(
      animations.resultDelay > 0 ? "+" + floor(totalAdded) : floor(totalScore),
      75,
      57
    );

    // tooltip
    if (
      PLAY_SCENE.selectedPieceIndex === null &&
      mouseX > 10 &&
      mouseX < 140 &&
      mouseY > 25 &&
      mouseY < 85
    ) {
      tooltip.set(
        "Psst... when you pass\nthe last score check,\nall shapes will be\ncleared. Try to have\nmany shapes by then.",
        [255, 130]
      );
    }
  },

  renderScoreCheck: function () {
    fill(DARK_COLOR);
    rect(525, 58, 120, 76, 10);
    textSize(40);
    fill(LIGHT_COLOR);
    text(SCORE_CHECK_AMOUNTS[scoreCheckIndex], 525, 50);
    textSize(20);
    // flash when less than 3 turns
    fill(
      this.turnsLeft < 3
        ? color(LIGHT_COLOR, 150 + cos(frameCount * 5) * 100)
        : LIGHT_COLOR
    );
    text(this.turnsLeft + " left", 525, 80);

    // line through if score already met
    if (totalScore >= SCORE_CHECK_AMOUNTS[scoreCheckIndex]) {
      stroke(LIGHT_COLOR);
      strokeWeight(3);
      line(480, 47, 570, 47);
      noStroke();
    }

    // tooltip
    if (
      PLAY_SCENE.selectedPieceIndex === null &&
      mouseX > 465 &&
      mouseX < 585 &&
      mouseY > 20 &&
      mouseY < 96
    ) {
      tooltip.set(
        `SCORE CHECK #${scoreCheckIndex + 1}: get\n${
          SCORE_CHECK_AMOUNTS[scoreCheckIndex]
        } score to pass,\n${this.turnsLeft} turns remaining.`,
        [235, 90]
      );
    }
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

    // tooltip
    if (
      PLAY_SCENE.selectedPieceIndex === null &&
      dist(mouseX, mouseY, 70, 400) < 40
    ) {
      tooltip.set(
        `MULTIPLIER: x${multiplier.toFixed(
          1
        )} all\nscore gained when\nclearing ${
          SHAPES_COLORS_NAMES[this.multColorIndex]
        } shapes.\nChange color after.`,
        [250, 110]
      );
    }
  },

  renderAdder: function () {
    const spinTime = -frameCount * (1 + adder * 0.05);
    fill(LIGHT_COLOR);
    arc(530, 400, 85, 85, spinTime - 50, spinTime);
    arc(530, 400, 85, 85, spinTime - 230, spinTime - 180);
    fill(DARK_COLOR);
    ellipse(530, 400, 80, 80);
    fill(LIGHT_COLOR);
    textSize(28 * animations.adderScaler);
    animations.adderScaler = max(1, animations.adderScaler - TEXT_SHRINK_SPEED);
    text("+" + (adder + temporaryAdder), 530, 400);

    // tooltip
    if (
      PLAY_SCENE.selectedPieceIndex === null &&
      dist(mouseX, mouseY, 530, 400) < 40
    ) {
      tooltip.set(
        "ADDER: Each shape cleared\ntemporarily +10 ADDER.\n(extra score for more\nshapes cleared in 1 turn)",
        [295, 110]
      );
    }
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
    // animations completed?
    if (animations.resultDelay-- === 0) {
      temporaryAdder = 0; // reset to base adder
      animations.adderScaler = 2;
      totalScore += totalAdded;
      animations.scoreScaler = 2;
      if (this.multIsActive) this.refreshMult();
      this.isClearing = false;
    }
  },

  addSealFlasher: function (pos) {
    this.sealFlashers.push({ pos: pos, progress: 0 });
  },
  renderSealFlashers: function () {
    noStroke();
    for (let i = this.sealFlashers.length - 1; i >= 0; i--) {
      const fl = this.sealFlashers[i];
      fl.progress += 0.03; // seal flasher speed
      fill(LIGHT_COLOR, min(255, (1 - fl.progress) * 300));
      ellipse(fl.pos[0], fl.pos[1], SEAL_SIZE, SEAL_SIZE);
      if (fl.progress >= 1) this.sealFlashers.splice(i, 1);
    }
  },

  render: function () {
    // reset
    this.hoveredPlaceable = null;
    tooltip.isShown = false;

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

    noStroke();
    this.renderNumFlashers();
    this.renderClearFlashers();

    // render grid lines
    stroke(GRID_COLOR);
    strokeWeight(2);
    for (let i = 0; i < GRID_LINES.length; i++) {
      const l = GRID_LINES[i];
      if (l === null) continue;
      line(l[0][0], l[0][1], l[1][0], l[1][1]);
    }

    // render portal lines
    strokeWeight(7);
    for (let i = 0; i < activePortalLines.length; i++) {
      const { gridLine, shape } = activePortalLines[i];
      stroke(255);
      line(gridLine[0][0], gridLine[0][1], gridLine[1][0], gridLine[1][1]);

      if (
        (this.selectedPieceIndex === null) &
        lineIsHovered(gridLine[0], gridLine[1])
      ) {
        fill(255, 100 + cos(frameCount * 7) * 50);
        noStroke();
        beginShape();
        for (let v = 0; v < shape.points.length; v++) {
          vertex(shape.points[v][0], shape.points[v][1]);
        }
        endShape(CLOSE);
        // the other shape
        beginShape();
        for (let v = 0; v < shape.portalNeighbor.points.length; v++) {
          vertex(
            shape.portalNeighbor.points[v][0],
            shape.portalNeighbor.points[v][1]
          );
        }
        endShape(CLOSE);
        // tooltip
        tooltip.set(
          "PORTAL: allows these 2\nshapes to be adjacent.",
          [260, 60]
        );
      }
    }

    // render placeable hints
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

    // render plus dot
    noStroke();
    fill(LIGHT_COLOR);
    ellipse(this.plusDot.pos[0], this.plusDot.pos[1], SEAL_SIZE, SEAL_SIZE);
    stroke(DARK_COLOR);
    strokeWeight(5);
    line(
      this.plusDot.pos[0],
      this.plusDot.pos[1] - 6,
      this.plusDot.pos[0],
      this.plusDot.pos[1] + 6
    );
    line(
      this.plusDot.pos[0] - 6,
      this.plusDot.pos[1],
      this.plusDot.pos[0] + 6,
      this.plusDot.pos[1]
    );
    // tooltip & highlight shapes
    if (
      PLAY_SCENE.selectedPieceIndex === null &&
      dist(mouseX, mouseY, this.plusDot.pos[0], this.plusDot.pos[1]) <
        SEAL_SIZE / 2
    ) {
      tooltip.set(
        "Completely surround\nthis to permanently\n+10 ADDER.",
        [235, 85]
      );
      noStroke();
      fill(255, 30 + cos(frameCount * 7) * 30);
      for (let i = 0; i < this.plusDot.shapes.length; i++) {
        const points = this.plusDot.shapes[i].points;
        beginShape();
        for (let j = 0; j < points.length; j++) {
          vertex(points[j][0], points[j][1]);
        }
        endShape(CLOSE);
      }
    }
    this.renderSealFlashers();

    // render button frame
    for (let i = 0; i < 3; i++) {
      this.pieceBtns[i].render();
    }
    fill(DARK_COLOR);
    strokeWeight(5);
    this.renderPieces();

    // show confirm
    if (START_SCENE.touchscreenOn && this.confirmHoveredPlaceable !== null) {
      if (this.confirmHoveredPlaceable !== this.hoveredPlaceable) {
        this.confirmHoveredPlaceable = null;
      } else {
        tooltip.set("Tap it again to place.", [255, 40]);
      }
    }

    tooltip.render();

    let setMessage = false;

    // do score check & out of space check
    if (this.pendingScoreCheck && !this.isClearing) {
      this.pendingScoreCheck = false;
      // enough score?
      if (totalScore >= SCORE_CHECK_AMOUNTS[scoreCheckIndex]) {
        this.popupMessage = "Score check passed";
        setMessage = true;
        // any more score checks? continue
        if (scoreCheckIndex < SCORE_CHECK_AMOUNTS.length - 1) {
          scoreCheckIndex++;
          this.turnsLeft = TURNS_PER_CHECK;
          this.spawnPortal();
        }
        // last check?
        else {
          this.gameEnded = true;
          this.finalClearAll = true;
        }
      } else {
        this.popupMessage = "Score check failed";
        setMessage = true;
        this.gameEnded = true;
      }
    }

    // out of space check
    if (this.outOfSpace && !this.gameEnded) {
      this.gameEnded = true;
      this.popupMessage = "Out of space";
      setMessage = true;
    }

    // set message?
    if (setMessage) animations.scoreCheckCountDown = GAME_MESSAGE_DURATION;
    // render message
    if (animations.scoreCheckCountDown > 0) {
      let factor = 1;
      if (animations.scoreCheckCountDown < GMAD) {
        // intro animation
        factor = animations.scoreCheckCountDown / GMAD;
      } else if (
        animations.scoreCheckCountDown >
        GAME_MESSAGE_DURATION - GMAD
      ) {
        // outro animation
        factor =
          (GAME_MESSAGE_DURATION - animations.scoreCheckCountDown) / GMAD;
      }
      noStroke();
      fill(DARK_COLOR);
      rect(300, 250, width, 100 * factor);
      fill(LIGHT_COLOR, factor * 255);
      textSize(40);
      text(this.popupMessage, 300, 250);
      animations.scoreCheckCountDown--;
      // message finish?
      if (animations.scoreCheckCountDown === 0) {
        if (this.gameEnded && !this.finalClearAll) {
          SCENE_TRANSITION.switchScene("END");
        }
      }
    }

    // final clear updates
    if (this.finalClearAll && !this.finalClearAllStarted) {
      this.clearShapes();
      this.finalClearAllStarted = true;
    }
    if (
      this.finalClearAllStarted &&
      this.clearFlasers.length === 0 &&
      animations.resultDelay < 0
    ) {
      this.finalClearAllStarted = false;
      this.finalClearAll = false;
      SCENE_TRANSITION.switchScene("END");
    }

    TUTORIAL.update();
  },

  mouseClicked: function () {
    // placing a piece (hovering on placeable & no more flashers)
    if (this.hoveredPlaceable !== null) {
      // cancel if still calculating placeables OR not added last score OR game over
      if (this.placeableGenIndex < 4 || this.isClearing || this.gameEnded) {
        return;
      }

      if (START_SCENE.touchscreenOn) {
        if (this.confirmHoveredPlaceable === null) {
          this.confirmHoveredPlaceable = this.hoveredPlaceable;
          return;
        }
        this.confirmHoveredPlaceable = null;
      }

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
      // make new piece
      this.pieces[this.selectedPieceIndex] = generatePiece(
        this.selectedPieceIndex
      );
      for (let i = 0; i < this.pieces.length; i++) {
        this.pieces[i].placeables = []; // clear all placeables
      }
      this.selectedPieceIndex = null; // deselect
      this.placeableGenIndex = 0; // trigger recalculate
      this.pendingCheckClear = true;
      this.turnsLeft--;
      _playSound(sounds.piecePlaced, 2);
      return;
    }

    // piece button clicked
    for (let i = 0; i < this.pieceBtns.length; i++) {
      if (this.pieceBtns[i].isHovered) return this.pieceBtns[i].clicked();
    }
  },

  pieceBtnClicked: function (pieceIndex) {
    if (this.gameEnded || this.outOfSpace) return;
    this.selectedPieceIndex =
      this.selectedPieceIndex !== pieceIndex ? pieceIndex : null;
    if (START_SCENE.tutorialOn && TUTORIAL.index === 0) {
      TUTORIAL.popupProgress = 1;
    }
  },

  // check to clear
  clearShapes: function () {
    const checkedShapes = {};
    const groups = [];
    let clearedShapes = [];

    // final clear (won) would clear all shapes
    if (this.finalClearAll) {
      for (let i = 0; i < ALL_SHAPES.length; i++) {
        if (ALL_SHAPES[i].renderData !== null) {
          clearedShapes.push(ALL_SHAPES[i]);
        }
      }
    }
    // normal clearing
    else {
      for (let i = 0; i < ALL_SHAPES.length; i++) {
        if (
          ALL_SHAPES[i].renderData === null ||
          ALL_SHAPES[i].renderData.special === "CHROMA"
        ) {
          continue;
        }
        checkShape(ALL_SHAPES[i], checkedShapes, groups, [], true);
      }
      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        if (group.length >= 4) clearedShapes = clearedShapes.concat(group);
      }
      clearedShapes.sort(function (shapeA, shapeB) {
        return shapeA.centerPos[0] - shapeB.centerPos[0];
      });
    }

    this.isClearing = clearedShapes.length > 0;

    const chromas = [];
    let delayCounter = 0;
    let applyExtraDelay = this.checkCollectPlus();
    for (let i = 0; i < clearedShapes.length; i++) {
      const cs = clearedShapes[i];

      // skip this chroma shape in group if already added
      if (cs.renderData.special === "CHROMA") {
        if (chromas.includes(cs)) continue;
        chromas.push(cs);
      }

      // activate mult (not chroma & match color with mult color)
      if (
        cs.renderData.special !== "CHROMA" &&
        cs.renderData.colorIndex === this.multColorIndex
      ) {
        this.multIsActive = true;
      }
      // consume seal
      if (cs.renderData.special === "X") {
        applyExtraDelay = true;
        cs.renderData.special = "NONE";
        multiplier += 0.1;
        animations.multScaler = 2;
        this.addSealFlasher(cs.centerPos);
      }
      cs.renderData.willBeCleared = true;
      this.clearFlasers.push({
        delay: delayCounter++ * CLEAR_DELAY,
        shape: cs,
        progress: 0,
        textProgress: 0,
      });
    }
    totalAdded = 0; // reset added sum from last turn
    if (applyExtraDelay) {
      _playSound(sounds.piecePlaced, 6);
      for (let i = 0; i < this.clearFlasers.length; i++) {
        this.clearFlasers[i].delay += UPGRADE_DELAY;
      }
    }
  },
};

function checkShape(
  shape,
  checkedShapes,
  groups,
  currentGroup,
  doesAddToGroups // for the first shape in group only
) {
  // empty or already checked
  if (shape.renderData === null || checkedShapes[shape.shapeID]) return;

  // if is chroma, check if already added to group
  if (shape.renderData.special === "CHROMA") {
    // exit if already added this to group
    if (currentGroup.includes(shape)) {
      return;
    }
  } else {
    checkedShapes[shape.shapeID] = true; // mark checked if not chroma
  }

  currentGroup.push(shape); // add self to group
  if (doesAddToGroups) groups.push(currentGroup);
  const neighbors = shape.nShapes.slice(0);
  if (shape.portalNeighbor) {
    neighbors.push(shape.portalNeighbor);
  }
  for (let nb = 0; nb < neighbors.length; nb++) {
    const nShape = neighbors[nb];
    // jump to that shape if same color OR is chroma
    if (
      nShape &&
      nShape.renderData !== null &&
      (nShape.renderData.colorIndex === currentGroup[0].renderData.colorIndex ||
        nShape.renderData.special === "CHROMA")
    ) {
      checkShape(nShape, checkedShapes, groups, currentGroup);
    }
  }
}

const TUTORIAL = {
  index: 0,
  popupAlpha: 1,
  popupProgress: 0,
  x: 300,
  y: 40,
  h: 80,
  msg: null,
  update: function () {
    if (!START_SCENE.tutorialOn || this.index > 3) {
      return;
    }
    const PS = PLAY_SCENE;
    switch (this.index) {
      // select piece and place
      case 0:
        // didn't place a piece yet?
        if (PS.turnsLeft === TURNS_PER_CHECK) {
          if (PS.selectedPieceIndex === null) {
            this.msg = "Welcome! Select a piece below.";
          } else {
            this.msg = "Move it to a yellow dot\nthen click to place.";
          }
        } else {
          this.nextTutorial();
        }
        break;
      case 1:
        this.msg =
          "Link 4 or more shapes with the\nsame color together to clear them.";
        // close when score
        if (totalScore !== 0) {
          this.nextTutorial();
        }
        break;
      case 2:
        this.msg = "Hover on stuffs to\nlearn more about them.";
        // close when select piece
        if (PLAY_SCENE.selectedPieceIndex !== null) {
          this.nextTutorial();
        }
        break;
      case 3:
        this.msg = "Pass 5 score checks to win.\nGood luck!";
        // close when place
        if (PLAY_SCENE.placementFlashers.length !== 0) {
          this.nextTutorial();
        }
        break;
    }
    // check hover to hide
    if (mouseY < this.y + this.h / 2) {
      this.popupAlpha = max(0, this.popupAlpha - 0.2);
    } else {
      this.popupAlpha = min(1, this.popupAlpha + 0.2);
    }
    noStroke();
    fill(0, this.popupAlpha * 220);
    rect(this.x, this.y, width, this.h);
    fill(LIGHT_COLOR, this.popupAlpha * 255);
    textSize(24);
    text(this.msg, this.x, this.y);
    if (this.popupProgress > 0) {
      fill(255, this.popupProgress * 120);
      rect(this.x, this.y, width, this.h);
      this.popupProgress = max(0, this.popupProgress - 0.05);
    }
  },
  nextTutorial: function () {
    if (this.index < 3) {
      this.popupProgress = 1;
    } else {
      START_SCENE.tutorialOn = false;
    }
    this.index++;
  },
};
