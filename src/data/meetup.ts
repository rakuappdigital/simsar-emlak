import { resolveText, type Localized } from "./language";
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

/**
 * Bond needed before that character reaches out with a meetup invite.
 * Pool characters are cast fresh per house (assignCast prefers unused
 * candidates and the pool vastly outnumbers the slots used in one game),
 * so the same character is met at most once per playthrough — bond can
 * realistically only ever reach 1 from the flirty-choice moment itself.
 * A threshold above 1 would make the invite unreachable in practice.
 */
export const MEETUP_BOND_THRESHOLD = 1;
/** Chance, per house entry, that an eligible character's invite actually fires. */
export const MEETUP_INVITE_CHANCE = 0.15;

export interface MeetupActivity {
  id: string;
  label: Localized;
  cost: number;
  bonus: { interest?: number; fun?: number };
  bondGain: number;
  goodReplies: Localized[];
  cantAffordReplies: Localized[];
}

export const meetupActivities: MeetupActivity[] = [
  {
    id: "kahve",
    label: { tr: "\"Bir ara kahve içelim mi?\"", en: "\"Shall we grab coffee sometime?\"" },
    cost: 1000,
    bonus: { fun: 8 },
    bondGain: 1,
    goodReplies: [
      { tr: "Kahve güzeldi, uzun uzun sohbet ettik.", en: "The coffee was nice, we chatted for a long time." },
      { tr: "Keyifli bir molaydı, tekrar yapalım.", en: "It was an enjoyable break, let's do it again." },
    ],
    cantAffordReplies: [
      { tr: "Cebimde kahveye bile param kalmamıştı, mahcup oldum, gidemedim.", en: "I didn't even have money for coffee in my pocket, felt embarrassed, couldn't go." },
      { tr: "Tam çıkacaktım ki cüzdanımın boş olduğunu fark ettim, iptal etmek zorunda kaldım.", en: "Just as I was heading out I realized my wallet was empty, had to cancel." },
    ],
  },
  {
    id: "gezinti",
    label: { tr: "\"Sahilde biraz yürüyüş yapalım mı?\"", en: "\"Shall we take a walk by the beach?\"" },
    cost: 2500,
    bonus: { interest: 6, fun: 8 },
    bondGain: 1,
    goodReplies: [
      { tr: "Yürüyüş çok iyi geldi, güzel sohbet ettik.", en: "The walk felt great, we had a nice chat." },
      { tr: "Sahilde vakit geçirmek keyifliydi, teşekkürler.", en: "Spending time by the beach was enjoyable, thanks." },
    ],
    cantAffordReplies: [
      { tr: "Yol masraflarını bile çıkaramayacaktım, son anda vazgeçtim, hiç iyi olmadı.", en: "I wouldn't even be able to cover travel expenses, backed out at the last minute, turned out terrible." },
      { tr: "O gün param yetişmedi, buluşmayı iptal etmek zorunda kaldım, biraz garip oldu.", en: "My money didn't suffice that day, had to cancel the meetup, felt a bit awkward." },
    ],
  },
  {
    id: "ozel-aksam",
    label: { tr: "\"Baş başa özel bir akşam geçirelim mi?\"", en: "\"Shall we spend a special evening alone together?\"" },
    cost: 5000,
    bonus: { interest: 10, fun: 14 },
    bondGain: 2,
    goodReplies: [
      { tr: "O akşamı hiç unutmayacağım.", en: "I will never forget that evening." },
      { tr: "Gecenin geri kalanını konuşarak... ve başka şekillerde geçirdik.", en: "We spent the rest of the night talking... and in other ways." },
    ],
    cantAffordReplies: [
      { tr: "O akşam için hiç param yoktu, iptal etmek zorunda kaldım, gerçekten kötü hissettim.", en: "I had zero money for that evening, had to cancel, felt really bad." },
      { tr: "Planı son anda iptal ettim, cebimde hiçbir şey kalmamıştı, hiç iyi geçmedi.", en: "Canceled the plan at the last minute, had nothing left in my pocket, didn't go well at all." },
    ],
  },
];

export const declineReplies = [
  { tr: "Sorun değil, anlıyorum, ne zaman istersen.", en: "No problem, I understand, whenever you want." },
  { tr: "Tamam, başka zaman o zaman.", en: "Alright, another time then." },
];

const invitePrompts = [
  { tr: "Aklıma geldin, bir ara buluşalım mı?", en: "I thought of you, shall we meet up sometime?" },
  { tr: "Seninle vakit geçirmek güzel oluyor, tekrar görüşelim mi?", en: "It's nice spending time with you, shall we see each other again?" },
  { tr: "Müsait olduğun bir gün buluşalım mı?", en: "Shall we meet on a day you are available?" },
];

export function pickInvitePrompt(): string {
  return resolveText(invitePrompts[Math.floor(Math.random() * invitePrompts.length)]);
}
