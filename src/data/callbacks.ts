import type { HouseResult, HouseScene, PhoneMessage } from "../types";

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

export interface CallbackEvent {
  resultIndex: number;
  contactName: string;
  messages: PhoneMessage[];
  /** Present only when the original outcome was "thinking" — a real negotiation. */
  choices?: NegotiationChoice[];
}

const BASE_CHANCE = 0.3;
const BOOSTED_CHANCE = 0.45;

export function maybeGenerateCallback(
  results: HouseResult[],
  allHouses: HouseScene[],
  chanceBoost = false,
): CallbackEvent | null {
  if (results.length === 0) return null;
  const chance = chanceBoost ? BOOSTED_CHANCE : BASE_CHANCE;
  if (Math.random() > chance) return null;

  const resultIndex = Math.floor(Math.random() * results.length);
  const result = results[resultIndex];
  const house = allHouses.find((h) => h.id === result.houseId);
  if (!house) return null;
  const contactName = house.customerNames[0];

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
  return {
    resultIndex,
    contactName,
    messages: [
      { from: contactName, text: `Merhaba, ${house.title} konusunda tekrar düşündük...` },
      { from: contactName, text: "Hâlâ tam kararsızız açıkçası, biraz daha yardımcı olur musunuz?" },
    ],
    choices: negotiationChoices,
  };
}
