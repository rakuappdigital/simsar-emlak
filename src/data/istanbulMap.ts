import type { HouseResult, HouseScene, SceneOutcome } from "../types";
import { allHouses } from "./houses";
import { premiumHouses } from "./premiumHouses";
import { investmentHouses } from "./investmentHouses";
import { friendHouses } from "./friendHouses";
import { districtOf } from "./introFlavor";

/**
 * "Şehir Haritası" — a stylized, percentage-coordinate map of the districts
 * that actually appear across houses.ts/premiumHouses.ts/investmentHouses.ts
 * /friendHouses.ts. Positions are an approximate, deliberately simplified
 * mental map of Istanbul (west/European side lower x, east/Asian side
 * higher x, north near the Black Sea mouth lower y, south near the Sea of
 * Marmara higher y) — not surveyed coordinates, just enough geographic
 * logic to feel right at a glance.
 */

/** Folds location-string variants ("Moda sahili", "Bebek açıkları", ...) onto one canonical pin. */
export function normalizeDistrict(rawDistrict: string): string {
  if (rawDistrict === "Moda sahili") return "Moda";
  if (rawDistrict === "Bebek açıkları") return "Bebek";
  if (rawDistrict === "Adalar açığı") return "Adalar";
  if (rawDistrict === "Boğaz kıyısı") return "Boğaziçi";
  if (rawDistrict === "Şile yakınları") return "Şile";
  return rawDistrict;
}

// Recalibrated against the actual commissioned map artwork (src/assets/istanbul-map.webp):
// the Golden Horn inlet, Bosphorus strait, and Adalar are all traceable landmarks in
// that specific image, so these percentages are read off it rather than invented.
export const districtCoords: Record<string, { x: number; y: number }> = {
  Beylikdüzü: { x: 3, y: 71 },
  Bahçelievler: { x: 9, y: 60 },
  Bahçeşehir: { x: 6, y: 41 },
  Bakırköy: { x: 12, y: 64 },
  Ataköy: { x: 14, y: 67 },
  Yedikule: { x: 21, y: 62 },
  Kumkapı: { x: 27, y: 53 },
  Sultanahmet: { x: 31, y: 51 },
  Beyazıt: { x: 30, y: 44 },
  Fatih: { x: 28, y: 38 },
  Balat: { x: 37, y: 33 },
  Eminönü: { x: 40, y: 39 },
  Sirkeci: { x: 41, y: 41 },
  Karaköy: { x: 44, y: 37 },
  Tarlabaşı: { x: 44, y: 26 },
  Beyoğlu: { x: 45, y: 23 },
  Çukurcuma: { x: 47, y: 25 },
  Taksim: { x: 47, y: 20 },
  Cihangir: { x: 48, y: 27 },
  Nişantaşı: { x: 49, y: 17 },
  Şişli: { x: 50, y: 13 },
  Mecidiyeköy: { x: 51, y: 10 },
  Kağıthane: { x: 31, y: 10 },
  Maslak: { x: 53, y: 6 },
  Levent: { x: 54, y: 8 },
  Etiler: { x: 55, y: 10 },
  Beşiktaş: { x: 54, y: 18 },
  Bebek: { x: 57, y: 14 },
  Sarıyer: { x: 59, y: 4 },
  Boğaziçi: { x: 60, y: 32 },
  Üsküdar: { x: 63, y: 35 },
  Kuzguncuk: { x: 64, y: 27 },
  Beykoz: { x: 67, y: 9 },
  Çekmeköy: { x: 83, y: 18 },
  Ümraniye: { x: 75, y: 20 },
  Ataşehir: { x: 78, y: 32 },
  Kadıköy: { x: 67, y: 44 },
  Moda: { x: 65, y: 51 },
  Şile: { x: 97, y: 9 },
  Ağva: { x: 99, y: 5 },
  Adalar: { x: 64, y: 93 },
  "Kapalıçarşı yakını": { x: 30, y: 46 },
};

export interface DistrictPin {
  district: string;
  x: number;
  y: number;
  sold: number;
  thinking: number;
  lost: number;
  total: number;
  houses: { title: string; outcome: SceneOutcome; bestLine?: string }[];
  /** True once DISTRICT_DOMINANCE_THRESHOLD houses have been sold here — see isDistrictDominated below. */
  dominated: boolean;
}

/**
 * "Bölge Hakimiyeti" — selling enough houses in one district gives future
 * houses THERE a small suspicion discount, applied in enterPhone() exactly
 * like the existing districtReputationOffset nudge (introFlavor.ts) sits
 * alongside it — an additive nudge to starting suspicion, never touches
 * resolveOutcome's formula. Purely derived from `results`, no new save
 * state needed.
 */
export const DISTRICT_DOMINANCE_THRESHOLD = 3;
export const DISTRICT_DOMINANCE_SUSPICION_DISCOUNT = -8;

export function soldCountInDistrict(results: HouseResult[], allHousesList: HouseScene[], district: string): number {
  return results.filter((r) => {
    if (r.outcome !== "sold") return false;
    const h = allHousesList.find((house) => house.id === r.houseId);
    return h ? normalizeDistrict(districtOf(h.location)) === district : false;
  }).length;
}

export function isDistrictDominated(results: HouseResult[], allHousesList: HouseScene[], district: string): boolean {
  return soldCountInDistrict(results, allHousesList, district) >= DISTRICT_DOMINANCE_THRESHOLD;
}

function findHouse(houseId: string): HouseScene | undefined {
  return (
    allHouses.find((h) => h.id === houseId) ??
    premiumHouses.find((h) => h.id === houseId) ??
    investmentHouses.find((h) => h.id === houseId) ??
    friendHouses.find((h) => h.id === houseId)
  );
}

export function buildDistrictPins(
  results: HouseResult[],
  premiumResults: HouseResult[],
  investmentResults: HouseResult[],
  friendHouseResults: HouseResult[],
): DistrictPin[] {
  const byDistrict = new Map<string, DistrictPin>();
  const all = [...results, ...premiumResults, ...investmentResults, ...friendHouseResults];

  for (const result of all) {
    const house = findHouse(result.houseId);
    if (!house) continue;
    const district = normalizeDistrict(districtOf(house.location));
    const coords = districtCoords[district];
    if (!coords) continue;

    let pin = byDistrict.get(district);
    if (!pin) {
      pin = { district, x: coords.x, y: coords.y, sold: 0, thinking: 0, lost: 0, total: 0, houses: [], dominated: false };
      byDistrict.set(district, pin);
    }
    pin[result.outcome] += 1;
    pin.total += 1;
    pin.houses.push({ title: house.title, outcome: result.outcome, bestLine: result.bestLine });
  }

  for (const pin of byDistrict.values()) {
    pin.dominated = pin.sold >= DISTRICT_DOMINANCE_THRESHOLD;
  }

  return Array.from(byDistrict.values());
}

export const TOTAL_DISTRICT_COUNT = Object.keys(districtCoords).length;
