import IGenerator from "./IGenerator";

export default class Summer implements IGenerator {
  sampleRate: number;
  generators: IGenerator[];

  constructor(sampleRate: number, ...generators: IGenerator[]) {
    this.sampleRate = sampleRate;
    this.generators = generators;
  }

  tic(): number {
    let sum = 0;
    for (let gen of this.generators) {
      sum += gen.tic();
    }
    return sum;
  }
}
