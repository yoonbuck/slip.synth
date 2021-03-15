import { ctx, height, width } from "./canvas";
import { DISABLED_FILL, PAD } from "./constants";

export default function drawBanner(message: string) {
  ctx.fillStyle = DISABLED_FILL;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "black";
  ctx.font = "24px Roboto";
  ctx.textBaseline = "top";
  ctx.fillText(message, PAD, PAD);
}
