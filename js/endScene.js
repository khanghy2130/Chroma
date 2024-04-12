const END_SCENE = {
  timePlayed: null,

  render: function () {
    background(BG_COLOR);

    // set timer if not already
    if (timeElapsed === null) {
      timeElapsed = Date.now() - startTime;
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
