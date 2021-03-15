import { Preset } from "./Preset";
import { Scrubbable } from "./Scrubbable";

type Transformer = (arg0: number) => number;

export default class SettingController implements Scrubbable {
  target: Preset;
  param: keyof Preset;
  fn: Transformer;
  fnInv: Transformer;

  cb: () => void;

  value: number;

  constructor(
    target: Preset,
    param: keyof Preset,
    fn: Transformer,
    fnInv: Transformer,
    callback?: () => void
  ) {
    this.target = target;
    this.param = param;
    this.fn = fn;
    this.fnInv = fnInv;
    this.cb = callback;

    this.value = this.fnInv(target[param]);
  }

  retarget(target: Preset) {
    this.target = target;
    this.value = this.fnInv(target[this.param]);
  }

  set(value: number) {
    this.value = value;
    this.target[this.param] = this.fn(value);
    this.cb?.();
  }

  realValue(): number {
    return this.target[this.param];
  }
}
