import IGenerator from "./IGenerator";

const TAU = 2 * Math.PI;

export default class SawtoothGenerator implements IGenerator {
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
    return 2 * this.amplitude * (this.time - 0.5);
  }
}
