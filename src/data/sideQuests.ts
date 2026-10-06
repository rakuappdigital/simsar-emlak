/**
 * Yan Görevler & Easter Egg paketi (2026-10-06) — oyuncunun PEŞİNE
 * DÜŞEBİLECEĞİ şeyler. Mevcut sürprizler pasifti (zar tutunca başa gelen);
 * bunlar birden fazla eve yayılan küçük hikâyeler.
 *
 *  A1 Nadide Hanım'ın Anahtarı · A2 Muzaffer Bey'in Sırrı · A3 Muhtar'ın Defteri
 *  A4 Bir Müşterinin Hayatı · A5 Hayalet Ev Soruşturması
 *  B2 Kedi Fotoğrafçısı · B3 Tanıdık İmza · B5 Gece Yarısı Müşterisi
 *  B6 Radyonun Gizli Frekansı · B7 55. Ev
 *  (B1 Albüm → album.ts, B4 Takvim günleri → specialDays.ts)
 *
 * Bu dosya yalnızca durum şekli, metinler ve saf kurallar içerir; durumu
 * değiştiren her şey hooks/useSideQuests.ts'te. Durum oyun kaydında
 * (SaveGame.sideQuests) saklanır; alan yoksa eski kayıt boş durumla açılır.
 */
import type { HouseScene, SceneOutcome } from "../types";
import type { Localized } from "./language";
import { districtOf } from "./introFlavor";
import { normalizeDistrict } from "./istanbulMap";

export interface SideQuestState {
  /** En son hangi ev için "ev başı" ilerlemesi işlendi (kayıt yüklemede iki kez işlenmesin). */
  lastTick: number;
  key: { stage: "none" | "held" | "unlocked" | "done"; route: string[]; found: number };
  muzaffer: { targetHouseId: string | null; targetIndex: number; cluesSent: number; status: "pending" | "told" | "missed" | null };
  muhtar: { met: boolean; taskId: string | null; taskParam: string | null; done: number; tipReady: boolean; titled: boolean };
  life: { houseId: string | null; name: string | null; stage: number; nextAt: number };
  ghost: { step: number; lastIndex: number; storyReady: boolean };
  night: { done: boolean; pendingHouseId: string | null };
  forgery: boolean;
  rivalHeadStart: number;
  cat: boolean;
  radio: boolean;
  yaliResult: SceneOutcome | null;
  homeResult: SceneOutcome | null;
  firedDays: string[];
}

export function emptySideQuests(): SideQuestState {
  return {
    lastTick: -1,
    key: { stage: "none", route: [], found: 0 },
    muzaffer: { targetHouseId: null, targetIndex: -1, cluesSent: 0, status: null },
    muhtar: { met: false, taskId: null, taskParam: null, done: 0, tipReady: false, titled: false },
    life: { houseId: null, name: null, stage: 0, nextAt: -1 },
    ghost: { step: 0, lastIndex: -1, storyReady: false },
    night: { done: false, pendingHouseId: null },
    forgery: false,
    rivalHeadStart: 0,
    cat: false,
    radio: false,
    yaliResult: null,
    homeResult: null,
    firedDays: [],
  };
}

/** Eski/eksik kayıt → tam durum (yeni alan eklenince de güvenli). */
export function normalizeSideQuests(raw: Partial<SideQuestState> | undefined | null): SideQuestState {
  const base = emptySideQuests();
  if (!raw) return base;
  return {
    ...base,
    ...raw,
    key: { ...base.key, ...(raw.key ?? {}) },
    muzaffer: { ...base.muzaffer, ...(raw.muzaffer ?? {}) },
    muhtar: { ...base.muhtar, ...(raw.muhtar ?? {}) },
    life: { ...base.life, ...(raw.life ?? {}) },
    ghost: { ...base.ghost, ...(raw.ghost ?? {}) },
    night: { ...base.night, ...(raw.night ?? {}) },
    firedDays: raw.firedDays ?? [],
  };
}

export function houseDistrict(house: HouseScene): string {
  return normalizeDistrict(districtOf(house.location));
}

/* ------------------------------------------------------------------ */
/* A1 — Nadide Hanım'ın Anahtarı                                      */
/* ------------------------------------------------------------------ */

export const KEY_GIVE_MIN_INDEX = 4;
export const KEY_WRONG_HOUSE_SUSPICION = 6;

/** Sıradaki evlerden, aralarında en az iki ev olan üç farklı semt seçer — rota mutlaka gezilebilir. */
export function planKeyRoute(order: number[], fromIndex: number, all: HouseScene[]): string[] {
  const route: string[] = [];
  let i = fromIndex + 2;
  while (i < order.length && route.length < 3) {
    const h = all[order[i]];
    const d = h ? houseDistrict(h) : "";
    if (d && !route.includes(d)) {
      route.push(d);
      i += 3;
    } else {
      i += 1;
    }
  }
  return route;
}

export const nadideMessages = (firstDistrict: string): Localized[] => [
  {
    tr: `Evladım, evimi o kadar güzel sattın ki sana bir şey emanet edeceğim. Çantamda yıllardır taşıdığım eski bir anahtar var, üstünde "Y.K." yazıyor.`,
    en: `Dear, you sold my home so beautifully that I'll trust you with something. There's an old key I've carried for years, it says "G.D." on it.`,
  },
  {
    tr: `Hangi kapıyı açtığını unuttum. Ama gençken ${firstDistrict}'te biri bu anahtarı tanıyacağını söylemişti. Gösterirsen belki hatırlayan çıkar.`,
    en: `I've forgotten which door it opens. But when I was young, someone in ${firstDistrict} said they'd recognize it. Show it around, maybe someone remembers.`,
  },
];

export function keyClueLines(route: string[], found: number): { speaker: "customer1" | "thought"; text: Localized }[] {
  const next = route[found + 1];
  if (found === 0) {
    return [
      { speaker: "customer1", text: { tr: "Bu anahtar... Rahmetli dedem de böyle anahtarlar yapardı. Bu, deniz kenarındaki eski yalılardan birinin.", en: "This key... My late grandfather made keys like this. It's from one of the old seaside mansions." } },
      { speaker: "customer1", text: { tr: `Yalıların listesini ${next}'te bir çilingir tutardı. Oraya bir sorun.`, en: `A locksmith in ${next} used to keep a list of the mansions. Ask there.` } },
    ];
  }
  if (found === 1) {
    return [
      { speaker: "customer1", text: { tr: "\"Y.K.\" mi? Yeşil Kapı. Annem anlatırdı: bahçe kapısı yemyeşil boyalı bir yalı.", en: "\"G.D.\"? Green Door. My mother used to talk about it: a mansion with a bright green garden gate." } },
      { speaker: "customer1", text: { tr: `Sahiplerini ${next}'te bir aile tanırdı, onlara gösterin.`, en: `A family in ${next} knew the owners, show it to them.` } },
    ];
  }
  return [
    { speaker: "customer1", text: { tr: "Yeşil kapılı yalı! Kuzguncuk'ta, sahil yolunda. Yıllardır kapalı, kimse giremedi.", en: "The green-doored mansion! In Kuzguncuk, on the shore road. Closed for years, nobody could get in." } },
    { speaker: "thought", text: { tr: "(içinden) Anahtar cebimde ağırlaştı sanki. Ofise dönünce oraya gitmeliyim.", en: "(to himself) The key feels heavier in my pocket. I should go there once I'm back at the office." } },
  ];
}

export const keyWrongHouseLines: { speaker: "customer1"; text: Localized }[] = [
  { speaker: "customer1", text: { tr: "Hangi anahtar? Bu evle ne ilgisi var? Bana bir şey mi satmaya çalışıyorsunuz?", en: "What key? What does it have to do with this house? Are you trying to sell me something?" } },
];

/* ------------------------------------------------------------------ */
/* A2 — Muzaffer Bey'in Sırrı                                          */
/* ------------------------------------------------------------------ */

export const MUZAFFER_START_INDEX = 6;
export const MUZAFFER_TARGET_AHEAD = 7;
/** Hedeften kaç ev önce ipucu düşer. */
export const MUZAFFER_CLUE_OFFSETS = [6, 4, 2];
export const MUZAFFER_TOLD_MOOD = 15;

export function muzafferClue(n: number, district: string): Localized {
  if (n === 0) {
    return {
      tr: `Bugün aklıma geldi, çocukken ${district}'te otururduk. Bahçede koca bir dut ağacı vardı, bütün mahalle toplanırdı.`,
      en: `It came to mind today: as a kid we lived in ${district}. There was a huge mulberry tree in the garden, the whole street gathered there.`,
    };
  }
  if (n === 1) {
    return {
      tr: `O ev hâlâ duruyor mu bilmiyorum. Kapısının üstünde babamın oyduğu küçük bir kuş vardı. Bir gün portföyümüze düşse...`,
      en: `I don't know if that house still stands. There was a small bird my father carved above the door. If it ever landed in our portfolio...`,
    };
  }
  return {
    tr: `Boş ver, eski hikâyeler. Ama ${district}'te bir eve gidersen kapının üstüne bir bak, olur mu?`,
    en: `Never mind, old stories. But if you go to a house in ${district}, look above the door, will you?`,
  };
}

export const muzafferToldReply: Localized = {
  tr: "Emlah... Kuş hâlâ orada mı? Bunu bana söylediğin için sağ ol. Bu evi sen sat, ama önce bir kez gidip görmeme izin ver.",
  en: "Estetan... Is the bird still there? Thank you for telling me. You sell this house, but let me go and see it once first.",
};

export const muzafferMissedReply: Localized = {
  tr: "Duydum, o ev satılmış. Kapının üstüne bakan oldu mu acaba. Neyse, işine devam et.",
  en: "I heard that house was sold. I wonder if anyone looked above the door. Anyway, carry on.",
};

/* ------------------------------------------------------------------ */
/* A3 — Muhtar'ın Defteri (Esnafla Çay)                                */
/* ------------------------------------------------------------------ */

export const MUHTAR_TITLE_AT = 10;
export const MUHTAR_TASK_REWARD = 3000;
export const MUHTAR_TITLE_SUSPICION = -5;
export const MUHTAR_TIP_EFFECTS = { interest: 8, suspicion: -6 };

export interface MuhtarTask {
  id: string;
  /** {semt} parametreli görevlerde semt eklenir. */
  text: (param: string | null) => Localized;
  needsDistrict?: boolean;
  check: (ctx: { outcome: SceneOutcome; discountPercent: number; suspicion: number; fun: number; district: string }, param: string | null) => boolean;
}

export const muhtarTasks: MuhtarTask[] = [
  { id: "sat", text: () => ({ tr: "Bir ev sat, mahalle hareketlensin.", en: "Sell a house, get the street moving." }), check: (c) => c.outcome === "sold" },
  { id: "indirimsiz", text: () => ({ tr: "İndirimsiz bir satış yap — esnaf pazarlığa değil, dürüstlüğe bakar.", en: "Make a sale with no discount — shopkeepers value honesty over haggling." }), check: (c) => c.outcome === "sold" && c.discountPercent === 0 },
  { id: "guven", text: () => ({ tr: "Müşterinin şüphesini 25'in altında tutarak sat.", en: "Sell while keeping the client's suspicion under 25." }), check: (c) => c.outcome === "sold" && c.suspicion < 25 },
  { id: "semt", needsDistrict: true, text: (p) => ({ tr: `${p ?? "Bir semtte"} bir ev sat — orada tanıdıklarım var.`, en: `Sell a house in ${p ?? "a district"} — I know people there.` }), check: (c, p) => c.outcome === "sold" && c.district === p },
  { id: "keyif", text: () => ({ tr: "Bir müşteriyi güldür (eğlence 40 ve üstü), sonucu ne olursa olsun.", en: "Make a client laugh (fun 40 or more), whatever the outcome." }), check: (c) => c.fun >= 40 },
];

export const muhtarIntro: Localized[] = [
  { tr: "Muhtar Cemal: Sen şu yeni emlakçısın. Çayını iç, otur bakalım.", en: "Headman Cemal: You're the new realtor. Drink your tea, sit down." },
  { tr: "Bu mahallede ev satmak kâğıtla olmaz, insanla olur. Bana küçük işler gör, ben de sana kimin neyi sevdiğini söyleyeyim.", en: "Selling houses here isn't about paperwork, it's about people. Do me small favors and I'll tell you who likes what." },
];

export const muhtarDoneLines: Localized[] = [
  { tr: "Duydum, iş tamam. Al bakalım, sana bir bilgi: sıradaki müşterin çayı demli sever. Sohbeti oradan aç.", en: "I heard, job done. Here's a tip: your next client likes strong tea. Open the conversation there." },
  { tr: "Aferin. Bir sonraki evin komşusu benim eski arkadaşım, adını anarsan kapıyı açar.", en: "Well done. Your next house's neighbor is an old friend of mine, mention my name and doors open." },
  { tr: "Esnaf seni konuşuyor, iyi şeyler. Bir dahaki müşterine mahallenin pazarını anlat, bayılır.", en: "The shopkeepers are talking about you, good things. Tell your next client about the street market, they'll love it." },
];

/* ------------------------------------------------------------------ */
/* A4 — Bir Müşterinin Hayatı                                          */
/* ------------------------------------------------------------------ */

export const LIFE_START_MIN_INDEX = 3;
export const LIFE_STAGE_GAP = 8;
export const LIFE_REWARDS = [15000, 25000, 0];

export function lifeMessage(stage: number): Localized {
  if (stage === 1) {
    return {
      tr: "Emlah Bey merhaba! Bebeğimiz oldu. Ev artık dar geliyor, daha büyük bir yer bakarken sizi önerdim herkese. Referans komisyonunuz yolda.",
      en: "Hi Estetan! We had a baby. The place feels small now — while looking for something bigger I recommended you to everyone. Your referral fee is on its way.",
    };
  }
  if (stage === 2) {
    return {
      tr: "Hayat ne garip, iş için yurt dışına taşınıyoruz. Sattığınız evi yine siz satın, başkasına emanet etmem. Komisyonunuz hesabınızda.",
      en: "Life is strange — we're moving abroad for work. Please sell the house you sold us, I won't trust anyone else. Your commission is in your account.",
    };
  }
  return {
    tr: "Kardeşim evleniyor, davetiyeyi size de gönderdik. Annem \"ailenin emlakçısı gelmeden olmaz\" dedi.",
    en: "My sister is getting married and we sent you an invitation too. Mom said \"it won't be the same without the family's realtor\".",
  };
}

/* ------------------------------------------------------------------ */
/* A5 — Hayalet Ev Soruşturması                                         */
/* ------------------------------------------------------------------ */

export const GHOST_STEP_ENERGY = 5;
export const GHOST_STORY_CHANCE = 0.25;
export const GHOST_STORY_EFFECTS = { fun: 12 };

export const ghostSteps: { title: Localized; lines: Localized[] }[] = [
  {
    title: { tr: "Eski Gazete Kupürü", en: "An Old Newspaper Clipping" },
    lines: [
      { tr: "Arşivde 1994 tarihli bir haber: \"Mahallede geceleri kapılar kendiliğinden açılıyor. Sakinler tedirgin.\"", en: "A 1994 article in the archive: \"Doors open by themselves at night in the neighborhood. Residents uneasy.\"" },
      { tr: "Haberin altında küçük bir not: \"Olaylar kış aylarında yoğunlaşıyor.\"", en: "A small note below: \"Incidents intensify in the winter months.\"" },
    ],
  },
  {
    title: { tr: "Bekçinin İfadesi", en: "The Night Watchman's Account" },
    lines: [
      { tr: "Emekli bekçi Rıza Amca mesaj atıyor: \"O binada her kış gece ikide bir tıkırtı başlar. Sonra kapılar aralanır.\"", en: "Retired watchman Uncle Rıza texts: \"In that building, every winter a knocking starts at 2 a.m. Then the doors creak open.\"" },
      { tr: "\"Kimse görmedi ama bodrumdan geldiğine yemin ederim.\"", en: "\"Nobody saw anything, but I swear it came from the basement.\"" },
    ],
  },
  {
    title: { tr: "Gece Ziyareti", en: "The Night Visit" },
    lines: [
      { tr: "Gece ikide bodrumdasın. Tıkırtı başlıyor. Fenerini çeviriyorsun...", en: "It's 2 a.m. and you're in the basement. The knocking starts. You turn your flashlight..." },
      { tr: "Eski kalorifer tesisatı. Kazan çalışınca borular genleşiyor, basınç bütün kapıları itiyor.", en: "An old heating system. When the boiler kicks in the pipes expand, and the pressure pushes every door open." },
      { tr: "Hayalet yok. Sadece 1970'lerden kalma bir kazan. Yine de bu hikâyeyi anlatmaya değer.", en: "No ghost. Just a boiler from the 1970s. Still, a story worth telling." },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* B3 — Tanıdık İmza                                                    */
/* ------------------------------------------------------------------ */

export const FORGERY_CHANCE = 0.15;

export const firatAngryMessage: Localized = {
  tr: "Fırat Bey: Tapu masasındaki o evrakı sen mi geri çevirdin? Bunu unutmam Emlah. Ama madem bu kadar dikkatlisin, bu tur ben bir adım geri çekiliyorum.",
  en: "Fırat Bey: Was it you who rejected that deed at the desk? I won't forget this, Estetan. But since you're that careful, I'll step back this round.",
};

/* ------------------------------------------------------------------ */
/* B5 — Gece Yarısı Müşterisi                                           */
/* ------------------------------------------------------------------ */

export const nightCustomerLines: { speaker: "customer1" | "thought"; text: Localized }[] = [
  { speaker: "thought", text: { tr: "(içinden) Saat gece yarısını geçmiş. Kapıda çok kibar, solgun bir müşteri.", en: "(to himself) It's past midnight. A very polite, pale client at the door." } },
  { speaker: "customer1", text: { tr: "Bu saatte geldiğim için kusura bakmayın. Gündüzleri pek çıkamıyorum. Perdeleri ışık geçirmiyor, değil mi?", en: "Sorry for coming at this hour. I can't really go out in the daytime. The curtains block out light, don't they?" } },
];

/* ------------------------------------------------------------------ */
/* B6 — Radyonun Gizli Frekansı                                         */
/* ------------------------------------------------------------------ */

export const RADIO_SECRET_TAPS = 5;

export function radioSecretBroadcast(origin: string | null): Localized {
  switch (origin) {
    case "ogretmen":
      return { tr: "Gizli frekans: \"Eski bir öğrenciniz bu akşam aradı. 'Öğretmenim sabırla ev satılır mı?' dedi. Satılıyor çocuğum, satılıyor.\"", en: "Secret frequency: \"An old student of yours called tonight. 'Can you sell houses with patience?' they asked. You can, kid, you can.\"" };
    case "emlakci-ailesi":
      return { tr: "Gizli frekans: \"Babanın ofisindeki eski radyo hâlâ bu frekansta. O da bir zamanlar senin gibi bu yayını dinlerdi.\"", en: "Secret frequency: \"The old radio in your father's office is still on this frequency. He used to listen to this broadcast just like you.\"" };
    case "girisimci":
      return { tr: "Gizli frekans: \"Batan şirketler de bir gün bir ofiste yeniden doğar. Bu gece senin için çalıyoruz.\"", en: "Secret frequency: \"Bankrupt companies are reborn in an office one day. Tonight this one's for you.\"" };
    case "yurtdisi":
      return { tr: "Gizli frekans: \"Uzaklarda yaşamış birine İstanbul'dan selam. Şehir seni özlemiş, belli.\"", en: "Secret frequency: \"Greetings from Istanbul to someone who lived far away. The city missed you, it shows.\"" };
    default:
      return { tr: "Gizli frekans: \"Bu yayın yalnızca ofiste geç saatlere kalanlar için.\"", en: "Secret frequency: \"This broadcast is only for those who stay late at the office.\"" };
  }
}

/* ------------------------------------------------------------------ */
/* B7 — 55. Ev                                                          */
/* ------------------------------------------------------------------ */

/** Hiç indirim yapmadan sattı ve dürüstlük ağır bastı. */
export function qualifiesForHome(
  results: { outcome: SceneOutcome; sale?: { discountPercent: number } | null }[],
  compass: { durustluk: number; kurnazlik: number },
): boolean {
  const sold = results.filter((r) => r.outcome === "sold" && r.sale);
  if (sold.length === 0) return false;
  return sold.every((r) => (r.sale?.discountPercent ?? 0) === 0) && compass.durustluk > compass.kurnazlik;
}
