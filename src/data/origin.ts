import type { Choice, OriginId } from "../types";
import type { Localized } from "./language";

/**
 * "Emlah'ın Geçmişi" — a one-time backstory pick at the start of a new game
 * (never on continue). Each origin unlocks a single, always-available extra
 * closing-node choice, appended exactly like the existing bonusChoice/
 * flirtChoice synthetic options in DialogueScene.tsx — same closingBias
 * pipeline, no new resolution logic, no per-house authoring needed. The
 * point isn't raw power (each is roughly on par with bonusChoice), it's
 * that two playthroughs with different origins genuinely sound different
 * at every single closing.
 */
export interface OriginDef {
  id: OriginId;
  title: Localized;
  description: Localized;
  introLine: Localized;
  closingChoice: Choice;
  /** "Sadakat Rozetleri" — what Muzaffer Bey starts calling Emlah once the origin's closing choice has been picked LOYALTY_THRESHOLD times. */
  nickname: Localized;
  /** Origin-themed accent color for the rank-up card glow — pure CSS, no external assets. */
  accentColor: string;
}

/** Number of times an origin's closing choice must be picked before Muzaffer Bey starts using the nickname. */
export const LOYALTY_THRESHOLD = 10;

export const origins: OriginDef[] = [
  {
    id: "ogretmen",
    title: { tr: "Eski Öğretmen", en: "Former Teacher" },
    description: { tr: "Yıllarca sınıfta durdun, şimdi sabrın en büyük silahın.", en: "You stood in the classroom for years, now patience is your greatest weapon." },
    introLine: { tr: "(içinden) Öğretmenlik günlerimden kalma bir sabrım var, bu işte gerçekten işime yarıyor.", en: "(to himself) I have a patience left from my teaching days, it really comes in handy in this job." },
    closingChoice: {
      id: "origin-ogretmen",
      text: { tr: "(Sakin bir sesle) Acele etmeyin, bu önemli bir karar — birlikte düşünelim.", en: "(Calmly) Don't rush, this is an important decision — let's think together." },
      next: "",
      effects: { closingBias: 12, suspicion: -8 },
    },
    nickname: { tr: "Hoca", en: "Teacher" },
    accentColor: "#4dd0e1",
  },
  {
    id: "emlakci-ailesi",
    title: { tr: "Emlakçı Ailesi", en: "Realtor Family" },
    description: { tr: "Bu iş kanında var, küçüklüğünden beri tapu senetleri arasında büyüdün.", en: "This business is in your blood, you grew up among title deeds since childhood." },
    introLine: { tr: "(içinden) Ailemin mesleği bu, kanımda var — bu bölgeleri gözüm kapalı bilirim.", en: "(to himself) This is my family's profession, it's in my blood — I know these districts blindfolded." },
    closingChoice: {
      id: "origin-emlakci-ailesi",
      text: { tr: "(Ailesinden gelen tecrübeyle) Bu bölgeyi çok iyi tanırım, bana güvenebilirsiniz.", en: "(With experience from his family) I know this region very well, you can trust me." },
      next: "",
      effects: { closingBias: 15, interest: 8 },
    },
    nickname: { tr: "Usta", en: "Master" },
    accentColor: "#a1887f",
  },
  {
    id: "girisimci",
    title: { tr: "İflas Etmiş Girişimci", en: "Bankrupt Entrepreneur" },
    description: { tr: "Bir zamanlar kendi şirketin vardı. Battı ama pazarlık reflekslerin kalıcı.", en: "You once had your own company. It went under, but your negotiation reflexes are permanent." },
    introLine: { tr: "(içinden) Eskiden kendi şirketimi yönetirdim, battı ama pazarlık içgüdülerim hâlâ keskin.", en: "(to himself) I used to run my own company, it went under but my negotiation instincts are still sharp." },
    closingChoice: {
      id: "origin-girisimci",
      text: { tr: "(İş tecrübesiyle) Size özel bir esneklik sağlayabilirim.", en: "(With business experience) I can provide a special flexibility for you." },
      next: "",
      effects: { closingBias: 12, discountPercent: 3 },
    },
    nickname: { tr: "Patron", en: "Boss" },
    accentColor: "#ffd166",
  },
  {
    id: "yurtdisi",
    title: { tr: "Yurt Dışından Dönen", en: "Returned from Abroad" },
    description: { tr: "Yıllarca başka bir ülkede yaşadın, farklı bir bakış açın var.", en: "You lived in another country for years, you have a different perspective." },
    introLine: { tr: "(içinden) Yurt dışında gördüklerim bana farklı bir bakış açısı kazandırdı.", en: "(to himself) What I saw abroad gave me a different perspective." },
    closingChoice: {
      id: "origin-yurtdisi",
      text: { tr: "(Farklı bir bakış açısıyla) Yurt dışında gördüğüm bazı örnekleri anlatayım size.", en: "(With a different perspective) Let me tell you some examples I saw abroad." },
      next: "",
      effects: { closingBias: 10, fun: 10 },
    },
    nickname: { tr: "Gezgin", en: "Traveler" },
    accentColor: "#81c784",
  },
];

export function originById(id: OriginId | null | undefined): OriginDef | undefined {
  return origins.find((o) => o.id === id);
}

/**
 * A one-line origin-flavored epilogue appended to whichever of the 5
 * endings.ts endings was reached — never changes WHICH ending is picked
 * (that logic in endings.ts is untouched), just colors it. "Yarım Kalan
 * Hikaye" (an unstarted run) has no origin epilogue on purpose.
 */
const endingEpilogues: Record<OriginId, Record<string, string>> = {
  ogretmen: {
    "Kendi Ofisini Açtı": "Sınıfta öğrettiği sabrı, şimdi kendi ofisinde çalışanlarına öğretiyor.",
    "Az Kazandı Ama Huzurlu": "Zengin olmadı ama hâlâ bir öğretmen gibi, iyi bir iş çıkardığını biliyor.",
    "Muzaffer Bey'in Ortağı Oldu": "Eski öğrencileri bu haberi duysa şaşırırdı — ama bu iş başka kurallarla işliyor.",
    "Kovuldu": "Belki sınıfa dönmenin vakti gelmiştir, orada daha iyiydi.",
    "Sektörde Sağlam Bir İsim Oldu": "Öğretmenlik günlerinden kalma dengeyi, bu işte de kurmayı başardı.",
  },
  "emlakci-ailesi": {
    "Kendi Ofisini Açtı": "Ailesinin adını taşıyan bir ofis kurdu — büyükbabası gururlanırdı.",
    "Az Kazandı Ama Huzurlu": "Aile mesleğinde büyük para her zaman gelmez, ama isim temiz kaldı.",
    "Muzaffer Bey'in Ortağı Oldu": "Ailesinin öğrettiği kurnazlık, sonunda işe yaradı.",
    "Kovuldu": "Ailesinin mesleğinde bile başarısız oldu — bu ağır bir yüktü.",
    "Sektörde Sağlam Bir İsim Oldu": "Ailesinin bıraktığı mirası, kendi tarzıyla sürdürdü.",
  },
  girisimci: {
    "Kendi Ofisini Açtı": "Bir kez battı, bu kez kazandı — ikinci şansını sonuna kadar kullandı.",
    "Az Kazandı Ama Huzurlu": "Zengin olamadı ama bu kez en azından batmadı, bu bile bir zaferdi.",
    "Muzaffer Bey'in Ortağı Oldu": "Eski girişimci içgüdüleri, sonunda ona bir ortaklık kazandırdı.",
    "Kovuldu": "İkinci iflasını yaşadı — bu sefer telafisi daha zor olacak.",
    "Sektörde Sağlam Bir İsim Oldu": "Battığı işin dersini almış, bu kez daha dengeli ilerledi.",
  },
  yurtdisi: {
    "Kendi Ofisini Açtı": "Yurt dışında gördüğü örnekleri burada hayata geçirdi.",
    "Az Kazandı Ama Huzurlu": "Belki yurt dışına dönmeyi düşünecek, ama burada bulduğu huzuru bırakmak istemiyor.",
    "Muzaffer Bey'in Ortağı Oldu": "Farklı bir kültürden gelen bakış açısı, burada işine yaradı — ama hangi bedelle?",
    "Kovuldu": "Belki bu iş, gördüğü örneklerden farklı işliyordu.",
    "Sektörde Sağlam Bir İsim Oldu": "Getirdiği farklı bakış açısı, sektörde kalıcı bir iz bıraktı.",
  },
};

export function originEndingLine(originId: OriginId | null, endingTitle: string): string | null {
  if (!originId) return null;
  return endingEpilogues[originId][endingTitle] ?? null;
}
