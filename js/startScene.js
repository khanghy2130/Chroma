const TITLE_DATA =
  "134,215?125,208?123,207?121,206?118,206?115,205?111,205?108,205?100,207?97,209?93,210?85,216?79,224?76,228?74,232?72,237?68,247?67,251?65,261?64,266?65,280?66,285?67,290?69,295?71,299?72,303?77,310?79,313?82,316?86,319?89,321?95,325?98,327?101,328?104,329?107,329?113,328?115,327?122,323?125,321?128,318?130,315?133,313?134,310?136,309?138,307?0,0?174,209?173,282?174,307?175,311?176,314?177,321?0,0?175,289?180,279?182,276?184,274?187,272?188,271?190,271?192,271?196,270?198,270?199,269?201,269?202,271?203,273?205,278?206,282?209,290?211,303?212,310?213,322?0,0?246,268?248,279?249,285?250,291?251,307?252,318?253,325?254,332?0,0?253,292?254,281?256,278?258,275?260,273?262,271?264,270?268,269?270,269?272,268?274,269?276,270?278,270?279,271?280,273?281,274?282,274?283,275?0,0?342,270?333,269?330,270?328,271?325,273?323,275?321,278?317,283?316,286?314,294?316,315?317,319?320,327?324,332?329,336?333,337?337,337?341,336?344,335?346,334?348,333?350,331?352,329?356,324?357,321?358,319?360,317?361,314?362,306?363,303?362,291?361,284?359,281?358,279?356,277?353,275?351,274?349,272?347,271?342,269?341,268?340,268?0,0?392,267?393,339?0,0?392,297?398,285?401,282?406,276?408,273?411,272?413,271?416,274?419,278?420,281?422,288?423,296?422,315?423,339?0,0?425,295?431,284?433,281?439,276?444,273?446,273?448,273?449,273?452,275?454,281?455,285?454,299?453,314?454,343?0,0?524,280?515,277?513,277?511,278?509,279?507,280?505,281?503,282?501,283?497,288?495,291?493,295?492,299?491,303?490,307?491,326?492,329?496,334?498,337?500,339?502,341?507,343?510,343?512,343?514,343?516,342?520,340?522,339?525,335?526,333?528,330?529,326?530,325?0,0?531,274?528,284?529,295?530,305?531,318?532,325?534,349?535,352?0,0";

const START_SCENE = {
  touchscreenOn: true,
  tutorialOn: true,

  TDArray: TITLE_DATA.split("?").map(function (s) {
    return s.split(",").map(function (n) {
      return Number(n);
    });
  }),
  t: 1, // title time
  layer1Graphics: null,
  layer2Graphics: null,
  titleSetup: function () {
    this.layer1Graphics = createGraphics(600, 600, P2D);
    this.layer1Graphics.background(0, 0);
    this.layer1Graphics.colorMode(HSB, 255);
    this.layer1Graphics.strokeWeight(25);

    this.layer2Graphics = createGraphics(600, 600, P2D);
    this.layer2Graphics.background(0, 0);
    this.layer2Graphics.stroke(BG_COLOR);
    this.layer2Graphics.strokeWeight(15);
  },

  // runs when done loading
  onLoad: function () {
    ////SCENE_TRANSITION.switchScene("PLAY");
  },

  render: function () {
    background(BG_COLOR);

    // update title
    if (this.t < this.TDArray.length) {
      const pos1 = this.TDArray[this.t];
      const pos2 = this.TDArray[this.t - 1];
      this.t++;
      if (pos1[0] !== 0 && pos2[0] !== 0) {
        this.layer1Graphics.stroke(map(pos1[0], 0, width, 0, 255), 255, 255);
        this.layer1Graphics.line(pos1[0], pos1[1], pos2[0], pos2[1]);
        this.layer2Graphics.line(pos1[0], pos1[1], pos2[0], pos2[1]);
      }
    }

    image(this.layer1Graphics, width / 2, height / 3);
    image(this.layer2Graphics, width / 2, height / 3);

    // is still loading texture?
    if (TEXTURE_LOADER.isLoading) {
      TEXTURE_LOADER.createShapeImages();

      const GRAPHICS_DONE =
        TEXTURE_LOADER._colorIndex * IMAGES_AMOUNT + TEXTURE_LOADER._groupIndex;
      const loadingProgress = min(
        1,
        GRAPHICS_DONE / (IMAGES_AMOUNT * SHAPES_COLORS.length)
      );

      fill(250);
      noStroke();
      text("Loading", 300, 520);
      fill(100);
      rect(300, 550, 500, 6);
      fill(250, 200, 0);
      rect(300 - (1 - loadingProgress) * 250, 550, 500 * loadingProgress, 6);
    }

    // done loading?
    else {
      ///  play, touchscreen toggle, tutorial toggle
      fill(250);
      noStroke();
      text("Done", 300, 520);

      ////image(TEXTURE_LOADER.squareImages[0][0], mouseX, mouseY);
    }
  },
};
