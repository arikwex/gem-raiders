function LevelManager() {
  let level = 1;

  function reset() {
    level = 1;
  }

  function getLevel() {
    return level;
  }

  function nextLevel() {
    level += 1;
  }

  return {
    reset,
    getLevel,
    nextLevel,
  }
}

export default LevelManager();