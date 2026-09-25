import type { OriginId } from "../types";
import type { Localized } from "./language";

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
  title: Localized;
  paragraphs: Localized[];
}

const beat1: Record<OriginId, FatefulMomentText> = {
  ogretmen: {
    title: { tr: "İlk Şüphe", en: "First Suspicion" },
    paragraphs: [
      { tr: "Bir müşteri onunla sanki sınıfta geri kalmış bir öğrenciymiş gibi konuştu — sabırla değil, tepeden.", en: "A customer spoke to him as if he were a lagging student in class — not with patience, but from above." },
      { tr: "Öğretmenlik günlerinden kalma sakinliği hâlâ oradaydı ama bugün onu koruyamamış gibi hissetti.", en: "The calmness left over from his teaching days was still there, but he felt as though it couldn't protect him today." },
      { tr: "Acaba o sabır gerçekten işine mi yarıyordu, yoksa sadece kendine söylediği bir hikaye miydi?", en: "Was that patience actually working for him, or was it just a story he told himself?" },
    ],
  },
  "emlakci-ailesi": {
    title: { tr: "İlk Şüphe", en: "First Suspicion" },
    paragraphs: [
      { tr: "Bir müşteri \"ailenizi tanırım\" dediğinde, Emlah bir an kendi adını değil, ailesinin adını duydu.", en: "When a customer said \"I know your family\", Estetan heard his family's name instead of his own for a moment." },
      { tr: "Bu işte iyi olması kendi başarısı mıydı, yoksa sadece doğru soyadıyla doğmuş olması mı?", en: "Was being good at this job his own success, or was he just born with the right last name?" },
      { tr: "Cevabı bilmiyordu. Bugünlük bu soruyu bir kenara bıraktı — ama aklından tam çıkmadı.", en: "He didn't know the answer. He put this question aside for today — but it didn't quite leave his mind." },
    ],
  },
  girisimci: {
    title: { tr: "İlk Şüphe", en: "First Suspicion" },
    paragraphs: [
      { tr: "Bir müşteriye fazla emin konuştuğunu fark etti — tıpkı şirketi batmadan önceki günlerdeki gibi.", en: "He noticed he spoke too confidently to a customer — just like in the days before his company went bankrupt." },
      { tr: "O özgüven bir zamanlar onu bitirmişti. Şimdi aynı tonu duyunca içi ürperdi.", en: "That self-confidence had once ruined him. Hearing the same tone now gave him chills." },
      { tr: "Belki bu sefer farklıydı. Belki de sadece aynı hatayı daha yavaş yapıyordu.", en: "Maybe this time was different. Or maybe he was just making the same mistake more slowly." },
    ],
  },
  yurtdisi: {
    title: { tr: "İlk Şüphe", en: "First Suspicion" },
    paragraphs: [
      { tr: "Bir şakayı yanlış anladı, oradaki herkes güldü, o gülümsemekle yetindi.", en: "He misunderstood a joke, everyone there laughed, he settled for a smile." },
      { tr: "Yıllar sonra bile bazen bir adım geride duruyordu — burada olmasına rağmen, tam olarak burada değilmiş gibi.", en: "Even years later, he sometimes stood a step behind — as if despite being here, he wasn't quite fully here." },
      { tr: "Acaba bu şehir onu gerçekten kabul edecek miydi, yoksa o hep biraz yabancı mı kalacaktı?", en: "Would this city really accept him/her, or would he/she always remain a bit of a foreigner?" },
    ],
  },
};

const beat2: Record<OriginId, FatefulMomentText> = {
  ogretmen: {
    title: { tr: "Tanıdık Bir Yüz", en: "A Familiar Face" },
    paragraphs: [
      { tr: "Müşterinin yanındaki genç, bir an tanıdık geldi — sonra hatırladı: eski bir öğrencisiydi.", en: "The young man next to the client looked familiar for a moment — then remembered: it was an old student." },
      { tr: "Genç onu tanımadı. Neden tanısın ki, aradan geçen onca yıl, onca sınıf.", en: "The young man didn't recognize him/her. Why would he, after all those years, all those classes." },
      { tr: "Emlah hiçbir şey söylemedi, sadece işine devam etti. Ama içi bir tuhaf oldu, hem gururlu hem hafif kırgın.", en: "Estetan didn't say anything, just continued his/her work. But he/she felt strange inside, both proud and slightly hurt." },
    ],
  },
  "emlakci-ailesi": {
    title: { tr: "Tanıdık Bir Yüz", en: "A Familiar Face" },
    paragraphs: [
      { tr: "Komşulardan biri \"bu evi büyükbabanız satmıştı bize\" dedi, gülümseyerek.", en: "One of the neighbors said, \"your grandfather sold this house to us,\" smiling." },
      { tr: "Emlah bu evi hiç görmemişti ama bir anda kendini ailesinin uzun tarihinin bir parçası gibi hissetti.", en: "Estetan had never seen this house but suddenly felt like a part of his/her family's long history." },
      { tr: "Aynı sokaklar, aynı isim, yeni bir kuşak. Bu bazen ağır bir yüktü, bazen de bir çeşit huzur.", en: "The same streets, the same name, a new generation. This was sometimes a heavy burden, sometimes a kind of peace." },
    ],
  },
  girisimci: {
    title: { tr: "Tanıdık Bir Yüz", en: "A Familiar Face" },
    paragraphs: [
      { tr: "Müşterinin arkadaşı, eski iş ortağıydı — şirketi batarken en son onunla konuşmuştu.", en: "The client's friend was an old business partner — he/she had last talked to him/her when the company was going under." },
      { tr: "Kısa, garip bir selamlaşma oldu. İkisi de eski günlerden hiç bahsetmedi.", en: "It was a short, awkward greeting. Neither of them mentioned the old days at all." },
      { tr: "Emlah işine devam ederken fark etti: o günden bu yana hiç bu kadar yakınından geçmemişti geçmişine.", en: "As Estetan continued his/her work, he/she realized: he/she had never passed this close to his/her past since that day." },
    ],
  },
  yurtdisi: {
    title: { tr: "Tanıdık Bir Yüz", en: "A Familiar Face" },
    paragraphs: [
      { tr: "Evin penceresinden gelen bir koku, bir anda onu yaşadığı şehre geri götürdü.", en: "A smell coming from the window of the house suddenly took him/her back to the city he/she lived in." },
      { tr: "Birkaç saniye orada kaldı, gözleri uzakta, müşteri bir şey sorana kadar.", en: "He/she stayed there for a few seconds, eyes far away, until the client asked something." },
      { tr: "\"İyi misiniz?\" diye sordular. \"Evet,\" dedi, \"sadece bir an başka bir yerdeydim.\"", en: "\"Are you okay?\" they asked. \"Yes,\" he/she said, \"I was just somewhere else for a moment.\"" },
    ],
  },
};

const beat3: Record<OriginId, FatefulMomentText> = {
  ogretmen: {
    title: { tr: "Kim Oldum", en: "Who I Have Become" },
    paragraphs: [
      { tr: "Bir müşteriye bir şey açıklarken, sesinde hâlâ o eski öğretmen tonunu duydu.", en: "While explaining something to a client, he/she heard that old teacher tone in his/her voice again." },
      { tr: "Belki hâlâ öğretiyordu — sadece artık ders değil, güven öğretiyordu.", en: "Maybe he/she was still teaching — only now he/she was teaching trust, not a lesson." },
      { tr: "Bu düşünce içini ısıttı. Belki de sınıftan hiç gerçekten ayrılmamıştı.", en: "This thought warmed him/her inside. Maybe he/she had never really left the classroom." },
    ],
  },
  "emlakci-ailesi": {
    title: { tr: "Kim Oldum", en: "Who I Have Become" },
    paragraphs: [
      { tr: "Bir akşam, ailesinin ona bıraktığı ismi düşündü — onu taşımak mı, yoksa onu büyütmek mi istiyordu?", en: "One evening, he/she thought about the name his/her family left him/her — did he/she want to carry it, or grow it?" },
      { tr: "Şimdiye kadar yaptıkları, o ismi hem koruyor hem de kendine göre şekillendiriyordu.", en: "What he/she had done so far was both protecting that name and shaping it in his/her own way." },
      { tr: "Belki de mesele hiç seçmek değildi. Belki ikisini bir arada yapmayı öğreniyordu.", en: "Maybe the point was never to choose. Maybe he/she was learning to do both together." },
    ],
  },
  girisimci: {
    title: { tr: "Kim Oldum", en: "Who I Have Become" },
    paragraphs: [
      { tr: "Geçmişteki şirketini düşündü — o günden bu yana ne kadar değişmişti, ne kadar aynı kalmıştı?", en: "He/she thought about his/her past company — how much had changed since that day, how much had stayed the same?" },
      { tr: "Bu sefer daha dikkatliydi, ama aynı ateş hâlâ oradaydı, sadece daha kontrollü yanıyordu.", en: "He/she was more careful this time, but the same fire was still there, just burning more controlled." },
      { tr: "Belki bu ikinci şans bir tekrar değildi. Belki gerçekten bir şeyler öğrenmişti.", en: "Maybe this second chance wasn't a repeat. Maybe he/she had really learned something." },
    ],
  },
  yurtdisi: {
    title: { tr: "Kim Oldum", en: "Who I Have Become" },
    paragraphs: [
      { tr: "Sokakta yürürken fark etti: artık yön sormuyordu, yön veriyordu.", en: "While walking on the street, he/she realized: he/she wasn't asking for directions anymore, he/she was giving them." },
      { tr: "Bu şehir hâlâ bazen yabancı geliyordu ama artık ona da ait bir köşesi vardı.", en: "This city still felt foreign sometimes, but it had a corner belonging to him/her now too." },
      { tr: "Tam olarak eve dönmüş sayılmazdı belki — ama artık sadece ziyaretçi de değildi.", en: "Maybe he/she wasn't exactly considered returned home — but he/she wasn't just a visitor anymore either." },
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
