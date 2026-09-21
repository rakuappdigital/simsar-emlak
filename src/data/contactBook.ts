import type { HouseResult, HouseScene, SceneOutcome } from "../types";
import { allHouses } from "./houses";
import { premiumHouses } from "./premiumHouses";
import { investmentHouses } from "./investmentHouses";
import { resolveCustomerNames, resolvePortrait } from "./characterPool";
import { characterImages } from "./characterImages";
import { districtOf } from "./introFlavor";
import { resolveText, type Localized } from "./language";

/**
 * "Emlah'ın Rehberi" — a phone-contacts-style read-only view built purely
 * from data already tracked (results/premiumResults/investmentResults +
 * castAssignment). Customers only, on purpose — friends (friendHouses.ts)
 * and Fırat are a different relationship and stay in their own tabs. One
 * card per resolved customer name per house visit; names can coincidentally
 * repeat across different houses (same as the rest of the game already
 * accepts), which reads as "small world" rather than a bug.
 */
export interface ContactEntry {
  key: string;
  name: string;
  portrait?: string;
  houseTitle: string;
  district: string;
  outcome: SceneOutcome;
  note: string;
  bestLine?: string;
}

function findHouse(houseId: string): HouseScene | undefined {
  return allHouses.find((h) => h.id === houseId) ?? premiumHouses.find((h) => h.id === houseId) ?? investmentHouses.find((h) => h.id === houseId);
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick(seed: string, options: Localized[]): string {
  return resolveText(options[hashString(seed) % options.length]);
}

const soldHonestNotes = [
  { tr: "İşimi dürüstçe yaptım, hiç zorlanmadım.", en: "I did my job honestly, had no trouble at all." },
  { tr: "Ona her şeyi olduğu gibi anlattım, yine de anlaştık.", en: "I explained everything to him just as it was, we agreed anyway." },
  { tr: "Temiz bir satıştı, arkamda hiçbir şey bırakmadım.", en: "It was a clean sale, I left nothing behind." },
];
const soldSneakyNotes = [
  { tr: "Biraz köşe kestim ama iş oldu, vicdanım biraz sızladı.", en: "I cut some corners but the job got done, my conscience twinged a bit." },
  { tr: "Bazı detayları atlattım, keşke gerek kalmasaydı.", en: "I glossed over some details, wish it hadn't been necessary." },
  { tr: "Baskı yaptım, işe yaradı ama tadı damağımda kalmadı.", en: "I applied pressure, it worked, but left a bitter taste." },
];
const soldFunNotes = [
  { tr: "Sohbeti tatlıydı, satış neredeyse kendiliğinden oldu.", en: "The chat was sweet, the sale happened almost by itself." },
  { tr: "İyi anlaştık, tekrar karşılaşmak isterim.", en: "We got along well, would love to cross paths again." },
  { tr: "Espriyle geçti, keşke her müşteri böyle olsa.", en: "It passed with humor, wish every client was like this." },
];
const soldDiscountNotes = [
  { tr: "Pazarlıkta cömert davrandım ama satış cepte kaldı.", en: "I was generous in negotiation, but the sale is in the bag." },
  { tr: "İndirimi hak etti, memnun ayrıldı.", en: "He deserved the discount, left satisfied." },
];
const thinkingNotes = [
  { tr: "Kararsız kaldı, belki bir gün geri döner.", en: "Remained indecisive, maybe he'll return one day." },
  { tr: "İkna olmadı ama kapıyı da kapatmadı.", en: "Wasn't convinced but didn't close the door either." },
  { tr: "Düşünmek istedi, elimden geleni yaptım.", en: "Wanted to think, I did my best." },
];
const lostSuspiciousNotes = [
  { tr: "Bana hiç güvenmedi, elimden bir şey gelmedi.", en: "Never trusted me, nothing I could do." },
  { tr: "Gözlerindeki şüpheyi kıramadım.", en: "I couldn't break the doubt in their eyes." },
  { tr: "Fazla ısrar ettim galiba, kaçırdım.", en: "I guess I insisted too much, I missed it." },
];
const lostOtherNotes = [
  { tr: "Bu sefer olmadı, tam anlaşamadık.", en: "Not this time, we couldn't quite agree." },
  { tr: "Farklı bir şey arıyordu, elimde o yoktu.", en: "They were looking for something different, I didn't have that." },
  { tr: "Kısmet değilmiş.", en: "It wasn't meant to be." },
];

function contactNoteFor(result: HouseResult): string {
  const seed = `${result.houseId}-${result.outcome}-${Math.round(result.finalSuspicion)}`;
  if (result.outcome === "sold") {
    if ((result.sale?.discountPercent ?? 0) > 12) return pick(seed, soldDiscountNotes);
    if (result.bestLineFun && result.bestLineFun >= 20) return pick(seed, soldFunNotes);
    if (result.finalSuspicion > 45) return pick(seed, soldSneakyNotes);
    return pick(seed, soldHonestNotes);
  }
  if (result.outcome === "thinking") return pick(seed, thinkingNotes);
  if (result.finalSuspicion > 45) return pick(seed, lostSuspiciousNotes);
  return pick(seed, lostOtherNotes);
}

export function buildContactBook(
  results: HouseResult[],
  premiumResults: HouseResult[],
  investmentResults: HouseResult[],
  castAssignment: Record<string, string[]>,
): ContactEntry[] {
  const all = [...results, ...premiumResults, ...investmentResults];
  const entries: ContactEntry[] = [];

  for (const result of all) {
    const house = findHouse(result.houseId);
    if (!house) continue;
    const names = resolveCustomerNames(house, castAssignment);
    for (const name of names) {
      if (!name) continue;
      const portrait = resolvePortrait(name, house, castAssignment) ?? characterImages[name];
      entries.push({
        key: `${result.houseId}-${name}`,
        name,
        portrait,
        houseTitle: house.title,
        district: districtOf(house.location),
        outcome: result.outcome,
        note: contactNoteFor(result),
        bestLine: result.bestLine,
      });
    }
  }

  // Newest first.
  return entries.reverse();
}
