import bus from '../bus.js';
import ui from '../ui/ui-main-menu.js';
import levelManager from '../managers/level-manager.js';

let requestAnimate = null;

function initialize() {
  levelManager.reset();
  animate();
}

function cleanup() {
  window.cancelAnimationFrame(requestAnimate);
}

function animate() {
  ui.render();
  requestAnimate = window.requestAnimationFrame(animate);
}

export default {
  initialize,
  cleanup,
};
