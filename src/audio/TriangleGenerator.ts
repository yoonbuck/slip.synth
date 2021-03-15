import IGenerator from "./IGenerator";

const TAU = 2 * Math.PI;

export default class TriangleGenerator implements IGenerator {
  sampleRate: number;
  frequency = 440;
  amplitude = 0.5;

  time = 0;

  constructor(sampleRate: number) {
    this.sampleRate = sampleRate;
  }

  tic() {
    this.time += this.frequency / this.sampleRate;
    this.time %= 1;
    return 2 * this.amplitude * Math.abs(this.time * 2 - 1) - 0.5;
  }
}
