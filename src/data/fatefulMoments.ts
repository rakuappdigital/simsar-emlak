import type { OriginId } from "../types";

/**
 * "Kader Anları" — 3 fixed points across the 54-house arc where Emlah's
 * chosen backstory (origin.ts) briefly comes back into focus. Unlike
 * originRecognition.ts (a rare, recurring, customer-noticed flavor line)
 * these are GUARANTEED, one-time, origin-SPECIFIC narrative beats — a
 * player only ever sees the 3 entries matching their own origin, never
 * the other 9. This is the direct answer to "a second playthrough with a
 * different origin feels the same": it now genuinely doesn't, at 3 fixed
 * moments. Delivered as a standalone modal (same shape as
 * timeTravelerFlashback.ts's activeFlashback card), not through
 * DialogueScene's already-crowded prependedLines chain, so it never
 * competes with celebrity/echo/voice/originRecognition/memory/firat for
 * the same "one moment per intro" slot.
 *
 * Indices are 0-based house positions, chosen mid-week (index % 5 === 2)
 * so they never land on the first/last house of a week (those already
 * have their own daily-quest/WeekResult beats) and spread roughly
 * early/mid/late across the 54-house arc.
 */
export const FATEFUL_MOMENT_INDICES = [7, 22, 37] as const;

interface FatefulMomentText {
  title: string;
  paragraphs: string[];
}

const beat1: Record<OriginId, FatefulMomentText> = {
  ogretmen: {
    title: "İlk Şüphe",
    paragraphs: [
      "Bir müşteri onunla sanki sınıfta geri kalmış bir öğrenciymiş gibi konuştu — sabırla değil, tepeden.",
      "Öğretmenlik günlerinden kalma sakinliği hâlâ oradaydı ama bugün onu koruyamamış gibi hissetti.",
      "Acaba o sabır gerçekten işine mi yarıyordu, yoksa sadece kendine söylediği bir hikaye miydi?",
    ],
  },
  "emlakci-ailesi": {
    title: "İlk Şüphe",
    paragraphs: [
      "Bir müşteri \"ailenizi tanırım\" dediğinde, Emlah bir an kendi adını değil, ailesinin adını duydu.",
      "Bu işte iyi olması kendi başarısı mıydı, yoksa sadece doğru soyadıyla doğmuş olması mı?",
      "Cevabı bilmiyordu. Bugünlük bu soruyu bir kenara bıraktı — ama aklından tam çıkmadı.",
    ],
  },
  girisimci: {
    title: "İlk Şüphe",
    paragraphs: [
      "Bir müşteriye fazla emin konuştuğunu fark etti — tıpkı şirketi batmadan önceki günlerdeki gibi.",
      "O özgüven bir zamanlar onu bitirmişti. Şimdi aynı tonu duyunca içi ürperdi.",
      "Belki bu sefer farklıydı. Belki de sadece aynı hatayı daha yavaş yapıyordu.",
    ],
  },
  yurtdisi: {
    title: "İlk Şüphe",
    paragraphs: [
      "Bir şakayı yanlış anladı, oradaki herkes güldü, o gülümsemekle yetindi.",
      "Yıllar sonra bile bazen bir adım geride duruyordu — burada olmasına rağmen, tam olarak burada değilmiş gibi.",
      "Acaba bu şehir onu gerçekten kabul edecek miydi, yoksa o hep biraz yabancı mı kalacaktı?",
    ],
  },
};

const beat2: Record<OriginId, FatefulMomentText> = {
  ogretmen: {
    title: "Tanıdık Bir Yüz",
    paragraphs: [
      "Müşterinin yanındaki genç, bir an tanıdık geldi — sonra hatırladı: eski bir öğrencisiydi.",
      "Genç onu tanımadı. Neden tanısın ki, aradan geçen onca yıl, onca sınıf.",
      "Emlah hiçbir şey söylemedi, sadece işine devam etti. Ama içi bir tuhaf oldu, hem gururlu hem hafif kırgın.",
    ],
  },
  "emlakci-ailesi": {
    title: "Tanıdık Bir Yüz",
    paragraphs: [
      "Komşulardan biri \"bu evi büyükbabanız satmıştı bize\" dedi, gülümseyerek.",
      "Emlah bu evi hiç görmemişti ama bir anda kendini ailesinin uzun tarihinin bir parçası gibi hissetti.",
      "Aynı sokaklar, aynı isim, yeni bir kuşak. Bu bazen ağır bir yüktü, bazen de bir çeşit huzur.",
    ],
  },
  girisimci: {
    title: "Tanıdık Bir Yüz",
    paragraphs: [
      "Müşterinin arkadaşı, eski iş ortağıydı — şirketi batarken en son onunla konuşmuştu.",
      "Kısa, garip bir selamlaşma oldu. İkisi de eski günlerden hiç bahsetmedi.",
      "Emlah işine devam ederken fark etti: o günden bu yana hiç bu kadar yakınından geçmemişti geçmişine.",
    ],
  },
  yurtdisi: {
    title: "Tanıdık Bir Yüz",
    paragraphs: [
      "Evin penceresinden gelen bir koku, bir anda onu yaşadığı şehre geri götürdü.",
      "Birkaç saniye orada kaldı, gözleri uzakta, müşteri bir şey sorana kadar.",
      "\"İyi misiniz?\" diye sordular. \"Evet,\" dedi, \"sadece bir an başka bir yerdeydim.\"",
    ],
  },
};

const beat3: Record<OriginId, FatefulMomentText> = {
  ogretmen: {
    title: "Kim Oldum",
    paragraphs: [
      "Bir müşteriye bir şey açıklarken, sesinde hâlâ o eski öğretmen tonunu duydu.",
      "Belki hâlâ öğretiyordu — sadece artık ders değil, güven öğretiyordu.",
      "Bu düşünce içini ısıttı. Belki de sınıftan hiç gerçekten ayrılmamıştı.",
    ],
  },
  "emlakci-ailesi": {
    title: "Kim Oldum",
    paragraphs: [
      "Bir akşam, ailesinin ona bıraktığı ismi düşündü — onu taşımak mı, yoksa onu büyütmek mi istiyordu?",
      "Şimdiye kadar yaptıkları, o ismi hem koruyor hem de kendine göre şekillendiriyordu.",
      "Belki de mesele hiç seçmek değildi. Belki ikisini bir arada yapmayı öğreniyordu.",
    ],
  },
  girisimci: {
    title: "Kim Oldum",
    paragraphs: [
      "Geçmişteki şirketini düşündü — o günden bu yana ne kadar değişmişti, ne kadar aynı kalmıştı?",
      "Bu sefer daha dikkatliydi, ama aynı ateş hâlâ oradaydı, sadece daha kontrollü yanıyordu.",
      "Belki bu ikinci şans bir tekrar değildi. Belki gerçekten bir şeyler öğrenmişti.",
    ],
  },
  yurtdisi: {
    title: "Kim Oldum",
    paragraphs: [
      "Sokakta yürürken fark etti: artık yön sormuyordu, yön veriyordu.",
      "Bu şehir hâlâ bazen yabancı geliyordu ama artık ona da ait bir köşesi vardı.",
      "Tam olarak eve dönmüş sayılmazdı belki — ama artık sadece ziyaretçi de değildi.",
    ],
  },
};

const beatsByIndex: Record<number, Record<OriginId, FatefulMomentText>> = {
  [FATEFUL_MOMENT_INDICES[0]]: beat1,
  [FATEFUL_MOMENT_INDICES[1]]: beat2,
  [FATEFUL_MOMENT_INDICES[2]]: beat3,
};

export function fatefulMomentFor(index: number, origin: OriginId): FatefulMomentText | null {
  return beatsByIndex[index]?.[origin] ?? null;
}
