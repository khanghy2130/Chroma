const BG_COLOR = 30;
const GRID_COLOR = 150;

// GRID
const SCALER = 42; // grid scale
const CORES = [];
const GRID_LINES = [];

// TEXTURE
const NOISE_SCALE = 0.012;
const IMAGES_AMOUNT = 3; // per shape per color
const LOAD_SPEED = 2000;
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
let scene = "START"; // START / PLAY / END
const placeableEdges = []; // {pos, triangle, square}

function getShapeColor(colorIndex, shadeIndex) {
  let c = SHAPES_COLORS[colorIndex][shadeIndex];
  return color(c[0], c[1], c[2]);
}

function getRandomShapeImage(shapeIndex, colorIndex) {
  return getRandomItem(
    (shapeIsSquare(shapeIndex)
      ? TEXTURE_LOADER.squareImages
      : TEXTURE_LOADER.triangleImages)[colorIndex]
  );
}

function shapeIsSquare(shapeIndex) {
  // below index 4 is triangle
  return shapeIndex >= 4;
}

function randomInt(start, end) {
  return Math.floor(Math.random() * end + start);
}
function getRandomItem(arr) {
  return arr[randomInt(0, arr.length)];
}
