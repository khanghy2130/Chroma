const __skip__ = !!true;

const BG_COLOR = 25;
const DARK_COLOR = 12;
const LIGHT_COLOR = 230;
const GRID_COLOR = 150;
const BUTTON_GLOW_SPEED = 0.05;

const FLYER_UNSELECTED_SCALING = 0.8;
const FLYER_SCALING_SPEED = 0.05;
const FLYER_MOVE_SPEED = 0.2;
const FLYER_ROTATE_SPEED = 10;

const CLEAR_DELAY = 10;
const FLASHER_SPEED = 0.06;
const CLEAR_RESULT_DURATION = 80;
const TEXT_SHRINK_SPEED = 0.2;

const SCORE_CHECK_AMOUNTS = [100, 200, 300, 400, 500];

// GRID
const SCALER = 42; // grid scale
const SQUARE_SIZE = 85;
const TRIANGLE_SIZE = 75;
const PLACEABLE_DIAMETER = 20;
const CORES = [];
const GRID_LINES = [];
const PLUS_DOTS = [];

// TEXTURE
const NOISE_SCALE = 0.012;
let IMAGES_AMOUNT = 3;
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
    [110, 210, 255],
    [31, 77, 156],
  ],
  // pink
  [
    [255, 150, 255],
    [145, 25, 100],
  ],
];

// CONTROLS
const SEALS_AMOUNT = 5;
const ALL_SQUARES = [];
const ALL_TRIANGLES = [];
let ALL_SHAPES;
let scene = "START"; // START / PLAY / END

let totalAdded = 0;
let totalScore = 0;
let multiplier = 2.0;
let adder = 0;
let temporaryAdder = 0;
let scoreCheckIndex = 0;
let turnsCount = 0;
let animations = {
  resultDelay: 0,

  scoreScaler: 1, // 1.5
  adderScaler: 1, // 2
  multScaler: 1, // 2
};

let touchCountdown = 0;

function getShapeColor(colorIndex, shadeIndex) {
  let c = SHAPES_COLORS[colorIndex][shadeIndex];
  return color(c[0], c[1], c[2]);
}

function newRenderData(isSquare, hasSeal, colorIndex) {
  if (typeof colorIndex !== "number") colorIndex = randomInt(0, 4);
  return {
    img: getRandomItem(
      (isSquare ? TEXTURE_LOADER.squareImages : TEXTURE_LOADER.triangleImages)[
        colorIndex
      ]
    ),
    textureOri: isSquare ? randomInt(0, 4) * 90 : randomInt(0, 3) * 120,
    colorIndex: colorIndex,
    sealIndex: hasSeal ? randomInt(1, SEALS_AMOUNT + 1) : 0,
    size: isSquare ? SQUARE_SIZE : TRIANGLE_SIZE,
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

function nsi(n) {
  // normalize square index
  while (n < 0) n += 4;
  while (n >= 4) n -= 4;
  return n;
}
