import type { HouseResult } from "../types";

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
  text: string;
  bossMoodDelta?: number;
  bonusEarningsDelta?: number;
  reply: string;
}

export interface PostSaleCallDef {
  id: string;
  kind: "complaint" | "thanks";
  tag: string;
  prompt: string;
  choices: PostSaleCallChoice[];
}

export const postSaleCalls: PostSaleCallDef[] = [
  {
    id: "tapu-gecikme",
    kind: "complaint",
    tag: "Eski bir müşteri arıyor",
    prompt: "Tapu işlemleri beklediğinden uzun sürmüş, biraz sinirli. Ne dersin?",
    choices: [
      { id: "sahiplen", text: "Hemen ilgilenirim, kusura bakmayın.", bossMoodDelta: 2, bonusEarningsDelta: -5000, reply: "Teşekkür ederim, bu yaklaşımı takdir ediyorum." },
      { id: "yonlendir", text: "Bu tapu dairesinin işi ama ben de takip ederim.", bossMoodDelta: 0, reply: "Peki, umarım hızlanır." },
      { id: "geçiştir", text: "Ne yazık ki elimden bir şey gelmez.", bossMoodDelta: -4, reply: "Anlıyorum... ama pek memnun ayrılmıyorum." },
    ],
  },
  {
    id: "komsu-sikayeti",
    kind: "complaint",
    tag: "Eski bir müşteri arıyor",
    prompt: "Yeni komşularla ilgili küçük bir sorun yaşamış, senden tavsiye istiyor.",
    choices: [
      { id: "dinle", text: "Detayları dinle, birlikte bir çözüm bulalım.", bossMoodDelta: 2, reply: "Vakit ayırdığınız için teşekkürler." },
      { id: "kisa-tavsiye", text: "Kısa bir tavsiye ver, işin ucundan tut.", bossMoodDelta: 0, reply: "Tamam, deneyeceğim." },
      { id: "ilgilenme", text: "Bu artık benim işim değil.", bossMoodDelta: -3, reply: "Haklısınız herhalde, boşuna aradım." },
    ],
  },
  {
    id: "tesekkur-daveti",
    kind: "thanks",
    tag: "Eski bir müşteri arıyor",
    prompt: "Yeni evine yerleşmiş, sana teşekkür etmek için aramış — ev açılışına davet ediyor.",
    choices: [
      { id: "sicak-karsilik", text: "Çok naziksiniz, kesinlikle uğrarım.", bossMoodDelta: 3, reply: "Harika, sizi orada görmek güzel olacak!" },
      { id: "kisa-tesekkur", text: "Rica ederim, iyi günler dilerim.", bossMoodDelta: 1, reply: "Size de, tekrar teşekkürler." },
      { id: "esprili", text: "Davetiyeyi komisyondan sayabilir miyiz?", bossMoodDelta: 1, reply: "(Güler) Olur, bir şişe şarapla dengeleriz." },
    ],
  },
  {
    id: "referans-teklifi",
    kind: "thanks",
    tag: "Eski bir müşteri arıyor",
    prompt: "Sizden çok memnun kalmış, bir akrabasına da sizi önereceğini söylüyor.",
    choices: [
      { id: "tesekkur-et", text: "Çok teşekkür ederim, her zaman buradayım.", bossMoodDelta: 3, reply: "Yakında arayacaktır, kendisine sizi anlattım." },
      { id: "alcak-gonullu", text: "Asıl siz kolaylık sağladınız, ben teşekkür ederim.", bossMoodDelta: 2, reply: "Ne demek, hak ediyorsunuz." },
      { id: "umursamaz", text: "Tamam, iyi olur.", bossMoodDelta: 0, reply: "..." },
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
