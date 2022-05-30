import LEVEL_DATA from '../constants/level-data.js';

function LevelManager() {
  let level = 3;

  function reset() {
    level = 1;
  }

  function getLevel() {
    return level;
  }

  function nextLevel() {
    level += 1;
  }

  function hasLevelData() {
    return LEVEL_DATA[level];
  }

  return {
    reset,
    getLevel,
    nextLevel,
    hasLevelData,
  }
}

export default LevelManager();