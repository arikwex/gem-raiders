import bus from '../bus.js';
import LEVEL_DATA from '../constants/level-data.js';

const GameEngine = () => {
  const state = {
    tiles: [[]],
    gems: [],
    characters: [],
    tick: 0,
  };

  const loadLevel = (level) => {
    const data = LEVEL_DATA[level];
    state.tiles = data;
  };

  return {
    state,
    loadLevel,
  };
};

export default GameEngine;