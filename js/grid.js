/*

CORE {
  points[4]
  shapes[6] [t,t,t,t,s,s]
  
}

SHAPE {
  shapeIndex: (index in core.shapes)
  nShapes[3 | 4] (clockwise order) (neighbors)
  points[3 | 4]
  
  centerPos
  gridOrientation
  render { img, textureOrientation, colorIndex, sealIndex }
}

(standalone list, made of shapes and midlines)
PLACEABLE {
  
}
*/

// make all shapes for a core
// nCores is neighbor cores
function makeShapesAndLines(core, N_CORE, skippedShapeIndex, SP) {
  const cores = N_CORE.map((index) => {
    if (index === null) return null;
    else return CORES[index];
  });
  cores.unshift(core); // add main core too

  // add shapes to core
  core.shapes = SP.map((pairs, shapeIndex) => {
    // skip this shape?
    if (skippedShapeIndex === shapeIndex) {
      return null;
    }

    const shape = {
      shapeIndex: shapeIndex,
      points: [],
    };

    // add points
    // if point not exist then shape is null
    for (let pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
      const [coreIndex, pointIndex] = pairs[pairIndex];
      // This core doesn't exist?
      if (cores[coreIndex] === null) {
        return null;
      } else {
        shape.points.push(cores[coreIndex].points[pointIndex]);
      }
    }

    // add .centerPos
    if (shapeIsSquare(shapeIndex)) {
      shape.centerPos = [
        (shape.points[0][0] + shape.points[2][0]) / 2,
        (shape.points[0][1] + shape.points[2][1]) / 2,
      ];
    } else {
      shape.centerPos = [
        (shape.points[0][0] + shape.points[1][0] + shape.points[2][0]) / 3,
        (shape.points[0][1] + shape.points[1][1] + shape.points[2][1]) / 3,
      ];
    }

    return shape;
  });

  const lines = [
    getLine(core.shapes[0], 0, 1),
    getLine(core.shapes[0], 0, 2),
    getLine(core.shapes[0], 1, 2),
    getLine(core.shapes[1], 0, 2),
    getLine(core.shapes[1], 1, 2),
    getLine(core.shapes[2], 0, 1),
    getLine(core.shapes[3], 0, 1),
    getLine(core.shapes[2], 0, 2),
    getLine(core.shapes[2], 1, 2),
    getLine(core.shapes[3], 0, 2),
  ];

  ///// go thru lines to add midline (except between 2 triangles) placeables to placeables
}

// also push line into GRID_LINES
function getLine(shape, point1Index, point2Index) {
  if (shape === null) return null;
  const l = [shape.points[point1Index], shape.points[point2Index]];
  GRID_LINES.push(l);
  return l;
}

function initializeGridData() {
  const SCALED_SQRT_3 = Math.sqrt(3) * SCALER;
  const S_SQ3 = SCALER + SCALED_SQRT_3;
  const gx = width / 2; // grid x
  const gy = height / 2 - SCALER * 1.5; // grid y
  const POINTS_POS = [
    [gx, gy - S_SQ3 * 2],
    [gx - S_SQ3, gy - S_SQ3],
    [gx + S_SQ3, gy - S_SQ3],
    [gx - S_SQ3 * 2, gy],
    [gx, gy], // CENTER
    [gx + S_SQ3 * 2, gy],
    [gx - S_SQ3, gy + S_SQ3],
    [gx + S_SQ3, gy + S_SQ3],
    [gx, gy + S_SQ3 * 2],
  ];

  // add cores (with .points)
  POINTS_POS.forEach((ppos) => {
    CORES.push({
      points: [
        // top, bottom, left, right
        [ppos[0], ppos[1] - SCALED_SQRT_3],
        [ppos[0], ppos[1] + SCALED_SQRT_3],
        [ppos[0] - SCALER, ppos[1]],
        [ppos[0] + SCALER, ppos[1]],
      ],
    });
  });

  // clockwise nCores around a core (index)
  const N_CORES = [
    [null, null, 2, 4, 1, null],
    [null, 0, 4, 6, 3, null],
    [null, null, 5, 7, 4, 0],
    [null, 1, 6, null, null, null],
    [0, 2, 7, 8, 6, 1],
    [null, null, null, null, 7, 2],
    [1, 4, 8, null, null, 3],
    [2, 5, null, null, 8, 4],
    [4, 7, null, null, null, 6],
  ];

  // in order of core.shapes
  // [ [coreIndex, pointIndex], ...]
  const SHAPES_POINTS = [
    // shape-type: points
    // up-triangle: top,left,right
    [
      [0, 0],
      [0, 2],
      [0, 3],
    ],
    // down-triangle: left,right,bottom
    [
      [0, 2],
      [0, 3],
      [0, 1],
    ],
    // left-triangle: left,top,bottom
    [
      [5, 3],
      [0, 1],
      [4, 0],
    ],
    // right-triangle: right,top,bottom
    [
      [3, 2],
      [0, 1],
      [4, 0],
    ],

    // left square: left,top,right,bottom
    [
      [5, 0],
      [0, 2],
      [0, 1],
      [5, 3],
    ],
    // right square: left,top,right,bottom
    [
      [0, 1],
      [0, 3],
      [3, 0],
      [3, 2],
    ],
  ];

  // add .shapes to cores (also add lines to gridLines)
  CORES.forEach((core, i) => {
    let skippedShapeIndex = null;
    if (i === 0) skippedShapeIndex = 0;
    if (i === 8) skippedShapeIndex = 1;
    makeShapesAndLines(core, N_CORES[i], skippedShapeIndex, SHAPES_POINTS);
  });

  // add edge lines that were left out
  getLine(CORES[0].shapes[1], 0, 1);
  getLine(CORES[0].shapes[4], 0, 1);
  getLine(CORES[0].shapes[5], 1, 2);
  getLine(CORES[1].shapes[4], 0, 1);
  getLine(CORES[2].shapes[5], 1, 2);
  getLine(CORES[3].shapes[5], 3, 0);
  getLine(CORES[5].shapes[4], 2, 3);
  getLine(CORES[6].shapes[5], 3, 0);
  getLine(CORES[7].shapes[4], 2, 3);

  // triangle: [triangle, square(left), square(right)]
  const N_SHAPE_INDICES = [
    // [ [nCoreIndex (+1), shapeIndex(from that core)], ... ]
    [
      [0, 1],
      [6, 5],
      [2, 4],
    ],
    [
      [0, 0],
      [0, 5],
      [0, 4],
    ],
    [
      [0, 3],
      [5, 5],
      [0, 4],
    ],
    [
      [0, 2],
      [0, 5],
      [3, 4],
    ],
    [
      [6, 3],
      [0, 1],
      [0, 2],
      [5, 0],
    ],
    [
      [0, 1],
      [2, 2],
      [3, 0],
      [0, 3],
    ],
  ];
  // add .nShapes to each of .shapes
  CORES.forEach((core, coreIndex) => {
    const cores = N_CORES[coreIndex].map((index) => {
      if (index === null) return null;
      else return CORES[index];
    });
    cores.unshift(core); // add main core too

    core.shapes.forEach((shape, shapeIndex) => {
      if (!shape) return;
      const nShapeIndices = N_SHAPE_INDICES[shapeIndex];
      shape.nShapes = nShapeIndices.map(([_coreIndex, nShapeIndex]) => {
        // This core doesn't exist?
        if (cores[_coreIndex] === null) {
          return null;
        } else {
          return cores[_coreIndex].shapes[nShapeIndex];
        }
      });
    });
  });
}
