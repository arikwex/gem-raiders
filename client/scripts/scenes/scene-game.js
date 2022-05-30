import bus from '../bus.js';
import ui from '../ui/ui-game.js';
import GameEngine from '../components/game-engine.js';
import levelManager from '../managers/level-manager.js';

let requestAnimate = null;
let gameEngine = null;

function initialize() {
  gameEngine = GameEngine();
  gameEngine.loadLevel(levelManager.getLevel());
  animate();

  setInterval(() => {
    const moves = gameEngine.getValidMoves();
    console.log(moves);
    gameEngine.move(moves[parseInt(Math.random() * moves.length)]);
  }, 100);
}

function cleanup() {
  window.cancelAnimationFrame(requestAnimate);
  gameEngine = null;
}

function animate() {
  ui.render(gameEngine);
  requestAnimate = window.requestAnimationFrame(animate);
}

export default {
  initialize,
  cleanup,
};
