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
import { addJettons } from "./jettons";

const UNLOCK_KEY = "simsar-emlak-full-unlock";
const REMOVE_ADS_KEY = "simsar-emlak-remove-ads";

export const FULL_UNLOCK_PRODUCT_ID = "com.rakuappdigital.simsaremlak.full_unlock";
export const REMOVE_ADS_PRODUCT_ID = "com.rakuappdigital.simsaremlak.remove_ads";

/** Demo sınırı — bu kadar ev tamamlanınca (ücretsiz) tam sürüm satın alma ekranı çıkar. */
export const DEMO_HOUSE_LIMIT = 2;

// Prices MUST match App Store Connect's actual price schedule exactly — see
// jettons.ts's comment on JETTON_PACKAGES for why (no separate Turkey manual
// price means Apple auto-equalizes TRY from the USD tier, and that's the
// real charged price regardless of what we display).
export const FULL_UNLOCK_PRICE_TR = "₺29,99";
export const FULL_UNLOCK_PRICE_INTL = "$1.99";
export const FULL_UNLOCK_DESCRIPTION = {
  tr: "Tüm 54+ ev, tüm sistemler (yatırım evleri, arkadaşlıklar, beceri ağacı, rakip merdiveni) tek seferlik ödemeyle sonsuza kadar açılır. Demo sınırı ve gün geçişlerindeki geçiş reklamları kalkar; ödüllü reklamlar yalnızca sen istersen kalır.",
  en: "Unlocks all 54+ houses and every system (investment houses, friendships, skill tree, rival ladder) forever with a single payment. Removes the demo limit and the interstitial ads between days; rewarded ads stay, only when you choose them.",
};

/** Paywall'daki "Tam Sürümde neler var" listesi — ikon + başlık + tek satır açıklama. */
export const FULL_UNLOCK_FEATURES: { icon: string; title: { tr: string; en: string }; text: { tr: string; en: string } }[] = [
  { icon: "house", title: { tr: "54+ ev, tüm hikâye", en: "54+ houses, the full story" }, text: { tr: "Demo sınırı kalkar, portföyün sonuna kadar oyna.", en: "No demo limit — play the whole portfolio." } },
  { icon: "noads", title: { tr: "Geçiş reklamı yok", en: "No interstitial ads" }, text: { tr: "Gün geçişlerinde araya giren reklamlar tamamen kalkar.", en: "The ads between days are gone for good." } },
  { icon: "clapper", title: { tr: "Ödüllü reklamlar senin elinde", en: "Rewarded ads are your call" }, text: { tr: "Enerji / ikinci şans için izlemek istersen yine izleyebilirsin — zorunlu değil.", en: "Still there if you want energy or a second chance — never forced." } },
  { icon: "chart", title: { tr: "Tüm sistemler", en: "Every system" }, text: { tr: "Yatırım evleri, arkadaşlıklar, beceri ağacı, rakip merdiveni.", en: "Investment houses, friendships, skill tree, rival ladder." } },
  { icon: "check", title: { tr: "Tek seferlik ödeme", en: "One-time payment" }, text: { tr: "Abonelik yok; sonsuza kadar senin.", en: "No subscription — yours forever." } },
];

export const REMOVE_ADS_PRICE_TR = "₺79,99";
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

/**
 * Geçiş reklamları kapalı mı? Artık tam sürüm bunu kendiliğinden kapsıyor —
 * ayrı "Reklamları Kaldır" ürünü mağazadan kaldırıldı. Eski REMOVE_ADS_KEY
 * bayrağı, geçmişte o ürünü/paketleri almış oyuncular için hâlâ okunuyor.
 * Ödüllü reklamlar bu kontrolden bağımsızdır, her zaman açıktır.
 */
export function isAdsRemoved(): boolean {
  if (isFullUnlocked()) return true;
  try {
    return localStorage.getItem(REMOVE_ADS_KEY) === "1";
  } catch {
    return false;
  }
}

/** @deprecated Mağazada artık satılmıyor — tam sürüm geçiş reklamlarını da kaldırıyor. Eski alımlar syncPurchasesFromRevenueCat ile tanınmaya devam eder. */
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

// --- Başlangıç Paketleri (Starter Bundles) — App Store "bundle" kavramını desteklemediği için üçü de ayrı non-consumable ürün. ---
export const BUNDLE_FULL_JETTON30_PRODUCT_ID = "com.rakuappdigital.simsaremlak.bundle_full_jetton30";
export const BUNDLE_FULL_NOADS_PRODUCT_ID = "com.rakuappdigital.simsaremlak.bundle_full_noads";
export const BUNDLE_FULL_NOADS_JETTON30_PRODUCT_ID = "com.rakuappdigital.simsaremlak.bundle_full_noads_jetton30";

export const BUNDLE_FULL_JETTON30_PRICE_INTL = "$2.99";
export const BUNDLE_FULL_NOADS_PRICE_INTL = "$3.99";
export const BUNDLE_FULL_NOADS_JETTON30_PRICE_INTL = "$4.99";
// Turkey prices — previously missing entirely, which meant Turkish players
// were shown the raw "$" price on these three buttons regardless of
// language. See the comment above FULL_UNLOCK_PRICE_TR for why these must
// match ASC's actual price schedule exactly.
export const BUNDLE_FULL_JETTON30_PRICE_TR = "₺45,99";
export const BUNDLE_FULL_NOADS_PRICE_TR = "₺99,99";
export const BUNDLE_FULL_NOADS_JETTON30_PRICE_TR = "₺119,99";

export const BUNDLE_FULL_JETTON30_DESCRIPTION = {
  tr: "Tam sürümü açar ve hesabına 30 Jetton ekler — ayrı ayrı almaktan daha avantajlı.",
  en: "Unlocks the full version and adds 30 Jetton to your account — better value than buying separately.",
};
export const BUNDLE_FULL_NOADS_DESCRIPTION = {
  tr: "Tam sürümü açar ve hafta sonu ekranındaki geçilebilir reklamları kaldırır.",
  en: "Unlocks the full version and removes the skippable weekly ad.",
};
export const BUNDLE_FULL_NOADS_JETTON30_DESCRIPTION = {
  tr: "Tam sürümü açar, geçilebilir reklamları kaldırır ve 30 Jetton ekler — en avantajlı paket.",
  en: "Unlocks the full version, removes the skippable ad, and adds 30 Jetton — the best value bundle.",
};

async function purchaseBundle(productId: string, grantsRemoveAds: boolean, jettonAmount: number): Promise<boolean> {
  const ok = isRevenueCatAvailable() ? await purchaseByProductId(productId) : true;
  if (!ok) return false;
  try {
    localStorage.setItem(UNLOCK_KEY, "1");
    if (grantsRemoveAds) localStorage.setItem(REMOVE_ADS_KEY, "1");
  } catch {
    // ignore
  }
  if (jettonAmount > 0) addJettons(jettonAmount);
  return true;
}

export function purchaseBundleFullJetton30(): Promise<boolean> {
  return purchaseBundle(BUNDLE_FULL_JETTON30_PRODUCT_ID, false, 30);
}

export function purchaseBundleFullNoAds(): Promise<boolean> {
  return purchaseBundle(BUNDLE_FULL_NOADS_PRODUCT_ID, true, 0);
}

export function purchaseBundleFullNoAdsJetton30(): Promise<boolean> {
  return purchaseBundle(BUNDLE_FULL_NOADS_JETTON30_PRODUCT_ID, true, 30);
}

/** Re-checks RevenueCat purchase history (e.g. after reinstall) and refreshes the local cache flags. */
export async function syncPurchasesFromRevenueCat(): Promise<void> {
  if (!isRevenueCatAvailable()) return;
  const owned = await getOwnedProductIds();
  try {
    // Paketler de tam sürümü açıyor — eskiden burada sadece tekil ürünler
    // kontrol ediliyordu, paket alan oyuncu yeniden kurulumda tam sürümünü kaybediyordu.
    const fullGranting = [
      FULL_UNLOCK_PRODUCT_ID,
      BUNDLE_FULL_JETTON30_PRODUCT_ID,
      BUNDLE_FULL_NOADS_PRODUCT_ID,
      BUNDLE_FULL_NOADS_JETTON30_PRODUCT_ID,
    ];
    if (fullGranting.some((id) => owned.has(id))) localStorage.setItem(UNLOCK_KEY, "1");
    if (owned.has(REMOVE_ADS_PRODUCT_ID)) localStorage.setItem(REMOVE_ADS_KEY, "1");
  } catch {
    // ignore
  }
}
