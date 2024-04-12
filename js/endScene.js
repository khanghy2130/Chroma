const FLAME_THRESHOLDS = [
  // darker, brighter
  [0, [10, 10, 10], [250, 250, 250]],
  [1000, [227, 230, 70], [227, 230, 70]],
  [3000, [0, 0, 0], [60, 200, 60]],
  [6000, [0, 0, 0], [46, 196, 255]],
  [10000, [0, 0, 0], [238, 48, 255]],
  [15000, [255, 255, 255], [0, 0, 0]],
  [20000, [145, 71, 255], [0, 0, 0]],
  [25000, [255, 5, 5], [0, 0, 0]],
  [30000, [255, 255, 255], [255, 255, 255]],
];

const FLAME_STARTING_DURATION = 50; // ms
const FLAME_ADDITIONAL_DURATION = 8; // ms

const FLAME_WIDTH = 300;
const FLAME_PIXEL_COUNT = 20; // amount across flame width

const FLAME_NOISE_SCALE = 0.16;
const FLAME_SPEED_FACTOR = 0.1;

const END_SCENE = {
  timePlayed: null,
  targetScorePos: null, // move scorePos to here
  scorePos: null,
  doneWithScore: false,
  flameIndex: 0,

  progressCountUpMax: 0,
  progressCountUp: 0,

  initialize: function () {
    this.timePlayed = null;
    this.targetScorePos = [width / 2, height / 2];
    this.scorePos = [width / 2, height / 2];
    this.doneWithScore = false;
    this.flameIndex = 0;

    this.progressCountUpMax = FLAME_STARTING_DURATION;
    this.progressCountUp = 0;
  },

  render: function () {
    background(BG_COLOR);

    const isLastFlame = this.flameIndex === FLAME_THRESHOLDS.length - 1;
    let [startingScore, c1, c2] =
      FLAME_THRESHOLDS[min(this.flameIndex, FLAME_THRESHOLDS.length - 1)];
    const endingScore =
      this.flameIndex < FLAME_THRESHOLDS.length - 1
        ? FLAME_THRESHOLDS[this.flameIndex + 1][0]
        : totalScore;
    c1 = color(c1[0], c1[1], c1[2]);
    c2 = color(c2[0], c2[1], c2[2]);

    let displayScore;
    if (this.doneWithScore) {
      displayScore = totalScore;
    } else {
      // set score based on progress
      displayScore = floor(
        lerp(
          startingScore,
          endingScore,
          this.progressCountUp / this.progressCountUpMax
        )
      );
      // check to stop animating score
      if (displayScore > totalScore) {
        displayScore = totalScore;
        this.doneWithScore = true;
      }
    }

    push(); // pushMatrix(); // KA
    translate(this.scorePos[0], this.scorePos[1]);
    // update pos
    if (this.doneWithScore) {
      this.targetScorePos[0] = 200;
    }
    this.scorePos[0] += (this.targetScorePos[0] - this.scorePos[0]) * 0.1;
    this.scorePos[1] += (this.targetScorePos[1] - this.scorePos[1]) * 0.1;

    // render score bg
    const FLAME_PIXEL_SIZE = FLAME_WIDTH / FLAME_PIXEL_COUNT;
    noStroke();
    fill(DARK_COLOR);
    rect(0, 0, FLAME_WIDTH, 80, 0, 0, 30, 30);

    // render score
    textSize(60);
    fill(this.flameIndex < 5 ? c2 : c1);
    if (isLastFlame) {
      fill(255, 150 + cos(frameCount * 10) * 100);
    }
    text(displayScore, 0, 5);

    // render flames
    const flameHeightCount = this.flameIndex * 3;
    const HALF_FLAME_WIDTH = FLAME_WIDTH / 2;
    const renderPixSize = FLAME_PIXEL_SIZE * 1.04;
    for (let x = 0; x < FLAME_PIXEL_COUNT; x++) {
      if (isLastFlame) {
        colorMode(HSB, 255);
        c1 = color((x / FLAME_PIXEL_COUNT) * 255, 255, 255);
        colorMode(RGB, 255);
      }
      for (let y = 0; y < flameHeightCount; y++) {
        let noiseValue = noise(
          x * FLAME_NOISE_SCALE,
          (y - frameCount * this.flameIndex * FLAME_SPEED_FACTOR) *
            FLAME_NOISE_SCALE
        );
        noiseValue += (y - flameHeightCount / 2) * 0.03;

        if (noiseValue > 0.4 && noiseValue < 0.5) {
          // FIRE OUTLINE
          fill(c2);
        } else if (noiseValue <= 0.4) {
          // FIRE WALLS
          if (
            x === 0 ||
            x === FLAME_PIXEL_COUNT - 1 ||
            y === flameHeightCount - 1
          ) {
            fill(c2);
          } else {
            if (isLastFlame) {
              fill(c1);
            } else {
              fill(
                lerpColor(
                  c2,
                  c1,
                  round(max(0, noiseValue) * 15) /
                    (this.flameIndex < 5 ? 10 : 5)
                )
              );
            }
          }
        } else {
          continue; // emptiness
        }
        rect(
          (x + 0.5) * FLAME_PIXEL_SIZE - HALF_FLAME_WIDTH,
          -40 - (y + 0.5) * FLAME_PIXEL_SIZE,
          renderPixSize,
          renderPixSize
        );
      }
    }

    pop(); // popMatrix(); // KA

    // update score & flames when not transitioning
    if (SCENE_TRANSITION.progress === 1 && !this.doneWithScore) {
      if (this.progressCountUp === this.progressCountUpMax) {
        if (this.flameIndex < FLAME_THRESHOLDS.length - 1) {
          this.flameIndex++;
        }
        this.progressCountUpMax =
          FLAME_STARTING_DURATION + this.flameIndex * FLAME_ADDITIONAL_DURATION;
        this.progressCountUp = 0;
        this.targetScorePos[1] = height / 2 + this.flameIndex * 20; // moved down
        if (displayScore >= totalScore) this.doneWithScore = true;
      }
      this.progressCountUp++;
    }

    // set timer if not already
    if (this.timePlayed === null) {
      let timeElapsed = Date.now() - startTime;
      let minute = floor(timeElapsed / 60000);
      let sec = floor((timeElapsed % 60000) / 1000) + "";
      if (sec.length === 1) {
        sec = "0" + sec;
      }
      this.timePlayed = `Time played:\n${minute}:${sec}`;
    }
  },
  mouseClicked: function () {
    print(this.timePlayed);
  },
};
