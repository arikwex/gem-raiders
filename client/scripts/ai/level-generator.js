import TILE_TYPE from '../constants/tile-types.js';

function levelGenerator(rows, cols) {
  const tiles = [];
  
  // Exit panels
  tiles.push(new Array(cols).fill(TILE_TYPE.EXIT));

  // Middle of level
  for (let r = 0; r < rows; r++) {
    tiles.push(new Array(cols).fill(TILE_TYPE.BASIC));
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