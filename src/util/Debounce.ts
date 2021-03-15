export default class Debounce<T> {
  value: T;
  listener: (arg0: T) => void;
  timeout: number;

  handle = -1;

  constructor(timeout: number, initial?: T, listener?: (arg0: T) => void) {
    this.timeout = timeout;
    this.value = initial ?? undefined;
    this.listener = listener;
  }

  set(val: T) {
    clearTimeout(this.handle);
    if (val !== this.value) {
      this.handle = window.setTimeout(() => {
        if (val !== this.value) {
          this.value = val;
          this.listener?.(val);
        }
      });
    }
  }
}
