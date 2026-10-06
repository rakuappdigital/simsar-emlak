/**
 * App Tracking Transparency kapısı. İzin penceresinin kendisi native tarafta
 * (ios/App/App/SceneDelegate.swift) sahne aktif olunca gösteriliyor; burada
 * yalnızca cevabı bekliyoruz ki:
 *  - Game Center girişi kendi penceresini ATT'nin üstüne açıp onu yutmasın,
 *  - AdMob, izin verilmeden önce hiçbir istek/veri toplamasın.
 * Cevap hiç gelmezse (ör. kısıtlı cihaz) zaman aşımından sonra devam edilir;
 * o durumda izin verilmemiş sayılır, IDFA zaten paylaşılmaz.
 */
import { Capacitor } from "@capacitor/core";
import { AdMob } from "@capacitor-community/admob";

const POLL_MS = 400;
const MAX_WAIT_MS = 45_000;

let decisionPromise: Promise<void> | null = null;

async function currentStatus(): Promise<string | null> {
  try {
    const { status } = await AdMob.trackingAuthorizationStatus();
    return status;
  } catch {
    return null;
  }
}

export function waitForTrackingDecision(): Promise<void> {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "ios") return Promise.resolve();
  if (!decisionPromise) {
    decisionPromise = (async () => {
      const deadline = Date.now() + MAX_WAIT_MS;
      while (Date.now() < deadline) {
        const status = await currentStatus();
        if (status !== "notDetermined") return;
        await new Promise((r) => setTimeout(r, POLL_MS));
      }
    })();
  }
  return decisionPromise;
}
