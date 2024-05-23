const __skip__ = !true;

const SCORE_CHECK_AMOUNTS = [300, 1000, 3000, 6000, 10000];
const TURNS_PER_CHECK = 10;
const PIECE_TYPES_CHANCES = [15, 40]; // 1 shape, 2 shapes
const SEAL_CHANCE = 0.16;
const CHROMA_CHANCE = 0.09;

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
const UPGRADE_DELAY = 40;
const FLASHER_SPEED = 0.06;
const CLEAR_RESULT_DURATION = 80;
const TEXT_SHRINK_SPEED = 0.15;
const GAME_MESSAGE_DURATION = 120;
const GMAD = 20; // game message animation duration
const PROGRESS_BAR_HEIGHT = 3;

// GRID
const SEAL_SIZE = 25;
const SCALER = 42; // grid scale
const SHAPE_SIZE = 85;
const PLACEABLE_DIAMETER = 20;
const CORES = [];
const GRID_LINES = [];
const PLUS_DOTS = [];
let PORTAL_LINES; // {line, shape, isActive}
let activePortalLines = []; // for render

// TEXTURE
const NOISE_SCALE = 0.012;
let IMAGES_AMOUNT = 3;
const SHAPES_COLORS_NAMES = ["GREEN", "ORANGE", "BLUE", "PINK"];
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
const sounds = {};
const ALL_SQUARES = [];
const ALL_TRIANGLES = [];
let ALL_SHAPES;
let scene = "START"; // START / PLAY / END
let touchCountdown = 0;
let startTime = 0;

let totalScore = 0;
let totalAdded = 0;
let multiplier = 2.0;
let adder = 0;
let temporaryAdder = 0;

let scoreCheckIndex = 0;
let animations = {
  resultDelay: 0,
  scoreCheckCountDown: 0,

  scoreScaler: 1, // 1.5
  adderScaler: 1, // 2
  multScaler: 1, // 2
};

function getShapeColor(colorIndex, shadeIndex) {
  let c = SHAPES_COLORS[colorIndex][shadeIndex];
  return color(c[0], c[1], c[2]);
}

function newRenderData(isSquare, colorIndex) {
  if (typeof colorIndex !== "number") colorIndex = randomInt(0, 4);
  const randomNum = random();
  let special = "NONE";
  if (scoreCheckIndex > 0 || PLAY_SCENE.turnsLeft < TURNS_PER_CHECK) {
    if (randomNum < SEAL_CHANCE) special = "X";
    else if (randomNum < SEAL_CHANCE + CHROMA_CHANCE) special = "CHROMA";
  }
  return {
    imgNeg: isSquare
      ? TEXTURE_LOADER.negativeImages.square
      : TEXTURE_LOADER.negativeImages.triangle,
    img: getRandomItem(
      (isSquare ? TEXTURE_LOADER.squareImages : TEXTURE_LOADER.triangleImages)[
        colorIndex
      ]
    ),
    textureOri: isSquare ? randomInt(0, 4) * 90 : randomInt(0, 3) * 120,
    colorIndex: colorIndex,
    special: special,
    isSquare: isSquare,
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

// code from https://stackoverflow.com/a/34474547
function lineIsHovered(point1, point2) {
  const dxL = point2[0] - point1[0];
  const dyL = point2[1] - point1[1];
  const dxP = _mouseX - point1[0];
  const dyP = _mouseY - point1[1];

  const squareLen = dxL * dxL + dyL * dyL;
  const dotProd = dxP * dxL + dyP * dyL;
  const crossProd = dyP * dxL - dxP * dyL;
  const distance = Math.abs(crossProd) / Math.sqrt(squareLen);
  return dotProd >= 0 && dotProd <= squareLen && distance < 7; // line width here
}
function getPortalLine(index) {
  let realIndex = index;
  if (index < 0) {
    realIndex = index + PORTAL_LINES.length;
  } else if (index >= PORTAL_LINES.length) {
    realIndex = index - PORTAL_LINES.length;
  }
  return PORTAL_LINES[realIndex];
}
