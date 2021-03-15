import IGenerator from "./IGenerator";

export default class AREnvelope implements IGenerator {
  generator: IGenerator;
  attackSamples: number;
  releaseSamples: number;
  sampleRate: number;

  mode: 0 | 1 | 2 | 3;
  time: number;

  constructor(generator: IGenerator, attack: number, release: number) {
    this.generator = generator;
    this.sampleRate = generator.sampleRate;
    this.mode = 0;
    this.time = 0;
    this.setAttack(attack);
    this.setRelease(release);
  }

  setAttack(attack: number) {
    this.attackSamples = Math.floor((attack / 1000) * this.sampleRate);
  }

  setRelease(release: number) {
    this.releaseSamples = Math.floor((release / 1000) * this.sampleRate);
  }

  on() {
    if (this.mode === 0) {
      this.mode = 1;
      this.time = 0;
    } else if (this.mode === 3) {
      this.mode = 1;
      this.time = Math.floor(
        (1 - this.time / this.releaseSamples) * this.attackSamples
      );
    }
  }

  off() {
    if (this.mode === 2) {
      this.mode = 3;
      this.time = 0;
    } else if (this.mode === 1) {
      this.mode = 3;
      this.time = Math.floor(
        (1 - this.time / this.attackSamples) * this.releaseSamples
      );
    }
  }

  tic() {
    let sample = this.generator.tic();
    let r: number;
    switch (this.mode) {
      case 0:
        return 0;
      case 1:
        r = (sample * this.time) / this.attackSamples;
        if (this.time++ >= this.attackSamples) {
          this.time = 0;
          this.mode = 2;
        }
        return r;
      case 2:
        return sample;
      case 3:
        r = sample * (1 - this.time / this.releaseSamples);
        if (this.time++ >= this.releaseSamples) {
          this.time = 0;
          this.mode = 0;
        }
        return r;
    }
  }
}
