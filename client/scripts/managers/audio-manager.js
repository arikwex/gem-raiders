import bus from '../bus.js'

function AudioManager() {
  let audioCtx = null;
  let sampleRate = null;

  // Sounds to be loaded on loadSounds (cursed AudioContext waiting for interaction)
  let beepSound;

  // Useful tone generators
  var sin = (i) => Math.min(Math.max(Math.sin(i), -1), 1)
  var saw = (i) => ((i % 6.28)-3.14)/6.28;
  var sqr = (i) => Math.min(Math.max(Math.sin(i) * 1000, -1), 1)
  var win = (i, ts, te) => {
    if (i<ts*44100 || i>te*44100) {return 0;}
    return 1 - ((i/44100) - ts)/(te - ts);
  }
  var winUnclamped = (i, ts, te) => {
    return 1 - ((i/44100) - ts)/(te - ts);
  }
  var note = (i, tone, time, dur) => {
    if (i<time*44100 || i>(time+dur)*44100) {return 0;}
    return 0.01*sqr(i / (80/Math.pow(2,tone/12))) * winUnclamped(i,time,time+dur);
  };
  var hhat = (i, time) => 0.02*Math.random() * win(i,time,time+0.06);

  var generate = async (duration, fn, fading = true) => {
    var audioBuffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
    var buffer = audioBuffer.getChannelData(0);
    var N = audioBuffer.length;
    var anim = 0;
    for (var i = 0; i < N; i++) {
      var p = i / N;
      var envelope = 1 - p;
      if (!fading) { envelope = 1; }
      buffer[i] = fn(i*44100/sampleRate) * envelope;
      if (i % 10000 == 0) {
        await new Promise((res) => { setTimeout(res, 0); });
      }
    }
    return audioBuffer;
  }

  this.loadSounds = async () => {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    sampleRate = audioCtx.sampleRate;

    beepSound = await generate(0.25, (i) => {
      return sin(i / 20);
    }, true);
  }

  var play = (audioBuffer) => {
    if (audioCtx === null) {
      return;
    }
    var source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
  };

  this.loadOnContextGain = async () => {
    window.removeEventListener('mousedown', this.loadOnContextGain);
    await this.loadSounds();
  };

  this.initialize = () => {
    window.addEventListener('mousedown', this.loadOnContextGain);
    bus.on('beep', () => { play(beepSound); });
  };
}

export default new AudioManager();
