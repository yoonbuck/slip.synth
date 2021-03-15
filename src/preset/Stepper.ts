import { Scrubbable } from "./Scrubbable";

export default class Stepper implements Scrubbable {
  value: number;
  step: number;
  steps: number;

  cb: () => void;

  constructor(steps: number, cb: () => void) {
    this.steps = steps;
    this.cb = cb;
    this.step = 0;
    this.value = 0;
  }

  set(value: number) {
    this.value = value;
    this.step = Math.floor(this.steps * value);
    if (this.step > this.steps) this.step = this.steps;
    this.cb?.();
  }

  setSteps(steps: number) {
    this.steps = steps;
    this.set(this.value);
  }
}
