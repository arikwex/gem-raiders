import mainMenu from './scene-main-menu.js';
import game from './scene-game.js';
import splash from './scene-splash.js';

let activeScene = null;

export const SCENES = {
  MAIN_MENU: mainMenu,
  GAME: game,
  SPLASH: splash,
};

export function transition(scene) {
  activeScene?.cleanup();
  scene.initialize();
  activeScene = scene;
}
