import bus from '../bus.js';
import LEVEL_DATA from '../constants/level-data.js';
import TILE_TYPE from '../constants/tile-types.js';

const GameEngine = () => {
  const state = {
    tiles: [[]],
    characters: [],
    characterIndex: 0,
    tick: 0,
  };

  const history = [];

  const clearHistory = () =>{
    while (history.length > 0) {
      history.pop();
    }
  }

  const storeHistory = () => {
    history.push(JSON.stringify(state));
  }

  const undo = () => {
    if (history.length == 0) {
      return;
    }
    const historyString = history.pop();
    const historyJson = JSON.parse(historyString);
    state.tiles = historyJson.tiles;
    state.characters = historyJson.characters;
    state.characterIndex = historyJson.characterIndex;
    state.tick = historyJson.tick;
  }

  const loadLevel = (level) => {
    clearHistory();
    const data = LEVEL_DATA[level];
    state.tick = 0;
    state.tiles = JSON.parse(JSON.stringify(data));
    state.characters = [
      [parseInt(data[0].length / 2), data.length - 1, false],
      [parseInt(data[0].length / 2 - 1), data.length, false],
      [parseInt(data[0].length / 2 + 1), data.length, false],
    ];
    state.characterIndex = 0;
  };

  const move = (position) => {
    storeHistory();
    state.tick += 1;
    const character = state.characters[state.characterIndex];
    const oldC = character[0];
    const oldR = character[1];
    character[0] = position[0];
    character[1] = position[1];

    const tile = state.tiles[position[1]][position[0]];
    const oldTile = state.tiles[oldR][oldC];

    // Collection of gem if character is not holding one already
    if (character[2] == false && tile == TILE_TYPE.GEM) {
      state.tiles[position[1]][position[0]] = TILE_TYPE.BASIC;
      character[2] = true;
    }

    // Stepping off a basic tile makes it a hole
    if (oldTile == TILE_TYPE.BASIC) {
      state.tiles[oldR][oldC] = TILE_TYPE.HOLE;
    }

    // Stepping on a double tile makes it a basic tile
    if (tile == TILE_TYPE.DOUBLE) {
      state.tiles[position[1]][position[0]] = TILE_TYPE.BASIC;
    } else if (tile == TILE_TYPE.TRIPLE) {
      state.tiles[position[1]][position[0]] = TILE_TYPE.DOUBLE;
    }

    // Reaching end of level area advances to next character
    if (position[1] == 0) {
      if (state.characterIndex == 0) {
        state.characters[state.characterIndex][0] = 0;
        state.characters[state.characterIndex][1] = -1;
        state.characters[state.characterIndex][2] = false;
        state.characters[state.characterIndex + 1][1] -= 1;
        state.characterIndex += 1;
      } else if (state.characterIndex == 1) {
        state.characters[state.characterIndex][0] = 1;
        state.characters[state.characterIndex][1] = -1;
        state.characters[state.characterIndex][2] = false;
        state.characters[state.characterIndex + 1][1] -= 1;
        state.characterIndex += 1;
      } else if (state.characterIndex == 2) {
        state.characters[state.characterIndex][0] = 2;
        state.characters[state.characterIndex][1] = -1;
        state.characters[state.characterIndex][2] = false;
        console.log('SUCCESS!');
      }
    }
  };

  const getValidMoves = () => {
    const character = state.characters[state.characterIndex];
    const x = character[0];
    const y = character[1];
    const moves = [];
    if (isValidMove(character, x-1, y)) { moves.push([x-1, y]); }
    if (isValidMove(character, x+1, y)) { moves.push([x+1, y]); }
    if (isValidMove(character, x, y-1)) { moves.push([x, y-1]); }
    if (isValidMove(character, x, y+1)) { moves.push([x, y+1]); }
    return moves;
  };

  const isValidMove = (character, c, r) => {
    if (c < 0 || c >= state.tiles[0].length) { return false; }
    if (r < 0 || r >= state.tiles.length) { return false; }
    const tile = state.tiles[r][c];
    if (tile == TILE_TYPE.HOLE) { return false; }
    if (tile == TILE_TYPE.EXIT && character[2] == false) { return false; }
    return true;
  };

  const getCurrentCharacterInfo = () => {
    const character = state.characters[state.characterIndex];
    return [character[0], character[1], character[2]];
  }

  return {
    state,
    loadLevel,
    move,
    getValidMoves,
    isValidMove,
    getCurrentCharacterInfo,
    undo,
  };
};

export default GameEngine;