import bus from '../bus.js';
import LEVEL_DATA from '../constants/level-data.js';
import TILE_TYPE from '../constants/tile-types.js';

const GameEngine = () => {
  const state = {
    tiles: [[]],
    characters: [],
    characterIndex: 0,
    levelPassed: false,
  };
  let silent = false;

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
    if (history.length == 0) { return; }
    const historyString = history.pop();
    const historyJson = JSON.parse(historyString);
    restoreState(historyJson);
  }

  const getSerializedState = () => {
    return JSON.stringify(state);
  }

  const restoreState = (historyJson) => {
    state.tiles = historyJson.tiles;
    state.characters = historyJson.characters;
    state.characterIndex = historyJson.characterIndex;
    state.levelPassed = historyJson.levelPassed;
  }

  const setSilent = (s) => {
    silent = s;
  }

  const loadLevel = (level) => {
    clearHistory();
    const data = LEVEL_DATA[level];
    state.tiles = JSON.parse(JSON.stringify(data));
    state.characters = [
      [parseInt(data[0].length / 2), data.length - 1, false],
      [parseInt(data[0].length / 2 - 1), data.length, false],
      [parseInt(data[0].length / 2 + 1), data.length, false],
    ];
    state.characterIndex = 0;
    state.levelPassed = false;
  };

  const move = (position) => {
    storeHistory();
    if (!silent) {
      bus.emit('character-move');
    }
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
      if (!silent) {
        bus.emit('gem-collect');
      }
    }

    // Stepping off a basic tile makes it a hole (or demotes durability)
    if (oldTile == TILE_TYPE.BASIC) {
      state.tiles[oldR][oldC] = TILE_TYPE.HOLE;
    } else if (oldTile == TILE_TYPE.DOUBLE) {
      state.tiles[oldR][oldC] = TILE_TYPE.BASIC;
    } else if (oldTile == TILE_TYPE.TRIPLE) {
      state.tiles[oldR][oldC] = TILE_TYPE.DOUBLE;
    }

    // All spike tiles alternate phase
    for (let r = 0; r < state.tiles.length; r++) {
      for (let c = 0; c < state.tiles[0].length; c++) {
        const tileType = state.tiles[r][c];
        if (tileType == TILE_TYPE.SPIKE_DOWN) {
          state.tiles[r][c] = TILE_TYPE.SPIKE_UP;
        } else if (tileType == TILE_TYPE.SPIKE_UP) {
          state.tiles[r][c] = TILE_TYPE.SPIKE_DOWN;
        }
      }
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
        state.levelPassed = true;
        if (!silent) {
          bus.emit('level-complete');
        }
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
    if (tile == TILE_TYPE.SPIKE_DOWN) { return false; }
    if (tile == TILE_TYPE.EXIT && character[2] == false) { return false; }
    return true;
  };

  const getCurrentCharacterInfo = () => {
    const character = state.characters[state.characterIndex];
    return [character[0], character[1], character[2]];
  }

  return {
    state,
    getSerializedState,
    restoreState,
    loadLevel,
    move,
    getValidMoves,
    isValidMove,
    getCurrentCharacterInfo,
    undo,
    setSilent,
  };
};

export default GameEngine;