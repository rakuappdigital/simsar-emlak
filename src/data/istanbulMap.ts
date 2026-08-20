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

export const districtCoords: Record<string, { x: number; y: number }> = {
  Beylikdüzü: { x: 10, y: 70 },
  Bahçelievler: { x: 18, y: 62 },
  Bahçeşehir: { x: 14, y: 48 },
  Bakırköy: { x: 20, y: 68 },
  Ataköy: { x: 22, y: 70 },
  Yedikule: { x: 28, y: 72 },
  Kumkapı: { x: 33, y: 70 },
  Sultanahmet: { x: 36, y: 68 },
  Beyazıt: { x: 35, y: 64 },
  Fatih: { x: 33, y: 62 },
  Balat: { x: 32, y: 56 },
  Eminönü: { x: 37, y: 60 },
  Sirkeci: { x: 38, y: 61 },
  Karaköy: { x: 40, y: 58 },
  Tarlabaşı: { x: 39, y: 52 },
  Beyoğlu: { x: 40, y: 50 },
  Çukurcuma: { x: 41, y: 51 },
  Taksim: { x: 41, y: 48 },
  Cihangir: { x: 42, y: 50 },
  Nişantaşı: { x: 40, y: 44 },
  Şişli: { x: 39, y: 40 },
  Mecidiyeköy: { x: 38, y: 37 },
  Kağıthane: { x: 33, y: 34 },
  Maslak: { x: 37, y: 28 },
  Levent: { x: 40, y: 32 },
  Etiler: { x: 42, y: 30 },
  Beşiktaş: { x: 44, y: 42 },
  Bebek: { x: 45, y: 28 },
  Sarıyer: { x: 46, y: 10 },
  Boğaziçi: { x: 50, y: 30 },
  Üsküdar: { x: 55, y: 46 },
  Kuzguncuk: { x: 56, y: 40 },
  Beykoz: { x: 58, y: 12 },
  Çekmeköy: { x: 70, y: 30 },
  Ümraniye: { x: 65, y: 38 },
  Ataşehir: { x: 68, y: 48 },
  Kadıköy: { x: 58, y: 55 },
  Moda: { x: 57, y: 58 },
  Şile: { x: 85, y: 8 },
  Ağva: { x: 91, y: 4 },
  Adalar: { x: 62, y: 75 },
  "Kapalıçarşı yakını": { x: 34, y: 63 },
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
      pin = { district, x: coords.x, y: coords.y, sold: 0, thinking: 0, lost: 0, total: 0, houses: [] };
      byDistrict.set(district, pin);
    }
    pin[result.outcome] += 1;
    pin.total += 1;
    pin.houses.push({ title: house.title, outcome: result.outcome, bestLine: result.bestLine });
  }

  return Array.from(byDistrict.values());
}

export const TOTAL_DISTRICT_COUNT = Object.keys(districtCoords).length;
