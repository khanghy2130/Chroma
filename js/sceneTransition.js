const SCENE_TRANSITION = {
  progress: 1, // 0 to 1 twice
  isClosing: true,
  prevScene: null,
  nextScene: null, // no input if this is not null
  switchScene: function (nextScene) {
    this.nextScene = nextScene;
    this.progress = 0;
    this.isClosing = true;
  },
  update: function () {
    if (this.progress < 1) {
      this.progress += 0.04;

      fill(BG_COLOR);
      noStroke();
      if (this.isClosing) {
        triangle(
          width,
          height,
          width,
          height - this.progress * height * 2,
          width - width * this.progress * 2,
          height
        );
      } else {
        triangle(
          0,
          0,
          (width - this.progress * width) * 2,
          0,
          0,
          (height - this.progress * height) * 2
        );
      }

      // check done
      if (this.progress >= 1 && this.isClosing) {
        scene = this.nextScene;
        this.nextScene = null;
        this.progress = 0;
        this.isClosing = false;
      }
    }
  },
};
