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

/** "Thinking it over" outcome — a neutral, curious little bounce, not a win or a loss. */
export function playThinking(): void {
  playTones([
    { freq: 440, start: 0, duration: 0.09, type: "triangle", gain: 0.45 },
    { freq: 523.25, start: 0.09, duration: 0.12, type: "triangle", gain: 0.4 },
  ]);
}

/** Satın alma onayı — Envanter/Jetton/Market'te bir ürün alındığında. */
export function playPurchase(): void {
  playTones([
    { freq: 987.77, start: 0, duration: 0.06, type: "square", gain: 0.5 },
    { freq: 1318.5, start: 0.05, duration: 0.1, type: "square", gain: 0.5 },
  ]);
}

/** Yeni güne geçiş — kısa bir sayfa çevirme/whoosh hissi. */
export function playDayAdvance(): void {
  playTones([
    { freq: 300, start: 0, duration: 0.1, type: "triangle", gain: 0.35 },
    { freq: 500, start: 0.06, duration: 0.12, type: "triangle", gain: 0.4 },
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

// ---------- Background music (real tracks, playlist) ----------

/**
 * 4 gerçek şarkı, `<audio>` ile çalınıyor (WebAudio değil — dosya tabanlı,
 * senkron ses grafiğine ihtiyacı yok). Her seferinde rastgele bir sırayla
 * (shuffled queue) baştan sona çalar, hiçbir zaman durmaz — kuyruk biterse
 * yeniden karıştırılır, tek kural: bir önceki turun son şarkısı yeni turun
 * ilk şarkısı olamaz (peş peşe aynı şarkı asla çalınmaz). Tek bir modül-
 * seviyesi `<audio>` elemanı — App.tsx yeniden render olsa da şarkı kesilmez.
 */
const musicTracks = [
  new URL("../assets/music/track1.mp3", import.meta.url).href,
  new URL("../assets/music/track2.mp3", import.meta.url).href,
  new URL("../assets/music/track3.mp3", import.meta.url).href,
  new URL("../assets/music/track4.mp3", import.meta.url).href,
];

function shuffledIndices(): number[] {
  const arr = musicTracks.map((_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

let playQueue: number[] = shuffledIndices();
let queuePos = 0;

/** Pulls the next track index off the shuffled queue, reshuffling (and guarding the repeat-at-the-seam case) once it runs out. */
function nextTrackIndex(): number {
  if (queuePos >= playQueue.length) {
    const lastPlayed = playQueue[playQueue.length - 1];
    const reshuffled = shuffledIndices();
    if (reshuffled.length > 1 && reshuffled[0] === lastPlayed) {
      [reshuffled[0], reshuffled[1]] = [reshuffled[1], reshuffled[0]];
    }
    playQueue = reshuffled;
    queuePos = 0;
  }
  return playQueue[queuePos++];
}

let musicEl: HTMLAudioElement | null = null;
let currentTrackIndex = playQueue[queuePos++];

function ensureMusicEl(): HTMLAudioElement | null {
  if (typeof Audio === "undefined") return null;
  if (musicEl) return musicEl;
  const el = new Audio(musicTracks[currentTrackIndex]);
  el.volume = (musicVolume / 100) * 0.6;
  el.addEventListener("ended", () => {
    currentTrackIndex = nextTrackIndex();
    el.src = musicTracks[currentTrackIndex];
    el.play().catch(() => {});
  });
  musicEl = el;
  return el;
}

function applyMusicGain() {
  if (!musicEl) return;
  musicEl.volume = (musicVolume / 100) * 0.6;
}

export function startMusic(): void {
  const el = ensureMusicEl();
  if (!el) return;
  el.play().catch(() => {
    // Autoplay engellenmiş olabilir (ilk kullanıcı etkileşiminden önce) — bir sonraki playClick/kullanıcı etkileşiminde tekrar denenir.
  });
}

export function stopMusic(): void {
  if (!musicEl) return;
  musicEl.pause();
}
