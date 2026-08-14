/**
 * "Bağlantılar" — a very rare, entirely optional thread where a spark
 * during a house visit (a flirty closing line, gated behind high fun and a
 * low roll) can turn into a recurring connection with that specific pool
 * character. Purely text-based, fade-to-black on anything intimate, and
 * bounded: a small one-off cost + a small one-off stat bonus on the next
 * house, nothing that touches the sale/scoring math directly.
 */

/** Fun stat needed on a closing node before a flirty option can even appear. */
export const FLIRT_FUN_THRESHOLD = 20;
/** Chance a flirty option appears at all, once the fun threshold is met. */
export const FLIRT_CHANCE = 0.08;
/** Bond points gained per flirty moment picked during a house visit. */
export const FLIRT_BOND_GAIN = 1;

/** Bond needed before that character reaches out with a meetup invite. */
export const MEETUP_BOND_THRESHOLD = 3;
/** Chance, per house entry, that an eligible character's invite actually fires. */
export const MEETUP_INVITE_CHANCE = 0.15;

export interface MeetupActivity {
  id: string;
  label: string;
  cost: number;
  bonus: { interest?: number; fun?: number };
  bondGain: number;
  goodReplies: string[];
  cantAffordReplies: string[];
}

export const meetupActivities: MeetupActivity[] = [
  {
    id: "kahve",
    label: "\"Bir ara kahve içelim mi?\"",
    cost: 1000,
    bonus: { fun: 8 },
    bondGain: 1,
    goodReplies: [
      "Kahve güzeldi, uzun uzun sohbet ettik. 😊",
      "Keyifli bir molaydı, tekrar yapalım.",
    ],
    cantAffordReplies: [
      "Cebimde kahveye bile param kalmamıştı, mahcup oldum, gidemedim.",
      "Tam çıkacaktım ki cüzdanımın boş olduğunu fark ettim, iptal etmek zorunda kaldım.",
    ],
  },
  {
    id: "gezinti",
    label: "\"Sahilde biraz yürüyüş yapalım mı?\"",
    cost: 2500,
    bonus: { interest: 6, fun: 8 },
    bondGain: 1,
    goodReplies: [
      "Yürüyüş çok iyi geldi, güzel sohbet ettik.",
      "Sahilde vakit geçirmek keyifliydi, teşekkürler.",
    ],
    cantAffordReplies: [
      "Yol masraflarını bile çıkaramayacaktım, son anda vazgeçtim, hiç iyi olmadı.",
      "O gün param yetişmedi, buluşmayı iptal etmek zorunda kaldım, biraz garip oldu.",
    ],
  },
  {
    id: "ozel-aksam",
    label: "\"Baş başa özel bir akşam geçirelim mi?\"",
    cost: 5000,
    bonus: { interest: 10, fun: 14 },
    bondGain: 2,
    goodReplies: [
      "O akşamı hiç unutmayacağım. 😉",
      "Gecenin geri kalanını konuşarak... ve başka şekillerde geçirdik. 😉",
    ],
    cantAffordReplies: [
      "O akşam için hiç param yoktu, iptal etmek zorunda kaldım, gerçekten kötü hissettim.",
      "Planı son anda iptal ettim, cebimde hiçbir şey kalmamıştı, hiç iyi geçmedi.",
    ],
  },
];

export const declineReplies = [
  "Sorun değil, anlıyorum, ne zaman istersen.",
  "Tamam, başka zaman o zaman.",
];

const invitePrompts = [
  "Aklıma geldin, bir ara buluşalım mı?",
  "Seninle vakit geçirmek güzel oluyor, tekrar görüşelim mi?",
  "Müsait olduğun bir gün buluşalım mı?",
];

export function pickInvitePrompt(): string {
  return invitePrompts[Math.floor(Math.random() * invitePrompts.length)];
}
