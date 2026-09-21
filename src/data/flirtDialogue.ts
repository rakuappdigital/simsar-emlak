import type { DialogueLine } from "../types";
import { resolveText, type Localized } from "./language";

/**
 * "Flörtöz Kapanış" — picking the flirty closing choice (see flirtChoice in
 * DialogueScene.tsx) used to resolve the sale instantly, the flirt itself
 * only a hidden number. Now it opens a short two-line exchange first —
 * playful but always circling back to the house/sale, never anything
 * beyond that (same "fade to black" convention as meetup.ts) — before the
 * closing choice actually resolves. Speaker "customer1" so the existing
 * name/portrait interpolation pipeline in DialogueScene.tsx applies as-is.
 */
const exchanges: DialogueLine[][] = [
  [
    { speaker: "emlah", text: { tr: "(Gülümseyerek) Açıkçası bu evi göstermek bu kadar keyifli olmasa bu kadar uzatmazdım.", en: "(Smiling) Frankly, if showing this house weren't so enjoyable, I wouldn't have dragged it out this long." } },
    { speaker: "customer1", text: { tr: "(Gülerek) Bu işin bir parçası mı yoksa gerçekten mi öyle düşünüyorsunuz?", en: "(Laughing) Is this part of the job or do you really think so?" } },
  ],
  [
    { speaker: "emlah", text: { tr: "(Göz kırparak) Genelde bu kadar çabuk karar veren müşteri olmuyor, sizi etkileyen ev mi yoksa ben mi?", en: "(Winking) Usually clients don't decide this fast, is it the house that impresses you or me?" } },
    { speaker: "customer1", text: { tr: "(Gülümseyerek) İkisi de olabilir, ama şu an asıl konu bu ev.", en: "(Smiling) Could be both, but right now the main topic is this house." } },
  ],
  [
    { speaker: "emlah", text: { tr: "(Şakayla karışık) İtiraf edeyim, bu görüşme resmi olması gerekenden biraz daha keyifli geçti.", en: "(Playfully) I must admit, this meeting went a bit more pleasantly than it needed to be." } },
    { speaker: "customer1", text: { tr: "Benim için de öyle oldu, açıkçası. Peki, bu evle nasıl ilerliyoruz?", en: "It was the same for me, frankly. So, how are we proceeding with this house?" } },
  ],
  [
    { speaker: "emlah", text: { tr: "(Yarı ciddi) Bu sohbeti biraz daha uzatabilirdim ama işim başımı aşacak sanırım.", en: "(Semi-seriously) I could have extended this chat a bit more, but I think my work is going to pile up." } },
    { speaker: "customer1", text: { tr: "(Gülerek) Madem öyle, asıl konuya dönelim — evi konuşalım.", en: "(Laughing) If so, let's return to the main subject — let's talk about the house." } },
  ],
];

const closingLines: Localized[] = [
  { tr: "(Gülümseyerek) Peki, bu evle nasıl ilerlemek istersiniz?", en: "(Smiling) Well, how would you like to proceed with this house?" },
  { tr: "(Toparlanarak) Şimdi ciddiyetle soruyorum: bu ev sizin için uygun mu?", en: "(Composing himself) Now I'm asking seriously: is this house suitable for you?" },
  { tr: "(Gülümsemesini koruyarak) O zaman kararınızı öğrenebilir miyim?", en: "(Maintaining his smile) Then may I know your decision?" },
];

export function pickFlirtExchangeLines(): DialogueLine[] {
  return exchanges[Math.floor(Math.random() * exchanges.length)];
}

export function pickFlirtClosingLine(): string {
  return resolveText(closingLines[Math.floor(Math.random() * closingLines.length)]);
}
