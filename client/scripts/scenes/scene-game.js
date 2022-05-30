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

  bus.on('control:up', onControlUp);
  bus.on('control:down', onControlDown);
  bus.on('control:left', onControlLeft);
  bus.on('control:right', onControlRight);
  bus.on('control:reset', onControlReset);
  bus.on('control:undo', onControlUndo);

  // setInterval(() => {
  //   const moves = gameEngine.getValidMoves();
  //   if (moves.length > 0) {
  //     gameEngine.move(moves[parseInt(Math.random() * moves.length)]);
  //   }
  // }, 100);
}

function cleanup() {
  bus.off('control:up', onControlUp);
  bus.off('control:down', onControlDown);
  bus.off('control:left', onControlLeft);
  bus.off('control:right', onControlRight);
  bus.off('control:reset', onControlReset);
  bus.off('control:undo', onControlUndo);
  window.cancelAnimationFrame(requestAnimate);
  gameEngine = null;
}

function animate() {
  ui.render(gameEngine);
  requestAnimate = window.requestAnimationFrame(animate);
}

function onControlUp() {
  const charPos = gameEngine.getCurrentCharacterInfo(); charPos[1] -= 1;
  if (gameEngine.isValidMove(charPos, charPos[0], charPos[1])) { gameEngine.move(charPos); }
}

function onControlDown() {
  const charPos = gameEngine.getCurrentCharacterInfo(); charPos[1] += 1;
  if (gameEngine.isValidMove(charPos, charPos[0], charPos[1])) { gameEngine.move(charPos); }
}

function onControlLeft() {
  const charPos = gameEngine.getCurrentCharacterInfo(); charPos[0] -= 1;
  if (gameEngine.isValidMove(charPos, charPos[0], charPos[1])) { gameEngine.move(charPos); }
}

function onControlRight() {
  const charPos = gameEngine.getCurrentCharacterInfo(); charPos[0] += 1;
  if (gameEngine.isValidMove(charPos, charPos[0], charPos[1])) { gameEngine.move(charPos); }
}

function onControlReset() {
  gameEngine.loadLevel(levelManager.getLevel());
}

function onControlUndo() {
  gameEngine.undo();
}

export default {
  initialize,
  cleanup,
};
