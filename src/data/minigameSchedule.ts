/**
 * Mini oyun hak sistemi — her mini oyun (kendi id'si için ayrı ayrı) son 8
 * gerçek saatte en fazla 2 kez oynanabilir. Bir "oynayış" artık kendi
 * içinde ard arda 3 denemelik bir oturum (bkz EnergyMiniGames.tsx) —
 * oturum kazanılsa da kaybedilse de tek hak sayılır. Kayıt slotlarından
 * bağımsız kendi localStorage anahtarlarında yaşar (jetton/adSchedule/
 * inventory ile aynı desen).
 */
const WINDOW_MS = 8 * 60 * 60 * 1000;
const MAX_PLAYS_PER_WINDOW = 2;
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
  markEverPlayed(gameId);
}

/**
 * "Gece Kuşu" başarımı — 8 saatlik pencereyle silinen timestamp'lerden
 * bağımsız, kalıcı "en az bir kez oynandı" bayrağı (jetton/inventory ile
 * aynı desen, kayıt slotlarından bağımsız).
 */
const EVER_PLAYED_KEY = "simsar-emlak-minigame-ever-played";

function getEverPlayedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(EVER_PLAYED_KEY);
    const arr: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

function markEverPlayed(gameId: string): void {
  try {
    const set = getEverPlayedSet();
    set.add(gameId);
    localStorage.setItem(EVER_PLAYED_KEY, JSON.stringify([...set]));
  } catch {
    // ignore
  }
}

export function hasPlayedAllMinigames(allGameIds: string[]): boolean {
  const played = getEverPlayedSet();
  return allGameIds.every((id) => played.has(id));
}
