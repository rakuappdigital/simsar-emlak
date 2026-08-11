import type { HouseResult, PhoneMessage } from "../types";
import { computeStreak } from "./badges";

export type Mood = "happy" | "neutral" | "annoyed";

/** Muzaffer's mood from the last few visits — purely narrative, but reactive. */
export function computeMood(results: HouseResult[]): Mood {
  const recent = results.slice(-3);
  if (recent.length === 0) return "neutral";
  const soldCount = recent.filter((r) => r.outcome === "sold").length;
  const lostCount = recent.filter((r) => r.outcome === "lost").length;
  if (soldCount >= 2) return "happy";
  if (lostCount >= 2) return "annoyed";
  return "neutral";
}

const moodLines: Record<Exclude<Mood, "neutral">, string[]> = {
  happy: [
    "Aslanım benim, böyle devam et!",
    "Bugün keyfim yerinde, seninle çalışmak güzelmiş.",
    "Şu gidişata bak, ofisin gözdesi oluyorsun yakında.",
  ],
  annoyed: [
    "Emlah, son zamanlarda pek iyi gitmiyor ha, biraz toparlan.",
    "Bu ayki kotayı nasıl tutturacağız bilmiyorum doğrusu.",
    "Biraz daha gayret bekliyorum senden açıkçası.",
  ],
};

export function pickMoodLine(mood: Exclude<Mood, "neutral">): string {
  const lines = moodLines[mood];
  return lines[Math.floor(Math.random() * lines.length)];
}

const luckyLines = [
  "Bugün havan yerinde galiba Emlah, içim rahat!",
  "Bu sabah kahve fincanımda güzel bir şekil gördüm, bugün şanslı günündesin.",
  "Bugün her şey senin lehine dönecek gibi bir hissim var.",
];

export function pickLuckyLine(): string {
  return luckyLines[Math.floor(Math.random() * luckyLines.length)];
}

/** Word-of-mouth reputation label — same bucketing shown in the Kariyer tab. */
export function reputationLabel(results: HouseResult[]): string {
  if (results.length === 0) return "";
  const avg = results.reduce((s, r) => s + r.finalSuspicion, 0) / results.length;
  if (avg <= 25) return "Dürüst Simsar";
  if (avg <= 45) return "Dengeli Simsar";
  return "İstanbul'un En Sinsi Emlakçısı";
}

/**
 * Lets reputation nudge the next customer's starting trust — a small, felt
 * consequence for the sneaky/honest pattern in past houses, instead of every
 * visit starting from a fully clean slate. Derived from reputationLabel
 * itself so the mechanical effect can never drift out of sync with the label
 * shown to the player.
 */
export function reputationSuspicionOffset(results: HouseResult[]): number {
  const label = reputationLabel(results);
  if (label === "Dürüst Simsar") return -6;
  if (label === "İstanbul'un En Sinsi Emlakçısı") return 6;
  return 0;
}

const honestReputationLines = [
  "Az önce biriyle konuştum, sizi cidden övmüş — dürüst biri olduğunuzu söylüyorlar.",
  "Bugünkü müşteri sizi bir tanıdıktan duymuş, güvenilir biri olduğunuzu söylemişler.",
  "Adınız mahallede iyi anılıyor galiba, bu da işimizi kolaylaştırır.",
];

const sneakyReputationLines = [
  "Bugünkü müşteri biraz temkinli geliyor, sanırım sizi araştırmış.",
  "Duydum ki bazı müşteriler sizin hakkınızda dedikodu yapıyormuş, dikkatli olun.",
  "Bu sefer karşınızdaki biraz daha soru soracak gibi, hazırlıklı olun.",
];

export function pickReputationLine(label: string): string {
  const lines = label === "Dürüst Simsar" ? honestReputationLines : sneakyReputationLines;
  return lines[Math.floor(Math.random() * lines.length)];
}

/** Streak length at which the commission bonus caps out (see STREAK_BONUS_CAP/RATE in scoring.ts). */
const HOT_STREAK_THRESHOLD = 3;

const streakLines = [
  "Şu anki gidişat müthiş, arka arkaya satıyorsun!",
  "Bu formu bozma, tam bir seri yakaladın.",
  "Ofis seni konuşuyor, bu kadar art arda satış az görülür.",
];

export function pickStreakLine(): string {
  return streakLines[Math.floor(Math.random() * streakLines.length)];
}

const rivalLines = [
  "Bu arada Fırat Bey de senin bölgede geziyormuş, gözünü dört aç.",
  "Fırat Bey geçen hafta iki ev birden sattı, moralini bozma ama bilesin istedim.",
  "Rakip ofisten Fırat Bey seni sormuş, ne diyeyim bilmiyorum.",
  "Fırat Bey'in yeni arabası varmış, komisyonları iyi gidiyor demek ki.",
];

export function pickRivalLine(): string {
  return rivalLines[Math.floor(Math.random() * rivalLines.length)];
}

const LUCKY_DAY_CHANCE = 0.08;
const MOOD_COMMENT_CHANCE = 0.6;
const RIVAL_CHANCE = 0.12;
const REPUTATION_CHANCE = 0.18;
const STREAK_COMMENT_CHANCE = 0.35;

export interface IntroFlavorResult {
  message: PhoneMessage | null;
  isLucky: boolean;
}

/** Picks at most one extra flavor line for Muzaffer's intro message, so the phone screen never gets spammy. */
export function pickIntroFlavor(results: HouseResult[]): IntroFlavorResult {
  const isLucky = Math.random() < LUCKY_DAY_CHANCE;
  if (isLucky) {
    return { message: { from: "Muzaffer Bey", text: pickLuckyLine() }, isLucky: true };
  }
  const mood = computeMood(results);
  if (mood !== "neutral" && Math.random() < MOOD_COMMENT_CHANCE) {
    return { message: { from: "Muzaffer Bey", text: pickMoodLine(mood) }, isLucky: false };
  }
  if (Math.random() < RIVAL_CHANCE) {
    return { message: { from: "Muzaffer Bey", text: pickRivalLine() }, isLucky: false };
  }
  const repLabel = reputationLabel(results);
  if (repLabel !== "" && repLabel !== "Dengeli Simsar" && Math.random() < REPUTATION_CHANCE) {
    return { message: { from: "Muzaffer Bey", text: pickReputationLine(repLabel) }, isLucky: false };
  }
  if (computeStreak(results) >= HOT_STREAK_THRESHOLD && Math.random() < STREAK_COMMENT_CHANCE) {
    return { message: { from: "Muzaffer Bey", text: pickStreakLine() }, isLucky: false };
  }
  return { message: null, isLucky: false };
}
