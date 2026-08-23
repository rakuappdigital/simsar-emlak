import type { GameStats } from "../types";

/**
 * "Takip Mesajı" — a player-initiated follow-up on a "thinking" sale,
 * available from the inbox the moment the visit is over (same one-shot-use
 * shape as retryFromInbox's "Tekrar Dene" for lost sales, just for the
 * thinking outcome instead). How well it lands depends on how the ORIGINAL
 * conversation actually went (finalStats already recorded on the result) —
 * a customer who was already warm reads it as attentive service, one who
 * was already suspicious/uninterested reads it as pushy. Reuses the
 * existing negotiationChoices/resolveOutcome pipeline for what happens
 * next — this only decides the opening reaction.
 */
export type FollowUpReaction = "warm" | "annoyed" | "instant-lost";

const INSTANT_LOST_CHANCE_WHEN_ANNOYED = 0.35;

export function rollFollowUpReaction(finalStats: GameStats): FollowUpReaction {
  const goodwill = finalStats.interest - finalStats.suspicion;
  const annoyanceChance = goodwill >= 20 ? 0.15 : goodwill >= 0 ? 0.35 : 0.6;
  if (Math.random() >= annoyanceChance) return "warm";
  return Math.random() < INSTANT_LOST_CHANCE_WHEN_ANNOYED ? "instant-lost" : "annoyed";
}

export const FOLLOWUP_WARM_SUSPICION_DELTA = -6;
export const FOLLOWUP_WARM_INTEREST_DELTA = 4;
export const FOLLOWUP_ANNOYED_SUSPICION_DELTA = 12;
export const FOLLOWUP_ANNOYED_INTEREST_DELTA = -8;

const emlahOpeners = [
  "Merhaba, geçen görüşmemizi bir kez daha düşünmek ister misiniz diye sormak istedim.",
  "Selam, aklınıza takılan bir şey oldu mu diye kontrol etmek istedim.",
  "Merhaba, ev hâlâ gündeminizde mi diye bir yazayım dedim.",
];

const warmReplies = [
  "İyi ki yazdınız, tam da bunu düşünüyordum.",
  "Aslında aramanızı bekliyordum, ilginize sevindim.",
  "Nazik bir hatırlatma oldu, teşekkür ederim.",
];

const annoyedReplies = [
  "Açıkçası biraz sık soruyorsunuz, düşünme sürem hâlâ devam ediyor.",
  "Karar vermem için zaman istemiştim, bu kadar sık takip etmenize gerek yok.",
  "Bu ısrar beni biraz rahatsız etti, açıkçası.",
];

const instantLostReplies = [
  "Bu kadar sık aranmak kararımı değiştirdi, artık ilgilenmiyorum.",
  "Açıkçası bu ısrar güven vermedi, vazgeçiyorum.",
];

export function pickEmlahFollowUpLine(): string {
  return emlahOpeners[Math.floor(Math.random() * emlahOpeners.length)];
}

export function pickFollowUpReply(reaction: FollowUpReaction): string {
  const pool = reaction === "warm" ? warmReplies : reaction === "annoyed" ? annoyedReplies : instantLostReplies;
  return pool[Math.floor(Math.random() * pool.length)];
}
