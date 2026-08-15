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
  text: string;
}

export const tipsterMessages: TipsterMessage[] = [
  // Cemil Abi — mahalleden, tecrübeli ama iş bilmiş esnaf tavırlı komşu
  { id: "cemil-tip-1", from: "Cemil Abi", text: "Yeğenim, şu yatırım evlerine bi göz at, bizim mahallede fiyatlar oynuyor bu aralar." },
  { id: "cemil-tip-2", from: "Cemil Abi", text: "Ben olsam acele etmezdim, biraz bekle bakalım piyasa ne yapacak." },
  { id: "cemil-tip-3", from: "Cemil Abi", text: "Marketten gelirken gördüm, karşı sokaktaki bina boyanıyor, bir şeyler dönüyor galiba." },
  { id: "cemil-off-1", from: "Cemil Abi", text: "Yeğenim akşam çay içmeye gel, uzun zamandır uğramadın." },
  { id: "cemil-off-2", from: "Cemil Abi", text: "Bizim kedi yine çatıya çıktı, indiremedik bir türlü." },

  // Kankam — genç, enerjik, argo tonlu arkadaş
  { id: "kankam-tip-1", from: "Kankam", text: "Kanka yatırım evlerine bak diyorum, fırsat kaçmasın." },
  { id: "kankam-tip-2", from: "Kankam", text: "Duydum ki piyasa hareketli bu hafta, sen de bi göz at derim." },
  { id: "kankam-tip-3", from: "Kankam", text: "Kanka bu ara para dönüyor ortalıkta, uyuma." },
  { id: "kankam-off-1", from: "Kankam", text: "Kanka akşam maç var, geliyon mu?" },
  { id: "kankam-off-2", from: "Kankam", text: "Yeni telefon aldım kanka, resmen uçuyor." },

  // Züleyha Teyze — dedikoducu ama bazen gerçekten haberdar komşu
  { id: "zuleyha-tip-1", from: "Züleyha Teyze", text: "Oğlum duydum ki bu aralar ev fiyatları oynuyormuş, dikkatli ol." },
  { id: "zuleyha-tip-2", from: "Züleyha Teyze", text: "Komşunun kızı ev satmış da çok iyi paraya satmış diyorlar." },
  { id: "zuleyha-tip-3", from: "Züleyha Teyze", text: "Sen o yatırım evlerine bakmışsın diye duydum, hayırlı olsun inşallah." },
  { id: "zuleyha-off-1", from: "Züleyha Teyze", text: "Oğlum yarın börek yapacağım, gel bir tabak da sana ayırayım." },
  { id: "zuleyha-off-2", from: "Züleyha Teyze", text: "Apartman toplantısı yine uzadı, saat kaça kadar sürdü bilemezsin." },
];

/** Avoids repeating the same message twice in a row. */
export function pickTipsterMessage(excludeId?: string): TipsterMessage {
  const pool = excludeId ? tipsterMessages.filter((m) => m.id !== excludeId) : tipsterMessages;
  return pool[Math.floor(Math.random() * pool.length)];
}
