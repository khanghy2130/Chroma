const START_SCENE = {
  touchscreenOn: true,
  tutorialOn: true,

  // runs when done loading
  onLoad: function () {
    for (let i = 0; i < 100; i++) {
      dummies.push({
        x: random(0, width),
        y: random(0, height),
        r: random(0, 100),
        img:
          random() > 0.5
            ? getRandomShapeImage(0, randomInt(0, 4))
            : getRandomShapeImage(4, randomInt(0, 4)),
      });

      SCENE_TRANSITION.switchScene("PLAY");
    }
  },

  loadProgressDisplay: 0,
  render: function () {
    background(BG_COLOR);

    /// title
    fill(250);
    text("TITLE", 300, 200);

    // is still loading texture?
    if (TEXTURE_LOADER.isLoading) {
      TEXTURE_LOADER.createShapeImages();

      const GRAPHICS_AMOUNT = IMAGES_AMOUNT * SHAPES_COLORS.length;
      const GRAPHICS_DONE =
        TEXTURE_LOADER._colorIndex * IMAGES_AMOUNT + TEXTURE_LOADER._groupIndex;
      const percentage = GRAPHICS_DONE / GRAPHICS_AMOUNT;
      if (this.loadProgressDisplay < percentage * 1.2) {
        this.loadProgressDisplay = min(1, this.loadProgressDisplay + 0.015);
      }

      fill(250);
      noStroke();
      text("Loading", 300, 520);
      fill(100);
      rect(300, 550, 400, 10);
      fill(250, 200, 0);
      rect(
        300 - (1 - this.loadProgressDisplay) * 200,
        550,
        400 * this.loadProgressDisplay,
        10
      );
    }

    // done loading?
    else {
      ///  play, touchscreen toggle, tutorial toggle
      fill(250);
      noStroke();
      text("Done", 300, 520);
    }
  },
};
