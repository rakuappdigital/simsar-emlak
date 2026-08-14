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
];

export function pickFriendMessage(excludeId?: string, loanActive = false, investmentActive = false): FriendMessageSet {
  let pool = friendMessageSets;
  if (excludeId) pool = pool.filter((f) => f.id !== excludeId);
  if (loanActive) pool = pool.filter((f) => f.id !== "bora-borc-istek");
  if (investmentActive) pool = pool.filter((f) => f.id !== "bora-yatirim");
  return pool[Math.floor(Math.random() * pool.length)];
}
