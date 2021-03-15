// https://www.desmos.com/calculator/j2w5drhjy5
export function tune(note: number, strength: number) {
  let base = Math.round(note);
  let frac = note - base;
  let correctedFrac =
    (Math.sign(frac) * Math.pow(2 * Math.abs(frac), strength)) / 2;
  return base + correctedFrac;
}
