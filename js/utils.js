const __skip__ = !!true;

const BG_COLOR = 30;
const LIGHT_COLOR = 230;
const GRID_COLOR = 150;
const BUTTON_GLOW_SPEED = 0.05;

// GRID
const SCALER = 42; // grid scale
const SQUARE_SIZE = 85;
const TRIANGLE_SIZE = 75;
const CORES = [];
const GRID_LINES = [];
const PLUS_DOTS = [];

// TEXTURE
const NOISE_SCALE = 0.012;
let IMAGES_AMOUNT = 4;
const SHAPES_COLORS = [
  // green
  [
    [138, 242, 34],
    [30, 100, 23],
  ],
  // orange
  [
    [255, 212, 92],
    [145, 77, 25],
  ],
  // blue
  [
    [100, 200, 255],
    [31, 77, 156],
  ],
  // pink
  [
    [255, 150, 255],
    [145, 25, 100],
  ],
];

// CONTROLS
const ALL_SQUARES = [];
const ALL_TRIANGLES = [];
let scene = "START"; // START / PLAY / END

function getShapeColor(colorIndex, shadeIndex) {
  let c = SHAPES_COLORS[colorIndex][shadeIndex];
  return color(c[0], c[1], c[2]);
}

function getNewShapeRenderData(shape, colorIndex) {
  const isSquare = shapeIsSquare(shape);
  return {
    img: getRandomItem(
      (isSquare ? TEXTURE_LOADER.squareImages : TEXTURE_LOADER.triangleImages)[
        colorIndex
      ]
    ),
    colorIndex: colorIndex,
    textureOri: isSquare ? randomInt(0, 4) * 90 : randomInt(0, 3) * 120,
    sealIndex: 0,
  };
}

function shapeIsSquare(shape) {
  // below index 4 is triangle
  return shape.shapeIndex >= 4;
}

function randomInt(start, end) {
  return Math.floor(Math.random() * end + start);
}
function getRandomItem(arr) {
  return arr[randomInt(0, arr.length)];
}
