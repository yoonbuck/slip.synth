import IGenerator from "./IGenerator";

export default class AudioScheduler {
  audioCtx: AudioContext;
  generator: IGenerator;

  nextSampleTime: number;
  nextTimeout: number;

  interval: number;
  lookahead: number;
  bufferSize: number;

  destination: AudioNode;

  constructor(
    ctx: AudioContext,
    generator: IGenerator,
    { lookahead = 35, interval = 10, bufferSize = 10 } = {}
  ) {
    this.audioCtx = ctx;
    this.generator = generator;
    this.interval = interval;
    this.lookahead = lookahead;
    this.bufferSize = Math.floor((bufferSize / 1000) * ctx.sampleRate);

    this.schedule = this.schedule.bind(this);
    this.destination = ctx.destination;
  }

  start(time: number = this.audioCtx.currentTime) {
    clearTimeout(this.nextTimeout);
    this.nextSampleTime = time;
    this.schedule();
  }

  schedule() {
    let sampleTime = this.nextSampleTime;
    let currentTime = this.audioCtx.currentTime;
    let scheduleUntil = currentTime + (this.lookahead + this.interval) / 1000;

    while (sampleTime < scheduleUntil) {
      let buffer = this.audioCtx.createBuffer(
        1,
        this.bufferSize,
        this.audioCtx.sampleRate
      );
      let data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = this.generator.tic();
      }
      let source = this.audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.destination);
      source.start(sampleTime);
      sampleTime += buffer.length / this.audioCtx.sampleRate;
    }
    this.nextSampleTime = sampleTime;
    this.nextTimeout = window.setTimeout(this.schedule, this.interval);
  }

  stop() {
    clearTimeout(this.nextTimeout);
  }
}
