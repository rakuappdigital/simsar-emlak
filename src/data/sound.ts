/**
 * Fully procedural WebAudio sound system — every sound is synthesized with
 * oscillators/noise at runtime, no audio files. Kept as a small singleton
 * module (not a React hook) since audio nodes need to persist across
 * re-renders and there's only ever one AudioContext for the whole app.
 */

const SFX_KEY = "simsar-emlak-sfx-volume";
const MUSIC_KEY = "simsar-emlak-music-volume";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function readVolume(key: string): number {
  const raw = typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
  const n = raw ? Number(raw) : 70;
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 70;
}

let sfxVolume = readVolume(SFX_KEY);
let musicVolume = readVolume(MUSIC_KEY);

export function getSfxVolume(): number {
  return sfxVolume;
}

export function getMusicVolume(): number {
  return musicVolume;
}

export function setSfxVolume(v: number): void {
  sfxVolume = Math.min(100, Math.max(0, v));
  localStorage.setItem(SFX_KEY, String(sfxVolume));
}

export function setMusicVolume(v: number): void {
  musicVolume = Math.min(100, Math.max(0, v));
  localStorage.setItem(MUSIC_KEY, String(musicVolume));
  applyMusicGain();
}

interface Tone {
  freq: number;
  start: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
}

function playTones(tones: Tone[]) {
  if (sfxVolume <= 0) return;
  const audio = getCtx();
  if (!audio) return;
  const master = audio.createGain();
  master.gain.value = (sfxVolume / 100) * 0.35;
  master.connect(audio.destination);

  for (const t of tones) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = t.type ?? "square";
    osc.frequency.value = t.freq;
    const startAt = audio.currentTime + t.start;
    const endAt = startAt + t.duration;
    const peak = t.gain ?? 1;
    gain.gain.setValueAtTime(0, startAt);
    gain.gain.linearRampToValueAtTime(peak, startAt + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, endAt);
    osc.connect(gain);
    gain.connect(master);
    osc.start(startAt);
    osc.stop(endAt + 0.02);
  }
}

/** Short UI click — buttons, choices, tab switches. */
export function playClick(): void {
  playTones([{ freq: 520, start: 0, duration: 0.045, type: "square", gain: 0.6 }]);
}

/** New message bubble landing in a phone screen. */
export function playMessage(): void {
  playTones([
    { freq: 700, start: 0, duration: 0.07, type: "sine", gain: 0.5 },
    { freq: 980, start: 0.06, duration: 0.09, type: "sine", gain: 0.5 },
  ]);
}

/** Sale closed — a small triumphant "cha-ching" arpeggio. */
export function playSale(): void {
  playTones([
    { freq: 523.25, start: 0, duration: 0.11, type: "square", gain: 0.55 },
    { freq: 659.25, start: 0.09, duration: 0.11, type: "square", gain: 0.55 },
    { freq: 783.99, start: 0.18, duration: 0.11, type: "square", gain: 0.55 },
    { freq: 1046.5, start: 0.28, duration: 0.22, type: "square", gain: 0.6 },
  ]);
}

/** Sale lost / negative outcome — a short descending buzz. */
export function playLost(): void {
  playTones([
    { freq: 220, start: 0, duration: 0.14, type: "sawtooth", gain: 0.45 },
    { freq: 164.81, start: 0.1, duration: 0.18, type: "sawtooth", gain: 0.45 },
  ]);
}

/** Badge/level-up style flourish. */
export function playReward(): void {
  playTones([
    { freq: 659.25, start: 0, duration: 0.09, type: "square", gain: 0.5 },
    { freq: 830.61, start: 0.08, duration: 0.09, type: "square", gain: 0.5 },
    { freq: 1046.5, start: 0.16, duration: 0.18, type: "square", gain: 0.55 },
  ]);
}

// ---------- Ambient background pad ----------

let musicNodes: { oscA: OscillatorNode; oscB: OscillatorNode; gain: GainNode } | null = null;

function applyMusicGain() {
  if (!musicNodes || !ctx) return;
  musicNodes.gain.gain.linearRampToValueAtTime((musicVolume / 100) * 0.05, ctx.currentTime + 0.4);
}

export function startMusic(): void {
  const audio = getCtx();
  if (!audio || musicNodes) return;
  const gain = audio.createGain();
  gain.gain.value = 0;
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;
  const oscA = audio.createOscillator();
  const oscB = audio.createOscillator();
  oscA.type = "sine";
  oscB.type = "sine";
  oscA.frequency.value = 110;
  oscB.frequency.value = 110 * 1.5;
  oscA.connect(filter);
  oscB.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);
  oscA.start();
  oscB.start();
  musicNodes = { oscA, oscB, gain };
  applyMusicGain();
}

export function stopMusic(): void {
  if (!musicNodes || !ctx) return;
  const { oscA, oscB, gain } = musicNodes;
  const now = ctx.currentTime;
  gain.gain.linearRampToValueAtTime(0, now + 0.3);
  oscA.stop(now + 0.35);
  oscB.stop(now + 0.35);
  musicNodes = null;
}
