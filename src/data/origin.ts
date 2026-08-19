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
  },
];

export function originById(id: OriginId | null | undefined): OriginDef | undefined {
  return origins.find((o) => o.id === id);
}
