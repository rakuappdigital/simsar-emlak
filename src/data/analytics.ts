/**
 * Ölçüm (6 Ekim 2026) — TelemetryDeck'e anonim kullanım olayları gönderir.
 * Pano: https://dashboard.telemetrydeck.com  (Sadrazam'daki analytics.js'in TS kopyası)
 *
 * OYUNU ASLA ETKİLEMEZ: her çağrı try/catch içinde, hiçbir şey beklenmez, ağ hatası
 * sessizce yutulur, oyun durumu yalnızca okunur. APP_ID yer tutucuyken HİÇ ağ isteği yok.
 *
 * Gizlilik: kişisel veri, IDFA, konum GÖNDERİLMEZ. Kullanıcı kimliği cihazda üretilen
 * rastgele sayının SHA-256 özetidir → ATT'ye bağlı değil. App Store gizlilik etiketi:
 * "Kullanım Verisi · Ürün Etkileşimi · kullanıcıyla bağlantılı değil · izleme yok".
 *
 * Kota: ücretsiz planda ayda 50.000 olay (Sadrazam ile aynı hesap → kota PAYLAŞILIR).
 * Oyun başına ~70 olay (54 ev + 9 hafta + birkaç tane).
 */
import { Capacitor } from "@capacitor/core";
import { getLanguage } from "./language";

const APP_ID = "04441313-DCAA-41B1-90E8-09568B546415"; // TelemetryDeck > Odd Estate > Settings > App ID
const NAMESPACE = "com.sadrazam"; // kuruluş namespace'i (Sadrazam ile aynı hesap)
const ENDPOINT = `https://nom.telemetrydeck.com/v2/namespace/${NAMESPACE}/`;
// Yerel geliştirme/test (http://localhost) → gönderim YOK; testler gerçek panoya yazmasın.
// iOS uygulaması capacitor://localhost'ta çalışır (http değil), o yüzden ayrım ŞEMAYA bakar.
// Testte bilerek açmak için localStorage["simsar-emlak-an-test"] = "1".
const LOCAL_DEV = (() => {
  try {
    return (
      /^https?:$/.test(location.protocol) &&
      /^(localhost|127\.0\.0\.1)$/.test(location.hostname) &&
      localStorage.getItem("simsar-emlak-an-test") !== "1"
    );
  } catch {
    return true;
  }
})();
const ENABLED = !APP_ID.startsWith("TELEMETRYDECK_") && !LOCAL_DEV;
const SALT = "odd-estate-kadikoy";
const FLUSH_MS = 20_000;
const MAX_BATCH = 25;

type Payload = Record<string, string>;
const queue: { type: string; payload: Payload }[] = [];
let hashedUser: string | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let context: Record<string, unknown> = {};

function randomId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return String(Date.now()) + Math.random().toString(16).slice(2);
  }
}
const sessionID = randomId();

function rawUser(): string {
  try {
    let id = localStorage.getItem("simsar-emlak-tdid");
    if (!id) {
      id = randomId();
      localStorage.setItem("simsar-emlak-tdid", id);
    }
    return id;
  } catch {
    return "anon";
  }
}

async function userHash(): Promise<string> {
  if (hashedUser) return hashedUser;
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rawUser() + SALT));
    hashedUser = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    hashedUser = "anon";
  }
  return hashedUser;
}

function isNative(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return "";
    }
  }
  return String(v);
}

function common(): Payload {
  const out: Payload = {
    appVersion: __APP_VERSION__,
    buildNumber: __APP_BUILD__,
    lang: getLanguage(),
    platform: isNative() ? "ios" : "web",
  };
  // paid / stage / index → App.tsx'in setAnalyticsContext'i (purchases'a import döngüsü olmasın).
  for (const [k, v] of Object.entries(context)) out[k] = str(v);
  return out;
}

function flush(keepalive = false): void {
  if (!ENABLED || !queue.length) return;
  const batch = queue.splice(0, MAX_BATCH);
  void (async () => {
    try {
      const clientUser = await userHash();
      const body = batch.map((s) => ({
        appID: APP_ID,
        clientUser,
        sessionID,
        type: s.type,
        payload: s.payload,
        telemetryClientVersion: "OddEstateTS 1.0",
        ...(isNative() ? {} : { isTestMode: true }), // web sürümü panoda "test" olarak ayrılır
      }));
      fetch(ENDPOINT, {
        method: "POST",
        mode: "cors",
        keepalive,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).catch(() => {});
    } catch {
      // ignore
    }
  })();
  if (queue.length) schedule();
}

function schedule(): void {
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
    flush();
  }, FLUSH_MS);
}

/** Olay gönderir (kuyruğa atar). Asla hata fırlatmaz, asla beklemez. */
export function track(type: string, payload?: Record<string, unknown>): void {
  if (!ENABLED) return;
  try {
    const p = common();
    for (const [k, v] of Object.entries(payload ?? {})) p[k] = str(v);
    queue.push({ type, payload: p });
    if (queue.length > 200) queue.splice(0, queue.length - 200);
    if (queue.length >= MAX_BATCH) flush();
    else schedule();
  } catch {
    // ignore
  }
}

/** Her olaya eklenen oyun bağlamı (ör. hangi ekran, kaçıncı ev). App.tsx günceller. */
export function setAnalyticsContext(ctx: Record<string, unknown>): void {
  context = ctx;
}

try {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      // Oyuncunun uygulamadan nerede çıktığını görmek için (bağlamda stage/index var).
      track("app_background");
      flush(true);
    }
  });
  window.addEventListener("pagehide", () => flush(true));
} catch {
  // ignore
}

setTimeout(() => track("session_start"), 0);
