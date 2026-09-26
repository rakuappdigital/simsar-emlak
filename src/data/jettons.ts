/**
 * Jetton — premium (satın alınabilir) para birimi. prestige.ts ile aynı
 * mantık: 3 kayıt slotundan bağımsız, hesap/cihaz genelinde kalıcı, kendi
 * localStorage anahtarında yaşar. Native tarafta gerçek RevenueCat SDK
 * üzerinden satın alınır (consumable — entitlement yok, başarılı satın
 * almada doğrudan addJettons çağrılır); web/test ortamında mock'a düşer.
 */
import { isRevenueCatAvailable, purchaseByProductId } from "./revenuecat";

const STORAGE_KEY = "simsar-emlak-jettons";

export interface JettonPackage {
  id: string;
  productId: string;
  amount: number;
  priceTR: string;
  priceIntl: string;
}

export const JETTON_DESCRIPTION = {
  tr: "Jetton — enerjini hızlıca doldurmak için kullanılan oyun içi para birimi. 2 Jetton = enerjinin %50'si.",
  en: "Jetton — the in-game currency for quickly refilling energy. 2 Jetton = 50% of your energy.",
};

// Prices MUST match App Store Connect's actual price schedule exactly — a
// $-based manual price with no separate Turkey manual price means Apple
// auto-equalizes TRY from the USD tier (current TRY devaluation makes that
// conversion look nothing like a "sensible" TL number), and StoreKit always
// charges that real converted price regardless of what we display here. Keep
// these three in sync with ASC's App Info > Pricing whenever it changes.
export const JETTON_PACKAGES: JettonPackage[] = [
  { id: "jetton-small", productId: "com.rakuappdigital.simsaremlak.jetton_20", amount: 20, priceTR: "₺19,99", priceIntl: "$0.99" },
  { id: "jetton-medium", productId: "com.rakuappdigital.simsaremlak.jetton_50", amount: 50, priceTR: "₺39,99", priceIntl: "$1.69" },
  { id: "jetton-large", productId: "com.rakuappdigital.simsaremlak.jetton_100", amount: 100, priceTR: "₺79,99", priceIntl: "$2.99" },
];

/** Enerji Molası'nda reklamın (ücretsiz, +%10) yanında sunulan jeton karşılığı hızlı enerji dolumu: 2 Jetton = enerjinin %50'si. */
export const JETTON_ENERGY_REFILL_COST = 2;
export const JETTON_ENERGY_REFILL_AMOUNT = 50;

/** Portföy kilidi ekranında bir sonraki tier'ı şartları beklemeden açmanın bedeli. */
export const TIER_SKIP_JETTON_COST = 50;

export function getJettons(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function setJettons(amount: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(Math.max(0, Math.round(amount))));
  } catch {
    // storage unavailable — jettons just won't persist
  }
}

export function addJettons(amount: number): number {
  const next = getJettons() + amount;
  setJettons(next);
  return next;
}

/** Returns false (no-op) if the balance is insufficient — caller should check first for a clean UI response. */
export function spendJettons(amount: number): boolean {
  const current = getJettons();
  if (current < amount) return false;
  setJettons(current - amount);
  return true;
}

export async function purchaseJettonPackage(pkg: JettonPackage): Promise<boolean> {
  if (isRevenueCatAvailable()) {
    const ok = await purchaseByProductId(pkg.productId);
    if (ok) addJettons(pkg.amount);
    return ok;
  }
  // Web/test fallback — no real purchase available outside the native app.
  addJettons(pkg.amount);
  return true;
}
