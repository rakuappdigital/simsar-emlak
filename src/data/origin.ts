import type { Choice, OriginId } from "../types";

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
  title: string;
  description: string;
  introLine: string;
  closingChoice: Choice;
  /** "Sadakat Rozetleri" — what Muzaffer Bey starts calling Emlah once the origin's closing choice has been picked LOYALTY_THRESHOLD times. */
  nickname: string;
  /** Origin-themed accent color for the rank-up card glow — pure CSS, no external assets. */
  accentColor: string;
}

/** Number of times an origin's closing choice must be picked before Muzaffer Bey starts using the nickname. */
export const LOYALTY_THRESHOLD = 10;

export const origins: OriginDef[] = [
  {
    id: "ogretmen",
    title: "Eski Öğretmen",
    description: "Yıllarca sınıfta durdun, şimdi sabrın en büyük silahın.",
    introLine: "(içinden) Öğretmenlik günlerimden kalma bir sabrım var, bu işte gerçekten işime yarıyor.",
    closingChoice: {
      id: "origin-ogretmen",
      text: "(Sakin bir sesle) Acele etmeyin, bu önemli bir karar — birlikte düşünelim.",
      next: "",
      effects: { closingBias: 12, suspicion: -8 },
    },
    nickname: "Hoca",
    accentColor: "#4dd0e1",
  },
  {
    id: "emlakci-ailesi",
    title: "Emlakçı Ailesi",
    description: "Bu iş kanında var, küçüklüğünden beri tapu senetleri arasında büyüdün.",
    introLine: "(içinden) Ailemin mesleği bu, kanımda var — bu bölgeleri gözüm kapalı bilirim.",
    closingChoice: {
      id: "origin-emlakci-ailesi",
      text: "(Ailesinden gelen tecrübeyle) Bu bölgeyi çok iyi tanırım, bana güvenebilirsiniz.",
      next: "",
      effects: { closingBias: 15, interest: 8 },
    },
    nickname: "Usta",
    accentColor: "#a1887f",
  },
  {
    id: "girisimci",
    title: "İflas Etmiş Girişimci",
    description: "Bir zamanlar kendi şirketin vardı. Battı ama pazarlık reflekslerin kalıcı.",
    introLine: "(içinden) Eskiden kendi şirketimi yönetirdim, battı ama pazarlık içgüdülerim hâlâ keskin.",
    closingChoice: {
      id: "origin-girisimci",
      text: "(İş tecrübesiyle) Size özel bir esneklik sağlayabilirim.",
      next: "",
      effects: { closingBias: 12, discountPercent: 3 },
    },
    nickname: "Patron",
    accentColor: "#ffd166",
  },
  {
    id: "yurtdisi",
    title: "Yurt Dışından Dönen",
    description: "Yıllarca başka bir ülkede yaşadın, farklı bir bakış açın var.",
    introLine: "(içinden) Yurt dışında gördüklerim bana farklı bir bakış açısı kazandırdı.",
    closingChoice: {
      id: "origin-yurtdisi",
      text: "(Farklı bir bakış açısıyla) Yurt dışında gördüğüm bazı örnekleri anlatayım size.",
      next: "",
      effects: { closingBias: 10, fun: 10 },
    },
    nickname: "Gezgin",
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
