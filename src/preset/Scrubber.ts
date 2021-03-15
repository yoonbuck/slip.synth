import { Scrubbable } from "./Scrubbable";

const SCRUB_BUF = 10;
const SCALE_FACTOR = 20;

export default class Scrubber {
  target: Scrubbable;

  lastPos = -1;
  posBuf: number[] = [];

  retarget(target: Scrubbable) {
    this.target = target;
    this.off();
  }

  off() {
    this.posBuf.length = 0;
    this.lastPos = -1;
  }

  at(pos: number) {
    if (!this.target) return;

    this.posBuf.push(pos);
    if (this.posBuf.length === SCRUB_BUF) {
      let t = 0;
      for (let v of this.posBuf) {
        t += v;
      }
      t /= SCRUB_BUF;
      this.posBuf.length = 0;

      if (this.lastPos !== -1) {
        let diff = t - this.lastPos;
        let change = Math.sign(diff) * diff * diff * SCALE_FACTOR;
        let newVal = Math.min(1, Math.max(0, this.target.value + change));
        if (newVal !== this.target.value) {
          this.target.set(newVal);
        }
      }
      this.lastPos = t;
    }
  }
}
