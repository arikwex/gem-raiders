import TILE_TYPE from '../constants/tile-types.js';

function levelGenerator(rows, cols) {
  const tiles = [];

  // Exit panels
  tiles.push(new Array(cols).fill(TILE_TYPE.EXIT));

  // Middle of level
  for (let r = 0; r < rows; r++) {
    tiles.push(new Array(cols).fill(TILE_TYPE.BASIC));
  }

  // Hype placement
  for (let n = 0; n < rows * cols; n++) {
    if (Math.random() > 0.4) {
      let r = parseInt(Math.random() * rows);
      let c = parseInt(Math.random() * cols);
      const opts = [
        TILE_TYPE.DOUBLE, TILE_TYPE.TRIPLE, TILE_TYPE.HOLE,
        TILE_TYPE.SPIKE_UP, TILE_TYPE.SPIKE_DOWN,
      ];
      const tileType = opts[parseInt(Math.random() * opts.length)];
      tiles[r + 1][c] = tileType;
    }
  }

  // Gem placement
  for (let g = 0; g < 3; g++) {
    while (true) {
      let r = parseInt(Math.random() * rows);
      let c = parseInt(Math.random() * cols);
      if (tiles[r + 1][c] != TILE_TYPE.GEM) {
        tiles[r + 1][c] = TILE_TYPE.GEM;
        break;
      }
    }
  }

  // Entry panels
  tiles.push(new Array(cols).fill(TILE_TYPE.ENTRY));

  return tiles;
}

export default levelGenerator;