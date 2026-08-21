import { useState } from "react";
import type { ReactNode } from "react";
import type {
  Badge,
  ContactedCustomer,
  HouseResult,
  HouseScene,
  InboxMessage,
  OwnedInvestmentHouse,
  PendingDelivery,
  ToneBucket,
  CompassAxis,
} from "../types";
import { formatTL } from "../data/economy";
import { weekIndexForHouse } from "../data/goals";
import MarketPanel from "./MarketPanel";
import MessagesPanel from "./MessagesPanel";
import PortfolioPanel from "./PortfolioPanel";
import CareerPanel from "./CareerPanel";
import PremiumInvitesPanel from "./PremiumInvitesPanel";
import InvestmentPanel from "./InvestmentPanel";
import DeliveriesPanel from "./DeliveriesPanel";
import RelationshipsPanel from "./RelationshipsPanel";
import FriendHousesPanel from "./FriendHousesPanel";
import RehberPanel from "./RehberPanel";
import CityMapPanel from "./CityMapPanel";
import SkillTreePanel from "./SkillTreePanel";
import type { ContactEntry } from "../data/contactBook";
import type { DistrictPin } from "../data/istanbulMap";
import type { RenovationLevel } from "../data/renovation";
import { WalletIcon, CartIcon, ChatIcon, HouseIcon, StarIcon, MedalIcon, CloseIcon, CalendarIcon, HeartIcon, BriefcaseIcon, CompassIcon, ChalkboardIcon } from "./icons";

export type EmlahTab =
  | "market"
  | "mesajlar"
  | "portfoy"
  | "kariyer"
  | "davet"
  | "yatirim"
  | "teslimler"
  | "iliskiler"
  | "arkadaslar"
  | "rehber"
  | "harita"
  | "beceri";

interface EmlahMenuProps {
  initialTab: EmlahTab;
  balance: number;
  ownedPerks: string[];
  consumables: Record<string, number>;
  unlockedTiers: number[];
  onBuy: (id: string) => void;
  inbox: InboxMessage[];
  results: HouseResult[];
  onRetry: (houseId: string) => void;
  allHouses: HouseScene[];
  houseOrder: number[];
  currentIndex: number;
  rankTitleText: string;
  reputationText: string;
  earned: number;
  badges: string[];
  allBadges: Record<string, Badge>;
  tasksCompleted: number;
  chitchatBonuses: number;
  onClose: () => void;
  premiumHouses: HouseScene[];
  unlockedPremiumIds: string[];
  premiumResults: HouseResult[];
  onOpenPremium: (houseId: string) => void;
  investmentHouses: HouseScene[];
  investmentUnlocked: boolean;
  ownedInvestmentHouses: OwnedInvestmentHouse[];
  investmentResults: HouseResult[];
  currentNewsModifier: number;
  onBuyInvestment: (houseId: string) => void;
  onSellInvestment: (houseId: string) => void;
  onRenovate: (houseId: string, level: RenovationLevel) => void;
  contactedCustomers: ContactedCustomer[];
  onPitchInvestment: (contact: ContactedCustomer, houseId: string) => void;
  pendingDeliveries: PendingDelivery[];
  currentDateLabel: string;
  bossMood: number;
  friendBonds: Record<string, number>;
  voiceTally: Record<ToneBucket, number>;
  compassTally: Record<CompassAxis, number>;
  friendHouses: HouseScene[];
  unlockedFriendHouseIds: string[];
  friendHouseResults: HouseResult[];
  onOpenFriendHouse: (houseId: string) => void;
  contacts: ContactEntry[];
  districtPins: DistrictPin[];
  defeatedRivalIds: string[];
  ownedSkillIds: string[];
  skillXP: number;
  onUnlockSkill: (skillId: string) => void;
}

const tabs: { id: EmlahTab; icon: ReactNode; label: string }[] = [
  { id: "market", icon: <CartIcon size={14} />, label: "Market" },
  { id: "mesajlar", icon: <ChatIcon size={14} />, label: "Mesajlar" },
  { id: "portfoy", icon: <HouseIcon size={14} />, label: "Portföy" },
  { id: "kariyer", icon: <StarIcon size={14} />, label: "Kariyer" },
  { id: "davet", icon: <MedalIcon size={14} />, label: "Özel Davetler" },
  { id: "yatirim", icon: <HouseIcon size={14} />, label: "Yatırım Evleri" },
  { id: "teslimler", icon: <CalendarIcon size={14} />, label: "Bekleyen Teslimler" },
  { id: "iliskiler", icon: <HeartIcon size={14} />, label: "İlişkiler" },
  { id: "arkadaslar", icon: <HouseIcon size={14} />, label: "Arkadaşlarım" },
  { id: "rehber", icon: <BriefcaseIcon size={14} />, label: "Rehber" },
  { id: "harita", icon: <CompassIcon size={14} />, label: "Şehir Haritası" },
  { id: "beceri", icon: <ChalkboardIcon size={14} />, label: "Beceriler" },
];

export default function EmlahMenu({
  initialTab,
  balance,
  ownedPerks,
  consumables,
  unlockedTiers,
  onBuy,
  inbox,
  results,
  onRetry,
  allHouses,
  houseOrder,
  currentIndex,
  rankTitleText,
  reputationText,
  earned,
  badges,
  allBadges,
  tasksCompleted,
  chitchatBonuses,
  onClose,
  premiumHouses,
  unlockedPremiumIds,
  premiumResults,
  onOpenPremium,
  investmentHouses,
  investmentUnlocked,
  ownedInvestmentHouses,
  investmentResults,
  currentNewsModifier,
  onBuyInvestment,
  onSellInvestment,
  onRenovate,
  contactedCustomers,
  onPitchInvestment,
  pendingDeliveries,
  currentDateLabel,
  bossMood,
  friendBonds,
  voiceTally,
  compassTally,
  friendHouses,
  unlockedFriendHouseIds,
  friendHouseResults,
  onOpenFriendHouse,
  contacts,
  districtPins,
  defeatedRivalIds,
  ownedSkillIds,
  skillXP,
  onUnlockSkill,
}: EmlahMenuProps) {
  const [tab, setTab] = useState<EmlahTab>(initialTab);

  return (
    <div className="modal-overlay">
      <div className="market-modal emlah-menu">
        <div className="market-header">
          <h2 className="market-title">Emlah</h2>
          <span className="market-balance">
            <WalletIcon size={14} className="icon-inline" /> {formatTL(balance)}
          </span>
          <button className="market-close" onClick={onClose} aria-label="Kapat">
            <CloseIcon size={12} />
          </button>
        </div>

        <div className="emlah-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`emlah-tab-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="emlah-tab-content">
          {tab === "market" && (
            <MarketPanel
              balance={balance}
              ownedPerks={ownedPerks}
              consumables={consumables}
              unlockedTiers={unlockedTiers}
              badges={badges}
              weekIndex={weekIndexForHouse(currentIndex)}
              results={results}
              onBuy={onBuy}
            />
          )}
          {tab === "mesajlar" && <MessagesPanel inbox={inbox} results={results} onRetry={onRetry} />}
          {tab === "portfoy" && (
            <PortfolioPanel
              allHouses={allHouses}
              houseOrder={houseOrder}
              results={results}
              unlockedTiers={unlockedTiers}
              currentIndex={currentIndex}
            />
          )}
          {tab === "kariyer" && (
            <CareerPanel
              rankTitleText={rankTitleText}
              reputationText={reputationText}
              earned={earned}
              balance={balance}
              ownedPerks={ownedPerks}
              badges={badges}
              allBadges={allBadges}
              results={results}
              tasksCompleted={tasksCompleted}
              chitchatBonuses={chitchatBonuses}
              investmentResults={investmentResults}
              defeatedRivalIds={defeatedRivalIds}
            />
          )}
          {tab === "davet" && (
            <PremiumInvitesPanel
              premiumHouses={premiumHouses}
              unlockedIds={unlockedPremiumIds}
              premiumResults={premiumResults}
              onOpen={onOpenPremium}
            />
          )}
          {tab === "yatirim" && (
            <InvestmentPanel
              balance={balance}
              investmentHouses={investmentHouses}
              investmentUnlocked={investmentUnlocked}
              ownedInvestmentHouses={ownedInvestmentHouses}
              investmentResults={investmentResults}
              currentNewsModifier={currentNewsModifier}
              onBuyInvestment={onBuyInvestment}
              onSellInvestment={onSellInvestment}
              onRenovate={onRenovate}
              contactedCustomers={contactedCustomers}
              onPitchInvestment={onPitchInvestment}
            />
          )}
          {tab === "teslimler" && (
            <DeliveriesPanel pendingDeliveries={pendingDeliveries} currentDateLabel={currentDateLabel} />
          )}
          {tab === "iliskiler" && (
            <RelationshipsPanel bossMood={bossMood} friendBonds={friendBonds} voiceTally={voiceTally} compassTally={compassTally} />
          )}
          {tab === "arkadaslar" && (
            <FriendHousesPanel
              friendHouses={friendHouses}
              unlockedIds={unlockedFriendHouseIds}
              friendHouseResults={friendHouseResults}
              onOpen={onOpenFriendHouse}
            />
          )}
          {tab === "rehber" && <RehberPanel contacts={contacts} />}
          {tab === "harita" && <CityMapPanel pins={districtPins} />}
          {tab === "beceri" && <SkillTreePanel ownedSkillIds={ownedSkillIds} skillXP={skillXP} onUnlock={onUnlockSkill} />}
        </div>
      </div>
    </div>
  );
}
