const START_SCENE = {
  touchscreenOn: true,
  tutorialOn: true,

  // runs when done loading
  onLoad: function () {
    for (let i = 0; i < 100; i++) {
      SCENE_TRANSITION.switchScene("PLAY");
    }
  },

  render: function () {
    background(BG_COLOR);

    /// title
    fill(250);
    text("TITLE", 300, 200);

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
    }
  },
};
