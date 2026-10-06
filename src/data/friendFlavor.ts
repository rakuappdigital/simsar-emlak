import type { Localized } from "./language";
export interface FriendChoice {
  id: string;
  text: Localized;
  reaction: Localized;
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
  prompt: Localized;
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
    prompt: { tr: "Kanka müsait misin, ufak bir konu var... Elin biraz cebe uzanır mı, birkaç haftaya öderim söz.", en: "Buddy are you available, got a small matter... Can you reach into your pocket a bit, I swear I'll pay in a couple of weeks." },
    choices: [
      {
        id: "lend",
        text: { tr: "Tamam kanka, gönderiyorum.", en: "Alright buddy, sending it over." },
        reaction: { tr: "Sağ ol be dostum, unutmam bunu, birkaç haftaya hallederim!", en: "Thanks man, I won't forget this, I'll sort it out in a couple of weeks!" },
        loanAction: "lend",
      },
      {
        id: "decline",
        text: { tr: "Şu an bende de yok açıkçası, kusura bakma.", en: "Frankly I don't have any right now either, sorry." },
        reaction: { tr: "Yok sorun değil, anlarım, başka baktım zaten.", en: "No problem at all, I understand, I looked elsewhere anyway." },
        loanAction: "decline",
      },
      {
        id: "joke",
        text: { tr: "Emlakçıdan borç istemek biraz ironik değil mi?", en: "Isn't asking a realtor for a loan a bit ironic?" },
        reaction: { tr: "Haha haklısın, ama denemeden olmaz dedim", en: "Haha you're right, but I figured I had to try" },
        loanAction: "decline",
      },
    ],
  },
  {
    id: "bora-yatirim",
    contactName: "Bora",
    prompt: { tr: "Elimde ucuza kapatılabilecek bir daire var, sen de kendi paranla bir el atsana, birkaç haftaya değerlenir.", en: "I have an apartment that can be snagged cheap, why don't you pitch in with your own money too, it'll appreciate in a couple of weeks." },
    choices: [
      {
        id: "invest",
        text: { tr: "Olur, kendi param için bir şans veriyorum.", en: "Alright, giving it a shot with my own money." },
        reaction: { tr: "Aferin, sonucu birkaç hafta içinde konuşuruz.", en: "Attaboy, we'll talk about the result in a couple of weeks." },
        investAction: "invest",
      },
      {
        id: "decline-risk",
        text: { tr: "Şu an riske girecek param yok açıkçası.", en: "Frankly I don't have money to risk right now." },
        reaction: { tr: "Sorun değil, başka sefere.", en: "No problem, next time." },
        investAction: "decline",
      },
      {
        id: "decline-joke",
        text: { tr: "Ben zaten başkasının evini satıyorum, kendime yetmiyor", en: "I'm already selling someone else's house, barely covers myself" },
        reaction: { tr: "Haha mantıklı, boş ver o zaman.", en: "Haha makes sense, never mind then." },
        investAction: "decline",
      },
    ],
  },
  {
    id: "melike-dedikodu",
    contactName: "Melike",
    prompt: { tr: "Duydun mu, mahallenin ünlü çifti ayrılmış!", en: "Did you hear, the neighborhood's famous couple broke up!" },
    choices: [
      { id: "a", text: { tr: "Yok artık, ciddi misin?", en: "No way, are you serious?" }, reaction: { tr: "Valla öyle diyorlar, herkes konuşuyor.", en: "I swear that's what they say, everyone is talking." } },
      { id: "b", text: { tr: "Ben dedikoduya karışmam", en: "I don't get involved in gossip" }, reaction: { tr: "Aman ne temiz insansın.", en: "Oh what a clean person you are." } },
      { id: "c", text: { tr: "Kimden duydun bunu?", en: "Who did you hear this from?" }, reaction: { tr: "Sorma sen, kaynağım sağlam.", en: "Don't ask, my source is solid." } },
    ],
  },
  {
    id: "melike-tavsiye",
    contactName: "Melike",
    prompt: { tr: "Bu arada bir ev bakıyorum da, sen bilirsin bu işleri, tavsiyen var mı?", en: "By the way I'm looking for a house, you know this business, any advice?" },
    choices: [
      { id: "a", text: { tr: "Bana gel, sana özel bir şeyler bulurum.", en: "Come to me, I'll find something special for you." }, reaction: { tr: "Vay be, iş insanı gibi konuştun şimdi", en: "Wow, you talked like a business person just now" } },
      { id: "b", text: { tr: "Acele etme, iyi araştır.", en: "Don't rush, research well." }, reaction: { tr: "Haklısın, acele işe şeytan karışır derler.", en: "You're right, haste makes waste as they say." } },
      { id: "c", text: { tr: "Şu an biraz meşgulüm, akşam konuşalım mı?", en: "I'm a bit busy right now, shall we talk in the evening?" }, reaction: { tr: "Tamam tamam, kolay gelsin!", en: "Okay okay, take it easy!" } },
    ],
  },
  {
    id: "kurumsal-toplu-anlasma",
    contactName: "Kurumsal Temsilci",
    prompt: { tr: "Merhaba, bir şirket adına birden fazla daire almayı düşünüyoruz. Size bir danışmanlık payı çıkarabiliriz, ilgilenir misiniz?", en: "Hello, we are thinking of buying multiple apartments on behalf of a company. We can give you a consultancy share, are you interested?" },
    choices: [
      {
        id: "safe",
        text: { tr: "\"Sabit bir danışmanlık ücreti üzerinden anlaşalım.\"", en: "\"Let's agree on a fixed consulting fee.\"" },
        reaction: { tr: "Anlaştık, güvenli tarafı seçtiniz — ödemeyi hemen geçiyoruz.", en: "Deal, you chose the safe side — we are transferring the payment right away." },
        bulkDealAction: "safe",
      },
      {
        id: "risky",
        text: { tr: "\"Satış hacmine bağlı bir pay öneriyorum, ikimiz için de daha iyi olabilir.\"", en: "\"I suggest a share based on sales volume, it might be better for both of us.\"" },
        reaction: { tr: "İlginç bir teklif, yönetime iletip size döneceğiz.", en: "An interesting offer, we will forward it to the management and get back to you." },
        bulkDealAction: "risky",
      },
      {
        id: "decline",
        text: { tr: "\"Şu an bu ölçekte bir işe vaktim yok açıkçası.\"", en: "\"Frankly, I don't have time for a job on this scale right now.\"" },
        reaction: { tr: "Anlıyoruz, belki ileride tekrar konuşuruz.", en: "We understand, maybe we'll talk again in the future." },
        bulkDealAction: "decline",
      },
    ],
  },
  {
    id: "ecrin-tip-isik-kuyulu-loft",
    contactName: "Ecrin",
    prompt: { tr: "Kadıköy'de tasarladığım bir loft satışa çıkıyor, ışık kuyusunu görmen lazım — randevu ayarlayayım mı?", en: "A loft I designed in Kadıköy is going on sale, you have to see the light well — shall I arrange an appointment?" },
    choices: [
      { id: "week", text: { tr: "\"Bu hafta uygunsam bakalım.\"", en: "\"Let's take a look if I'm available this week.\"" }, reaction: { tr: "Süper, bu hafta içine ayarlıyorum!", en: "Super, I'm setting it up for this week!" }, houseTipAction: "accept", houseTipHouseId: "ecrin-isik-kuyulu-loft", houseTipWeekOffset: 0 },
      { id: "next", text: { tr: "\"Gelecek hafta daha uygun olur.\"", en: "\"Next week would be more suitable.\"" }, reaction: { tr: "Tamamdır, gelecek haftaya not ediyorum.", en: "Alright, noting it down for next week." }, houseTipAction: "accept", houseTipHouseId: "ecrin-isik-kuyulu-loft", houseTipWeekOffset: 1 },
      { id: "decline", text: { tr: "\"Şu an başka işlerim var, sağ ol ama.\"", en: "\"I have other business right now, but thanks.\"" }, reaction: { tr: "Sorun değil, başka zaman söylerim.", en: "No problem, I'll let you know another time." }, houseTipAction: "decline" },
    ],
  },
  {
    id: "ecrin-tip-simetrik-ikiz-daire",
    contactName: "Ecrin",
    prompt: { tr: "Meslektaşımın simetrik ikiz dairelerinden biri boşaldı, çok nadir bir plan — ilgilenir misin?", en: "One of my colleague's symmetrical twin apartments is vacant, very rare layout — interested?" },
    choices: [
      { id: "week", text: { tr: "\"Bu hafta bakalım, merak ettim.\"", en: "\"Let's take a look this week, I'm curious.\"" }, reaction: { tr: "Harika, bu hafta için ayarlıyorum.", en: "Great, I'm arranging it for this week." }, houseTipAction: "accept", houseTipHouseId: "ecrin-simetrik-ikiz-daire", houseTipWeekOffset: 0 },
      { id: "next", text: { tr: "\"Gelecek hafta uğrayayım.\"", en: "\"Let me drop by next week.\"" }, reaction: { tr: "Tamam, gelecek haftaya not aldım.", en: "Okay, noted for next week." }, houseTipAction: "accept", houseTipHouseId: "ecrin-simetrik-ikiz-daire", houseTipWeekOffset: 1 },
      { id: "decline", text: { tr: "\"Şimdilik geçelim.\"", en: "\"Let's skip for now.\"" }, reaction: { tr: "Tamam, başka fırsat çıkarsa haber veririm.", en: "Okay, I'll let you know if another opportunity comes up." }, houseTipAction: "decline" },
    ],
  },
  {
    id: "kutay-tip-tertemiz-tapulu-konak",
    contactName: "Kutay",
    prompt: { tr: "Üsküdar'da tapusu kristal gibi temiz bir konak var, tam senlik bir iş — bakmak ister misin?", en: "There is a mansion in Üsküdar with a title deed as clear as crystal, exactly a job for you — want to take a look?" },
    choices: [
      { id: "week", text: { tr: "\"Bu hafta bakalım.\"", en: "\"Let's look this week.\"" }, reaction: { tr: "Ayarlıyorum, bu hafta için.", en: "Arranging, for this week." }, houseTipAction: "accept", houseTipHouseId: "kutay-tertemiz-tapulu-konak", houseTipWeekOffset: 0 },
      { id: "next", text: { tr: "\"Gelecek hafta daha rahat olur.\"", en: "\"Next week would be easier.\"" }, reaction: { tr: "Olur, gelecek haftaya not ettim.", en: "Sure, noted for next week." }, houseTipAction: "accept", houseTipHouseId: "kutay-tertemiz-tapulu-konak", houseTipWeekOffset: 1 },
      { id: "decline", text: { tr: "\"Şu an sırada değil, sağ ol.\"", en: "\"It's not next in line right now, thanks.\"" }, reaction: { tr: "Anladım, başka sefere.", en: "I understand, next time." }, houseTipAction: "decline" },
    ],
  },
  {
    id: "kutay-tip-miras-sonrasi-daire",
    contactName: "Kutay",
    prompt: { tr: "Miras süreci yeni tamamlanan bir daire var, evrakı ben hazırladım, tertemiz — ilgilenir misin?", en: "There's an apartment whose inheritance process has just been completed, I prepared the paperwork, squeaky clean — interested?" },
    choices: [
      { id: "week", text: { tr: "\"Bu hafta göreyim.\"", en: "\"Let me look into this week.\"" }, reaction: { tr: "Tamam, bu hafta için ayarlıyorum.", en: "Okay, I'm writing it down for this week." }, houseTipAction: "accept", houseTipHouseId: "kutay-miras-sonrasi-daire", houseTipWeekOffset: 0 },
      { id: "next", text: { tr: "\"Gelecek hafta uğrarım.\"", en: "\"Let's look next week.\"" }, reaction: { tr: "Not ettim, gelecek hafta.", en: "Okay, left it for next week." }, houseTipAction: "accept", houseTipHouseId: "kutay-miras-sonrasi-daire", houseTipWeekOffset: 1 },
      { id: "decline", text: { tr: "\"Şimdilik pas geçeyim.\"", en: "\"No time, pass.\"" }, reaction: { tr: "Tamam, sorun değil.", en: "Okay, good luck with work." }, houseTipAction: "decline" },
    ],
  },
  {
    id: "bengisu-tip-gunbatimi-terasi",
    contactName: "Bengisu",
    prompt: { tr: "Beylikdüzü'nde inanılmaz bir gün batımı terası buldum, çekim yaptım resmen çıldırdım — bakar mısın?", en: "My client wants to sell quickly, moving abroad, below market price — shall we take a look?" },
    choices: [
      { id: "week", text: { tr: "\"Bu hafta görmek isterim.\"", en: "\"Let's look this week for sure.\"" }, reaction: { tr: "Yaşasın, bu hafta ayarlıyorum!", en: "I'm setting it up, for this week." }, houseTipAction: "accept", houseTipHouseId: "bengisu-gunbatimi-terasi", houseTipWeekOffset: 0 },
      { id: "next", text: { tr: "\"Gelecek hafta daha uygun.\"", en: "\"Next week is fine.\"" }, reaction: { tr: "Tamam, gelecek haftaya not.", en: "Noted for next week." }, houseTipAction: "accept", houseTipHouseId: "bengisu-gunbatimi-terasi", houseTipWeekOffset: 1 },
      { id: "decline", text: { tr: "\"Şu an olmaz, sağ ol.\"", en: "\"Not interested right now.\"" }, reaction: { tr: "Tamam, kaçırdın ama olsun", en: "Okay, we'll talk later." }, houseTipAction: "decline" },
    ],
  },
  {
    id: "bengisu-tip-retro-vitrin-daire",
    contactName: "Bengisu",
    prompt: { tr: "Balat'ta çekim yaptığım bir daire satılığa çıktı, sokağı görünce bayılırsın — ilgilenir misin?", en: "There's a commercial space, previously a bank branch, high rental income guaranteed — how about it?" },
    choices: [
      { id: "week", text: { tr: "\"Bu hafta bakalım.\"", en: "\"Let's see it this week.\"" }, reaction: { tr: "Süper, bu hafta için ayarlıyorum.", en: "Arranging it right away." }, houseTipAction: "accept", houseTipHouseId: "bengisu-retro-vitrin-daire", houseTipWeekOffset: 0 },
      { id: "next", text: { tr: "\"Gelecek hafta uğrarım.\"", en: "\"Next week.\"" }, reaction: { tr: "Tamam, gelecek haftaya not aldım.", en: "Noted for next week." }, houseTipAction: "accept", houseTipHouseId: "bengisu-retro-vitrin-daire", houseTipWeekOffset: 1 },
      { id: "decline", text: { tr: "\"Şimdilik geçelim.\"", en: "\"Pass.\"" }, reaction: { tr: "Tamam, başka sefere haber veririm.", en: "Alright, see you." }, houseTipAction: "decline" },
    ],
  },
  {
    id: "alperen-tip-ofis-ev-hybrid-loft",
    contactName: "Alperen",
    prompt: { tr: "Kendi loftumu satıyorum dostum, yeni işe nakit lazım — sen bakar mısın?", en: "I'm selling my own loft buddy, I need cash for the new business — would you take a look?" },
    choices: [
      { id: "week", text: { tr: "\"Bu hafta bakayım.\"", en: "\"Let me look this week.\"" }, reaction: { tr: "Süper, bu hafta ayarlıyorum.", en: "Super, I'll arrange it this week." }, houseTipAction: "accept", houseTipHouseId: "alperen-ofis-ev-hybrid-loft", houseTipWeekOffset: 0 },
      { id: "next", text: { tr: "\"Gelecek hafta daha rahat olur.\"", en: "\"Next week would be easier.\"" }, reaction: { tr: "Tamam ama çok bekleyemem, not ettim.", en: "Okay but I can't wait long, noted." }, houseTipAction: "accept", houseTipHouseId: "alperen-ofis-ev-hybrid-loft", houseTipWeekOffset: 1 },
      { id: "decline", text: { tr: "\"Şu an vaktim yok, sağ ol.\"", en: "\"I don't have time right now, thanks.\"" }, reaction: { tr: "Anladım, başkasına bakarım o zaman.", en: "I understand, I'll look for someone else then." }, houseTipAction: "decline" },
    ],
  },
  {
    id: "alperen-tip-yatirimci-dostu-studyo",
    contactName: "Alperen",
    prompt: { tr: "Bir yatırımcı arkadaşımın stüdyosu var, kirası çok iyi — sayıları göstereyim mi?", en: "An investor friend of mine has a studio, the rent is very good — should I show you the numbers?" },
    choices: [
      { id: "week", text: { tr: "\"Bu hafta bakalım.\"", en: "\"Let's look this week.\"" }, reaction: { tr: "Tamam, bu hafta için ayarlıyorum.", en: "Okay, I'm setting it up for this week." }, houseTipAction: "accept", houseTipHouseId: "alperen-yatirimci-dostu-studyo", houseTipWeekOffset: 0 },
      { id: "next", text: { tr: "\"Gelecek hafta uğrarım.\"", en: "\"I'll drop by next week.\"" }, reaction: { tr: "Not ettim, gelecek hafta.", en: "Noted, next week." }, houseTipAction: "accept", houseTipHouseId: "alperen-yatirimci-dostu-studyo", houseTipWeekOffset: 1 },
      { id: "decline", text: { tr: "\"Şimdilik pas geçeyim.\"", en: "\"Let me pass for now.\"" }, reaction: { tr: "Tamam, arkadaşıma öyle söylerim.", en: "Okay, I'll tell my friend so." }, houseTipAction: "decline" },
    ],
  },
  {
    id: "duru-tip-sessiz-bahce-kati",
    contactName: "Duru",
    prompt: { tr: "Yurt dışına taşınıyorum, kendi evimi sana bırakmak istiyorum — bakmak ister misin?", en: "I'm moving abroad, I want to leave my own house to you — would you like to take a look?" },
    choices: [
      { id: "week", text: { tr: "\"Bu hafta bakayım.\"", en: "\"Let me take a look this week.\"" }, reaction: { tr: "Sağ ol, bu hafta için ayarlıyorum.", en: "Thanks, I'll arrange it for this week." }, houseTipAction: "accept", houseTipHouseId: "duru-sessiz-bahce-kati", houseTipWeekOffset: 0 },
      { id: "next", text: { tr: "\"Gelecek hafta uğrarım.\"", en: "\"I'll drop by next week.\"" }, reaction: { tr: "Olur, gelecek haftaya not aldım.", en: "Sure, noted for next week." }, houseTipAction: "accept", houseTipHouseId: "duru-sessiz-bahce-kati", houseTipWeekOffset: 1 },
      { id: "decline", text: { tr: "\"Şu an olmaz, kusura bakma.\"", en: "\"Not right now, sorry.\"" }, reaction: { tr: "Anlıyorum, umarım iyi birine gider.", en: "I understand, I hope it goes to someone good." }, houseTipAction: "decline" },
    ],
  },
  {
    id: "duru-tip-huzurlu-manzarali-ev",
    contactName: "Duru",
    prompt: { tr: "Meslektaşımın orman manzaralı bir evi var, vardiyalardan sonra toparlanmak için almış — bakar mısın?", en: "My colleague has a house with a forest view, he bought it to recover after shifts — will you look at it?" },
    choices: [
      { id: "week", text: { tr: "\"Bu hafta göreyim.\"", en: "\"Let me see it this week.\"" }, reaction: { tr: "Tamam, bu hafta için ayarlıyorum.", en: "Okay, I'm setting it up for this week." }, houseTipAction: "accept", houseTipHouseId: "duru-huzurlu-manzarali-ev", houseTipWeekOffset: 0 },
      { id: "next", text: { tr: "\"Gelecek hafta daha rahat.\"", en: "\"Next week is easier.\"" }, reaction: { tr: "Olur, gelecek haftaya not ettim.", en: "Sure, I noted it for next week." }, houseTipAction: "accept", houseTipHouseId: "duru-huzurlu-manzarali-ev", houseTipWeekOffset: 1 },
      { id: "decline", text: { tr: "\"Şimdilik geçelim.\"", en: "\"Let's skip for now.\"" }, reaction: { tr: "Tamam, meslektaşıma öyle iletirim.", en: "Okay, I'll pass it on to my colleague." }, houseTipAction: "decline" },
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
