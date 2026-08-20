import type { HouseResult, HouseScene, SceneOutcome } from "../types";
import { allHouses } from "./houses";
import { premiumHouses } from "./premiumHouses";
import { investmentHouses } from "./investmentHouses";
import { resolveCustomerNames, resolvePortrait } from "./characterPool";
import { characterImages } from "./characterImages";
import { districtOf } from "./introFlavor";

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

function pick(seed: string, options: string[]): string {
  return options[hashString(seed) % options.length];
}

const soldHonestNotes = [
  "İşimi dürüstçe yaptım, hiç zorlanmadım.",
  "Ona her şeyi olduğu gibi anlattım, yine de anlaştık.",
  "Temiz bir satıştı, arkamda hiçbir şey bırakmadım.",
];
const soldSneakyNotes = [
  "Biraz köşe kestim ama iş oldu, vicdanım biraz sızladı.",
  "Bazı detayları atlattım, keşke gerek kalmasaydı.",
  "Baskı yaptım, işe yaradı ama tadı damağımda kalmadı.",
];
const soldFunNotes = [
  "Sohbeti tatlıydı, satış neredeyse kendiliğinden oldu.",
  "İyi anlaştık, tekrar karşılaşmak isterim.",
  "Espriyle geçti, keşke her müşteri böyle olsa.",
];
const soldDiscountNotes = [
  "Pazarlıkta cömert davrandım ama satış cepte kaldı.",
  "İndirimi hak etti, memnun ayrıldı.",
];
const thinkingNotes = [
  "Kararsız kaldı, belki bir gün geri döner.",
  "İkna olmadı ama kapıyı da kapatmadı.",
  "Düşünmek istedi, elimden geleni yaptım.",
];
const lostSuspiciousNotes = [
  "Bana hiç güvenmedi, elimden bir şey gelmedi.",
  "Gözlerindeki şüpheyi kıramadım.",
  "Fazla ısrar ettim galiba, kaçırdım.",
];
const lostOtherNotes = [
  "Bu sefer olmadı, tam anlaşamadık.",
  "Farklı bir şey arıyordu, elimde o yoktu.",
  "Kısmet değilmiş.",
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
