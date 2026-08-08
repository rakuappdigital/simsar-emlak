import type { HouseResult, PhoneMessage } from "../types";

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
  return { message: null, isLucky: false };
}
