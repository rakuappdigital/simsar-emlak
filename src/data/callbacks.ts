import type { HouseResult, HouseScene, PhoneMessage } from "../types";
import { resolveCustomerNames } from "./characterPool";

export interface NegotiationChoice {
  id: string;
  text: string;
  suspicionDelta: number;
  interestDelta: number;
  funDelta: number;
  closingBias: number;
  /** Customer's reply pools per resolved outcome — must sound like a genuine
   *  continuation of what Emlah just said, not a generic one-size-fits-all
   *  brush-off. One is picked at random for a little variety across replays. */
  soldReplies: string[];
  thinkingReplies: string[];
  lostReplies: string[];
}

export const negotiationChoices: NegotiationChoice[] = [
  {
    id: "empathetic",
    text: '"Elinizde ne gibi tereddütler var, konuşalım."',
    suspicionDelta: -5,
    interestDelta: 10,
    funDelta: 0,
    closingBias: 15,
    soldReplies: [
      "Aslında sizinle konuşunca kafam netleşti, alalım bari!",
      "Bu kadar anladığınız için teşekkürler, karar verdim: alıyorum.",
    ],
    thinkingReplies: [
      "Açıkçası hâlâ bütçe konusunda emin değilim, biraz daha düşüneyim.",
      "Asıl tereddüdüm ulaşım tarafında, biraz daha araştırayım.",
      "Eşimle bir kez daha konuşmam lazım ama sorduğunuz için teşekkürler.",
    ],
    lostReplies: [
      "Konuştuk ama içim yine de rahat etmedi, başka bir yere bakacağım.",
      "Teşekkürler ama sanırım bu ev bize göre değilmiş.",
    ],
  },
  {
    id: "pushy",
    text: '"Bu fırsatı kaçırmayın, başkaları da ilgileniyor."',
    suspicionDelta: 15,
    interestDelta: 0,
    funDelta: 0,
    closingBias: 10,
    soldReplies: [
      "Tamam, başkasına kaptırmak istemem, alıyorum!",
      "Haklısınız, bekleyecek vaktim yok, anlaştık.",
    ],
    thinkingReplies: [
      "Baskı hissetmek istemiyorum açıkçası, biraz zamana ihtiyacım var.",
      "Acele etmeyeceğim, kararımı kendi hızımda vereceğim.",
    ],
    lostReplies: [
      "Bu şekilde zorlanmak hoşuma gitmedi, vazgeçiyorum.",
      "Sanırım acele bir karar sizin için, benim için değil.",
    ],
  },
  {
    id: "patient",
    text: '"Sizi hiç zorlamam, ne zaman hazır olursanız buradayım."',
    suspicionDelta: -10,
    interestDelta: 5,
    funDelta: 5,
    closingBias: -5,
    soldReplies: [
      "Bu sabrınız için teşekkürler, hazırım, alıyorum.",
      "Zaman tanımanız güzeldi, kararımı verdim: evet.",
    ],
    thinkingReplies: [
      "Zaman tanımanız için teşekkürler, birkaç gün içinde dönerim.",
      "Bu nezaketi takdir ediyorum, biraz daha düşüneceğim.",
    ],
    lostReplies: [
      "Sabrınız için teşekkürler ama sanırım bu ev bana göre değil.",
      "Düşündüm taşındım, maalesef vazgeçtim.",
    ],
  },
];

/** Same ids/effects as negotiationChoices (so effect resolution stays identical) — just upscale phrasing for tier-3 luxury houses. */
export const luxuryNegotiationChoices: NegotiationChoice[] = [
  {
    id: "empathetic",
    text: '"Kararınızı zorlamak istemem, sizi tereddüte düşüren detayı konuşalım."',
    suspicionDelta: -5,
    interestDelta: 10,
    funDelta: 0,
    closingBias: 15,
    soldReplies: [
      "Bu netlik için teşekkür ederim, ailemle de konuştum: ilerliyoruz.",
      "Sorduğunuz için sağ olun, bu ölçekte bir kararı artık verebilirim.",
    ],
    thinkingReplies: [
      "Asıl tereddüdümüz bu ölçekteki vergi yükü, biraz daha araştıralım.",
      "Ailece bir kez daha değerlendirmemiz lazım, birkaç gün istiyoruz.",
    ],
    lostReplies: [
      "Konuştuk ama bu ölçekte bir yatırımda içimiz yine de rahat etmedi.",
      "Teşekkürler ama sanırım bu bizim için doğru zaman değil.",
    ],
  },
  {
    id: "pushy",
    text: '"Bu segmentte böyle bir fırsat sık çıkmıyor, başka görüşmelerimiz de var."',
    suspicionDelta: 15,
    interestDelta: 0,
    funDelta: 0,
    closingBias: 10,
    soldReplies: [
      "Başka bir alıcıya kaptırmak istemeyiz, ilerleyelim.",
      "Haklısınız, bu ölçekte bir fırsatı beklemek istemiyoruz.",
    ],
    thinkingReplies: [
      "Bu ölçekte bir kararda acele etmek bize göre değil, zaman istiyoruz.",
      "Baskı hissetmek istemiyoruz açıkçası, biraz daha düşüneceğiz.",
    ],
    lostReplies: [
      "Bu yaklaşım bize göre değildi, başka seçeneklere bakacağız.",
      "Bu ölçekte bir kararda zorlanmak istemiyoruz, vazgeçiyoruz.",
    ],
  },
  {
    id: "patient",
    text: '"Bu ölçekte bir yatırımda acele etmemenizi tercih ederim, ne zaman hazırsanız buradayım."',
    suspicionDelta: -10,
    interestDelta: 5,
    funDelta: 5,
    closingBias: -5,
    soldReplies: [
      "Bu anlayış için teşekkürler, artık hazırız: ilerliyoruz.",
      "Zaman tanımanız değerliydi, ailece karar verdik: evet.",
    ],
    thinkingReplies: [
      "Bu nezaket için teşekkürler, bir hafta içinde dönüş yapacağız.",
      "Zaman tanımanızı takdir ediyoruz, biraz daha değerlendireceğiz.",
    ],
    lostReplies: [
      "Zaman tanımanız için teşekkürler ama bu ölçekte vazgeçtik.",
      "Değerlendirdik ama sanırım bu bizim için doğru yatırım değil.",
    ],
  },
];

function choicesForTier(tier: number): NegotiationChoice[] {
  return tier >= 3 ? luxuryNegotiationChoices : negotiationChoices;
}

/** Picks a reply for the outcome this negotiation choice actually resolved to. */
export function pickNegotiationReply(choice: NegotiationChoice, outcome: "sold" | "thinking" | "lost"): string {
  const pool = outcome === "sold" ? choice.soldReplies : outcome === "lost" ? choice.lostReplies : choice.thinkingReplies;
  return pool[Math.floor(Math.random() * pool.length)];
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
        { from: contactName, text: `Merhaba, ${house.title} için tekrar teşekkür etmek istedim, çok mutluyuz!` },
        { from: contactName, text: "Bu arada bir arkadaşıma da sizi önerdim, belki o da arar." },
      ],
    };
  }

  if (result.outcome === "lost") {
    return {
      resultIndex,
      contactName,
      messages: [
        { from: contactName, text: `Merhaba, ${house.title} hâlâ satılık mı acaba?` },
        { from: contactName, text: "Geçen sefer biraz aceleye getirilmiş hissetmiştim ama tekrar düşünüyorum." },
      ],
    };
  }

  // outcome === "thinking" — a real negotiation with consequences
  const thinkingMessages =
    house.tier >= 3
      ? [
          { from: contactName, text: `Merhaba, ${house.title} konusunda ailemizle tekrar değerlendirdik...` },
          { from: contactName, text: "Bu ölçekte bir yatırımda hâlâ emin değiliz, biraz daha bilgi verir misiniz?" },
        ]
      : [
          { from: contactName, text: `Merhaba, ${house.title} konusunda tekrar düşündük...` },
          { from: contactName, text: "Hâlâ tam kararsızız açıkçası, biraz daha yardımcı olur musunuz?" },
        ];

  return {
    resultIndex,
    contactName,
    messages: thinkingMessages,
    choices: choicesForTier(house.tier),
  };
}
