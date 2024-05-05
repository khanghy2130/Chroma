const FLAME_THRESHOLDS = [
  // darker, brighter
  [0, [10, 10, 10], [250, 250, 250]],
  [500, [227, 230, 70], [227, 230, 70]],
  [2000, [0, 0, 0], [60, 200, 60]],
  [5000, [0, 0, 0], [46, 196, 255]],
  [9000, [0, 0, 0], [238, 48, 255]],
  [15000, [145, 71, 255], [0, 0, 0]],
  [20000, [255, 5, 5], [0, 0, 0]],
  [25000, [255, 255, 255], [255, 255, 255]],
];

const FLAME_STARTING_DURATION = 50; // ms
const FLAME_ADDITIONAL_DURATION = 8; // ms

const FLAME_WIDTH = 300;
const FLAME_PIXEL_COUNT = 20; // amount across flame width

const FLAME_NOISE_SCALE = 0.16;
const FLAME_SPEED_FACTOR = 0.1;

const END_SCENE = {
  preventInfiniteLoopCounter: 0,
  timePlayed: null,
  targetScorePos: null, // move scorePos to here
  scorePos: null,
  doneWithScore: false,
  flameIndex: 0,

  progressCountUpMax: 0,
  progressCountUp: 0,
  shrinkProgress: 0, // 1 to 0
  afterScoreProgress: 0,
  replayButton: new Btn(
    480,
    350,
    170,
    60,
    function (x, y) {
      textSize(24);
      noStroke();
      fill(LIGHT_COLOR);
      text("Play again", x, y);
    },
    () => {
      SCENE_TRANSITION.switchScene("PLAY");
    }
  ),

  initialize: function () {
    // reset button
    this.replayButton.isHovered = false;
    this.replayButton.glow = 1;

    this.preventInfiniteLoopCounter = 0;
    this.timePlayed = null;
    this.targetScorePos = [width / 2, height / 2];
    this.scorePos = [width / 2, height / 2];
    this.doneWithScore = false;
    this.flameIndex = 0;

    this.progressCountUpMax = FLAME_STARTING_DURATION;
    this.progressCountUp = 0;
    this.shrinkProgress = 0;
    this.afterScoreProgress = 0;

    // set time played
    let timeElapsed = Date.now() - startTime;
    let minute = floor(timeElapsed / 60000);
    let sec = floor((timeElapsed % 60000) / 1000) + "";
    if (sec.length === 1) {
      sec = "0" + sec;
    }
    this.timePlayed = `Time played\n${minute}:${sec}`;
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
      displayScore = floor(totalScore);
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
        displayScore = floor(totalScore);
        this.doneWithScore = true;
      }
    }

    push(); // pushMatrix(); // KA
    // update pos
    if (this.doneWithScore) {
      this.targetScorePos[0] = 200;
    }
    this.scorePos[0] += (this.targetScorePos[0] - this.scorePos[0]) * 0.1;
    this.scorePos[1] += (this.targetScorePos[1] - this.scorePos[1]) * 0.1;
    // update shrink
    if (this.shrinkProgress > 0) {
      this.shrinkProgress = max(0, this.shrinkProgress - 0.08);
    }

    translate(this.scorePos[0], this.scorePos[1]);
    scale(1 + this.shrinkProgress * 0.4);

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
        c2 = color(((frameCount % 360) / 360) * 255, 100, 255);
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
    if (SCENE_TRANSITION.progress >= 1 && !this.doneWithScore) {
      if (this.progressCountUp === this.progressCountUpMax) {
        if (this.flameIndex < FLAME_THRESHOLDS.length - 1) {
          _playSound(sounds.piecePlaced, 2);
          this.flameIndex++;
          this.shrinkProgress = 1;
        }
        this.progressCountUpMax =
          FLAME_STARTING_DURATION + this.flameIndex * FLAME_ADDITIONAL_DURATION;
        this.progressCountUp = 0;
        this.targetScorePos[1] = height / 2 + this.flameIndex * 20; // moved down
        if (displayScore >= totalScore) this.doneWithScore = true;
      }
      this.progressCountUp++;
      // force exit after around 16.7 seconds
      if (this.preventInfiniteLoopCounter++ > 600) {
        this.doneWithScore = true;
      }
    }

    if (this.doneWithScore) {
      this.afterScoreProgress = min(1, this.afterScoreProgress + 0.01);

      // render time played
      noStroke();
      textSize(easeOutElastic(this.afterScoreProgress) * 28);
      fill(LIGHT_COLOR);
      text(this.timePlayed, 480, 250);

      this.replayButton.render();
    }
  },
  mouseClicked: function () {
    if (this.doneWithScore && this.replayButton.isHovered) {
      this.replayButton.clicked();
    }
  },
};

function easeOutElastic(x) {
  const c4 = (2 * Math.PI) / 3;
  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}
