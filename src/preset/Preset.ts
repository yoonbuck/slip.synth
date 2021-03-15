export interface Preset {
  shift: number;
  scale: number;
  tune: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export let defaultPreset: Readonly<Preset> = {
  shift: -20,
  scale: 30,
  tune: 2.5,
  attack: 100,
  decay: 100,
  sustain: 0.66,
  release: 500,
};

export function clonePreset(preset: Preset): Preset {
  return { ...preset };
}
