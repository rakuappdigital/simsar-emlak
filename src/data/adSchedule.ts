/**
 * Geçiş reklamı (interstitial) zamanlaması — hafta sonu ekranı yerine artık
 * takvim günü geçişlerine bağlı: her 3 ya da her 5 gün geçişinde bir kez
 * çalışır, hangisi olacağı her döngüde rastgele seçilir (kullanıcı tahmin
 * edemesin diye). Kendi localStorage sayaçlarında yaşar — jetton/purchases
 * ile aynı desen, kayıt slotlarından bağımsız (bu bir para kazanma temposu,
 * oyun ilerlemesi değil).
 */
const COUNT_KEY = "simsar-emlak-interstitial-day-count";
const TARGET_KEY = "simsar-emlak-interstitial-target";

function pickTarget(): number {
  return Math.random() < 0.5 ? 3 : 5;
}

function getCount(): number {
  try {
    const n = parseInt(localStorage.getItem(COUNT_KEY) ?? "0", 10);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function getTarget(): number {
  try {
    const raw = localStorage.getItem(TARGET_KEY);
    if (raw) {
      const n = parseInt(raw, 10);
      if (Number.isFinite(n) && (n === 3 || n === 5)) return n;
    }
  } catch {
    // ignore
  }
  const fresh = pickTarget();
  try {
    localStorage.setItem(TARGET_KEY, String(fresh));
  } catch {
    // ignore
  }
  return fresh;
}

/**
 * Her "Yeni Güne Geç" basışında bir kez çağrılır. Bu geçiş 3. ya da 5.
 * güne denk geliyorsa true döner (reklam gösterilmeli) ve sayaç/hedef
 * bir sonraki döngü için sıfırlanır.
 */
export function shouldShowInterstitialOnDayAdvance(): boolean {
  const count = getCount() + 1;
  const target = getTarget();
  if (count >= target) {
    try {
      localStorage.setItem(COUNT_KEY, "0");
      localStorage.setItem(TARGET_KEY, String(pickTarget()));
    } catch {
      // ignore
    }
    return true;
  }
  try {
    localStorage.setItem(COUNT_KEY, String(count));
  } catch {
    // ignore
  }
  return false;
}
