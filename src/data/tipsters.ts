import type { Localized } from "./language";
/**
 * Three flavor-only phone contacts who occasionally ping Emlah with market
 * tips (and, just as often, something completely unrelated) — pure texture,
 * no gameplay effect, no choices to make. Logged straight into the inbox
 * like other passive messages (introFlavor, callback replies), never
 * pausing the game for a response.
 */
export interface TipsterMessage {
  id: string;
  from: string;
  text: Localized;
}

export const tipsterMessages: TipsterMessage[] = [
  // Cemil Abi — mahalleden, tecrübeli ama iş bilmiş esnaf tavırlı komşu
  { id: "cemil-tip-1", from: "Cemil Abi", text: { tr: "Yeğenim, şu yatırım evlerine bi göz at, bizim mahallede fiyatlar oynuyor bu aralar.", en: "Kid, take a look at those investment homes, prices are fluctuating in our neighborhood lately." } },
  { id: "cemil-tip-2", from: "Cemil Abi", text: { tr: "Ben olsam acele etmezdim, biraz bekle bakalım piyasa ne yapacak.", en: "If I were you I wouldn't rush, wait a bit and see what the market does." } },
  { id: "cemil-tip-3", from: "Cemil Abi", text: { tr: "Marketten gelirken gördüm, karşı sokaktaki bina boyanıyor, bir şeyler dönüyor galiba.", en: "Saw it while coming from the market, the building across the street is being painted, something's up." } },
  { id: "cemil-off-1", from: "Cemil Abi", text: { tr: "Yeğenim akşam çay içmeye gel, uzun zamandır uğramadın.", en: "Kid, come over for tea tonight, you haven't dropped by in a long time." } },
  { id: "cemil-off-2", from: "Cemil Abi", text: { tr: "Bizim kedi yine çatıya çıktı, indiremedik bir türlü.", en: "Our cat got up on the roof again, couldn't get it down somehow." } },

  // Kankam — genç, enerjik, argo tonlu arkadaş
  { id: "kankam-tip-1", from: "Kankam", text: { tr: "Kanka yatırım evlerine bak diyorum, fırsat kaçmasın.", en: "Buddy I'm telling you to check out investment homes, don't let the opportunity slip." } },
  { id: "kankam-tip-2", from: "Kankam", text: { tr: "Duydum ki piyasa hareketli bu hafta, sen de bi göz at derim.", en: "I heard the market is active this week, I suggest you take a look too." } },
  { id: "kankam-tip-3", from: "Kankam", text: { tr: "Kanka bu ara para dönüyor ortalıkta, uyuma.", en: "Buddy money is floating around lately, don't sleep on it." } },
  { id: "kankam-off-1", from: "Kankam", text: { tr: "Kanka akşam maç var, geliyon mu?", en: "Buddy there's a match tonight, you coming?" } },
  { id: "kankam-off-2", from: "Kankam", text: { tr: "Yeni telefon aldım kanka, resmen uçuyor.", en: "Got a new phone buddy, it literally flies." } },

  // Züleyha Teyze — dedikoducu ama bazen gerçekten haberdar komşu
  { id: "zuleyha-tip-1", from: "Züleyha Teyze", text: { tr: "Oğlum duydum ki bu aralar ev fiyatları oynuyormuş, dikkatli ol.", en: "Son I heard home prices are fluctuating lately, be careful." } },
  { id: "zuleyha-tip-2", from: "Züleyha Teyze", text: { tr: "Komşunun kızı ev satmış da çok iyi paraya satmış diyorlar.", en: "They say the neighbor's daughter sold a house for a very good price." } },
  { id: "zuleyha-tip-3", from: "Züleyha Teyze", text: { tr: "Sen o yatırım evlerine bakmışsın diye duydum, hayırlı olsun inşallah.", en: "I heard you checked out those investment homes, congratulations." } },
  { id: "zuleyha-off-1", from: "Züleyha Teyze", text: { tr: "Oğlum yarın börek yapacağım, gel bir tabak da sana ayırayım.", en: "Son I'm making pastry tomorrow, I'll set aside a plate for you too." } },
  { id: "zuleyha-off-2", from: "Züleyha Teyze", text: { tr: "Apartman toplantısı yine uzadı, saat kaça kadar sürdü bilemezsin.", en: "The apartment meeting dragged on again, you have no idea till what time it lasted." } },
];

/** Avoids repeating the same message twice in a row. */
export function pickTipsterMessage(excludeId?: string): TipsterMessage {
  const pool = excludeId ? tipsterMessages.filter((m) => m.id !== excludeId) : tipsterMessages;
  return pool[Math.floor(Math.random() * pool.length)];
}
