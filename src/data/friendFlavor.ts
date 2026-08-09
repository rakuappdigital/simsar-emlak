export interface FriendChoice {
  id: string;
  text: string;
  reaction: string;
  /** Present only on the loan-ask set — drives App.tsx's small lend/repay loop. */
  loanAction?: "lend" | "decline";
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
    prompt: "Bu ara kripto paraya giriyorum, sen de girsene emlakçı kafasını bırak biraz 😄",
    choices: [
      { id: "a", text: "Ben tuğlaya güveniyorum kanka, sağlam iş.", reaction: "Haklısın valla, ev hiç değer kaybetmiyor." },
      { id: "b", text: "O da ne şimdi? 😄", reaction: "Cahil kalma öyle, biraz araştır bence." },
      { id: "c", text: "Sen bilirsin, ben riske girmem.", reaction: "Aferin, akıllı adamsın sen." },
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
];

export function pickFriendMessage(excludeId?: string, loanActive = false): FriendMessageSet {
  let pool = friendMessageSets;
  if (excludeId) pool = pool.filter((f) => f.id !== excludeId);
  if (loanActive) pool = pool.filter((f) => f.id !== "bora-borc-istek");
  return pool[Math.floor(Math.random() * pool.length)];
}
