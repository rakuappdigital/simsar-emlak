import type { HouseResult, HouseScene, PhoneMessage } from "../types";
import { resolveCustomerNames } from "./characterPool";

export interface NegotiationChoice {
  id: string;
  text: string;
  suspicionDelta: number;
  interestDelta: number;
  funDelta: number;
  closingBias: number;
}

export const negotiationChoices: NegotiationChoice[] = [
  {
    id: "empathetic",
    text: '"Elinizde ne gibi tereddütler var, konuşalım."',
    suspicionDelta: -5,
    interestDelta: 10,
    funDelta: 0,
    closingBias: 15,
  },
  {
    id: "pushy",
    text: '"Bu fırsatı kaçırmayın, başkaları da ilgileniyor."',
    suspicionDelta: 15,
    interestDelta: 0,
    funDelta: 0,
    closingBias: 10,
  },
  {
    id: "patient",
    text: '"Sizi hiç zorlamam, ne zaman hazır olursanız buradayım."',
    suspicionDelta: -10,
    interestDelta: 5,
    funDelta: 5,
    closingBias: -5,
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
  },
  {
    id: "pushy",
    text: '"Bu segmentte böyle bir fırsat sık çıkmıyor, başka görüşmelerimiz de var."',
    suspicionDelta: 15,
    interestDelta: 0,
    funDelta: 0,
    closingBias: 10,
  },
  {
    id: "patient",
    text: '"Bu ölçekte bir yatırımda acele etmemenizi tercih ederim, ne zaman hazırsanız buradayım."',
    suspicionDelta: -10,
    interestDelta: 5,
    funDelta: 5,
    closingBias: -5,
  },
];

function choicesForTier(tier: number): NegotiationChoice[] {
  return tier >= 3 ? luxuryNegotiationChoices : negotiationChoices;
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
