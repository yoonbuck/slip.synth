import IGenerator from "./IGenerator";

export default class ADSREnvelope implements IGenerator {
  generator: IGenerator;
  attackSamples: number;
  decaySamples: number;
  sustainLevel: number;
  releaseSamples: number;
  sampleRate: number;

  mode: 0 | 1 | 2 | 3 | 4;
  time: number;

  constructor(
    generator: IGenerator,
    attack: number,
    decay: number,
    sustain: number,
    release: number
  ) {
    this.generator = generator;
    this.sampleRate = generator.sampleRate;
    this.mode = 0;
    this.time = 0;
    this.setAttack(attack);
    this.setDecay(decay);
    this.sustainLevel = sustain;
    this.setRelease(release);
  }

  setAttack(attack: number) {
    this.attackSamples = Math.floor((attack / 1000) * this.sampleRate);
  }

  setDecay(decay: number) {
    this.decaySamples = Math.floor((decay / 1000) * this.sampleRate);
  }

  setSustain(sustain: number) {
    this.sustainLevel = sustain;
  }

  setRelease(release: number) {
    this.releaseSamples = Math.floor((release / 1000) * this.sampleRate);
  }

  on() {
    if (this.mode === 0) {
      this.mode = 1;
      this.time = 0;
    } else if (this.mode === 4) {
      this.mode = 1;
      this.time = Math.floor(
        (1 - this.time / this.releaseSamples) *
          this.sustainLevel *
          this.attackSamples
      );
    }
  }

  off() {
    if (this.mode === 3) {
      this.mode = 4;
      this.time = 0;
    } else if (this.mode === 2) {
      this.mode = 4;
      // t' = (r)(1-s)(t-d) / (ds)
      this.time =
        (this.releaseSamples *
          (1 - this.sustainLevel) *
          (this.time - this.decaySamples)) /
        (this.decaySamples * this.sustainLevel);
    } else if (this.mode === 1) {
      this.mode = 4;
      this.time =
        (1 - this.time / this.attackSamples / this.sustainLevel) *
        this.releaseSamples;
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
        r =
          sample *
          (1 - (this.time / this.decaySamples) * (1 - this.sustainLevel));
        if (this.time++ >= this.decaySamples) {
          this.time = 0;
          this.mode = 3;
        }
        return r;
      case 3:
        return sample * this.sustainLevel;
      case 4:
        r = sample * (1 - this.time / this.releaseSamples) * this.sustainLevel;
        if (this.time++ >= this.releaseSamples) {
          this.time = 0;
          this.mode = 0;
        }
        return r;
    }
  }
}
