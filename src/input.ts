export default class InputSmoother {
  upper: number;
  divider: number;
  enableDelay: number;
  disableDelay: number;
  rollingSize: number;
  threshold: number;

  inactiveSamples: number;

  rawBuffer: number[] = [];
  outBuffer: number[] = [];

  constructor({
    upper = 18000,
    divider = 10000,
    enableDelay = 0,
    disableDelay = 0,
    rollingSize = 5,
    threshold = 300,
  } = {}) {
    this.upper = upper;
    this.divider = divider;
    this.enableDelay = enableDelay;
    this.disableDelay = disableDelay;
    this.inactiveSamples = disableDelay;
    this.rollingSize = rollingSize;
    this.threshold = threshold;
  }

  sample(rawValue: number): number {
    if (rawValue < this.threshold) {
      // no press
      if (this.inactiveSamples < this.disableDelay) {
        this.inactiveSamples++;
      } else {
        if (this.inactiveSamples === this.disableDelay) {
          this.inactiveSamples++;
          this.rawBuffer.length = 0;
        }
        return -1;
      }
    } else {
      this.inactiveSamples = 0;
      // has value: update buffer
      this.rawBuffer.push(rawValue);
      if (this.rawBuffer.length > this.rollingSize) {
        this.rawBuffer.shift();
      }
    }
    if (this.rawBuffer.length < this.enableDelay) {
      return -1;
    }
    let sum = 0;
    for (let i = 0; i < this.rawBuffer.length; i++) {
      sum += this.rawBuffer[i];
    }
    sum /= this.rawBuffer.length;
    return this.normalize(sum);
  }

  normalize(rawValue: number): number {
    return Math.min(
      1,
      Math.max(
        0,
        1 - ((1024 * this.divider) / rawValue - this.divider) / this.upper
      )
    );
  }
}
