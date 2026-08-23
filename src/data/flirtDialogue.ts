import type { DialogueLine } from "../types";

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
    { speaker: "emlah", text: "(Gülümseyerek) Açıkçası bu evi göstermek bu kadar keyifli olmasa bu kadar uzatmazdım." },
    { speaker: "customer1", text: "(Gülerek) Bu işin bir parçası mı yoksa gerçekten mi öyle düşünüyorsunuz?" },
  ],
  [
    { speaker: "emlah", text: "(Göz kırparak) Genelde bu kadar çabuk karar veren müşteri olmuyor, sizi etkileyen ev mi yoksa ben mi?" },
    { speaker: "customer1", text: "(Gülümseyerek) İkisi de olabilir, ama şu an asıl konu bu ev." },
  ],
  [
    { speaker: "emlah", text: "(Şakayla karışık) İtiraf edeyim, bu görüşme resmi olması gerekenden biraz daha keyifli geçti." },
    { speaker: "customer1", text: "Benim için de öyle oldu, açıkçası. Peki, bu evle nasıl ilerliyoruz?" },
  ],
  [
    { speaker: "emlah", text: "(Yarı ciddi) Bu sohbeti biraz daha uzatabilirdim ama işim başımı aşacak sanırım." },
    { speaker: "customer1", text: "(Gülerek) Madem öyle, asıl konuya dönelim — evi konuşalım." },
  ],
];

const closingLines = [
  "(Gülümseyerek) Peki, bu evle nasıl ilerlemek istersiniz?",
  "(Toparlanarak) Şimdi ciddiyetle soruyorum: bu ev sizin için uygun mu?",
  "(Gülümsemesini koruyarak) O zaman kararınızı öğrenebilir miyim?",
];

export function pickFlirtExchangeLines(): DialogueLine[] {
  return exchanges[Math.floor(Math.random() * exchanges.length)];
}

export function pickFlirtClosingLine(): string {
  return closingLines[Math.floor(Math.random() * closingLines.length)];
}
