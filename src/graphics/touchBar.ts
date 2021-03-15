import { ctx, height, width } from "./canvas";
import { DISABLED_FILL, PAD, STROKE, TOUCH_BAR_HEIGHT } from "./constants";

export default function drawTouchBar(touch: number, tuned: number) {
  let w = width - PAD - PAD;
  let yUpper = height - PAD - TOUCH_BAR_HEIGHT;
  let yLower = height - PAD;

  ctx.clearRect(PAD, height - PAD - TOUCH_BAR_HEIGHT, w, TOUCH_BAR_HEIGHT);

  if (touch !== -1) {
    // tuned position
    let x = PAD + 2 + tuned * (w - 4);
    ctx.beginPath();
    ctx.moveTo(x, yUpper);
    ctx.lineTo(x, yLower);
    ctx.strokeStyle = "#bbb";
    ctx.lineWidth = 4;
    ctx.stroke();

    // actual position
    x = PAD + 2 + touch * (w - 4);
    ctx.beginPath();
    ctx.moveTo(x, yUpper);
    ctx.lineTo(x, yLower);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.rect(PAD, height - PAD - TOUCH_BAR_HEIGHT, w, TOUCH_BAR_HEIGHT);

  if (touch === -1) {
    ctx.fillStyle = DISABLED_FILL;
    ctx.fill();
  }

  ctx.strokeStyle = STROKE;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.clearRect(width - PAD + 1, yUpper, PAD, TOUCH_BAR_HEIGHT + 2);
}
