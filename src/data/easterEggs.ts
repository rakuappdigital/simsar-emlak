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
  tag: string;
  lines: { speaker: "thought" | "customer1"; text: string }[];
  funBonus: number;
}

export const easterEggs: EasterEgg[] = [
  {
    id: "hayalet-ev",
    tag: "👻 Tuhaf Bir An",
    lines: [
      { speaker: "thought", text: "(içinden) Neden bilmiyorum ama bu evde tuylerim diken diken oldu..." },
      { speaker: "customer1", text: "Bazen gece kapılar kendiliğinden açılıyor... ama boş verin, alışkınız artık." },
      { speaker: "thought", text: "(içinden) Alışkınız derken... tam olarak neye alışkınlar?" },
    ],
    funBonus: 6,
  },
  {
    id: "ufo-komsu",
    tag: "🛸 Tuhaf Bir An",
    lines: [
      { speaker: "customer1", text: "Balkondan geçen ay tuhaf ışıklar gördük, komşular da doğruladı." },
      { speaker: "thought", text: "(içinden) UFO mu, drone mu, yoksa hayal gücü mü — hiç sormayayım." },
    ],
    funBonus: 5,
  },
  {
    id: "kedi-konseyi",
    tag: "🐈 Tuhaf Bir An",
    lines: [
      { speaker: "thought", text: "(içinden) Salonda yedi kedi var ve hepsi bana aynı anda bakıyor." },
      { speaker: "customer1", text: "Onlara aldırmayın, sadece yeni gelenleri değerlendiriyorlar." },
      { speaker: "thought", text: "(içinden) Değerlendiriliyorum... harika." },
    ],
    funBonus: 6,
  },
  {
    id: "zaman-yolcusu",
    tag: "🕰️ Tuhaf Bir An",
    lines: [
      { speaker: "customer1", text: "Duvar kağıdının altında eski bir not bulduk, 1987 tarihli, bir emlakçıya yazılmış." },
      { speaker: "thought", text: "(içinden) O emlakçı da tam bugün, tam bu cümleyi mi kurmuş acaba?" },
    ],
    funBonus: 5,
  },
  {
    id: "gizli-oyuncu",
    tag: "🎭 Tuhaf Bir An",
    lines: [
      { speaker: "customer1", text: "(fısıltıyla, ezbere) \"Bu ev... benim kaderim...\" Kusura bakmayın, bir repliği tekrar ediyordum." },
      { speaker: "thought", text: "(içinden) Galiba bir oyunculuk kursundan çıkmışlar. Devam edelim." },
    ],
    funBonus: 5,
  },
];

export const EASTER_EGG_CHANCE = 0.02;

export function pickEasterEgg(excludeId?: string): EasterEgg {
  const pool = excludeId ? easterEggs.filter((e) => e.id !== excludeId) : easterEggs;
  return pool[Math.floor(Math.random() * pool.length)];
}
