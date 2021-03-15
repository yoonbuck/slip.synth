import SettingController from "../preset/SettingController";
import { ctx, height } from "./canvas";
import {
  CONTROLLER_FILL,
  CONTROLLER_TEXT_SPACE,
  CONTROLLER_WIDTH,
  PAD,
  STROKE,
  EDIT_STROKE,
  TOUCH_BAR_HEIGHT,
  EDIT_FILL,
  HIGHLIGHT_FILL,
  CHANGE_FILL,
  CHANGE_STROKE,
  HIGHLIGHT_STROKE,
} from "./constants";

export default function drawControllers(
  controllers: SettingController[],
  editMode: boolean,
  changeMode: boolean,
  item: number
) {
  let h = height - (PAD * 3 + TOUCH_BAR_HEIGHT + CONTROLLER_TEXT_SPACE);
  controllers.forEach(function (controller: SettingController, i: number) {
    let x = PAD * (i + 1) + CONTROLLER_WIDTH * i;

    if (controller.value > 0) {
      ctx.fillStyle = editMode
        ? i === item
          ? changeMode
            ? CHANGE_FILL
            : HIGHLIGHT_FILL
          : EDIT_FILL
        : CONTROLLER_FILL;
      ctx.fillRect(
        x,
        PAD + (1 - controller.value) * h,
        CONTROLLER_WIDTH,
        controller.value * h
      );
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = editMode
      ? i === item
        ? changeMode
          ? CHANGE_STROKE
          : HIGHLIGHT_STROKE
        : EDIT_STROKE
      : STROKE;
    ctx.strokeRect(x, PAD, CONTROLLER_WIDTH, h);

    ctx.fillStyle = STROKE;
    ctx.font = "12px Fira Code";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText(
      controller.param + ": " + trunc(controller.realValue()),
      x,
      PAD + h + 8
    );
  });
}

function trunc(n: number): number {
  if (Math.abs(n) < 10) {
    n = Math.round(n * 100) / 100;
  } else {
    n = Math.round(n * 10) / 10;
  }

  return n;
}
