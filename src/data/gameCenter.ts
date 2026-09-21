import { Capacitor, registerPlugin } from "@capacitor/core";

interface GameCenterPlugin {
  authenticate(): Promise<{ authenticated: boolean }>;
  unlockAchievement(options: { achievementID: string }): Promise<{ unlocked: boolean }>;
  showAchievements(): Promise<void>;
  submitScore(options: { leaderboardID: string; score: number }): Promise<{ submitted: boolean }>;
  showLeaderboard(options?: { leaderboardID?: string }): Promise<void>;
}

/** App Store Connect Game Center'da bu id ile bir leaderboard tanımlanmalı (bkz TODO.md). */
export const LEADERBOARD_ID = "toplam_kazanc";

/**
 * Native tarafı `ios/App/App/GameCenterPlugin.swift` — küçük, projeye özel
 * bir Capacitor plugin'i (ayrı bir npm paketi DEĞİL). npm'deki hazır Game
 * Center pluginleri sadece CocoaPods podspec'i ile geliyor (Swift +
 * Objective-C dosyalarını aynı SPM target'ında karıştırıyorlar, Swift
 * Package Manager bunu derleyemiyor) — bu proje CocoaPods değil Capacitor'ın
 * SPM entegrasyonunu kullanıyor, o yüzden tek ihtiyaç duyulan 3 metodu
 * (authenticate/unlockAchievement/showAchievements) doğrudan App target'ı
 * içine Swift-only bir plugin olarak yazmak en temiz çözümdü.
 */
const GameCenter = registerPlugin<GameCenterPlugin>("GameCenter");

/** App Store Connect Game Center'da bu ID'lerle 20 başarım tanımlanmalı (bkz TODO.md madde 5). */
export const ACHIEVEMENT_IDS = {
  firstSale: "ilk_satis",
  tenSales: "on_numara",
  allHousesSold: "emlak_krali",
  beatFirat: "firati_gectim",
  allRivalsBeaten: "rakip_yok_edici",
  honestWeek: "durust_emlakci",
  bossMoodMax: "patron_aski",
  topRank: "terfi_zamani",
  threeFriendsYakinlik: "arkadas_canlisi",
  loneWolf20: "yalniz_kurt",
  firstInvestmentFlip: "yatirimci",
  districtDominance: "mahalle_fatihi",
  heldFirm5InWeek: "pazarlik_ustasi",
  triedAllMinigames: "gece_kusu",
  secondChanceUsed: "sadik_musteri",
  prestigeCompleted: "efsane_oldu",
  totalEarnings10M: "zengin_emlakci",
  /** Sadece gerçek satın alımla açılabilir — ücretsiz oynayarak kazanılamaz. */
  jettonPurchased: "jetton_koleksiyoncusu",
  /** Sadece gerçek satın alımla açılabilir. */
  jetton100Purchased: "buyuk_yatirimci",
  /** Sadece gerçek satın alımla açılabilir. */
  fullSupport: "tam_destek",
} as const;

export type AchievementId = (typeof ACHIEVEMENT_IDS)[keyof typeof ACHIEVEMENT_IDS];

export async function initGameCenter(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await GameCenter.authenticate();
  } catch (e) {
    console.error("Game Center authenticate failed:", e);
  }
}

const UNLOCKED_KEY_PREFIX = "simsar-emlak-achievement-";

function isUnlockedLocally(id: string): boolean {
  try {
    return localStorage.getItem(UNLOCKED_KEY_PREFIX + id) === "1";
  } catch {
    return false;
  }
}

function markUnlockedLocally(id: string): void {
  try {
    localStorage.setItem(UNLOCKED_KEY_PREFIX + id, "1");
  } catch {
    // ignore
  }
}

/** Idempotent — koşul sağlandığı her render'da tekrar çağrılması güvenli, sadece ilkinde gerçekten açar. */
export function unlockAchievement(id: AchievementId): void {
  if (isUnlockedLocally(id)) return;
  markUnlockedLocally(id);
  if (!Capacitor.isNativePlatform()) return;
  GameCenter.unlockAchievement({ achievementID: id }).catch((e) => {
    console.error(`Game Center unlock failed for ${id}:`, e);
  });
}

export function showAchievements(): void {
  if (!Capacitor.isNativePlatform()) return;
  GameCenter.showAchievements().catch((e) => {
    console.error("Game Center showAchievements failed:", e);
  });
}

/** Toplam kazancı liderlik tablosuna gönderir — ucuz bir çağrı değil, sık değil, anlamlı state değişimlerinde çağrılmalı. */
export function submitLeaderboardScore(score: number): void {
  if (!Capacitor.isNativePlatform()) return;
  GameCenter.submitScore({ leaderboardID: LEADERBOARD_ID, score: Math.round(score) }).catch((e) => {
    console.error("Game Center submitScore failed:", e);
  });
}

export function showLeaderboard(): void {
  if (!Capacitor.isNativePlatform()) return;
  GameCenter.showLeaderboard({ leaderboardID: LEADERBOARD_ID }).catch((e) => {
    console.error("Game Center showLeaderboard failed:", e);
  });
}
