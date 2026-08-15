import type { HouseScene } from "../types";

/**
 * "Yatırım Evleri" pool — properties Emlah can buy with his own money and
 * later resell for a profit, instead of just earning commission on someone
 * else's sale. Reuses the exact same HouseScene shape (and therefore the
 * same DialogueScene/ContractModal engine, via PremiumHouseScene) as the
 * main and premium house pools — completely isolated from `results`/
 * `houseOrder`, so it can never disturb week grouping or the core scoring
 * math. `askingPrice` here is the BASE price before the active market-news
 * modifier (see data/marketNews.ts) is applied at purchase/resale time.
 *
 * Only one placeholder house below to keep the mechanic testable end to
 * end. Add the real 20 in this same shape — `dynamicCast: [{}]` draws a
 * random buyer from the full shared character pool (see characterPool.ts),
 * same as any other dynamicCast house, so no dedicated art/characters are
 * needed for the buyers themselves.
 */
export const investmentHouses: HouseScene[] = [
  {
    id: "yatirim-ornek-daire",
    title: "Örnek Yatırım Dairesi",
    location: "Kadıköy, 4. kat",
    customerNames: ["Alıcı"],
    background: "placeholder-house-1",
    askingPrice: 4200000,
    tier: 1,
    dynamicCast: [{}],
    closingNodes: { sold: "closing_sold", thinking: "closing_thinking", lost: "closing_lost" },
    startNode: "start",
    nodes: {
      start: {
        id: "start",
        lines: [
          { speaker: "customer1", text: "Emlah Bey, kendi eviniz olduğunu söylediler, doğru mu?" },
          { speaker: "customer1", text: "Neden satıyorsunuz peki, bir sorun mu var?" },
        ],
        choices: [
          { id: "a", text: "\"Yeni bir yatırıma yöneliyorum, ev gayet sağlam.\"", next: "start_a", effects: { interest: 10 } },
          { id: "b", text: "\"Açıkçası fırsat çıktı, elimde tutmak istemedim.\"", next: "start_b", effects: { suspicion: 5, fun: 5 } },
          { id: "c", text: "\"Kendim otursam da satmak daha mantıklı geldi.\"", next: "start_c", effects: { interest: 5, fun: 5 } },
        ],
      },
      start_a: {
        id: "start_a",
        lines: [{ speaker: "customer1", text: "Mantıklı, yatırımcı bir yaklaşım o zaman." }],
        next: "detay",
      },
      start_b: {
        id: "start_b",
        lines: [{ speaker: "customer1", text: "Hmm, dürüst olduğunuz için teşekkürler en azından." }],
        next: "detay",
      },
      start_c: {
        id: "start_c",
        lines: [{ speaker: "customer1", text: "Kendi evinizmiş gibi bakmışsınızdır o zaman." }],
        next: "detay",
      },

      detay: {
        id: "detay",
        lines: [
          { speaker: "customer1", text: "Peki fiyat konusunda ne kadar esnetebiliriz?" },
        ],
        choices: [
          { id: "a", text: "\"Fiyat gayet net, bu değerin altına inmem.\"", next: "closing", effects: { suspicion: 5 } },
          { id: "b", text: "\"Makul bir teklif getirirseniz konuşuruz.\"", next: "closing", effects: { interest: 10, fun: 5 } },
          { id: "c", text: "\"Küçük bir esneklik olabilir ama çok değil.\"", next: "closing", effects: { interest: 5, discountPercent: 3 } },
        ],
      },

      closing: {
        id: "closing",
        lines: [{ speaker: "customer1", text: "Anladım, karar vermem gerekiyor sanırım." }],
        choices: [
          { id: "a", text: "\"Bu şartlarla anlaşalım o zaman.\"", next: "", effects: { closingBias: 15 } },
          { id: "b", text: "\"Düşünün, acele etmenize gerek yok.\"", next: "", effects: { closingBias: -10, fun: 5 } },
        ],
      },

      closing_sold: {
        id: "closing_sold",
        lines: [{ speaker: "customer1", text: "Tamam, anlaştık — sözleşmeyi hazırlayalım." }],
        end: "sold",
      },
      closing_thinking: {
        id: "closing_thinking",
        lines: [{ speaker: "customer1", text: "Biraz daha düşünmem lazım, size dönerim." }],
        end: "thinking",
      },
      closing_lost: {
        id: "closing_lost",
        lines: [{ speaker: "customer1", text: "Sanırım bu bana göre değil, vaktinizi aldım." }],
        end: "lost",
      },
    },
  },
];

/** Career rank required before the "Yatırım Evleri" tab unlocks. */
export const INVESTMENT_UNLOCK_RANK = "Ofis Ortağı";

export function isInvestmentUnlocked(rankTitleText: string): boolean {
  return rankTitleText === INVESTMENT_UNLOCK_RANK;
}
