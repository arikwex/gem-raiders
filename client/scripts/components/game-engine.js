import bus from '../bus.js';
import LEVEL_DATA from '../constants/level-data.js';

const GameEngine = () => {
  const state = {
    tiles: [[]],
    characters: [],
    tick: 0,
  };

  const loadLevel = (level) => {
    const data = LEVEL_DATA[level];
    state.tick = 0;
    state.tiles = data;
    state.characters = [
      [parseInt(data[0].length / 2), data.length - 1, false],
      [parseInt(data[0].length / 2 - 1), data.length, false],
      [parseInt(data[0].length / 2 + 1), data.length, false],
    ];
  };

  return {
    state,
    loadLevel,
  };
};

export default GameEngine;