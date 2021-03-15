import IGenerator from "./IGenerator";

const TAU = 2 * Math.PI;

export default class SinGenerator implements IGenerator {
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
    return this.amplitude * Math.sin(this.time * TAU);
  }
}
