const TEXTURE_LOADER = {
  isLoading: true,
  _groupIndex: 0,
  _colorIndex: 0,

  LOAD_SPEED: 500,
  textureSeed: 0,
  textureGraphics: null,
  textureProgress: 0, // 0: create new graphics

  // 4 colors, each with 3 images
  squareImages: [],
  triangleImages: [],
  squareMask: null,
  triangleMask: null,
  createMasks: function () {
    let maskGraphics = createGraphics(150, 150, P2D);
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

    const r = 30;
    const rsqrt3 = r * sqrt(3);
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
    const c1 = getShapeColor(this._colorIndex, 0);
    const c2 = getShapeColor(this._colorIndex, 1);

    if (this.textureProgress === 0) {
      this.textureGraphics.background(255, 0, 0);
    }
    for (let i = 0; i < this.LOAD_SPEED; i++) {
      const x = this.textureProgress % this.textureGraphics.width;
      const y = floor(this.textureProgress / this.textureGraphics.width);

      const noiseValue = noise(
        x * NOISE_SCALE,
        (y + this.textureSeed) * NOISE_SCALE
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
    if (this._groupIndex >= IMAGES_AMOUNT) {
      this._colorIndex++;
      // complete loading?
      if (this._colorIndex >= SHAPES_COLORS.length) {
        this.isLoading = false;
        // cleanup
        this.squareMask = null;
        this.triangleMask = null;
        this.textureGraphics = null;
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

    let sis = this.squareImages[this._colorIndex];
    let tis = this.triangleImages[this._colorIndex];
    if (this._groupIndex === 0) {
      // add new images group
      sis = [];
      tis = [];
    }

    // add to group
    const si = this.textureGraphics.get();
    si.mask(this.squareMask);
    sis.push(si);
    const ti = this.textureGraphics.get();
    ti.mask(this.triangleMask);
    tis.push(ti);

    this._groupIndex++;
    this.squareImages[this._colorIndex] = sis;
    this.triangleImages[this._colorIndex] = tis;
    this.textureProgress = 0;
  },
};
