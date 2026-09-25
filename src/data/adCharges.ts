/**
 * Ödüllü reklam hakkı — bir "şarj" sistemi (mobil oyunlardaki enerji/can
 * sistemleriyle aynı mantık). En fazla MAX_CHARGES hak birikebilir, her
 * biri ayrı ayrı REGEN_HOURS saatte bir yenilenir. Kasıtlı olarak kaç
 * hakkın kaldığı ya da bir sonrakinin ne zaman geleceği DIŞARI VERİLMİYOR
 * (sadece "izlenebilir mi" boole'u) — ücretli ürünlerin (Jetton, Tam Sürüm)
 * cazibesini korumak için oyuncu tam sayıyı/geri sayımı göremiyor.
 * jetton/minigameSchedule ile aynı desen: kayıt slotlarından bağımsız kendi
 * localStorage anahtarında yaşar.
 */
const MAX_CHARGES = 8;
const REGEN_HOURS = 4;
const REGEN_MS = REGEN_HOURS * 60 * 60 * 1000;
const KEY = "simsar-emlak-ad-charges";

interface ChargeState {
  charges: number;
  lastRegenAt: number;
}

function readState(): ChargeState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed === "object" &&
        typeof (parsed as ChargeState).charges === "number" &&
        typeof (parsed as ChargeState).lastRegenAt === "number"
      ) {
        return parsed as ChargeState;
      }
    }
  } catch {
    // ignore — falls through to a fresh, fully-charged state
  }
  return { charges: MAX_CHARGES, lastRegenAt: Date.now() };
}

function writeState(state: ChargeState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage unavailable — charges just won't persist
  }
}

/** Applies any whole regen windows elapsed since lastRegenAt, capped at MAX_CHARGES. */
function regenerate(state: ChargeState): ChargeState {
  if (state.charges >= MAX_CHARGES) return state;
  const windowsElapsed = Math.floor((Date.now() - state.lastRegenAt) / REGEN_MS);
  if (windowsElapsed <= 0) return state;
  const charges = Math.min(MAX_CHARGES, state.charges + windowsElapsed);
  const lastRegenAt = charges >= MAX_CHARGES ? Date.now() : state.lastRegenAt + windowsElapsed * REGEN_MS;
  return { charges, lastRegenAt };
}

export function canWatchRewardedAd(): boolean {
  const state = regenerate(readState());
  writeState(state);
  return state.charges > 0;
}

/** Call once a rewarded ad actually paid out — spends one charge. */
export function consumeAdCharge(): void {
  const state = regenerate(readState());
  const wasFull = state.charges >= MAX_CHARGES;
  writeState({
    charges: Math.max(0, state.charges - 1),
    lastRegenAt: wasFull ? Date.now() : state.lastRegenAt,
  });
}
