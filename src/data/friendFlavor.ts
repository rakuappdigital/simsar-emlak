export interface FriendChoice {
  id: string;
  text: string;
  reaction: string;
  /** Present only on the loan-ask set — drives App.tsx's small lend/repay loop. */
  loanAction?: "lend" | "decline";
  /** Present only on the investment-offer set — drives App.tsx's buy/resolve loop. */
  investAction?: "invest" | "decline";
  /** Present only on the bulk-deal set — drives App.tsx's immediate safe/risky/decline payout. */
  bulkDealAction?: "safe" | "risky" | "decline";
  /** Present only on "Arkadaş Tavsiyeleri" house-tip sets — drives App.tsx's unlock-with-appointment flow. See data/friendHouses.ts. */
  houseTipAction?: "accept" | "decline";
  /** Required alongside houseTipAction "accept" — which friendHouses.ts entry gets unlocked. */
  houseTipHouseId?: string;
  /** Required alongside houseTipAction "accept" — 0 = this week, 1 = next week, purely a flavor label on the scheduled appointment. */
  houseTipWeekOffset?: 0 | 1;
}

export interface FriendMessageSet {
  id: string;
  contactName: string;
  prompt: string;
  choices: FriendChoice[];
}

/**
 * Mostly-cosmetic messages from recurring friends outside the work thread —
 * a small easter egg, rare on purpose. "bora-borc-istek" is the one set with
 * a real (small) consequence: lend him money and, a couple of weeks later,
 * he either pays back with a little extra or — occasionally — doesn't.
 */
export const friendMessageSets: FriendMessageSet[] = [
  {
    id: "bora-borc-istek",
    contactName: "Bora",
    prompt: "Kanka müsait misin, ufak bir konu var... Elin biraz cebe uzanır mı, birkaç haftaya öderim söz.",
    choices: [
      {
        id: "lend",
        text: "Tamam kanka, gönderiyorum.",
        reaction: "Sağ ol be dostum, unutmam bunu, birkaç haftaya hallederim!",
        loanAction: "lend",
      },
      {
        id: "decline",
        text: "Şu an bende de yok açıkçası, kusura bakma.",
        reaction: "Yok sorun değil, anlarım, başka baktım zaten.",
        loanAction: "decline",
      },
      {
        id: "joke",
        text: "Emlakçıdan borç istemek biraz ironik değil mi? 😄",
        reaction: "Haha haklısın, ama denemeden olmaz dedim 😅",
        loanAction: "decline",
      },
    ],
  },
  {
    id: "bora-yatirim",
    contactName: "Bora",
    prompt: "Elimde ucuza kapatılabilecek bir daire var, sen de kendi paranla bir el atsana, birkaç haftaya değerlenir.",
    choices: [
      {
        id: "invest",
        text: "Olur, kendi param için bir şans veriyorum.",
        reaction: "Aferin, sonucu birkaç hafta içinde konuşuruz.",
        investAction: "invest",
      },
      {
        id: "decline-risk",
        text: "Şu an riske girecek param yok açıkçası.",
        reaction: "Sorun değil, başka sefere.",
        investAction: "decline",
      },
      {
        id: "decline-joke",
        text: "Ben zaten başkasının evini satıyorum, kendime yetmiyor 😄",
        reaction: "Haha mantıklı, boş ver o zaman.",
        investAction: "decline",
      },
    ],
  },
  {
    id: "melike-dedikodu",
    contactName: "Melike",
    prompt: "Duydun mu, mahallenin ünlü çifti ayrılmış! 👀",
    choices: [
      { id: "a", text: "Yok artık, ciddi misin?", reaction: "Valla öyle diyorlar, herkes konuşuyor." },
      { id: "b", text: "Ben dedikoduya karışmam 😄", reaction: "Aman ne temiz insansın." },
      { id: "c", text: "Kimden duydun bunu?", reaction: "Sorma sen, kaynağım sağlam." },
    ],
  },
  {
    id: "melike-tavsiye",
    contactName: "Melike",
    prompt: "Bu arada bir ev bakıyorum da, sen bilirsin bu işleri, tavsiyen var mı?",
    choices: [
      { id: "a", text: "Bana gel, sana özel bir şeyler bulurum.", reaction: "Vay be, iş insanı gibi konuştun şimdi 😄" },
      { id: "b", text: "Acele etme, iyi araştır.", reaction: "Haklısın, acele işe şeytan karışır derler." },
      { id: "c", text: "Şu an biraz meşgulüm, akşam konuşalım mı?", reaction: "Tamam tamam, kolay gelsin!" },
    ],
  },
  {
    id: "kurumsal-toplu-anlasma",
    contactName: "Kurumsal Temsilci",
    prompt: "Merhaba, bir şirket adına birden fazla daire almayı düşünüyoruz. Size bir danışmanlık payı çıkarabiliriz, ilgilenir misiniz?",
    choices: [
      {
        id: "safe",
        text: "\"Sabit bir danışmanlık ücreti üzerinden anlaşalım.\"",
        reaction: "Anlaştık, güvenli tarafı seçtiniz — ödemeyi hemen geçiyoruz.",
        bulkDealAction: "safe",
      },
      {
        id: "risky",
        text: "\"Satış hacmine bağlı bir pay öneriyorum, ikimiz için de daha iyi olabilir.\"",
        reaction: "İlginç bir teklif, yönetime iletip size döneceğiz.",
        bulkDealAction: "risky",
      },
      {
        id: "decline",
        text: "\"Şu an bu ölçekte bir işe vaktim yok açıkçası.\"",
        reaction: "Anlıyoruz, belki ileride tekrar konuşuruz.",
        bulkDealAction: "decline",
      },
    ],
  },
  {
    id: "ecrin-tip-isik-kuyulu-loft",
    contactName: "Ecrin",
    prompt: "Kadıköy'de tasarladığım bir loft satışa çıkıyor, ışık kuyusunu görmen lazım — randevu ayarlayayım mı?",
    choices: [
      { id: "week", text: "\"Bu hafta uygunsam bakalım.\"", reaction: "Süper, bu hafta içine ayarlıyorum!", houseTipAction: "accept", houseTipHouseId: "ecrin-isik-kuyulu-loft", houseTipWeekOffset: 0 },
      { id: "next", text: "\"Gelecek hafta daha uygun olur.\"", reaction: "Tamamdır, gelecek haftaya not ediyorum.", houseTipAction: "accept", houseTipHouseId: "ecrin-isik-kuyulu-loft", houseTipWeekOffset: 1 },
      { id: "decline", text: "\"Şu an başka işlerim var, sağ ol ama.\"", reaction: "Sorun değil, başka zaman söylerim.", houseTipAction: "decline" },
    ],
  },
  {
    id: "ecrin-tip-simetrik-ikiz-daire",
    contactName: "Ecrin",
    prompt: "Meslektaşımın simetrik ikiz dairelerinden biri boşaldı, çok nadir bir plan — ilgilenir misin?",
    choices: [
      { id: "week", text: "\"Bu hafta bakalım, merak ettim.\"", reaction: "Harika, bu hafta için ayarlıyorum.", houseTipAction: "accept", houseTipHouseId: "ecrin-simetrik-ikiz-daire", houseTipWeekOffset: 0 },
      { id: "next", text: "\"Gelecek hafta uğrayayım.\"", reaction: "Tamam, gelecek haftaya not aldım.", houseTipAction: "accept", houseTipHouseId: "ecrin-simetrik-ikiz-daire", houseTipWeekOffset: 1 },
      { id: "decline", text: "\"Şimdilik geçelim.\"", reaction: "Tamam, başka fırsat çıkarsa haber veririm.", houseTipAction: "decline" },
    ],
  },
  {
    id: "kutay-tip-tertemiz-tapulu-konak",
    contactName: "Kutay",
    prompt: "Üsküdar'da tapusu kristal gibi temiz bir konak var, tam senlik bir iş — bakmak ister misin?",
    choices: [
      { id: "week", text: "\"Bu hafta bakalım.\"", reaction: "Ayarlıyorum, bu hafta için.", houseTipAction: "accept", houseTipHouseId: "kutay-tertemiz-tapulu-konak", houseTipWeekOffset: 0 },
      { id: "next", text: "\"Gelecek hafta daha rahat olur.\"", reaction: "Olur, gelecek haftaya not ettim.", houseTipAction: "accept", houseTipHouseId: "kutay-tertemiz-tapulu-konak", houseTipWeekOffset: 1 },
      { id: "decline", text: "\"Şu an sırada değil, sağ ol.\"", reaction: "Anladım, başka sefere.", houseTipAction: "decline" },
    ],
  },
  {
    id: "kutay-tip-miras-sonrasi-daire",
    contactName: "Kutay",
    prompt: "Miras süreci yeni tamamlanan bir daire var, evrakı ben hazırladım, tertemiz — ilgilenir misin?",
    choices: [
      { id: "week", text: "\"Bu hafta göreyim.\"", reaction: "Tamam, bu hafta için ayarlıyorum.", houseTipAction: "accept", houseTipHouseId: "kutay-miras-sonrasi-daire", houseTipWeekOffset: 0 },
      { id: "next", text: "\"Gelecek hafta uğrarım.\"", reaction: "Not ettim, gelecek hafta.", houseTipAction: "accept", houseTipHouseId: "kutay-miras-sonrasi-daire", houseTipWeekOffset: 1 },
      { id: "decline", text: "\"Şimdilik pas geçeyim.\"", reaction: "Tamam, sorun değil.", houseTipAction: "decline" },
    ],
  },
  {
    id: "bengisu-tip-gunbatimi-terasi",
    contactName: "Bengisu",
    prompt: "Beylikdüzü'nde inanılmaz bir gün batımı terası buldum, çekim yaptım resmen çıldırdım — bakar mısın?",
    choices: [
      { id: "week", text: "\"Bu hafta görmek isterim.\"", reaction: "Yaşasın, bu hafta ayarlıyorum!", houseTipAction: "accept", houseTipHouseId: "bengisu-gunbatimi-terasi", houseTipWeekOffset: 0 },
      { id: "next", text: "\"Gelecek hafta daha uygun.\"", reaction: "Tamam, gelecek haftaya not.", houseTipAction: "accept", houseTipHouseId: "bengisu-gunbatimi-terasi", houseTipWeekOffset: 1 },
      { id: "decline", text: "\"Şu an olmaz, sağ ol.\"", reaction: "Tamam, kaçırdın ama olsun 😄", houseTipAction: "decline" },
    ],
  },
  {
    id: "bengisu-tip-retro-vitrin-daire",
    contactName: "Bengisu",
    prompt: "Balat'ta çekim yaptığım bir daire satılığa çıktı, sokağı görünce bayılırsın — ilgilenir misin?",
    choices: [
      { id: "week", text: "\"Bu hafta bakalım.\"", reaction: "Süper, bu hafta için ayarlıyorum.", houseTipAction: "accept", houseTipHouseId: "bengisu-retro-vitrin-daire", houseTipWeekOffset: 0 },
      { id: "next", text: "\"Gelecek hafta uğrarım.\"", reaction: "Tamam, gelecek haftaya not aldım.", houseTipAction: "accept", houseTipHouseId: "bengisu-retro-vitrin-daire", houseTipWeekOffset: 1 },
      { id: "decline", text: "\"Şimdilik geçelim.\"", reaction: "Tamam, başka sefere haber veririm.", houseTipAction: "decline" },
    ],
  },
  {
    id: "alperen-tip-ofis-ev-hybrid-loft",
    contactName: "Alperen",
    prompt: "Kendi loftumu satıyorum dostum, yeni işe nakit lazım — sen bakar mısın?",
    choices: [
      { id: "week", text: "\"Bu hafta bakayım.\"", reaction: "Süper, bu hafta ayarlıyorum.", houseTipAction: "accept", houseTipHouseId: "alperen-ofis-ev-hybrid-loft", houseTipWeekOffset: 0 },
      { id: "next", text: "\"Gelecek hafta daha rahat olur.\"", reaction: "Tamam ama çok bekleyemem, not ettim.", houseTipAction: "accept", houseTipHouseId: "alperen-ofis-ev-hybrid-loft", houseTipWeekOffset: 1 },
      { id: "decline", text: "\"Şu an vaktim yok, sağ ol.\"", reaction: "Anladım, başkasına bakarım o zaman.", houseTipAction: "decline" },
    ],
  },
  {
    id: "alperen-tip-yatirimci-dostu-studyo",
    contactName: "Alperen",
    prompt: "Bir yatırımcı arkadaşımın stüdyosu var, kirası çok iyi — sayıları göstereyim mi?",
    choices: [
      { id: "week", text: "\"Bu hafta bakalım.\"", reaction: "Tamam, bu hafta için ayarlıyorum.", houseTipAction: "accept", houseTipHouseId: "alperen-yatirimci-dostu-studyo", houseTipWeekOffset: 0 },
      { id: "next", text: "\"Gelecek hafta uğrarım.\"", reaction: "Not ettim, gelecek hafta.", houseTipAction: "accept", houseTipHouseId: "alperen-yatirimci-dostu-studyo", houseTipWeekOffset: 1 },
      { id: "decline", text: "\"Şimdilik pas geçeyim.\"", reaction: "Tamam, arkadaşıma öyle söylerim.", houseTipAction: "decline" },
    ],
  },
  {
    id: "duru-tip-sessiz-bahce-kati",
    contactName: "Duru",
    prompt: "Yurt dışına taşınıyorum, kendi evimi sana bırakmak istiyorum — bakmak ister misin?",
    choices: [
      { id: "week", text: "\"Bu hafta bakayım.\"", reaction: "Sağ ol, bu hafta için ayarlıyorum.", houseTipAction: "accept", houseTipHouseId: "duru-sessiz-bahce-kati", houseTipWeekOffset: 0 },
      { id: "next", text: "\"Gelecek hafta uğrarım.\"", reaction: "Olur, gelecek haftaya not aldım.", houseTipAction: "accept", houseTipHouseId: "duru-sessiz-bahce-kati", houseTipWeekOffset: 1 },
      { id: "decline", text: "\"Şu an olmaz, kusura bakma.\"", reaction: "Anlıyorum, umarım iyi birine gider.", houseTipAction: "decline" },
    ],
  },
  {
    id: "duru-tip-huzurlu-manzarali-ev",
    contactName: "Duru",
    prompt: "Meslektaşımın orman manzaralı bir evi var, vardiyalardan sonra toparlanmak için almış — bakar mısın?",
    choices: [
      { id: "week", text: "\"Bu hafta göreyim.\"", reaction: "Tamam, bu hafta için ayarlıyorum.", houseTipAction: "accept", houseTipHouseId: "duru-huzurlu-manzarali-ev", houseTipWeekOffset: 0 },
      { id: "next", text: "\"Gelecek hafta daha rahat.\"", reaction: "Olur, gelecek haftaya not ettim.", houseTipAction: "accept", houseTipHouseId: "duru-huzurlu-manzarali-ev", houseTipWeekOffset: 1 },
      { id: "decline", text: "\"Şimdilik geçelim.\"", reaction: "Tamam, meslektaşıma öyle iletirim.", houseTipAction: "decline" },
    ],
  },
];

export function pickFriendMessage(
  excludeId?: string,
  loanActive = false,
  investmentActive = false,
  unlockedFriendHouseIds: string[] = [],
): FriendMessageSet {
  let pool = friendMessageSets;
  if (excludeId) pool = pool.filter((f) => f.id !== excludeId);
  if (loanActive) pool = pool.filter((f) => f.id !== "bora-borc-istek");
  if (investmentActive) pool = pool.filter((f) => f.id !== "bora-yatirim");
  pool = pool.filter((f) => {
    const houseId = f.choices.find((c) => c.houseTipAction === "accept")?.houseTipHouseId;
    return !houseId || !unlockedFriendHouseIds.includes(houseId);
  });
  return pool[Math.floor(Math.random() * pool.length)];
}
