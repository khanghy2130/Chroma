const tooltip = {
  isShown: false,
  progress: 0, // 0 (close) to 1 (open)
  content: "",
  bgSize: [0, 0],

  set: function (content, bgSize) {
    tooltip.isShown = true;
    tooltip.content = content;
    tooltip.bgSize = bgSize;
  },

  render: function () {
    if (this.isShown) {
      this.progress = min(1, this.progress + 0.1);
    } else {
      this.progress = max(0, this.progress - 0.1);
    }
    if (this.progress > 0) {
      const yValue = _mouseY + 30;
      const xValue = constrain(
        _mouseX,
        this.bgSize[0] / 2,
        width - this.bgSize[0] / 2
      );
      noStroke();
      fill(DARK_COLOR, this.progress * 220);
      rect(xValue, this.bgSize[1] / 2 + yValue, this.bgSize[0], this.bgSize[1]);
      textSize(20);
      fill(LIGHT_COLOR, this.progress * 255);
      text(this.content, xValue, this.bgSize[1] / 2 + yValue);
    }
  },
};
