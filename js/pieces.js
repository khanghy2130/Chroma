const PIECE_TYPES = [
  // 1 shape
  ["T", "S"],
  // 2 shapes
  ["TT", "TS"],
  // 3 shapes
  ["STT", "TTS", "STS", "TST-", "TST^"],
];

// return Piece: {type, flyer, placeables}
function generatePiece(pieceIndex) {
  // determine type
  const randomNum = random(100);
  let shapesCountIndex;
  // 10%, 35%, 55%
  if (randomNum < 10) shapesCountIndex = 0;
  else if (randomNum < 10 + 35) shapesCountIndex = 1;
  else shapesCountIndex = 2;
  const type = getRandomItem(PIECE_TYPES[shapesCountIndex]);

  const btnPos = [
    PLAY_SCENE.pieceBtns[pieceIndex].x,
    PLAY_SCENE.pieceBtns[pieceIndex].y,
  ];
  return {
    type: type,
    flyer: generatePieceFlyer(type, btnPos),
    placeables: null,
  };
}

// return Flyer: { fShapes, dPos, pos, r, scaling }
// FShape: { renderData(see grid), r, pos, }
function generatePieceFlyer(type, btnPos) {
  const flyer = {
    fShapes: [],
    dPos: btnPos, // could be modified by type
    pos: null,
    r: 0,
    scaling: 0,
  };
  switch (type) {
    case "T":
      // center triangle
      flyer.fShapes.push({
        renderData: newRenderData(false, true),
        r: 0,
        pos: [0, 0],
      });
      flyer.dPos[1] += 10;
      break;
    case "S":
      // center square
      flyer.fShapes.push({
        renderData: newRenderData(true, true),
        r: 0,
        pos: [0, 0],
      });
      break;
  }

  flyer.pos = [flyer.dPos[0], flyer.dPos[1]]; // set render pos to default
  return flyer;
}

/*
  T: {
    centerShapeIndices: [0,1,2,3], // ALL TRIANGLES
  }
  S: {
    centerShapeIndices: [4,5], // ALL SQUARES
  }
  
  TT: {
    centerShapeIndices: [0,1,2,3], // ALL TRIANGLES
    REQUIRE THE NEIGHBOR TRIANGLE
  }
  TS: {
    centerShapeIndices: [4,5], // ALL SQUARES
    EDGE: CHECK ALL 4 NEIGHBOR TRIANGLES
  }

  STT: {
    centerShapeIndices: [4], // LEFT SQUARE
    EDGE: CHECK ALL 4 NEIGHBOR TRIANGLES
  }
  TTS: {
    centerShapeIndices: [5], // RIGHT SQUARE
    EDGE: CHECK ALL 4 NEIGHBOR TRIANGLES
  }

  STS: {
    centerShapeIndices: [0,1,2,3], // ALL TRIANGLES
  }
  TST-: {
    centerShapeIndices: [4,5], // ALL SQUARES
  }
  TST^: {
    centerShapeIndices: [4,5], // ALL SQUARES
  }

*/
