async function autoplay(gameEngine, moves, period = 100) {
  for (const m of moves) {
    await new Promise((res) => setTimeout(res, period));
    gameEngine.move(m);
  }
}

export default autoplay;