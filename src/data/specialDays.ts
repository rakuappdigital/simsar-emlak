/**
 * B4 — Gerçek takvim günleri. Cihazın tarihine bakar (oyun içi takvime değil):
 * 1 Nisan, 13'ü Cuma, 29 Ekim, yılbaşı ve oyunun ilk açılışının yıldönümü.
 * Ofiste bir şerit, Muzaffer'den günde bir mesaj, bazı günlerde de her evin
 * başında kısa bir satır. Hiçbir puan hesabına dokunmaz.
 */
import type { Localized } from "./language";

const FIRST_LAUNCH_KEY = "simsar-emlak-first-launch";

export type SpecialDayId = "nisan-1" | "cuma-13" | "cumhuriyet" | "yilbasi" | "yildonumu";

export interface SpecialDay {
  id: SpecialDayId;
  /** Albüm kartı. */
  albumId: string;
  banner: Localized;
  muzafferMessage: Localized;
  /** Varsa her evin başında bu havuzdan bir satır (müşteri ya da Emlah'ın içinden). */
  houseLines?: { speaker: "thought" | "customer1"; text: Localized }[][];
  /** Ofis süsü (bayrak şeridi) gösterilsin mi. */
  festive?: boolean;
}

const days: Record<SpecialDayId, SpecialDay> = {
  "nisan-1": {
    id: "nisan-1",
    albumId: "nisan-1",
    banner: { tr: "Bugün 1 Nisan — müşterilere pek güvenme.", en: "It's April 1st — don't trust clients too much today." },
    muzafferMessage: { tr: "Emlah, bugün evlerin hepsi satıldı, eve gidebilirsin. ... 1 Nisan! Hadi işbaşına.", en: "Estetan, every house sold today, you can go home. ... April Fools! Back to work." },
    houseLines: [
      [
        { speaker: "customer1", text: { tr: "Ben aslında bu evi değil, karşı apartmanın çatısını almak istiyorum. Satılık mı?", en: "Actually I don't want this house, I want the roof of the building across. Is it for sale?" } },
        { speaker: "thought", text: { tr: "(içinden) Takvime baktım. 1 Nisan. Tamam.", en: "(to himself) I checked the calendar. April 1st. Right." } },
      ],
      [
        { speaker: "customer1", text: { tr: "Mutfağı salonla yer değiştirebilir miyiz? Sadece bugünlük.", en: "Could we swap the kitchen with the living room? Just for today." } },
        { speaker: "thought", text: { tr: "(içinden) Bugün kimse ciddi değil galiba.", en: "(to himself) Nobody seems serious today." } },
      ],
      [
        { speaker: "customer1", text: { tr: "Fiyatı ödeyeceğim ama sadece çikolatalı paralarla.", en: "I'll pay the price, but only in chocolate coins." } },
        { speaker: "thought", text: { tr: "(içinden) Gülümse, Emlah. Sadece gülümse.", en: "(to himself) Smile, Estetan. Just smile." } },
      ],
    ],
  },
  "cuma-13": {
    id: "cuma-13",
    albumId: "cuma-13",
    banner: { tr: "13'ü Cuma — bugün her şey biraz ters gidebilir.", en: "Friday the 13th — things may go a little wrong today." },
    muzafferMessage: { tr: "Bugün 13'ü Cuma. Ben batıl inançlı değilim ama sen yine de merdivenin altından geçme.", en: "It's Friday the 13th. I'm not superstitious, but don't walk under any ladders anyway." },
    houseLines: [
      [{ speaker: "thought", text: { tr: "(içinden) Kapı kolu elimde kaldı. Harika bir başlangıç.", en: "(to himself) The door handle came off in my hand. Great start." } }],
      [{ speaker: "thought", text: { tr: "(içinden) Kara bir kedi önümden geçti, sonra geri dönüp bir daha geçti.", en: "(to himself) A black cat crossed my path, then came back and crossed it again." } }],
      [{ speaker: "thought", text: { tr: "(içinden) Asansör tam 13. katta durdu. Bina 12 katlı.", en: "(to himself) The elevator stopped on floor 13. The building has 12 floors." } }],
      [{ speaker: "thought", text: { tr: "(içinden) Anahtarlığım koptu, tüm anahtarlar merdivenden aşağı.", en: "(to himself) My key ring snapped, every key bounced down the stairs." } }],
    ],
  },
  cumhuriyet: {
    id: "cumhuriyet",
    albumId: "bayram",
    banner: { tr: "29 Ekim — Cumhuriyet Bayramı kutlu olsun!", en: "October 29 — Happy Republic Day!" },
    muzafferMessage: { tr: "Cumhuriyet Bayramımız kutlu olsun Emlah. Ofise bayrakları astım, sen de güzel bir satışla kutla.", en: "Happy Republic Day, Estetan. I hung the flags at the office, celebrate with a good sale." },
    festive: true,
  },
  yilbasi: {
    id: "yilbasi",
    albumId: "bayram",
    banner: { tr: "Yeni yıl geliyor — ofiste süsler asıldı.", en: "The new year is coming — the office is decorated." },
    muzafferMessage: { tr: "Mutlu yıllar Emlah! Yeni yılda daha çok satış, daha az indirim dilerim.", en: "Happy new year, Estetan! Wishing you more sales and fewer discounts this year." },
    festive: true,
  },
  yildonumu: {
    id: "yildonumu",
    albumId: "yildonumu",
    banner: { tr: "Bugün Odd Estate'i ilk açtığın günün yıldönümü.", en: "Today is the anniversary of the day you first opened Odd Estate." },
    muzafferMessage: {
      tr: "Geliştiriciden not: Bir yıl önce bugün bu ofisin kapısından ilk kez girdin. O günden beri buradasın. Teşekkür ederiz.",
      en: "A note from the developer: one year ago today you walked into this office for the first time. You're still here. Thank you.",
    },
    festive: true,
  },
};

/** Yerel takvim tarihi "yyyy-mm-dd" (toISOString UTC'dir, gece yarısına yakın yanlış güne düşer). */
function localDate(now: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

/** İlk açılış tarihini bir kez kaydeder (yıldönümü için). */
export function rememberFirstLaunch(now: Date = new Date()): void {
  try {
    if (!localStorage.getItem(FIRST_LAUNCH_KEY)) localStorage.setItem(FIRST_LAUNCH_KEY, localDate(now));
  } catch {
    // yok say
  }
}

function firstLaunch(): Date | null {
  try {
    const raw = localStorage.getItem(FIRST_LAUNCH_KEY);
    return raw ? new Date(`${raw}T00:00:00`) : null;
  } catch {
    return null;
  }
}

export function specialDayFor(now: Date = new Date()): SpecialDay | null {
  const m = now.getMonth() + 1;
  const d = now.getDate();
  if (m === 4 && d === 1) return days["nisan-1"];
  if (d === 13 && now.getDay() === 5) return days["cuma-13"];
  if (m === 10 && d === 29) return days.cumhuriyet;
  if ((m === 12 && d === 31) || (m === 1 && d === 1)) return days.yilbasi;
  const first = firstLaunch();
  if (first && first.getFullYear() < now.getFullYear() && first.getMonth() === now.getMonth() && first.getDate() === d) {
    return days.yildonumu;
  }
  return null;
}

/** Aynı gün içinde tek mesaj — "yyyy-mm-dd:id". */
export function specialDayKey(day: SpecialDay, now: Date = new Date()): string {
  return `${localDate(now)}:${day.id}`;
}

/** B5 — Gece yarısı müşterisi saatleri (gerçek saat 00:00–04:00). */
export function isNightHours(now: Date = new Date()): boolean {
  return now.getHours() < 4;
}
