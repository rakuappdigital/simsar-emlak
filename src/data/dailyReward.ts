/**
 * Günlük giriş ödülü — son ödülden 24 gerçek saat geçtiyse uygulama
 * açılışında otomatik 1 Jetton verir. Kayıt slotlarından bağımsız kendi
 * localStorage anahtarında yaşar (jetton/adSchedule/inventory ile aynı desen).
 */
const KEY = "simsar-emlak-daily-reward-last-claim";
const INTERVAL_MS = 24 * 60 * 60 * 1000;

export const DAILY_REWARD_JETTON_AMOUNT = 1;

/** Uygun ise ödül miktarını döner VE talebi anında kaydeder (tekrar çağrılırsa null döner). Uygun değilse null. */
export function claimDailyRewardIfEligible(): number | null {
  try {
    const last = parseInt(localStorage.getItem(KEY) ?? "0", 10);
    const now = Date.now();
    if (Number.isFinite(last) && now - last < INTERVAL_MS) return null;
    localStorage.setItem(KEY, String(now));
    return DAILY_REWARD_JETTON_AMOUNT;
  } catch {
    return null;
  }
}
