import type { OriginId } from "../types";
import { resolveText, type Localized } from "./language";

/**
 * "Geçmişini Hatırlıyor" — brings origin.ts (currently only felt at the
 * very first house and in the ending epilogue) back into the middle of the
 * game. A rare, recurring customer line noticing Emlah's backstory — same
 * "one flavor moment per intro" priority slot as voiceLine/echoLines in
 * DialogueScene.tsx, so it can never stack with those. Pure flavor line,
 * zero stat effect, no persisted state needed (same shape as voiceLine).
 */
export const ORIGIN_RECOGNITION_CHANCE = 0.05;

const linesByOrigin: Record<OriginId, Localized[]> = {
  ogretmen: [
    { tr: "Eskiden öğretmen miydiniz? Anlatış tarzınızdan belli oluyor.", en: "Were you a teacher before? Shows from your style of explaining." },
    { tr: "Bir öğretmen sabrı var sizde, fark ettim de.", en: "You have the patience of a teacher, I noticed." },
  ],
  "emlakci-ailesi": [
    { tr: "Bu işi ailenizden mi öğrendiniz? Bölgeyi çok iyi biliyorsunuz.", en: "Did you learn this business from your family? You know the region very well." },
    { tr: "Emlakçılık sizde kan galiba, her sokağı ezbere biliyorsunuz.", en: "Realtor business must be in your blood, you know every street by heart." },
  ],
  girisimci: [
    { tr: "Eskiden kendi işiniz mi vardı? Pazarlık tarzınız çok tanıdık geldi.", en: "Did you used to have your own business? Your negotiation style feels very familiar." },
    { tr: "İş insanı gibi konuşuyorsunuz, daha önce bir şirket mi yönettiniz?", en: "You talk like a business person, did you manage a company before?" },
  ],
  yurtdisi: [
    { tr: "Yurt dışında mı yaşadınız? Bakış açınız buradakilerden farklı.", en: "Did you live abroad? Your perspective is different from locals here." },
    { tr: "Aksanınızda hafif bir şey var, yurt dışında mı büyüdünüz?", en: "There's a slight hint in your accent, did you grow up abroad?" },
  ],
};

export function pickOriginRecognitionLine(originId: OriginId): string {
  const pool = linesByOrigin[originId];
  return resolveText(pool[Math.floor(Math.random() * pool.length)]);
}
