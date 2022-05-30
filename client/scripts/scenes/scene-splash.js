import bus from '../bus.js';
import ui from '../ui/ui-splash.js';
import levelManager from '../managers/level-manager.js';
import { transition, SCENES } from '../scenes/scene-manager.js';

let requestAnimate = null;

function initialize() {
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
