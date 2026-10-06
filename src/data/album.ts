/**
 * B1 — Tuhaf Anlar Albümü. Oyuncunun keşfettiği her sır / easter egg / ünlü /
 * gizli müşteri bir kart olur; görülmeyenler "???" ve tek satırlık ipucuyla
 * durur. Oyunlar arası kalıcıdır (kendi localStorage anahtarı, prestige.ts gibi)
 * — yeni oyun açmak albümü sıfırlamaz. 5 / 10 / tamamı için jeton ödülü.
 */
import type { Localized } from "./language";

const STORAGE_KEY = "simsar-emlak-album";

export interface AlbumEntry {
  id: string;
  title: Localized;
  /** Görülmemişken gösterilen tek satırlık ipucu. */
  hint: Localized;
}

export const albumEntries: AlbumEntry[] = [
  { id: "egg-hayalet-ev", title: { tr: "Kendiliğinden Açılan Kapılar", en: "Doors That Open Themselves" }, hint: { tr: "Bazı evlerde tüyler diken diken olur.", en: "Some houses give you goosebumps." } },
  { id: "egg-ufo-komsu", title: { tr: "Balkondaki Işıklar", en: "Lights Over the Balcony" }, hint: { tr: "Komşular gökyüzünde bir şey görmüş.", en: "The neighbors saw something in the sky." } },
  { id: "egg-kedi-konseyi", title: { tr: "Yedi Kedinin Kurulu", en: "The Council of Seven Cats" }, hint: { tr: "Salonda seni değerlendiren bir heyet var.", en: "A committee in the living room is judging you." } },
  { id: "egg-zaman-yolcusu", title: { tr: "1987 Tarihli Not", en: "A Note from 1987" }, hint: { tr: "Duvar kâğıdının altında eski bir mesaj.", en: "An old message under the wallpaper." } },
  { id: "egg-gizli-oyuncu", title: { tr: "Repliğini Ezberleyen Müşteri", en: "The Client Rehearsing Lines" }, hint: { tr: "Biri sahneye hazırlanıyor gibi.", en: "Someone seems to be preparing for a stage." } },
  { id: "unlu", title: { tr: "Ünlü Bir Müşteri", en: "A Famous Client" }, hint: { tr: "Özel davetlerde tanıdık bir yüz.", en: "A familiar face at a special invite." } },
  { id: "gizli-musteri", title: { tr: "Gizli Müşteri", en: "The Mystery Shopper" }, hint: { tr: "Her müşteri göründüğü gibi değildir.", en: "Not every client is who they seem." } },
  { id: "zaman-yolcusu", title: { tr: "Zaman Yolcusu Emlah", en: "Time-Traveler Estetan" }, hint: { tr: "Bir gün geçmişinle karşılaşacaksın.", en: "One day you'll meet your past." } },
  { id: "tiklama", title: { tr: "Bin Tıklama", en: "A Thousand Taps" }, hint: { tr: "Oyun, ne kadar dokunduğunu sayıyor.", en: "The game is counting your taps." } },
  { id: "kedi-fotografci", title: { tr: "İlanı Kedi Sattı", en: "The Cat Sold the Listing" }, hint: { tr: "Vitrin Karesi'nde bazen tek bir yüz yeter.", en: "In Listing Shot, sometimes one face is enough." } },
  { id: "tanidik-imza", title: { tr: "Tanıdık İmza", en: "A Familiar Signature" }, hint: { tr: "Tapu Masası'nda bir isim gözüne takılacak.", en: "A name will catch your eye at the Deed Desk." } },
  { id: "nisan-1", title: { tr: "1 Nisan Müşterileri", en: "April Fools' Clients" }, hint: { tr: "Takvimin belli bir günü herkes şakacıdır.", en: "On a certain calendar day everyone jokes." } },
  { id: "cuma-13", title: { tr: "13'ü Cuma", en: "Friday the 13th" }, hint: { tr: "Uğursuz bir günde her evde bir aksilik.", en: "On an unlucky day, every house has a mishap." } },
  { id: "bayram", title: { tr: "Ofiste Kutlama", en: "Celebration at the Office" }, hint: { tr: "Bazı günlerde ofis süslenir.", en: "On some days the office gets decorated." } },
  { id: "yildonumu", title: { tr: "Bir Yıl Oldu", en: "It's Been a Year" }, hint: { tr: "Oyunu ilk açtığın günü hatırlıyor musun?", en: "Remember the day you first opened the game?" } },
  { id: "gece-kusu", title: { tr: "Gece Kuşu", en: "The Night Owl" }, hint: { tr: "Gece yarısından sonra ofise biri uğrar.", en: "Someone drops by the office after midnight." } },
  { id: "gizli-frekans", title: { tr: "Radyonun Gizli Frekansı", en: "The Radio's Secret Frequency" }, hint: { tr: "Ofis radyosunu biraz kurcala.", en: "Fiddle with the office radio a little." } },
  { id: "hayalet-sorusturma", title: { tr: "Hayalet Ev Soruşturması", en: "The Haunted House Inquiry" }, hint: { tr: "Bir tuhaf andan sonra peşine düşebileceğin bir iz.", en: "After a strange moment, a trail you can follow." } },
  { id: "yesil-kapi", title: { tr: "Yeşil Kapılı Yalı", en: "The Green-Doored Mansion" }, hint: { tr: "Yaşlı bir müşteri sana bir anahtar bırakacak.", en: "An elderly client will leave you a key." } },
  { id: "muzaffer-sirri", title: { tr: "Muzaffer Bey'in Sırrı", en: "Muzaffer Bey's Secret" }, hint: { tr: "Patronun sohbetlerinde bir ev saklı.", en: "A house is hidden in the boss's small talk." } },
  { id: "mahallenin-emlakcisi", title: { tr: "Mahallenin Emlakçısı", en: "The Neighborhood's Realtor" }, hint: { tr: "Esnafla çay içmek bazen kapı açar.", en: "Having tea with the shopkeepers opens doors." } },
  { id: "aile-dostu", title: { tr: "Aile Dostu", en: "Friend of the Family" }, hint: { tr: "Bazı müşteriler hayatından hiç çıkmaz.", en: "Some clients never leave your life." } },
  { id: "dongu", title: { tr: "55. Ev", en: "The 55th House" }, hint: { tr: "Portföy 54'te bitmiyor olabilir.", en: "The portfolio might not end at 54." } },
];

export const ALBUM_REWARDS: { at: number | "all"; jettons: number }[] = [
  { at: 5, jettons: 5 },
  { at: 10, jettons: 10 },
  { at: "all", jettons: 25 },
];

interface AlbumData {
  seen: string[];
  rewarded: string[];
}

function load(): AlbumData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { seen: [], rewarded: [] };
    const parsed = JSON.parse(raw);
    return {
      seen: Array.isArray(parsed.seen) ? parsed.seen : [],
      rewarded: Array.isArray(parsed.rewarded) ? parsed.rewarded : [],
    };
  } catch {
    return { seen: [], rewarded: [] };
  }
}

function save(data: AlbumData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // depolama yoksa albüm bu oturumla sınırlı kalır
  }
}

export function getAlbumSeen(): string[] {
  return load().seen;
}

/**
 * Bir kartı açar. Yeni açıldıysa ve bir ödül eşiği geçildiyse kazanılan
 * jeton miktarını döndürür (çağıran addJettons yapar); aksi halde 0.
 * Bilinmeyen id'ler yok sayılır.
 */
export function recordAlbum(id: string): { isNew: boolean; jettons: number } {
  if (!albumEntries.some((e) => e.id === id)) return { isNew: false, jettons: 0 };
  const data = load();
  if (data.seen.includes(id)) return { isNew: false, jettons: 0 };
  data.seen = [...data.seen, id];
  let jettons = 0;
  for (const r of ALBUM_REWARDS) {
    const key = String(r.at);
    const reached = r.at === "all" ? data.seen.length >= albumEntries.length : data.seen.length >= r.at;
    if (reached && !data.rewarded.includes(key)) {
      data.rewarded = [...data.rewarded, key];
      jettons += r.jettons;
    }
  }
  save(data);
  return { isNew: true, jettons };
}
