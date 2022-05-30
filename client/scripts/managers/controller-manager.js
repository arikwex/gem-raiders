import bus from '../bus.js';

function ControllerManager() {

  function initialize() {
    window.onkeydown = (evt) => {
      if (evt.key == 'ArrowUp') { bus.emit('control:up'); }
      if (evt.key == 'ArrowDown') { bus.emit('control:down'); }
      if (evt.key == 'ArrowLeft') { bus.emit('control:left'); }
      if (evt.key == 'ArrowRight') { bus.emit('control:right'); }
      if (evt.key == 'r') { bus.emit('control:reset'); }
      if (evt.key == 'u') { bus.emit('control:undo'); }
    };
  };

  return {
    initialize,
  };
}

export default ControllerManager();