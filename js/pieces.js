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
  const randomNum = random(100);
  let shapesCountIndex;
  // 20%, 40%, 40%
  if (randomNum < 20 && turnsCount > 0) shapesCountIndex = 0;
  else if (randomNum < 20 + 40) shapesCountIndex = 1;
  else shapesCountIndex = 2;
  const type = getRandomItem(PIECE_TYPES[shapesCountIndex]);

  // check if already have this type (unless it's 1 shape)
  // if (shapesCountIndex !== 0) {
  for (let i = 0; i < PLAY_SCENE.pieces.length; i++) {
    if (i === pieceIndex) continue;
    if (PLAY_SCENE.pieces[i].type === type) {
      return generatePiece(pieceIndex); // reroll
    }
  }
  // }

  const btnCenterPos = [
    PLAY_SCENE.pieceBtns[pieceIndex].x,
    PLAY_SCENE.pieceBtns[pieceIndex].y,
  ];
  return {
    type: type,
    flyer: generatePieceFlyer(type, btnCenterPos),
    placeables: [],
  };
}

// return Flyer: { fShapes, default{pos,r}, pos, r, scaling }
// FShape: { renderData(see grid), r, pos, }
function generatePieceFlyer(type, btnCenterPos) {
  const flyer = {
    fShapes: [],
    // could be modified by type
    default: { pos: btnCenterPos, r: 0 },
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
        renderData: newRenderData(false),
        r: 0,
        pos: [0, 0],
      });
      flyer.default.pos[1] += 10;
      break;
    case "S":
      // center square
      flyer.fShapes.push({
        renderData: newRenderData(true),
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

// Placeable: { pos, r, shapes[] (same order as fShapes) }
function generatePlaceables() {
  // don't generate if there are still flashers
  if (
    PLAY_SCENE.placementFlashers.length > 0 ||
    PLAY_SCENE.clearFlasers.length > 0
  )
    return;
  // check out of space if placeableGenIndex is 3
  if (PLAY_SCENE.placeableGenIndex === 3) {
    let outOfSpace = true;
    for (let i = 0; i < PLAY_SCENE.pieces.length; i++) {
      if (PLAY_SCENE.pieces[i].placeables.length > 0) {
        outOfSpace = false;
        break;
      }
    }
    if (outOfSpace) {
      PLAY_SCENE.outOfSpace = outOfSpace;
      //// trigger lost
    }
    PLAY_SCENE.placeableGenIndex++;
  }
  if (PLAY_SCENE.placeableGenIndex >= 3) return;

  const piece = PLAY_SCENE.pieces[PLAY_SCENE.placeableGenIndex];
  const placeables = [];

  switch (piece.type) {
    case "T":
      for (let i = 0; i < ALL_TRIANGLES.length; i++) {
        const t = ALL_TRIANGLES[i];
        if (t.renderData === null) {
          placeables.push({
            pos: t.centerPos,
            r: GRID_ORI[t.shapeIndex],
            shapes: [t],
          });
        }
      }
      break;
    case "S":
      for (let i = 0; i < ALL_SQUARES.length; i++) {
        const s = ALL_SQUARES[i];
        if (s.renderData === null) {
          placeables.push({
            pos: s.centerPos,
            r: GRID_ORI[s.shapeIndex],
            shapes: [s],
          });
        }
      }
      break;

    case "TT":
      for (let i = 0; i < ALL_TRIANGLES.length; i++) {
        const t = ALL_TRIANGLES[i];
        if (
          t.renderData === null &&
          t.nShapes[0] &&
          t.nShapes[0].renderData === null
        ) {
          const ORI = [0, 180, 270, 90];
          placeables.push({
            pos: t.centerPos,
            r: ORI[t.shapeIndex],
            shapes: [t, t.nShapes[0]],
          });
        }
      }
      break;
    case "ST":
      for (let i = 0; i < ALL_SQUARES.length; i++) {
        const s = ALL_SQUARES[i];
        if (s.renderData === null) {
          // check the 4 neighbor triangles
          for (let nb = 0; nb < s.nShapes.length; nb++) {
            if (s.nShapes[nb] && s.nShapes[nb].renderData === null) {
              const midPos = [
                (s.points[nsi(nb)][0] + s.points[nsi(1 + nb)][0]) / 2,
                (s.points[nsi(nb)][1] + s.points[nsi(1 + nb)][1]) / 2,
              ];
              const r = s.shapeIndex === 5 ? 120 : 90;
              placeables.push({
                pos: midPos,
                r: nb * 90 - r,
                shapes: [s, s.nShapes[nb]],
              });
            }
          }
        }
      }
      break;

    case "TST-":
      for (let i = 0; i < ALL_SQUARES.length; i++) {
        const s = ALL_SQUARES[i];
        if (s.renderData === null) {
          // check the 4 neighbor triangles
          for (let nb = 0; nb < s.nShapes.length; nb++) {
            if (s.nShapes[nb] && s.nShapes[nb].renderData === null) {
              const otherT = s.nShapes[nsi(nb + 2)];
              if (otherT && otherT.renderData === null) {
                const midPos = [
                  (s.points[nsi(nb)][0] + s.points[nsi(1 + nb)][0]) / 2,
                  (s.points[nsi(nb)][1] + s.points[nsi(1 + nb)][1]) / 2,
                ];
                const r = s.shapeIndex === 5 ? 120 : 90;
                placeables.push({
                  pos: midPos,
                  r: nb * 90 - r,
                  shapes: [s, s.nShapes[nb], otherT],
                });
              }
            }
          }
        }
      }
      break;
    case "TST^":
      for (let i = 0; i < ALL_SQUARES.length; i++) {
        const s = ALL_SQUARES[i];
        if (s.renderData === null) {
          // check the 4 neighbor triangles
          for (let nb = 0; nb < s.nShapes.length; nb++) {
            if (s.nShapes[nb] && s.nShapes[nb].renderData === null) {
              const otherT = s.nShapes[nsi(nb + 1)];
              if (otherT && otherT.renderData === null) {
                const midPos = [
                  (s.points[nsi(nb)][0] + s.points[nsi(1 + nb)][0]) / 2,
                  (s.points[nsi(nb)][1] + s.points[nsi(1 + nb)][1]) / 2,
                ];
                const r = s.shapeIndex === 5 ? 120 : 90;
                placeables.push({
                  pos: midPos,
                  r: nb * 90 - r,
                  shapes: [s, s.nShapes[nb], otherT],
                });
              }
            }
          }
        }
      }
      break;

    case "STT":
      for (let i = 0; i < ALL_SQUARES.length; i++) {
        const s = ALL_SQUARES[i];
        if (s.shapeIndex === 4 && s.renderData === null) {
          // check the 4 neighbor triangles
          for (let nb = 0; nb < s.nShapes.length; nb++) {
            const t1 = s.nShapes[nb];
            if (t1 && t1.renderData === null) {
              const t2 = t1.nShapes[0];
              if (t2 && t2.renderData === null) {
                const midPos = [
                  (s.points[nsi(nb)][0] + s.points[nsi(1 + nb)][0]) / 2,
                  (s.points[nsi(nb)][1] + s.points[nsi(1 + nb)][1]) / 2,
                ];
                placeables.push({
                  pos: midPos,
                  r: nb * 90 - 180,
                  shapes: [s, t1, t2],
                });
              }
            }
          }
        }
      }
      break;
    case "TTS":
      for (let i = 0; i < ALL_SQUARES.length; i++) {
        const s = ALL_SQUARES[i];
        if (s.shapeIndex === 5 && s.renderData === null) {
          // check the 4 neighbor triangles
          for (let nb = 0; nb < s.nShapes.length; nb++) {
            const t1 = s.nShapes[nb];
            if (t1 && t1.renderData === null) {
              const t2 = t1.nShapes[0];
              if (t2 && t2.renderData === null) {
                const midPos = [
                  (s.points[nsi(nb)][0] + s.points[nsi(1 + nb)][0]) / 2,
                  (s.points[nsi(nb)][1] + s.points[nsi(1 + nb)][1]) / 2,
                ];
                placeables.push({
                  pos: midPos,
                  r: nb * 90 + 90,
                  shapes: [t2, t1, s],
                });
              }
            }
          }
        }
      }
      break;

    case "STS":
      for (let i = 0; i < ALL_TRIANGLES.length; i++) {
        const t = ALL_TRIANGLES[i];
        const s1 = t.nShapes[2];
        const s2 = t.nShapes[1];
        if (
          t.renderData === null &&
          s1 &&
          s1.renderData === null &&
          s2 &&
          s2.renderData === null
        ) {
          const ORI = [180, 0, 90, 270];
          placeables.push({
            pos: t.centerPos,
            r: ORI[t.shapeIndex],
            shapes: [t, s1, s2],
          });
        }
      }
      break;
  }

  piece.placeables = placeables;
  PLAY_SCENE.placeableGenIndex++;
}
