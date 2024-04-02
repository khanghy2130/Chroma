const PIECE_TYPES = [
  // 1 shape
  ["T", "S"],
  // 2 shapes
  ["TT", "TS"],
  // 3 shapes
  ["STT", "TTS", "STS", "TST-", "TST^"],
];

/*
  T: {
    centerShapeIndices: [0,1,2,3], // ALL TRIANGLES
  }
  S: {
    centerShapeIndices: [4,5], // ALL SQUARES
  }
  
  TT: {
    centerShapeIndices: [0,1,2,3], // ALL TRIANGLES
    REQUIRE THE NEIGHBOR TRIANGLE
  }
  TS: {
    centerShapeIndices: [4,5], // ALL SQUARES
    EDGE: CHECK ALL 4 NEIGHBOR TRIANGLES
  }

  STT: {
    centerShapeIndices: [4], // LEFT SQUARE
    EDGE: CHECK ALL 4 NEIGHBOR TRIANGLES
  }
  TTS: {
    centerShapeIndices: [5], // RIGHT SQUARE
    EDGE: CHECK ALL 4 NEIGHBOR TRIANGLES
  }

  STS: {
    centerShapeIndices: [0,1,2,3], // ALL TRIANGLES
  }
  TST-: {
    centerShapeIndices: [4,5], // ALL SQUARES
  }
  TST^: {
    centerShapeIndices: [4,5], // ALL SQUARES
  }

*/
