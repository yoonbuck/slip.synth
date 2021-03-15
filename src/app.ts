import Serial from "p5-webserial";
import ADSREnvelope from "./audio/ADSREnvelope";
import AudioScheduler from "./audio/AudioScheduler";
import SinGenerator from "./audio/SinGenerator";
import SquareGenerator from "./audio/SquareGenerator";
import SawtoothGenerator from "./audio/SawtoothGenerator";
import Summer from "./audio/Summer";
import TriangleGenerator from "./audio/TriangleGenerator";
import drawBanner from "./graphics/banner";
import { clearCanvas, onresize } from "./graphics/canvas";
import drawControllers from "./graphics/controllers";
import drawTouchBar from "./graphics/touchBar";
import InputSmoother from "./input";
import { clonePreset, defaultPreset } from "./preset/Preset";
import Scrubber from "./preset/Scrubber";
import SettingController from "./preset/SettingController";
import Stepper from "./preset/Stepper";
import { tune } from "./tune";
import Button from "./util/Button";

const SAMPLE_RATE = 41000;
const SCALE_TONES = 19;

const serial = new Serial();
let dirty = true;

let scrubber = new Scrubber();
let editMode = false;
let changeMode = false;
let paramStepper: Stepper;

const buttonA = new Button();
buttonA.onpress = pressA;
buttonA.onhold = toggleEditMode;
const buttonB = new Button();
buttonB.onpress = () => console.log("b press!");
buttonB.onhold = () => console.log("b hold!");

let serialHasPort = false;
function initSerial() {
  serial.getPorts();
  serial.on("portavailable", function () {
    setDirty();
    serialHasPort = true;
    serial.open({ baudRate: 19200 });
  });
  serial.on("noport", function () {
    serialHasPort = false;
  });
  serial.on("requesterror", function () {
    serialHasPort = false;
  });

  serial.on("data", data);
}

let input = new InputSmoother({
  rollingSize: 10,
  disableDelay: 2,
  enableDelay: 4,
});

let touchPosition = -1;
let tunedPosition = -1;

let presets = [clonePreset(defaultPreset)];
let preset = 0;

const settingControllers: SettingController[] = [];

let gen1: SquareGenerator;
let gen2: SquareGenerator;
let gen3: SquareGenerator;
let gen4: SquareGenerator;
let gen5: TriangleGenerator;
let sum: Summer;
let env: ADSREnvelope;
let audioCtx: AudioContext;
let gain: GainNode;
let scheduler: AudioScheduler;
let audioInitialized = false;
function initAudio() {
  gen1 = new TriangleGenerator(41000);
  gen1.amplitude = 1 / 2;
  gen2 = new TriangleGenerator(41000);
  gen2.amplitude = 1 / 4;
  gen3 = new TriangleGenerator(41000);
  gen3.amplitude = 1 / 6;
  // gen4 = new TriangleGenerator(41000);
  // gen4.amplitude = 1 / 8;
  // gen5 = new TriangleGenerator(41000);
  // gen5.amplitude = 1 / 2;

  sum = new Summer(41000, gen1, gen2, gen3);
  let { attack, decay, sustain, release } = presets[preset];
  env = new ADSREnvelope(sum, attack, decay, sustain, release);
  audioCtx = new AudioContext();
  gain = audioCtx.createGain();
  gain.gain.value = 0.25;
  gain.connect(audioCtx.destination);
  scheduler = new AudioScheduler(audioCtx, env);
  scheduler.destination = gain;
  scheduler.start();

  setDirty();
  audioInitialized = true;
}

function data() {
  let line = serial.readLine();
  if (line !== null) {
    if (line === "a") {
      return buttonA.off();
    } else if (line === "A") {
      return buttonA.on();
    } else if (line === "b") {
      return buttonB.off();
    } else if (line === "B") {
      return buttonB.on();
    }

    let rawValue = parseInt(line);
    if (Number.isNaN(rawValue)) return;
    touchPosition = input.sample(rawValue);

    if (editMode) {
      if (touchPosition !== -1) {
        scrubber.at(touchPosition);
      } else {
        scrubber.off();
      }
    } else if (audioInitialized) {
      if (touchPosition !== -1) {
        let { shift, tune: tuneVal, scale } = presets[preset];
        let note = touchPosition * scale + shift;
        note = tune(note, tuneVal);
        tunedPosition = (note - shift) / scale;
        env?.on();
        let freq = 440 * Math.pow(2, note / SCALE_TONES);
        gen1.frequency = 1 * freq;
        gen2.frequency = 2 * freq;
        gen3.frequency = 4 * freq;
        // gen4.frequency = 3 * freq;
        // gen5.frequency = 8 * freq;
      } else {
        env?.off();
      }
    }

    // call again - to consume extra data if we have another line!
    data();
  }
}

function toggleEditMode() {
  editMode = !editMode;
  scrubber.retarget(paramStepper);
  changeMode = false;
  touchPosition = -1;
  tunedPosition = -1;
  setDirty();
}

function pressA() {
  if (editMode) {
    changeMode = !changeMode;
    if (changeMode) {
      scrubber.retarget(settingControllers[paramStepper.step]);
    } else {
      scrubber.retarget(paramStepper);
    }
    setDirty();
  }
}

function setDirty() {
  dirty = true;
}

function initControllers() {
  let p = presets[preset];
  settingControllers.push(
    new SettingController(
      p,
      "shift",
      (n) => Math.floor(n * 56 - 48),
      (n) => (n + 48) / 56,
      setDirty
    )
  );
  settingControllers.push(
    new SettingController(
      p,
      "scale",
      (n) => n * 43 + 7,
      (n) => (n - 7) / 43,
      setDirty
    )
  );
  settingControllers.push(
    new SettingController(
      p,
      "tune",
      (n) => n * 3 + 1,
      (n) => (n - 1) / 3,
      setDirty
    )
  );
  settingControllers.push(
    new SettingController(
      p,
      "attack",
      (n) => n * 5000,
      (n) => n / 5000,
      setEnv
    )
  );
  settingControllers.push(
    new SettingController(
      p,
      "decay",
      (n) => n * 5000,
      (n) => n / 5000,
      setEnv
    )
  );
  settingControllers.push(
    new SettingController(
      p,
      "sustain",
      (n) => n,
      (n) => n,
      setEnv
    )
  );
  settingControllers.push(
    new SettingController(
      p,
      "release",
      (n) => n * 5000,
      (n) => n / 5000,
      setEnv
    )
  );

  paramStepper = new Stepper(settingControllers.length, setDirty);
}

function setEnv() {
  if (audioInitialized) {
    let { attack, decay, sustain, release } = presets[preset];
    env?.setAttack(attack);
    env?.setDecay(decay);
    env?.setSustain(sustain);
    env?.setRelease(release);
  }
  setDirty();
}

function click() {
  if (!audioInitialized) {
    initAudio();
  }
  if (!serialHasPort) {
    serial.requestPort();
  }
}

function draw() {
  if (dirty) {
    clearCanvas();
  }

  if (!audioInitialized) {
    drawBanner("Click to initialize audio.");
  } else if (!serialHasPort) {
    drawBanner("Click to select a serial port.");
  } else {
    drawTouchBar(touchPosition, tunedPosition);
    if (dirty) {
      drawControllers(
        settingControllers,
        editMode,
        changeMode,
        paramStepper?.step
      );
    }
  }

  dirty = false;
  requestAnimationFrame(draw);
}

document.addEventListener("click", click);
initSerial();
initControllers();
onresize(setDirty);
draw();
