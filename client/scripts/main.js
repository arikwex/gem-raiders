import * as EventEmitter from 'eventemitter3';
import { transition, SCENES } from './scenes/scene-manager.js';
import AudioManager from './managers/audio-manager.js';

(() => {
  AudioManager.initialize();
  transition(SCENES.MAIN_MENU);
})();