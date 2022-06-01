import * as EventEmitter from 'eventemitter3';
import { transition, SCENES } from './scenes/scene-manager.js';
import AudioManager from './managers/audio-manager.js';
import ControllerManager from './managers/controller-manager.js';

import levelGenerator from './ai/level-generator.js';
import LEVEL_DATA from './constants/level-data.js';

(() => {
  LEVEL_DATA[1] = levelGenerator(5, 5);
  AudioManager.initialize();
  ControllerManager.initialize();
  transition(SCENES.GAME);
})();