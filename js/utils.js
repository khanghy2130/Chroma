const BG_COLOR = 30;

// GRID
const SCALER = 42; // grid scale
const CORES = [];

// TEXTURE
const NOISE_SCALE = 0.012;
const IMAGES_AMOUNT = 3; // per shape per color
const LOAD_SPEED = 4000;
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

function getShapeColor(colorIndex, shadeIndex) {
  let c = SHAPES_COLORS[colorIndex][shadeIndex];
  return color(c[0], c[1], c[2]);
}

function getRandomShapeImage(shapeIndex, colorIndex) {
  // below index 4 is triangle
  return getRandomItem(
    (shapeIndex < 4
      ? TEXTURE_LOADER.triangleImages
      : TEXTURE_LOADER.squareImages)[colorIndex]
  );
}

function randomInt(start, end) {
  return Math.floor(Math.random() * end + start);
}
function getRandomItem(arr) {
  return arr[randomInt(0, arr.length)];
}
