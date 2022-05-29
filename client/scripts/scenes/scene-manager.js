import mainMenu from './scene-main-menu.js';

let activeScene = null;

export const SCENES = {
  MAIN_MENU: mainMenu,
};

export function transition(scene) {
  activeScene?.cleanup();
  scene.initialize();
  activeScene = scene;
}
