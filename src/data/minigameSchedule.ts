/**
 * Mini oyun hak sistemi — her mini oyun (kendi id'si için ayrı ayrı) son 8
 * gerçek saatte en fazla 4 kez oynanabilir (4 oyun × 4 hak = günde 16
 * kullanım tavanı). Kayıt slotlarından bağımsız kendi localStorage
 * anahtarlarında yaşar (jetton/adSchedule/inventory ile aynı desen).
 */
const WINDOW_MS = 8 * 60 * 60 * 1000;
const MAX_PLAYS_PER_WINDOW = 4;
const KEY_PREFIX = "simsar-emlak-minigame-plays-";

function getTimestamps(gameId: string): number[] {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + gameId);
    if (!raw) return [];
    const arr: unknown = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter((n): n is number => typeof n === "number" && Number.isFinite(n));
  } catch {
    return [];
  }
}

function setTimestamps(gameId: string, timestamps: number[]): void {
  try {
    localStorage.setItem(KEY_PREFIX + gameId, JSON.stringify(timestamps));
  } catch {
    // ignore
  }
}

function pruneOld(timestamps: number[]): number[] {
  const cutoff = Date.now() - WINDOW_MS;
  return timestamps.filter((t) => t > cutoff);
}

/** Kalan hak sayısı (0-4). */
export function getPlaysRemaining(gameId: string): number {
  return Math.max(0, MAX_PLAYS_PER_WINDOW - pruneOld(getTimestamps(gameId)).length);
}

/** Hak tükendiyse bir sonraki hakkın açılacağı zaman (epoch ms) — hak varsa null. */
export function getNextAvailableAt(gameId: string): number | null {
  const fresh = pruneOld(getTimestamps(gameId));
  if (fresh.length < MAX_PLAYS_PER_WINDOW) return null;
  return Math.min(...fresh) + WINDOW_MS;
}

/** Bir oynayışı kaydeder — çağrıdan önce getPlaysRemaining(gameId) > 0 kontrol edilmeli. */
export function recordPlay(gameId: string): void {
  const fresh = pruneOld(getTimestamps(gameId));
  fresh.push(Date.now());
  setTimestamps(gameId, fresh);
}
