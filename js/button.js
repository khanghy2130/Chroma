// transparent background
class Btn {
  // customRender: null || function(x, y)
  constructor(x, y, w, h, customRender, clicked) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.customRender = customRender;
    this.clicked = () => {
      this.glow = 1;
      _playSound(sounds.buttonClicked, 4);
      clicked();
    };

    this.glow = 1; // 0 to 1
    this.isHovered = false;
  }

  render() {
    if (this.customRender) this.customRender(this.x, this.y);

    // check hover
    if (
      SCENE_TRANSITION.nextScene === null &&
      mouseX > this.x - this.w / 2 &&
      mouseX < this.x + this.w / 2 &&
      mouseY > this.y - this.h / 2 &&
      mouseY < this.y + this.h / 2
    ) {
      if (!this.isHovered) {
        this.glow = 1; // glow up on initial hover
      } else {
        this.glow = max(0.2, this.glow - BUTTON_GLOW_SPEED); // hovered glow level
      }
      this.isHovered = true;
      cursor(HAND);
    } else {
      // not hovered
      this.isHovered = false;
      this.glow = max(0, this.glow - BUTTON_GLOW_SPEED);
    }

    // draw button frame
    strokeWeight(this.glow * 10 + 1);
    fill(255, this.glow * 110);
    stroke(LIGHT_COLOR);
    rect(this.x, this.y, this.w, this.h, 8);
  }
}
