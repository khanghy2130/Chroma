const TITLE_DATA =
  "134,95?125,88?123,87?121,86?118,86?115,85?111,85?108,85?100,87?97,89?93,90?85,96?79,104?76,108?74,112?72,117?68,127?67,131?65,141?64,146?65,160?66,165?67,170?69,175?71,179?72,183?77,190?79,193?82,196?86,199?89,201?95,205?98,207?101,208?104,209?107,209?113,208?115,207?122,203?125,201?128,198?130,195?133,193?134,190?136,189?138,187?0,0?174,89?173,162?174,187?175,191?176,194?177,201?0,0?175,169?180,159?182,156?184,154?187,152?188,151?190,151?192,151?196,150?198,150?199,149?201,149?202,151?203,153?205,158?206,162?209,170?211,183?212,190?213,202?0,0?246,148?248,159?249,165?250,171?251,187?252,198?253,205?254,212?0,0?253,172?254,161?256,158?258,155?260,153?262,151?264,150?268,149?270,149?272,148?274,149?276,150?278,150?279,151?280,153?281,154?282,154?283,155?0,0?342,150?333,149?330,150?328,151?325,153?323,155?321,158?317,163?316,166?314,174?316,195?317,199?320,207?324,212?329,216?333,217?337,217?341,216?344,215?346,214?348,213?350,211?352,209?356,204?357,201?358,199?360,197?361,194?362,186?363,183?362,171?361,164?359,161?358,159?356,157?353,155?351,154?349,152?347,151?342,149?341,148?340,148?0,0?392,147?393,219?0,0?392,177?398,165?401,162?406,156?408,153?411,152?413,151?416,154?419,158?420,161?422,168?423,176?422,195?423,219?0,0?425,175?431,164?433,161?439,156?444,153?446,153?448,153?449,153?452,155?454,161?455,165?454,179?453,194?454,223?0,0?524,160?515,157?513,157?511,158?509,159?507,160?505,161?503,162?501,163?497,168?495,171?493,175?492,179?491,183?490,187?491,206?492,209?496,214?498,217?500,219?502,221?507,223?510,223?512,223?514,223?516,222?520,220?522,219?525,215?526,213?528,210?529,206?530,205?0,0?531,154?528,164?529,175?530,185?531,198?532,205?534,229?535,232?0,0?42,212?43,212?45,214?47,217?50,222?53,227?55,229?57,232?58,233?59,234?60,235?61,235?62,236?63,237?64,238?68,240?71,241?75,242?79,243?84,243?89,243?94,244?97,244?104,244?107,245?112,245?116,246?121,246?125,246?129,247?131,247?132,247?134,247?136,247?137,247?138,247?140,247?141,247?142,247?145,247?147,248?149,249?151,250?155,251?159,252?163,253?166,255?171,257?175,257?177,259?180,259?181,260?183,260?185,260?189,261?194,262?197,262?199,262?203,262?207,262?213,261?216,261?218,261?223,260?228,259?232,258?235,257?237,257?239,256?241,256?245,255?248,254?250,254?253,253?255,253?257,253?260,253?266,253?271,253?275,253?277,253?279,253?281,253?285,253?291,253?293,253?294,253?295,253?296,253?298,253?302,253?307,253?309,253?310,253?311,251?314,251?318,250?319,249?321,247?322,247?325,245?328,243?331,242?332,241?333,240?335,239?336,238?337,237?338,235?339,234?340,234?341,234?342,233?343,231?344,230?345,229?347,226?349,224?350,223?351,223?353,217?354,215?355,213?356,211?357,209?0,0?524,89?522,94?521,98?519,102?517,106?516,108?515,108?514,109?513,110?511,112?510,113?509,113?507,114?506,115?505,116?503,116?502,117?501,117?500,117?499,118?497,118?496,119?495,119?493,120?491,120?489,120?488,120?487,120?485,120?483,120?481,120?479,120?477,119?472,118?467,116?463,116?462,116?461,115?460,115?459,115?457,115?455,114?451,114?450,114?447,114?446,113?443,112?439,112?436,112?433,112?431,112?427,111?423,110?419,110?411,110?407,110?403,110?401,110?400,110?399,110?398,110?396,110?393,112?392,112?391,113?389,113?386,114?382,115?380,116?379,116?378,116?377,117?376,117?373,118?367,118?363,118?362,118?358,119?355,120?350,120?347,121?346,122?344,123?343,123?342,124?341,125?339,126?336,128?335,130?334,131?333,132?331,133?330,134?329,135?328,136?327,138?326,139?325,140?323,141?322,143?321,144?319,146?318,152?317,156?316,157?0,0";

const START_SCENE = {
  tutorialOn: true,
  touchscreenOn: false,

  TDArray: TITLE_DATA.split("?").map(function (s) {
    return s.split(",").map(function (n) {
      return Number(n);
    });
  }),
  t: 1, // default: 1   skip: 220
  layer2Graphics: null,
  titleSetup: function () {
    this.layer2Graphics = createGraphics(600, 300, P2D);
    this.layer2Graphics.background(0, 0);
    this.layer2Graphics.stroke(BG_COLOR);
    this.layer2Graphics.strokeWeight(15);

    this.setUpButtons();
    background(BG_COLOR);
  },

  titleDone: false,
  displayLoadingProgress: 0,
  render: function () {
    // update title
    if (!this.titleDone) {
      // faster drawing
      for (let i = 0; i < 2; i++) {
        const pos1 = this.TDArray[this.t];
        const pos2 = this.TDArray[this.t - 1];
        this.t++;
        if (pos1[0] !== 0 && pos2[0] !== 0) {
          strokeWeight(25);
          colorMode(HSB, 255);
          stroke(map(pos1[0], 0, width, 0, 255), 255, 255);
          colorMode(RGB, 255);
          line(pos1[0], pos1[1], pos2[0], pos2[1]);
          this.layer2Graphics.line(pos1[0], pos1[1], pos2[0], pos2[1]);
        }
        image(this.layer2Graphics, width / 2, this.layer2Graphics.height / 2);
        if (this.t >= this.TDArray.length) {
          this.titleDone = true;
          TEXTURE_LOADER.LOAD_SPEED = 3000; // actual load speed
          break;
        }
      }
    }

    // is still loading texture?
    let loadingProgress = 1;
    if (TEXTURE_LOADER.isLoading) {
      TEXTURE_LOADER.createShapeImages();

      const GRAPHICS_DONE =
        TEXTURE_LOADER._colorIndex * IMAGES_AMOUNT + TEXTURE_LOADER._groupIndex;
      loadingProgress = min(
        1,
        GRAPHICS_DONE / (IMAGES_AMOUNT * SHAPES_COLORS.length)
      );
    }
    // done loading?
    else {
      noStroke();
      fill(BG_COLOR);
      rect(width / 2, 400, width, 200);
      this.buttons.play.render();
      this.buttons.tutorialToggle.render();
      this.buttons.touchscreenToggle.render();
    }

    // gradient load bar
    if (this.displayLoadingProgress < 1) {
      noStroke();
      this.displayLoadingProgress = min(
        loadingProgress,
        this.displayLoadingProgress + 0.01
      );
      colorMode(HSB, 255);
      fill(this.displayLoadingProgress * 255, 255, 255);
      colorMode(RGB, 255);
      rect(this.displayLoadingProgress * width, 598, 6, 6);
    }
  },

  mouseClicked: function () {
    for (let key in this.buttons) {
      if (this.buttons[key].isHovered) return this.buttons[key].clicked();
    }
  },

  buttons: {
    play: null,
    tutorialToggle: null,
    touchscreenToggle: null,
  },
  setUpButtons: function () {
    this.buttons.play = new Btn(
      160,
      400,
      220,
      100,
      (x, y) => {
        noStroke();
        textSize(40);
        fill(LIGHT_COLOR);
        text("Play", x, y);
      },
      () => {
        initializeGridData();
        SCENE_TRANSITION.switchScene("PLAY");
      }
    );
    this.buttons.tutorialToggle = new Btn(
      440,
      370,
      220,
      40,
      (x, y) => {
        noStroke();
        textSize(18);
        fill(LIGHT_COLOR);
        text("tutorial", x, y);
        if (this.tutorialOn) fill(LIGHT_COLOR);
        else noFill();
        strokeWeight(2);
        stroke(LIGHT_COLOR);
        ellipse(x - 85, y, 15, 15);
      },
      () => {
        this.tutorialOn = !this.tutorialOn;
      }
    );
    this.buttons.touchscreenToggle = new Btn(
      440,
      430,
      220,
      40,
      (x, y) => {
        noStroke();
        textSize(18);
        fill(LIGHT_COLOR);
        text("touchscreen", x, y);
        if (this.touchscreenOn) fill(LIGHT_COLOR);
        else noFill();
        strokeWeight(2);
        stroke(LIGHT_COLOR);
        ellipse(x - 85, y, 15, 15);
      },
      () => {
        this.touchscreenOn = !this.touchscreenOn;
      }
    );
  },
};
