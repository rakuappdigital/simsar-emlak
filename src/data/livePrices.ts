/**
 * Mağaza fiyatları doğrudan App Store'dan (RevenueCat → StoreKit) okunur.
 * Eskiden yalnızca elle yazılmış sabitler gösteriliyordu; App Store Connect'te
 * fiyat değişince ekran eski fiyatı, ödeme sayfası yenisini gösteriyordu
 * (TestFlight build 12: "₺39,99" yazıp ₺29,99 çekiyordu). Canlı fiyat
 * gelemezse (web/test, ağ yok) purchases.ts/jettons.ts sabitleri yedek olur.
 */
import { useEffect, useState } from "react";
import { Purchases } from "@revenuecat/purchases-capacitor";
import { isRevenueCatAvailable } from "./revenuecat";

export interface LivePrice {
  /** StoreKit'in yerelleştirilmiş metni, ör. "₺29,99" ya da "$1.99". */
  label: string;
  value: number;
  currencyCode: string;
}

let cache: Record<string, LivePrice> = {};

async function fetchLivePrices(ids: string[]): Promise<Record<string, LivePrice>> {
  if (!isRevenueCatAvailable()) return {};
  try {
    const { products } = await Purchases.getProducts({ productIdentifiers: ids });
    const out: Record<string, LivePrice> = {};
    for (const p of products) out[p.identifier] = { label: p.priceString, value: p.price, currencyCode: p.currencyCode };
    cache = { ...cache, ...out };
    return out;
  } catch (e) {
    console.error("RevenueCat getProducts (prices) failed:", e);
    return {};
  }
}

/** Ekran açılınca fiyatları bir kez çeker; önbellekte varsa hemen onları gösterir. */
export function useLivePrices(ids: string[]): Record<string, LivePrice> {
  const [prices, setPrices] = useState<Record<string, LivePrice>>(() => ({ ...cache }));
  const key = ids.join("|");
  useEffect(() => {
    let cancelled = false;
    fetchLivePrices(ids).then((p) => {
      if (!cancelled && Object.keys(p).length > 0) setPrices((cur) => ({ ...cur, ...p }));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return prices;
}

/** Ondalık ayraçtan bağımsız sayı: "₺39,99" / "$2.99" → 39.99 / 2.99. */
export function parsePriceString(price: string): number {
  const cleaned = price.replace(/[^\d,.-]/g, "");
  return parseFloat(cleaned.includes(",") ? cleaned.replace(",", ".") : cleaned);
}

/** Bir tutarı canlı fiyatın para birimiyle yazar (eski/indirimsiz toplam için). */
export function formatInCurrency(value: number, currencyCode: string, language: "tr" | "en"): string {
  try {
    return new Intl.NumberFormat(language === "tr" ? "tr-TR" : "en-US", { style: "currency", currency: currencyCode }).format(value);
  } catch {
    return value.toFixed(2);
  }
}
