import type { OriginId } from "../types";

/**
 * "Geçmişini Hatırlıyor" — brings origin.ts (currently only felt at the
 * very first house and in the ending epilogue) back into the middle of the
 * game. A rare, recurring customer line noticing Emlah's backstory — same
 * "one flavor moment per intro" priority slot as voiceLine/echoLines in
 * DialogueScene.tsx, so it can never stack with those. Pure flavor line,
 * zero stat effect, no persisted state needed (same shape as voiceLine).
 */
export const ORIGIN_RECOGNITION_CHANCE = 0.05;

const linesByOrigin: Record<OriginId, string[]> = {
  ogretmen: [
    "Eskiden öğretmen miydiniz? Anlatış tarzınızdan belli oluyor.",
    "Bir öğretmen sabrı var sizde, fark ettim de.",
  ],
  "emlakci-ailesi": [
    "Bu işi ailenizden mi öğrendiniz? Bölgeyi çok iyi biliyorsunuz.",
    "Emlakçılık sizde kan galiba, her sokağı ezbere biliyorsunuz.",
  ],
  girisimci: [
    "Eskiden kendi işiniz mi vardı? Pazarlık tarzınız çok tanıdık geldi.",
    "İş insanı gibi konuşuyorsunuz, daha önce bir şirket mi yönettiniz?",
  ],
  yurtdisi: [
    "Yurt dışında mı yaşadınız? Bakış açınız buradakilerden farklı.",
    "Aksanınızda hafif bir şey var, yurt dışında mı büyüdünüz?",
  ],
};

export function pickOriginRecognitionLine(originId: OriginId): string {
  const pool = linesByOrigin[originId];
  return pool[Math.floor(Math.random() * pool.length)];
}
