import type { Localized } from "./language";
/**
 * Nadir, atmosferik "easter egg" anları — bir ev ziyaretine çok küçük bir
 * sürpriz/mizah katıyor, istatistiklere neredeyse hiç dokunmuyor (yalnızca
 * küçük bir eğlence ödülü). Hayalet ev tek başlığı değil, birden fazla
 * farklı ton/temada tuhaf an içeren bir havuz — her house-agnostic yazıldığı
 * için herhangi bir main-house ziyaretine eklenebilir (celebrities.ts'in
 * aksine, kadroyu değiştirmez, sadece diyaloğun başına birkaç satır ekler).
 */
export interface EasterEgg {
  id: string;
  tag: Localized;
  lines: { speaker: "thought" | "customer1"; text: Localized }[];
  funBonus: number;
}

export const easterEggs: EasterEgg[] = [
  {
    id: "hayalet-ev",
    tag: { tr: "Tuhaf Bir An", en: "A Strange Moment" },
    lines: [
      { speaker: "thought", text: { tr: "(içinden) Neden bilmiyorum ama bu evde tuylerim diken diken oldu...", en: "(to himself) I don't know why but this house gave me goosebumps..." } },
      { speaker: "customer1", text: { tr: "Bazen gece kapılar kendiliğinden açılıyor... ama boş verin, alışkınız artık.", en: "Sometimes doors open by themselves at night... but never mind, we're used to it now." } },
      { speaker: "thought", text: { tr: "(içinden) Alışkınız derken... tam olarak neye alışkınlar?", en: "(to himself) Used to it... exactly what are they used to?" } },
    ],
    funBonus: 6,
  },
  {
    id: "ufo-komsu",
    tag: { tr: "Tuhaf Bir An", en: "A Strange Moment" },
    lines: [
      { speaker: "customer1", text: { tr: "Balkondan geçen ay tuhaf ışıklar gördük, komşular da doğruladı.", en: "We saw strange lights passing from the balcony last month, neighbors confirmed it too." } },
      { speaker: "thought", text: { tr: "(içinden) UFO mu, drone mu, yoksa hayal gücü mü — hiç sormayayım.", en: "(to himself) UFO, drone, or imagination — better not ask." } },
    ],
    funBonus: 5,
  },
  {
    id: "kedi-konseyi",
    tag: { tr: "Tuhaf Bir An", en: "A Strange Moment" },
    lines: [
      { speaker: "thought", text: { tr: "(içinden) Salonda yedi kedi var ve hepsi bana aynı anda bakıyor.", en: "(to himself) There are seven cats in the living room and they are all looking at me at the same time." } },
      { speaker: "customer1", text: { tr: "Onlara aldırmayın, sadece yeni gelenleri değerlendiriyorlar.", en: "Don't mind them, they are just evaluating newcomers." } },
      { speaker: "thought", text: { tr: "(içinden) Değerlendiriliyorum... harika.", en: "(to himself) I'm being evaluated... wonderful." } },
    ],
    funBonus: 6,
  },
  {
    id: "zaman-yolcusu",
    tag: { tr: "Tuhaf Bir An", en: "A Strange Moment" },
    lines: [
      { speaker: "customer1", text: { tr: "Duvar kağıdının altında eski bir not bulduk, 1987 tarihli, bir emlakçıya yazılmış.", en: "We found an old note under the wallpaper, dated 1987, written to a real estate agent." } },
      { speaker: "thought", text: { tr: "(içinden) O emlakçı da tam bugün, tam bu cümleyi mi kurmuş acaba?", en: "(to himself) I wonder if that real estate agent uttered this exact sentence today, right now?" } },
    ],
    funBonus: 5,
  },
  {
    id: "gizli-oyuncu",
    tag: { tr: "Tuhaf Bir An", en: "A Strange Moment" },
    lines: [
      { speaker: "customer1", text: { tr: "(fısıltıyla, ezbere) \"Bu ev... benim kaderim...\" Kusura bakmayın, bir repliği tekrar ediyordum.", en: "(whispering, from memory) \"This house... is my destiny...\" Sorry, I was repeating a line." } },
      { speaker: "thought", text: { tr: "(içinden) Galiba bir oyunculuk kursundan çıkmışlar. Devam edelim.", en: "(to himself) I guess they just came out of an acting class. Let's continue." } },
    ],
    funBonus: 5,
  },
];

export const EASTER_EGG_CHANCE = 0.02;

export function pickEasterEgg(excludeId?: string): EasterEgg {
  const pool = excludeId ? easterEggs.filter((e) => e.id !== excludeId) : easterEggs;
  return pool[Math.floor(Math.random() * pool.length)];
}
