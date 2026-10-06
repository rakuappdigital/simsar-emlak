import { Capacitor } from "@capacitor/core";
import { Purchases, LOG_LEVEL } from "@revenuecat/purchases-capacitor";
import { track } from "./analytics";

/**
 * RevenueCat Public API Key (App Store app) — get this from the RevenueCat
 * dashboard (Project Settings > API Keys) after attaching the app there.
 * Leave empty to keep running against the web/dev mock in purchases.ts/jettons.ts.
 */
export const REVENUECAT_API_KEY = "appl_uVsZyMczueBQjNNiklkCqXqPfZL";

let configured = false;

/** "com.rakuappdigital.simsaremlak.full_unlock" → "full_unlock" (ölçüm panosunda kısa görünsün). */
function shortProductId(productId: string): string {
  return productId.split(".").pop() ?? productId;
}

export function isRevenueCatAvailable(): boolean {
  return Capacitor.isNativePlatform() && REVENUECAT_API_KEY.length > 0;
}

export async function initRevenueCat(): Promise<void> {
  if (!isRevenueCatAvailable() || configured) return;
  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.WARN });
    await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    configured = true;
  } catch (e) {
    console.error("RevenueCat configure failed:", e);
  }
}

/** Buys a store product by its App Store Connect product ID, bypassing RevenueCat Offerings entirely. */
export async function purchaseByProductId(productId: string): Promise<boolean> {
  if (!isRevenueCatAvailable()) return false;
  try {
    const { products } = await Purchases.getProducts({ productIdentifiers: [productId] });
    const product = products[0];
    if (!product) {
      console.error(`RevenueCat: product not found: ${productId}`);
      return false;
    }
    await Purchases.purchaseStoreProduct({ product });
    track("purchase", { product: shortProductId(productId), result: "ok" });
    return true;
  } catch (e: any) {
    if (e?.userCancelled) {
      track("purchase", { product: shortProductId(productId), result: "cancelled" });
      return false;
    }
    console.error(`RevenueCat purchase failed for ${productId}:`, e);
    track("purchase", { product: shortProductId(productId), result: "error" });
    return false;
  }
}

/** Product IDs already owned (non-consumable purchase history) — used to restore state after reinstall. */
export async function getOwnedProductIds(): Promise<Set<string>> {
  if (!isRevenueCatAvailable()) return new Set();
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return new Set((customerInfo.nonSubscriptionTransactions ?? []).map((t) => t.productIdentifier));
  } catch (e) {
    console.error("RevenueCat getCustomerInfo failed:", e);
    return new Set();
  }
}
