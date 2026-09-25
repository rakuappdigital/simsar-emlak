import type { HouseResult, HouseScene, PhoneMessage } from "../types";
import { computeStreak } from "./badges";
import { resolveText, getLanguage, type Localized } from "./language";

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

const moodLines: Record<Exclude<Mood, "neutral">, Localized[]> = {
  happy: [
    { tr: "Aslanım benim, böyle devam et!", en: "My boy, keep it up!" },
    { tr: "Bugün keyfim yerinde, seninle çalışmak güzelmiş.", en: "I'm in a good mood today, it's nice working with you." },
    { tr: "Şu gidişata bak, ofisin gözdesi oluyorsun yakında.", en: "Look at this momentum, you'll be the darling of the office soon." },
  ],
  annoyed: [
    { tr: "Emlah, son zamanlarda pek iyi gitmiyor ha, biraz toparlan.", en: "Estetan, things haven't been going so well lately huh, pull yourself together." },
    { tr: "Bu ayki kotayı nasıl tutturacağız bilmiyorum doğrusu.", en: "Frankly I don't know how we'll hit this month's quota." },
    { tr: "Biraz daha gayret bekliyorum senden açıkçası.", en: "Frankly, I expect a bit more effort from you." },
  ],
};

export function pickMoodLine(mood: Exclude<Mood, "neutral">): string {
  const lines = moodLines[mood];
  return resolveText(lines[Math.floor(Math.random() * lines.length)]);
}

const luckyLines = [
  { tr: "Bugün havan yerinde galiba Emlah, içim rahat!", en: "You're in high spirits today I guess Estetan, my mind is at ease!" },
  { tr: "Bu sabah kahve fincanımda güzel bir şekil gördüm, bugün şanslı günündesin.", en: "I saw a nice shape in my coffee cup this morning, you're on your lucky day." },
  { tr: "Bugün her şey senin lehine dönecek gibi bir hissim var.", en: "I have a feeling everything will turn in your favor today." },
];

export function pickLuckyLine(): string {
  return resolveText(luckyLines[Math.floor(Math.random() * luckyLines.length)]);
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
 * `reputationLabel()`'s return value is used as a plain-string LOGIC key
 * elsewhere in this file (reputationSuspicionModifier, pickReputationLine) —
 * so it must stay Turkish. This is the display-only English translation,
 * same pattern as rankTitleDisplay for rankTitle().
 */
const reputationLabelEn: Record<string, string> = {
  "Dürüst Simsar": "Honest Realtor",
  "Dengeli Simsar": "Balanced Realtor",
  "İstanbul'un En Sinsi Emlakçısı": "Istanbul's Sneakiest Realtor",
};

export function reputationLabelDisplay(trLabel: string): string {
  return getLanguage() === "en" ? (reputationLabelEn[trLabel] ?? trLabel) : trLabel;
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
  { tr: "Az önce biriyle konuştum, sizi cidden övmüş — dürüst biri olduğunuzu söylüyorlar.", en: "I spoke with someone just now, they praised you big time — they say you're an honest person." },
  { tr: "Bugünkü müşteri sizi bir tanıdıktan duymuş, güvenilir biri olduğunuzu söylemişler.", en: "Today's client heard about you from an acquaintance, they said you're a trustworthy person." },
  { tr: "Adınız mahallede iyi anılıyor galiba, bu da işimizi kolaylaştırır.", en: "Your name is spoken well of in the neighborhood I guess, this makes our job easier." },
];

const sneakyReputationLines = [
  { tr: "Bugünkü müşteri biraz temkinli geliyor, sanırım sizi araştırmış.", en: "Today's client is coming in a bit cautious, I guess they researched you." },
  { tr: "Duydum ki bazı müşteriler sizin hakkınızda dedikodu yapıyormuş, dikkatli olun.", en: "I heard some clients are gossiping about you, be careful." },
  { tr: "Bu sefer karşınızdaki biraz daha soru soracak gibi, hazırlıklı olun.", en: "Looks like the person across you will ask more questions this time, be prepared." },
];

export function pickReputationLine(label: string): string {
  const lines = label === "Dürüst Simsar" ? honestReputationLines : sneakyReputationLines;
  return resolveText(lines[Math.floor(Math.random() * lines.length)]);
}

/** District name from a "Semt, detay" location string, e.g. "Kadıköy, pazar sokağı" -> "Kadıköy". */
export function districtOf(location: string): string {
  return location.split(",")[0].trim();
}

const DISTRICT_HONEST_OFFSET = -3;
const DISTRICT_SNEAKY_OFFSET = 3;

/**
 * A smaller, local echo of reputationSuspicionOffset scoped to just the
 * current district — visiting a district where you've been consistently
 * honest or sneaky before nudges trust a little further than the citywide
 * average alone. Combined with reputationSuspicionOffset the total swing
 * stays bounded at ±9, still a small fraction of a house's stat range.
 */
export function districtReputationOffset(results: HouseResult[], allHouses: HouseScene[], district: string): number {
  const districtResults = results.filter((r) => {
    const h = allHouses.find((house) => house.id === r.houseId);
    return h ? districtOf(h.location) === district : false;
  });
  if (districtResults.length === 0) return 0;
  const avg = districtResults.reduce((s, r) => s + r.finalSuspicion, 0) / districtResults.length;
  if (avg <= 25) return DISTRICT_HONEST_OFFSET;
  if (avg > 45) return DISTRICT_SNEAKY_OFFSET;
  return 0;
}

const districtHonestLines = [
  { tr: "Bu mahallede işleriniz hep temiz gitmiş, burada da rahat olacaksınız.", en: "Your business has always gone clean in this neighborhood, you'll be comfortable here too." },
  { tr: "Bu semtte adınız iyi biliniyor galiba.", en: "Your name seems to be well known in this district." },
];

const districtSneakyLines = [
  { tr: "Bu mahallede sizinle ilgili bazı şeyler duymuş, biraz temkinli geliyor.", en: "He heard some things about you in this neighborhood, comes a bit cautious." },
  { tr: "Bu semtte önceki bir işiniz pek iyi anılmıyor sanki.", en: "It seems a previous job of yours is not remembered very well in this district." },
];

export function pickDistrictLine(district: string, honest: boolean): string {
  const lines = honest ? districtHonestLines : districtSneakyLines;
  return resolveText(lines[Math.floor(Math.random() * lines.length)]).replace("Bu mahallede", `${district}'de`).replace("Bu semtte", `${district}'de`);
}

/** Streak length at which the commission bonus caps out (see STREAK_BONUS_CAP/RATE in scoring.ts). */
const HOT_STREAK_THRESHOLD = 3;

const streakLines = [
  { tr: "Şu anki gidişat müthiş, arka arkaya satıyorsun!", en: "The current trend is amazing, you are selling back to back!" },
  { tr: "Bu formu bozma, tam bir seri yakaladın.", en: "Don't break this form, you caught a real streak." },
  { tr: "Ofis seni konuşuyor, bu kadar art arda satış az görülür.", en: "The office is talking about you, such back to back sales are rarely seen." },
];

export function pickStreakLine(): string {
  return resolveText(streakLines[Math.floor(Math.random() * streakLines.length)]);
}

const rivalLines = [
  { tr: "Bu arada Fırat Bey de senin bölgede geziyormuş, gözünü dört aç.", en: "By the way, Mr. Fırat is also wandering around your area, keep your eyes open." },
  { tr: "Fırat Bey geçen hafta iki ev birden sattı, moralini bozma ama bilesin istedim.", en: "Mr. Fırat sold two houses at once last week, don't let it ruin your morale but I wanted you to know." },
  { tr: "Rakip ofisten Fırat Bey seni sormuş, ne diyeyim bilmiyorum.", en: "Mr. Fırat from the rival office asked about you, I don't know what to say." },
  { tr: "Fırat Bey'in yeni arabası varmış, komisyonları iyi gidiyor demek ki.", en: "Mr. Fırat has a new car, means his commissions are going well." },
];

export function pickRivalLine(): string {
  return resolveText(rivalLines[Math.floor(Math.random() * rivalLines.length)]);
}

const LUCKY_DAY_CHANCE = 0.08;
const MOOD_COMMENT_CHANCE = 0.6;
const RIVAL_CHANCE = 0.12;
const REPUTATION_CHANCE = 0.18;
const STREAK_COMMENT_CHANCE = 0.35;
const DISTRICT_CHANCE = 0.15;

export interface IntroFlavorResult {
  message: PhoneMessage | null;
  isLucky: boolean;
}

/** Picks at most one extra flavor line for Muzaffer's intro message, so the phone screen never gets spammy. */
export function pickIntroFlavor(
  results: HouseResult[],
  allHouses: HouseScene[] = [],
  currentDistrict: string | null = null,
): IntroFlavorResult {
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
  if (currentDistrict) {
    const districtOffset = districtReputationOffset(results, allHouses, currentDistrict);
    if (districtOffset !== 0 && Math.random() < DISTRICT_CHANCE) {
      return {
        message: { from: "Muzaffer Bey", text: pickDistrictLine(currentDistrict, districtOffset < 0) },
        isLucky: false,
      };
    }
  }
  return { message: null, isLucky: false };
}
