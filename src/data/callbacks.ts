import type { HouseResult, HouseScene, PhoneMessage } from "../types";
import { resolveCustomerNames } from "./characterPool";
import { resolveText, resolveHouseTitle, type Localized } from "./language";

export interface NegotiationChoice {
  id: string;
  text: Localized;
  suspicionDelta: number;
  interestDelta: number;
  funDelta: number;
  closingBias: number;
  /** Customer's reply pools per resolved outcome — must sound like a genuine
   *  continuation of what Emlah just said, not a generic one-size-fits-all
   *  brush-off. One is picked at random for a little variety across replays. */
  soldReplies: Localized[];
  thinkingReplies: Localized[];
  lostReplies: Localized[];
}

export const negotiationChoices: NegotiationChoice[] = [
  {
    id: "empathetic",
    text: { tr: "\"Elinizde ne gibi tereddütler var, konuşalım.\"", en: "\"What kind of hesitations do you have, let's talk.\"" },
    suspicionDelta: -5,
    interestDelta: 10,
    funDelta: 0,
    closingBias: 15,
    soldReplies: [
      { tr: "Aslında sizinle konuşunca kafam netleşti, alalım bari!", en: "Actually, talking to you cleared my mind, let's buy it after all!" },
      { tr: "Bu kadar anladığınız için teşekkürler, karar verdim: alıyorum.", en: "Thanks for understanding so much, I've decided: I'm buying it." },
    ],
    thinkingReplies: [
      { tr: "Açıkçası hâlâ bütçe konusunda emin değilim, biraz daha düşüneyim.", en: "Frankly, I'm still not sure about the budget, let me think a bit more." },
      { tr: "Asıl tereddüdüm ulaşım tarafında, biraz daha araştırayım.", en: "My main hesitation is on the transportation side, let me research a bit more." },
      { tr: "Eşimle bir kez daha konuşmam lazım ama sorduğunuz için teşekkürler.", en: "I need to talk to my spouse once more, but thanks for asking." },
    ],
    lostReplies: [
      { tr: "Konuştuk ama içim yine de rahat etmedi, başka bir yere bakacağım.", en: "We talked, but my mind still isn't at ease, I'll look somewhere else." },
      { tr: "Teşekkürler ama sanırım bu ev bize göre değilmiş.", en: "Thanks, but I guess this house wasn't for us." },
    ],
  },
  {
    id: "pushy",
    text: { tr: "\"Bu fırsatı kaçırmayın, başkaları da ilgileniyor.\"", en: "\"Don't miss this opportunity, others are interested too.\"" },
    suspicionDelta: 15,
    interestDelta: 0,
    funDelta: 0,
    closingBias: 10,
    soldReplies: [
      { tr: "Tamam, başkasına kaptırmak istemem, alıyorum!", en: "Okay, I don't want to lose it to someone else, I'm taking it!" },
      { tr: "Haklısınız, bekleyecek vaktim yok, anlaştık.", en: "You're right, I don't have time to wait, it's a deal." },
    ],
    thinkingReplies: [
      { tr: "Baskı hissetmek istemiyorum açıkçası, biraz zamana ihtiyacım var.", en: "Frankly, I don't want to feel pressured, I need some time." },
      { tr: "Acele etmeyeceğim, kararımı kendi hızımda vereceğim.", en: "I won't rush, I'll make my decision at my own pace." },
    ],
    lostReplies: [
      { tr: "Bu şekilde zorlanmak hoşuma gitmedi, vazgeçiyorum.", en: "I didn't like being pressured like this, I'm passing." },
      { tr: "Sanırım acele bir karar sizin için, benim için değil.", en: "I guess rushing is a decision for you, not for me." },
    ],
  },
  {
    id: "patient",
    text: { tr: "\"Sizi hiç zorlamam, ne zaman hazır olursanız buradayım.\"", en: "\"I won't rush you at all, I'm here whenever you're ready.\"" },
    suspicionDelta: -10,
    interestDelta: 5,
    funDelta: 5,
    closingBias: -5,
    soldReplies: [
      { tr: "Bu sabrınız için teşekkürler, hazırım, alıyorum.", en: "Thank you for your patience, I'm ready, I'll take it." },
      { tr: "Zaman tanımanız güzeldi, kararımı verdim: evet.", en: "It was nice of you to give me time, I made my decision: yes." },
    ],
    thinkingReplies: [
      { tr: "Zaman tanımanız için teşekkürler, birkaç gün içinde dönerim.", en: "Thank you for giving me time, I'll get back to you in a few days." },
      { tr: "Bu nezaketi takdir ediyorum, biraz daha düşüneceğim.", en: "I appreciate the courtesy, I will think about it a little more." },
    ],
    lostReplies: [
      { tr: "Sabrınız için teşekkürler ama sanırım bu ev bana göre değil.", en: "Thanks for your patience but I guess this house is not for me." },
      { tr: "Düşündüm taşındım, maalesef vazgeçtim.", en: "I thought it over, unfortunately I gave up." },
    ],
  },
];

/** Same ids/effects as negotiationChoices (so effect resolution stays identical) — just upscale phrasing for tier-3 luxury houses. */
export const luxuryNegotiationChoices: NegotiationChoice[] = [
  {
    id: "empathetic",
    text: { tr: "\"Kararınızı zorlamak istemem, sizi tereddüte düşüren detayı konuşalım.\"", en: "\"I don't want to force your decision, let's talk about the detail that makes you hesitate.\"" },
    suspicionDelta: -5,
    interestDelta: 10,
    funDelta: 0,
    closingBias: 15,
    soldReplies: [
      { tr: "Bu netlik için teşekkür ederim, ailemle de konuştum: ilerliyoruz.", en: "Thank you for this clarity, I also talked to my family: we are moving forward." },
      { tr: "Sorduğunuz için sağ olun, bu ölçekte bir kararı artık verebilirim.", en: "Thanks for asking, I can now make a decision on this scale." },
    ],
    thinkingReplies: [
      { tr: "Asıl tereddüdümüz bu ölçekteki vergi yükü, biraz daha araştıralım.", en: "Our main hesitation is the tax burden on this scale, let's research a bit more." },
      { tr: "Ailece bir kez daha değerlendirmemiz lazım, birkaç gün istiyoruz.", en: "We need to evaluate it once more as a family, we want a few days." },
    ],
    lostReplies: [
      { tr: "Konuştuk ama bu ölçekte bir yatırımda içimiz yine de rahat etmedi.", en: "We talked but we still didn't feel comfortable with an investment on this scale." },
      { tr: "Teşekkürler ama sanırım bu bizim için doğru zaman değil.", en: "Thanks but I guess this is not the right time for us." },
    ],
  },
  {
    id: "pushy",
    text: { tr: "\"Bu segmentte böyle bir fırsat sık çıkmıyor, başka görüşmelerimiz de var.\"", en: "\"An opportunity like this doesn't come up often in this segment, we have other meetings too.\"" },
    suspicionDelta: 15,
    interestDelta: 0,
    funDelta: 0,
    closingBias: 10,
    soldReplies: [
      { tr: "Başka bir alıcıya kaptırmak istemeyiz, ilerleyelim.", en: "We wouldn't want to lose it to another buyer, let's proceed." },
      { tr: "Haklısınız, bu ölçekte bir fırsatı beklemek istemiyoruz.", en: "You are right, we don't want to wait on an opportunity on this scale." },
    ],
    thinkingReplies: [
      { tr: "Bu ölçekte bir kararda acele etmek bize göre değil, zaman istiyoruz.", en: "Rushing a decision on this scale is not for us, we need time." },
      { tr: "Baskı hissetmek istemiyoruz açıkçası, biraz daha düşüneceğiz.", en: "Frankly, we don't want to feel pressured, we will think about it a bit more." },
    ],
    lostReplies: [
      { tr: "Bu yaklaşım bize göre değildi, başka seçeneklere bakacağız.", en: "This approach wasn't for us, we will look at other options." },
      { tr: "Bu ölçekte bir kararda zorlanmak istemiyoruz, vazgeçiyoruz.", en: "We don't want to be forced into a decision on this scale, we're giving up." },
    ],
  },
  {
    id: "patient",
    text: { tr: "\"Bu ölçekte bir yatırımda acele etmemenizi tercih ederim, ne zaman hazırsanız buradayım.\"", en: "\"I prefer you don't rush into an investment on this scale, I am here whenever you are ready.\"" },
    suspicionDelta: -10,
    interestDelta: 5,
    funDelta: 5,
    closingBias: -5,
    soldReplies: [
      { tr: "Bu anlayış için teşekkürler, artık hazırız: ilerliyoruz.", en: "Thanks for this understanding, we are ready now: we are proceeding." },
      { tr: "Zaman tanımanız değerliydi, ailece karar verdik: evet.", en: "It was valuable that you gave us time, we decided as a family: yes." },
    ],
    thinkingReplies: [
      { tr: "Bu nezaket için teşekkürler, bir hafta içinde dönüş yapacağız.", en: "Thanks for this courtesy, we will return in a week." },
      { tr: "Zaman tanımanızı takdir ediyoruz, biraz daha değerlendireceğiz.", en: "We appreciate you giving us time, we will evaluate it a bit more." },
    ],
    lostReplies: [
      { tr: "Zaman tanımanız için teşekkürler ama bu ölçekte vazgeçtik.", en: "Thanks for giving us time but we gave up on this scale." },
      { tr: "Değerlendirdik ama sanırım bu bizim için doğru yatırım değil.", en: "We evaluated it but I guess this is not the right investment for us." },
    ],
  },
];

function choicesForTier(tier: number): NegotiationChoice[] {
  return tier >= 3 ? luxuryNegotiationChoices : negotiationChoices;
}

/** Picks a reply for the outcome this negotiation choice actually resolved to. */
export function pickNegotiationReply(choice: NegotiationChoice, outcome: "sold" | "thinking" | "lost"): string {
  const pool = outcome === "sold" ? choice.soldReplies : outcome === "lost" ? choice.lostReplies : choice.thinkingReplies;
  return resolveText(pool[Math.floor(Math.random() * pool.length)]);
}

export interface CallbackEvent {
  resultIndex: number;
  contactName: string;
  messages: PhoneMessage[];
  /** Present only when the original outcome was "thinking" — a real negotiation. */
  choices?: NegotiationChoice[];
}

export function maybeGenerateCallback(
  results: HouseResult[],
  allHouses: HouseScene[],
  chance: number,
  castAssignment: Record<string, string[]> = {},
): CallbackEvent | null {
  if (results.length === 0 || chance <= 0) return null;
  if (Math.random() > chance) return null;

  const resultIndex = Math.floor(Math.random() * results.length);
  const result = results[resultIndex];
  const house = allHouses.find((h) => h.id === result.houseId);
  if (!house) return null;
  const contactName = resolveCustomerNames(house, castAssignment)[0];

  if (result.outcome === "sold") {
    return {
      resultIndex,
      contactName,
      messages: [
        {
          from: contactName,
          text: resolveText({
            tr: `Merhaba, ${resolveHouseTitle(house)} için tekrar teşekkür etmek istedim, çok mutluyuz!`,
            en: `Hi, I wanted to thank you again for ${resolveHouseTitle(house)}, we're so happy!`,
          }),
        },
        {
          from: contactName,
          text: resolveText({
            tr: "Bu arada bir arkadaşıma da sizi önerdim, belki o da arar.",
            en: "By the way, I recommended you to a friend, maybe they'll call too.",
          }),
        },
      ],
    };
  }

  if (result.outcome === "lost") {
    return {
      resultIndex,
      contactName,
      messages: [
        {
          from: contactName,
          text: resolveText({
            tr: `Merhaba, ${resolveHouseTitle(house)} hâlâ satılık mı acaba?`,
            en: `Hi, is ${resolveHouseTitle(house)} still for sale by any chance?`,
          }),
        },
        {
          from: contactName,
          text: resolveText({
            tr: "Geçen sefer biraz aceleye getirilmiş hissetmiştim ama tekrar düşünüyorum.",
            en: "I felt a bit rushed last time, but I'm thinking it over again.",
          }),
        },
      ],
    };
  }

  // outcome === "thinking" — a real negotiation with consequences
  const thinkingMessages =
    house.tier >= 3
      ? [
          {
            from: contactName,
            text: resolveText({
              tr: `Merhaba, ${resolveHouseTitle(house)} konusunda ailemizle tekrar değerlendirdik...`,
              en: `Hi, we reconsidered ${resolveHouseTitle(house)} with the family again...`,
            }),
          },
          {
            from: contactName,
            text: resolveText({
              tr: "Bu ölçekte bir yatırımda hâlâ emin değiliz, biraz daha bilgi verir misiniz?",
              en: "We're still not sure about an investment this size, could you give us a bit more information?",
            }),
          },
        ]
      : [
          {
            from: contactName,
            text: resolveText({
              tr: `Merhaba, ${resolveHouseTitle(house)} konusunda tekrar düşündük...`,
              en: `Hi, we thought about ${resolveHouseTitle(house)} again...`,
            }),
          },
          {
            from: contactName,
            text: resolveText({
              tr: "Hâlâ tam kararsızız açıkçası, biraz daha yardımcı olur musunuz?",
              en: "Honestly we're still quite undecided, could you help a bit more?",
            }),
          },
        ];

  return {
    resultIndex,
    contactName,
    messages: thinkingMessages,
    choices: choicesForTier(house.tier),
  };
}
