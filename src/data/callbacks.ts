import type { HouseResult, HouseScene, PhoneMessage } from "../types";
import { COMMISSION_RATE } from "./economy";

export interface CallbackEvent {
  resultIndex: number;
  messages: PhoneMessage[];
  converts: boolean;
  bonusCommission: number;
}

const CALLBACK_CHANCE = 0.3;
const CONVERT_CHANCE = 0.5;

export function maybeGenerateCallback(
  results: HouseResult[],
  allHouses: HouseScene[],
): CallbackEvent | null {
  if (results.length === 0) return null;
  if (Math.random() > CALLBACK_CHANCE) return null;

  const resultIndex = Math.floor(Math.random() * results.length);
  const result = results[resultIndex];
  const house = allHouses.find((h) => h.id === result.houseId);
  if (!house) return null;
  const customerName = house.customerNames[0];

  if (result.outcome === "sold") {
    return {
      resultIndex,
      converts: false,
      bonusCommission: 0,
      messages: [
        { from: customerName, text: `Merhaba, ${house.title} için tekrar teşekkür etmek istedim, çok mutluyuz!` },
        { from: customerName, text: "Bu arada bir arkadaşıma da sizi önerdim, belki o da arar." },
      ],
    };
  }

  if (result.outcome === "lost") {
    return {
      resultIndex,
      converts: false,
      bonusCommission: 0,
      messages: [
        { from: customerName, text: `Merhaba, ${house.title} hâlâ satılık mı acaba?` },
        { from: customerName, text: "Geçen sefer biraz aceleye getirilmiş hissetmiştim ama tekrar düşünüyorum." },
      ],
    };
  }

  // outcome === "thinking"
  const converts = Math.random() < CONVERT_CHANCE;
  if (converts) {
    const commission = house.askingPrice * COMMISSION_RATE;
    return {
      resultIndex,
      converts: true,
      bonusCommission: commission,
      messages: [
        { from: customerName, text: `Merhaba, ${house.title} konusunda düşündük...` },
        { from: customerName, text: "Karar verdik, alıyoruz! Süreci başlatabilir misiniz? 🎉" },
      ],
    };
  }
  return {
    resultIndex,
    converts: false,
    bonusCommission: 0,
    messages: [
      { from: customerName, text: `Merhaba, ${house.title} hakkında hâlâ düşünüyoruz.` },
      { from: customerName, text: "Biraz daha zamana ihtiyacımız var, haber veririz." },
    ],
  };
}
