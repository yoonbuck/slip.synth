const canvas = document.getElementById("c") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d");
export let height: number;
export let width: number;

let resizecb: () => void;
export function onresize(cb: () => void) {
  resizecb = cb;
}

function resize() {
  height = window.innerHeight;
  width = window.innerWidth;
  canvas.height = height;
  canvas.width = width;
  resizecb?.();
}
resize();
window.addEventListener("resize", resize);

export function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}
