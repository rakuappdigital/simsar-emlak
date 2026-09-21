import type { GameStats } from "../types";
import { resolveText, type Localized } from "./language";

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

const emlahOpeners: Localized[] = [
  { tr: "Merhaba, geçen görüşmemizi bir kez daha düşünmek ister misiniz diye sormak istedim.", en: "Hello, I wanted to ask if you'd like to think about our last meeting once more." },
  { tr: "Selam, aklınıza takılan bir şey oldu mu diye kontrol etmek istedim.", en: "Hi, I just wanted to check if you had anything lingering on your mind." },
  { tr: "Merhaba, ev hâlâ gündeminizde mi diye bir yazayım dedim.", en: "Hello, I thought I'd drop a line to see if the house is still on your agenda." },
];

const warmReplies: Localized[] = [
  { tr: "İyi ki yazdınız, tam da bunu düşünüyordum.", en: "Glad you wrote, I was thinking about just that." },
  { tr: "Aslında aramanızı bekliyordum, ilginize sevindim.", en: "Actually I was expecting your call, glad for your interest." },
  { tr: "Nazik bir hatırlatma oldu, teşekkür ederim.", en: "It was a polite reminder, thank you." },
];

const annoyedReplies: Localized[] = [
  { tr: "Açıkçası biraz sık soruyorsunuz, düşünme sürem hâlâ devam ediyor.", en: "Frankly, you're asking a bit too often, my thinking period is still ongoing." },
  { tr: "Karar vermem için zaman istemiştim, bu kadar sık takip etmenize gerek yok.", en: "I asked for time to make a decision, you don't need to follow up this often." },
  { tr: "Bu ısrar beni biraz rahatsız etti, açıkçası.", en: "This insistence made me a bit uncomfortable, frankly." },
];

const instantLostReplies: Localized[] = [
  { tr: "Bu kadar sık aranmak kararımı değiştirdi, artık ilgilenmiyorum.", en: "Being called this often changed my decision, I'm no longer interested." },
  { tr: "Açıkçası bu ısrar güven vermedi, vazgeçiyorum.", en: "Frankly, this persistence didn't inspire trust, I'm passing." },
];

export function pickEmlahFollowUpLine(): string {
  return resolveText(emlahOpeners[Math.floor(Math.random() * emlahOpeners.length)]);
}

export function pickFollowUpReply(reaction: FollowUpReaction): string {
  const pool = reaction === "warm" ? warmReplies : reaction === "annoyed" ? annoyedReplies : instantLostReplies;
  return resolveText(pool[Math.floor(Math.random() * pool.length)]);
}
