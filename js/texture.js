var TEXTURE_LOADER = {
  colors: [
    // green
    { c1: [138, 242, 34], c2: [30, 100, 23] },
    // orange
    { c1: [255, 212, 92], c2: [145, 77, 25] },
    // blue
    { c1: [100, 200, 255], c2: [30, 70, 138] },
    // pink
    { c1: [255, 150, 255], c2: [145, 25, 100] },
  ],
  NOISE_SCALE: 0.012,
  IMAGES_AMOUNT: 3, // per shape per color
  LOAD_SPEED: 4000,

  isLoading: true,
  _groupIndex: 0,
  _colorIndex: 0,

  textureSeed: 0,
  textureGraphics: null,
  textureProgress: 0, // 0: create new graphics

  // 4 colors, each with 3 images
  squareImages: [],
  triangleImages: [],
  squareMask: null,
  triangleMask: null,
  createMasks: function () {
    var maskGraphics = createGraphics(150, 150, P2D);
    // maskGraphics.background(0); // KA
    maskGraphics.rectMode(CENTER);
    maskGraphics.fill(255);
    maskGraphics.noStroke();
    maskGraphics.rect(
      maskGraphics.width / 2,
      maskGraphics.height / 2,
      130,
      130,
      20
    );
    this.squareMask = maskGraphics.get();

    var r = 30;
    var rsqrt3 = r * sqrt(3);
    maskGraphics = createGraphics(150, 150, P2D);
    // maskGraphics.background(0); // KA
    maskGraphics.strokeJoin(ROUND);
    maskGraphics.strokeWeight(25);
    maskGraphics.stroke(255);
    maskGraphics.triangle(
      maskGraphics.width / 2,
      maskGraphics.height / 2 - r * 2,
      maskGraphics.width / 2 - rsqrt3,
      maskGraphics.height / 2 + r,
      maskGraphics.width / 2 + rsqrt3,
      maskGraphics.height / 2 + r
    );
    this.triangleMask = maskGraphics.get();
  },

  // throughout multple frames
  createTexture: function () {
    var c1 = this.colors[this._colorIndex].c1;
    var c2 = this.colors[this._colorIndex].c2;
    c1 = color(c1[0], c1[1], c1[2]);
    c2 = color(c2[0], c2[1], c2[2]);

    if (this.textureProgress === 0) {
      this.textureGraphics.background(255, 0, 0);
    }
    for (var i = 0; i < this.LOAD_SPEED; i++) {
      var x = this.textureProgress % this.textureGraphics.width;
      var y = floor(this.textureProgress / this.textureGraphics.width);

      var noiseValue = noise(
        x * this.NOISE_SCALE,
        (y + this.textureSeed) * this.NOISE_SCALE
      );

      if (noiseValue > 0.5 && noiseValue < 0.54) {
        this.textureGraphics.stroke(c1);
      } else {
        this.textureGraphics.stroke(
          lerpColor(c1, c2, round(noiseValue * 10) / 10)
        );
      }
      this.textureGraphics.point(x, y);
      this.textureProgress++;
    }
  },

  // create all shape images for a color
  createShapeImages: function () {
    // done with a color?
    if (this._groupIndex >= this.IMAGES_AMOUNT) {
      this._colorIndex++;
      // complete loading?
      if (this._colorIndex >= this.colors.length) {
        this.isLoading = false;
        // cleanup
        this.squareMask = null;
        this.triangleMask = null;
        this.textureGraphics = null;
        this.onLoad();
        return;
      }
      this._groupIndex = 0; // reset for next color
    }

    // create new texture?
    if (this.textureProgress === 0) {
      this.textureSeed = random(-99999, 99999);
      this.textureGraphics = createGraphics(150, 150, P2D);
      this.textureGraphics.strokeWeight(2); // fix transparency
      return this.createTexture();
    }
    // still creating texture?
    else if (this.textureProgress < 22500) {
      return this.createTexture();
    }

    var sis = this.squareImages[this._colorIndex];
    var tis = this.triangleImages[this._colorIndex];
    if (this._groupIndex === 0) {
      // add new images group
      sis = [];
      tis = [];
    }

    // add to group
    var si = this.textureGraphics.get();
    si.mask(this.squareMask);
    sis.push(si);
    var ti = this.textureGraphics.get();
    ti.mask(this.triangleMask);
    tis.push(ti);

    this._groupIndex++;
    this.squareImages[this._colorIndex] = sis;
    this.triangleImages[this._colorIndex] = tis;
    this.textureProgress = 0;
  },

  loadProgressDisplay: 0,
  renderLoadscreen: function () {
    this.createShapeImages();

    var GRAPHICS_AMOUNT = this.IMAGES_AMOUNT * this.colors.length;
    var GRAPHICS_DONE =
      this._colorIndex * this.IMAGES_AMOUNT + this._groupIndex;
    var percentage = GRAPHICS_DONE / GRAPHICS_AMOUNT;
    if (this.loadProgressDisplay < percentage * 1.2) {
      this.loadProgressDisplay = min(1, this.loadProgressDisplay + 0.015);
    }

    background(0);
    fill(250);
    noStroke();
    text("Loading", width / 2, height / 2);
    fill(100);
    rect(width / 2, height / 2 + 50, 400, 10);
    fill(250, 200, 0);
    rect(
      width / 2 - (1 - this.loadProgressDisplay) * 200,
      height / 2 + 50,
      400 * this.loadProgressDisplay,
      10
    );
  },

  // runs when done loading
  onLoad: function () {
    for (var i = 0; i < 100; i++) {
      dummies.push({
        x: random(0, width),
        y: random(0, height),
        r: random(0, 100),
        img:
          random() > 0.5
            ? this.squareImages[floor(random(0, 4))][floor(random(0, 3))]
            : this.triangleImages[floor(random(0, 4))][floor(random(0, 3))],
      });
    }
  },
};
