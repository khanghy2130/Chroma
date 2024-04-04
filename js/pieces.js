const PIECE_TYPES = [
  // 1 shape
  ["T", "S"],
  // 2 shapes
  ["TT", "ST"],
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

  const btnCenterPos = [
    PLAY_SCENE.pieceBtns[pieceIndex].x,
    PLAY_SCENE.pieceBtns[pieceIndex].y,
  ];
  return {
    type: type,
    flyer: generatePieceFlyer(type, btnCenterPos),
    placeables: null,
  };
}

// return Flyer: { fShapes, default{pos,r}, pos, r, scaling }
// FShape: { renderData(see grid), r, pos, }
function generatePieceFlyer(type, btnCenterPos) {
  const flyer = {
    fShapes: [],
    default: {
      // could be modified by type
      pos: btnCenterPos,
      r: 0,
    },
    pos: null,
    r: 0,
    scaling: 0,
  };

  const MS = CORES[4].shapes; // model shapes
  const MS2 = CORES[6].shapes; // other core
  let midPos;
  switch (type) {
    case "T":
      // center triangle
      flyer.fShapes.push({
        renderData: newRenderData(false, true),
        r: 0,
        pos: [0, 0],
      });
      flyer.default.pos[1] += 10;
      break;
    case "S":
      // center square
      flyer.fShapes.push({
        renderData: newRenderData(true, true),
        r: 0,
        pos: [0, 0],
      });
      break;

    case "TT":
      // center triangle
      flyer.fShapes.push({
        renderData: newRenderData(false),
        r: 0,
        pos: [0, 0],
      });
      // other triangle
      flyer.fShapes.push({
        renderData: newRenderData(false),
        r: GRID_ORI[1],
        pos: [
          MS[1].centerPos[0] - MS[0].centerPos[0],
          MS[1].centerPos[1] - MS[0].centerPos[1],
        ],
      });
      flyer.default.pos[0] += 20;
      flyer.default.r = 90;
      break;
    case "ST":
      midPos = [
        (MS[4].points[1][0] + MS[4].points[2][0]) / 2,
        (MS[4].points[1][1] + MS[4].points[2][1]) / 2,
      ];
      // center square
      flyer.fShapes.push({
        renderData: newRenderData(true),
        r: GRID_ORI[4],
        pos: [MS[4].centerPos[0] - midPos[0], MS[4].centerPos[1] - midPos[1]],
      });
      flyer.fShapes.push({
        renderData: newRenderData(false),
        r: GRID_ORI[1],
        pos: [MS[1].centerPos[0] - midPos[0], MS[1].centerPos[1] - midPos[1]],
      });

      flyer.default.pos[0] += 10;
      flyer.default.r = 30;
      break;

    case "TST-":
      midPos = [
        (MS[4].points[1][0] + MS[4].points[2][0]) / 2,
        (MS[4].points[1][1] + MS[4].points[2][1]) / 2,
      ];
      // square
      flyer.fShapes.push({
        renderData: newRenderData(true),
        r: GRID_ORI[4],
        pos: [MS[4].centerPos[0] - midPos[0], MS[4].centerPos[1] - midPos[1]],
      });
      // triangle front
      flyer.fShapes.push({
        renderData: newRenderData(false),
        r: GRID_ORI[1],
        pos: [MS[1].centerPos[0] - midPos[0], MS[1].centerPos[1] - midPos[1]],
      });
      // triangle back
      flyer.fShapes.push({
        renderData: newRenderData(false),
        r: GRID_ORI[0],
        pos: [MS2[0].centerPos[0] - midPos[0], MS2[0].centerPos[1] - midPos[1]],
      });

      flyer.default.pos[0] += 35;
      flyer.default.r = 30;
      break;
    case "TST^":
      midPos = [
        (MS[4].points[1][0] + MS[4].points[2][0]) / 2,
        (MS[4].points[1][1] + MS[4].points[2][1]) / 2,
      ];
      // square
      flyer.fShapes.push({
        renderData: newRenderData(true),
        r: GRID_ORI[4],
        pos: [MS[4].centerPos[0] - midPos[0], MS[4].centerPos[1] - midPos[1]],
      });
      // triangle right (facing down)
      flyer.fShapes.push({
        renderData: newRenderData(false),
        r: GRID_ORI[1],
        pos: [MS[1].centerPos[0] - midPos[0], MS[1].centerPos[1] - midPos[1]],
      });
      // triangle left (facing down)
      flyer.fShapes.push({
        renderData: newRenderData(false),
        r: GRID_ORI[2],
        pos: [MS[2].centerPos[0] - midPos[0], MS[2].centerPos[1] - midPos[1]],
      });

      flyer.default.pos[0] += 24;
      flyer.default.pos[1] += 12;
      flyer.default.r = 75;
      break;

    case "STT":
      midPos = [
        (MS[4].points[2][0] + MS[4].points[3][0]) / 2,
        (MS[4].points[2][1] + MS[4].points[3][1]) / 2,
      ];
      // square
      flyer.fShapes.push({
        renderData: newRenderData(true),
        r: GRID_ORI[4],
        pos: [MS[4].centerPos[0] - midPos[0], MS[4].centerPos[1] - midPos[1]],
      });
      // triangle adjacent to square
      flyer.fShapes.push({
        renderData: newRenderData(false),
        r: GRID_ORI[2],
        pos: [MS[2].centerPos[0] - midPos[0], MS[2].centerPos[1] - midPos[1]],
      });
      // other triangle
      flyer.fShapes.push({
        renderData: newRenderData(false),
        r: GRID_ORI[3],
        pos: [MS[3].centerPos[0] - midPos[0], MS[3].centerPos[1] - midPos[1]],
      });

      flyer.default.pos[0] -= 5;
      flyer.default.pos[1] += 15;
      flyer.default.r = 330;
      break;
    case "TTS":
      midPos = [
        (MS[5].points[3][0] + MS[5].points[0][0]) / 2,
        (MS[5].points[3][1] + MS[5].points[0][1]) / 2,
      ];

      // other triangle
      flyer.fShapes.push({
        renderData: newRenderData(false),
        r: GRID_ORI[2],
        pos: [MS[2].centerPos[0] - midPos[0], MS[2].centerPos[1] - midPos[1]],
      });
      // triangle adjacent to square
      flyer.fShapes.push({
        renderData: newRenderData(false),
        r: GRID_ORI[3],
        pos: [MS[3].centerPos[0] - midPos[0], MS[3].centerPos[1] - midPos[1]],
      });
      // square
      flyer.fShapes.push({
        renderData: newRenderData(true),
        r: GRID_ORI[5],
        pos: [MS[5].centerPos[0] - midPos[0], MS[5].centerPos[1] - midPos[1]],
      });

      flyer.default.pos[0] += 5;
      flyer.default.pos[1] += 15;
      flyer.default.r = 30;
      break;

    case "STS":
      // center triangle
      flyer.fShapes.push({
        renderData: newRenderData(false),
        r: GRID_ORI[1],
        pos: [0, 0],
      });
      // square left (facing down)
      flyer.fShapes.push({
        renderData: newRenderData(true),
        r: GRID_ORI[4],
        pos: [
          MS[4].centerPos[0] - MS[1].centerPos[0],
          MS[4].centerPos[1] - MS[1].centerPos[1],
        ],
      });
      // square right (facing down)
      flyer.fShapes.push({
        renderData: newRenderData(true),
        r: GRID_ORI[5],
        pos: [
          MS[5].centerPos[0] - MS[1].centerPos[0],
          MS[5].centerPos[1] - MS[1].centerPos[1],
        ],
      });
      flyer.default.pos[1] -= 22;
      break;
  }

  // apply default to render
  flyer.pos = flyer.default.pos.slice(0);
  flyer.r = flyer.default.r;
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
