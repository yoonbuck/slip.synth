import Debounce from "./Debounce";

const BUTTON_DEBOUNCE = 150;
const BUTTON_LONG_PRESS = 500;

type Listener = (arg0: boolean) => void;

export default class Button {
  debounce: Debounce<boolean>;

  onpress: () => void;
  onhold: () => void;

  countPress: boolean;
  longPressHandler: number;

  constructor() {
    this.debounce = new Debounce<boolean>(BUTTON_DEBOUNCE, false, (v) =>
      this.callback(v)
    );
  }

  callback(val: boolean) {
    if (val) {
      this.countPress = true;
      this.longPressHandler = window.setTimeout(() => {
        this.onhold?.();
        this.countPress = false;
      }, BUTTON_LONG_PRESS);
    } else if (this.countPress) {
      clearTimeout(this.longPressHandler);
      this.onpress?.();
    }
  }

  on() {
    this.debounce.set(true);
  }

  off() {
    this.debounce.set(false);
  }

  get(): boolean {
    return this.debounce.value;
  }
}
