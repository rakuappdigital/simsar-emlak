import type { HouseResult } from "../types";
import type { Localized } from "./language";

/**
 * "Satış Sonrası Arama" — a sold customer calls back weeks later, either
 * with a small complaint or just to say thanks. Unlike echoNetwork/tipsters
 * (pure flavor, zero effect), this is the first post-sale content with a
 * real, if modest, consequence — a bossMood and/or bonusEarnings nudge,
 * same independent systems mysteryShopper.ts and finishCallbackContract's
 * discount-anger line already use. Never touches suspicion/interest/fun or
 * resolveOutcome — the sale itself is long since resolved and final.
 */
export const POST_SALE_CALL_MIN_INDEX = 6;

export interface PostSaleCallChoice {
  id: string;
  text: Localized;
  bossMoodDelta?: number;
  bonusEarningsDelta?: number;
  reply: Localized;
}

export interface PostSaleCallDef {
  id: string;
  kind: "complaint" | "thanks";
  tag: Localized;
  prompt: Localized;
  choices: PostSaleCallChoice[];
}

export const postSaleCalls: PostSaleCallDef[] = [
  {
    id: "tapu-gecikme",
    kind: "complaint",
    tag: { tr: "Eski bir müşteri arıyor", en: "An old client is calling" },
    prompt: { tr: "Tapu işlemleri beklediğinden uzun sürmüş, biraz sinirli. Ne dersin?", en: "Title deed procedures took longer than expected, a bit angry. What do you say?" },
    choices: [
      { id: "sahiplen", text: { tr: "Hemen ilgilenirim, kusura bakmayın.", en: "I'll handle it right away, sorry about that." }, bossMoodDelta: 2, bonusEarningsDelta: -5000, reply: { tr: "Teşekkür ederim, bu yaklaşımı takdir ediyorum.", en: "Thank you, I appreciate this approach." } },
      { id: "yonlendir", text: { tr: "Bu tapu dairesinin işi ama ben de takip ederim.", en: "This is the title office's job, but I'll follow up on it too." }, bossMoodDelta: 0, reply: { tr: "Peki, umarım hızlanır.", en: "Alright, hope it speeds up." } },
      { id: "geçiştir", text: { tr: "Ne yazık ki elimden bir şey gelmez.", en: "Unfortunately there's nothing I can do." }, bossMoodDelta: -4, reply: { tr: "Anlıyorum... ama pek memnun ayrılmıyorum.", en: "I understand... but I'm not leaving very satisfied." } },
    ],
  },
  {
    id: "komsu-sikayeti",
    kind: "complaint",
    tag: { tr: "Eski bir müşteri arıyor", en: "An old client is calling" },
    prompt: { tr: "Yeni komşularla ilgili küçük bir sorun yaşamış, senden tavsiye istiyor.", en: "Experienced a small issue with new neighbors, asking for your advice." },
    choices: [
      { id: "dinle", text: { tr: "Detayları dinle, birlikte bir çözüm bulalım.", en: "Listen to the details, let's find a solution together." }, bossMoodDelta: 2, reply: { tr: "Vakit ayırdığınız için teşekkürler.", en: "Thanks for taking the time." } },
      { id: "kisa-tavsiye", text: { tr: "Kısa bir tavsiye ver, işin ucundan tut.", en: "Give a brief advice, lend a helping hand." }, bossMoodDelta: 0, reply: { tr: "Tamam, deneyeceğim.", en: "Okay, I'll try." } },
      { id: "ilgilenme", text: { tr: "Bu artık benim işim değil.", en: "This is no longer my job." }, bossMoodDelta: -3, reply: { tr: "Haklısınız herhalde, boşuna aradım.", en: "I guess you're right, I called for nothing." } },
    ],
  },
  {
    id: "tesekkur-daveti",
    kind: "thanks",
    tag: { tr: "Eski bir müşteri arıyor", en: "An old client is calling" },
    prompt: { tr: "Yeni evine yerleşmiş, sana teşekkür etmek için aramış — ev açılışına davet ediyor.", en: "They settled into their new home, called to thank you — inviting you to the housewarming." },
    choices: [
      { id: "sicak-karsilik", text: { tr: "Çok naziksiniz, kesinlikle uğrarım.", en: "You are very kind, I will definitely stop by." }, bossMoodDelta: 3, reply: { tr: "Harika, sizi orada görmek güzel olacak!", en: "Great, it will be nice to see you there!" } },
      { id: "kisa-tesekkur", text: { tr: "Rica ederim, iyi günler dilerim.", en: "You're welcome, have a nice day." }, bossMoodDelta: 1, reply: { tr: "Size de, tekrar teşekkürler.", en: "You too, thanks again." } },
      { id: "esprili", text: { tr: "Davetiyeyi komisyondan sayabilir miyiz?", en: "Can we count the invitation as commission?" }, bossMoodDelta: 1, reply: { tr: "(Güler) Olur, bir şişe şarapla dengeleriz.", en: "(Laughs) Sure, we'll balance it with a bottle of wine." } },
    ],
  },
  {
    id: "referans-teklifi",
    kind: "thanks",
    tag: { tr: "Eski bir müşteri arıyor", en: "An old client is calling" },
    prompt: { tr: "Sizden çok memnun kalmış, bir akrabasına da sizi önereceğini söylüyor.", en: "Very satisfied with you, says they will recommend you to a relative." },
    choices: [
      { id: "tesekkur-et", text: { tr: "Çok teşekkür ederim, her zaman buradayım.", en: "Thank you very much, I'm always here." }, bossMoodDelta: 3, reply: { tr: "Yakında arayacaktır, kendisine sizi anlattım.", en: "They will call soon, I told them about you." } },
      { id: "alcak-gonullu", text: { tr: "Asıl siz kolaylık sağladınız, ben teşekkür ederim.", en: "You provided the real convenience, I thank you." }, bossMoodDelta: 2, reply: { tr: "Ne demek, hak ediyorsunuz.", en: "Don't mention it, you deserve it." } },
      { id: "umursamaz", text: { tr: "Tamam, iyi olur.", en: "Okay, that would be good." }, bossMoodDelta: 0, reply: { tr: "...", en: "..." } },
    ],
  },
];

export function pickPostSaleCallCandidateIndex(results: HouseResult[]): number | null {
  const eligible = results.map((r, i) => ({ r, i })).filter(({ r }) => r.outcome === "sold");
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)].i;
}

export function pickPostSaleCall(excludeId?: string): PostSaleCallDef {
  const pool = excludeId ? postSaleCalls.filter((c) => c.id !== excludeId) : postSaleCalls;
  return pool[Math.floor(Math.random() * pool.length)];
}
