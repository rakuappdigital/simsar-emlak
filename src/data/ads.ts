/**
 * AdMob soyutlama katmanı. Native (iOS) tarafında gerçek Google AdMob SDK'sı
 * üzerinden reklam gösterir; web/test ortamında eski mock davranışına
 * (900ms gecikme, her zaman başarılı) düşer — çağıran kod (OfficeScene/
 * EnergyBreakScreen/WeekResult) hiçbir şey değişmeden çalışmaya devam eder.
 *
 * Şu an Google'ın resmi TEST reklam birimi ID'leri kullanılıyor (hesap
 * kurulumu gerektirmez, simulator/cihazda güvenle gerçek reklam gösterir).
 * Gerçek AdMob hesabındaki reklam birimi ID'leri hazır olduğunda
 * REWARDED_AD_UNIT_ID / INTERSTITIAL_AD_UNIT_ID'yi değiştirip USE_TEST_ADS'i
 * false yap.
 *
 * showRewardedAd(): true = izlendi ve ödül hak edildi, false = iptal/hata.
 * showInterstitialAd(): reklam kapanana kadar bekler (ödülsüz, atlanabilir).
 */
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import { AdMob, RewardAdPluginEvents, InterstitialAdPluginEvents } from "@capacitor-community/admob";

const REWARDED_AD_UNIT_ID = "ca-app-pub-7882143822556333/4879734614";
const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-7882143822556333/8627407931";
const USE_TEST_ADS = false;

const MOCK_AD_DELAY_MS = 900;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let initPromise: Promise<void> | null = null;

function ensureInitialized(): Promise<void> {
  if (!initPromise) {
    initPromise = AdMob.initialize({ initializeForTesting: USE_TEST_ADS });
  }
  return initPromise;
}

export async function showRewardedAd(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    await delay(MOCK_AD_DELAY_MS);
    return true;
  }
  try {
    await ensureInitialized();
    await AdMob.prepareRewardVideoAd({ adId: REWARDED_AD_UNIT_ID, isTesting: USE_TEST_ADS });

    let rewarded = false;
    let resolveResult!: (v: boolean) => void;
    const resultPromise = new Promise<boolean>((resolve) => {
      resolveResult = resolve;
    });

    const handles: PluginListenerHandle[] = await Promise.all([
      AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
        rewarded = true;
      }),
      AdMob.addListener(RewardAdPluginEvents.Dismissed, () => resolveResult(rewarded)),
      AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => resolveResult(false)),
    ]);

    await AdMob.showRewardVideoAd();
    const result = await resultPromise;
    await Promise.all(handles.map((h) => h.remove()));
    return result;
  } catch (e) {
    console.error("AdMob rewarded ad failed:", e);
    return false;
  }
}

export async function showInterstitialAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    await delay(MOCK_AD_DELAY_MS);
    return;
  }
  try {
    await ensureInitialized();
    await AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_UNIT_ID, isTesting: USE_TEST_ADS });

    let resolveResult!: () => void;
    const resultPromise = new Promise<void>((resolve) => {
      resolveResult = resolve;
    });

    const handles: PluginListenerHandle[] = await Promise.all([
      AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => resolveResult()),
      AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, () => resolveResult()),
    ]);

    await AdMob.showInterstitial();
    await resultPromise;
    await Promise.all(handles.map((h) => h.remove()));
  } catch (e) {
    console.error("AdMob interstitial ad failed:", e);
  }
}
