/**
 * RevenueCat soyutlama katmanı. Native (iOS) tarafında gerçek SDK üzerinden
 * satın alma yapılır; web/test ortamında (REVENUECAT_API_KEY boşken veya
 * tarayıcıda) eski mock davranışına (localStorage bayrağı) düşer, böylece
 * Playwright test paketi değişmeden çalışmaya devam eder.
 * `isFullUnlocked()`/`isAdsRemoved()` localStorage'daki bir önbellek
 * bayrağını okur; bu bayrak satın alma başarılı olduğunda ve
 * `syncPurchasesFromRevenueCat()` ile (uygulama açılışında) senkronize edilir.
 */
import { isRevenueCatAvailable, purchaseByProductId, getOwnedProductIds } from "./revenuecat";

const UNLOCK_KEY = "simsar-emlak-full-unlock";
const REMOVE_ADS_KEY = "simsar-emlak-remove-ads";

export const FULL_UNLOCK_PRODUCT_ID = "com.rakuappdigital.simsaremlak.full_unlock";
export const REMOVE_ADS_PRODUCT_ID = "com.rakuappdigital.simsaremlak.remove_ads";

/** Demo sınırı — bu kadar ev tamamlanınca (ücretsiz) tam sürüm satın alma ekranı çıkar. */
export const DEMO_HOUSE_LIMIT = 2;

export const FULL_UNLOCK_PRICE_TR = "₺29,99";
export const FULL_UNLOCK_PRICE_INTL = "$1.99";
export const FULL_UNLOCK_DESCRIPTION = {
  tr: "Tüm 54+ ev, tüm sistemler (yatırım evleri, arkadaşlıklar, beceri ağacı, rakip merdiveni) tek seferlik ödemeyle sonsuza kadar açılır. Demo sınırı kalkar.",
  en: "Unlocks all 54+ houses and every system (investment houses, friendships, skill tree, rival ladder) forever with a single payment. Removes the demo limit.",
};

export const REMOVE_ADS_PRICE_TR = "₺59,99";
export const REMOVE_ADS_PRICE_INTL = "$2.99";
export const REMOVE_ADS_DESCRIPTION = {
  tr: "Hafta sonu özet ekranında arada çıkan ödülsüz/geçilebilir reklamları tamamen kaldırır. Enerji için izlemeyi seçebileceğin ödüllü reklamlar bu pakete dahil değildir — onlar istediğin sürece kullanılabilir kalır.",
  en: "Removes the skippable, non-rewarded ads shown on the weekly summary screen. Rewarded ads you can choose to watch for energy are not part of this — they stay available whenever you want them.",
};

export function isFullUnlocked(): boolean {
  try {
    return localStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export async function purchaseFullUnlock(): Promise<boolean> {
  if (isRevenueCatAvailable()) {
    const ok = await purchaseByProductId(FULL_UNLOCK_PRODUCT_ID);
    if (ok) {
      try {
        localStorage.setItem(UNLOCK_KEY, "1");
      } catch {
        // ignore
      }
    }
    return ok;
  }
  // Web/test fallback — no real purchase available outside the native app.
  try {
    localStorage.setItem(UNLOCK_KEY, "1");
  } catch {
    // ignore
  }
  return true;
}

export function isAdsRemoved(): boolean {
  try {
    return localStorage.getItem(REMOVE_ADS_KEY) === "1";
  } catch {
    return false;
  }
}

export async function purchaseRemoveAds(): Promise<boolean> {
  if (isRevenueCatAvailable()) {
    const ok = await purchaseByProductId(REMOVE_ADS_PRODUCT_ID);
    if (ok) {
      try {
        localStorage.setItem(REMOVE_ADS_KEY, "1");
      } catch {
        // ignore
      }
    }
    return ok;
  }
  // Web/test fallback — no real purchase available outside the native app.
  try {
    localStorage.setItem(REMOVE_ADS_KEY, "1");
  } catch {
    // ignore
  }
  return true;
}

/** Re-checks RevenueCat purchase history (e.g. after reinstall) and refreshes the local cache flags. */
export async function syncPurchasesFromRevenueCat(): Promise<void> {
  if (!isRevenueCatAvailable()) return;
  const owned = await getOwnedProductIds();
  try {
    if (owned.has(FULL_UNLOCK_PRODUCT_ID)) localStorage.setItem(UNLOCK_KEY, "1");
    if (owned.has(REMOVE_ADS_PRODUCT_ID)) localStorage.setItem(REMOVE_ADS_KEY, "1");
  } catch {
    // ignore
  }
}
