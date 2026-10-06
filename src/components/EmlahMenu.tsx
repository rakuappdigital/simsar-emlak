import { useState } from "react";
import { t } from "../data/language";
import type { ReactNode } from "react";
import type {
  Badge,
  ContactedCustomer,
  HouseResult,
  HouseScene,
  OwnedInvestmentHouse,
  PendingDelivery,
  ToneBucket,
  CompassAxis,
} from "../types";
import { formatTL } from "../data/economy";
import { weekIndexForHouse } from "../data/goals";
import MarketPanel from "./MarketPanel";
import InventoryPanel from "./InventoryPanel";
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
import { WalletIcon, CartIcon, HouseIcon, StarIcon, CloseIcon, CalendarIcon, HeartIcon, BriefcaseIcon, CompassIcon, ChalkboardIcon, KeyRingIcon, ChartUpIcon, PeopleIcon, ContactBookIcon, EnvelopeIcon, IdCardIcon } from "./icons";

export type EmlahTab =
  | "market"
  | "envanter"
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
  jettons: number;
  shieldHousesLeft: number;
  hasRetryCandidate: boolean;
  onBuyInventoryItem: (id: string) => void;
  results: HouseResult[];
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
  friendBondCounts: Record<string, number>;
  friendFavorAccepted: Record<string, boolean>;
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
  /** A1 — haritadaki soru işareti. */
  keyHintDistrict?: string | null;
}

type EmlahSection = "carsi" | "isim" | "insanlar" | "ben";

const tabs: { id: EmlahTab; icon: ReactNode; label: { tr: string; en: string } }[] = [
  { id: "market", icon: <CartIcon size={14} />, label: { tr: "Alışveriş", en: "Shop" } },
  { id: "envanter", icon: <KeyRingIcon size={14} />, label: { tr: "Envanter", en: "Inventory" } },
  { id: "portfoy", icon: <HouseIcon size={14} />, label: { tr: "Portföy", en: "Portfolio" } },
  { id: "teslimler", icon: <CalendarIcon size={14} />, label: { tr: "Bekleyen Teslimler", en: "Pending Deliveries" } },
  { id: "yatirim", icon: <ChartUpIcon size={14} />, label: { tr: "Yatırım Evleri", en: "Investment Properties" } },
  { id: "iliskiler", icon: <HeartIcon size={14} />, label: { tr: "İlişkiler", en: "Relationships" } },
  { id: "arkadaslar", icon: <PeopleIcon size={14} />, label: { tr: "Arkadaşlarım", en: "My Friends" } },
  { id: "rehber", icon: <ContactBookIcon size={14} />, label: { tr: "Rehber", en: "Contacts" } },
  { id: "davet", icon: <EnvelopeIcon size={14} />, label: { tr: "Özel Davetler", en: "Special Invites" } },
  { id: "kariyer", icon: <StarIcon size={14} />, label: { tr: "Kariyer", en: "Career" } },
  { id: "beceri", icon: <ChalkboardIcon size={14} />, label: { tr: "Beceriler", en: "Skills" } },
  { id: "harita", icon: <CompassIcon size={14} />, label: { tr: "Şehir Haritası", en: "City Map" } },
];

/** G2 — 12 sekme dört bölümde: üstte sabit 4'lü bölüm seçici, altında o bölümün sekmeleri. */
const sections: { id: EmlahSection; icon: ReactNode; label: { tr: string; en: string }; tabs: EmlahTab[] }[] = [
  { id: "carsi", icon: <CartIcon size={16} />, label: { tr: "Çarşı", en: "Bazaar" }, tabs: ["market", "envanter"] },
  { id: "isim", icon: <BriefcaseIcon size={16} />, label: { tr: "İşim", en: "My Work" }, tabs: ["portfoy", "teslimler", "yatirim"] },
  { id: "insanlar", icon: <PeopleIcon size={16} />, label: { tr: "İnsanlar", en: "People" }, tabs: ["iliskiler", "arkadaslar", "rehber", "davet"] },
  { id: "ben", icon: <IdCardIcon size={16} />, label: { tr: "Ben", en: "Me" }, tabs: ["kariyer", "beceri", "harita"] },
];

function sectionOf(tab: EmlahTab): EmlahSection {
  return sections.find((sec) => sec.tabs.includes(tab))?.id ?? "carsi";
}

export default function EmlahMenu({
  initialTab,
  balance,
  ownedPerks,
  consumables,
  unlockedTiers,
  onBuy,
  jettons,
  shieldHousesLeft,
  hasRetryCandidate,
  onBuyInventoryItem,
  results,
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
  friendBondCounts,
  friendFavorAccepted,
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
  keyHintDistrict = null,
}: EmlahMenuProps) {
  const [tab, setTab] = useState<EmlahTab>(initialTab);
  const currentSection = sectionOf(tab);
  const sectionTabs = tabs.filter((tb) => sections.find((sec) => sec.id === currentSection)!.tabs.includes(tb.id));

  return (
    <div className="modal-overlay">
      <div className="market-modal emlah-menu">
        <div className="market-header">
          <h2 className="market-title">Emlah</h2>
          <span className="market-balance">
            <WalletIcon size={14} className="icon-inline" /> {formatTL(balance)}
          </span>
          <button className="market-close" onClick={onClose} aria-label={t({ tr: "Kapat", en: "Close" })}>
            <CloseIcon size={12} />
          </button>
        </div>

        <div className="emlah-sections" role="tablist">
          {sections.map((sec) => (
            <button
              key={sec.id}
              role="tab"
              aria-selected={currentSection === sec.id}
              className={`emlah-section-btn ${currentSection === sec.id ? "active" : ""}`}
              data-tabs={`|${sec.tabs.map((id) => { const d = tabs.find((x) => x.id === id)!; return `${d.label.tr}|${d.label.en}`; }).join("|")}|`}
              onClick={() => setTab(sec.tabs[0])}
            >
              {sec.icon}
              <span>{t(sec.label)}</span>
            </button>
          ))}
        </div>

        {sectionTabs.length > 1 && (
          <div className="emlah-tabs">
            {sectionTabs.map((tabDef) => (
              <button
                key={tabDef.id}
                className={`emlah-tab-btn ${tab === tabDef.id ? "active" : ""}`}
                onClick={() => setTab(tabDef.id)}
              >
                {tabDef.icon}
                <span>{t(tabDef.label)}</span>
              </button>
            ))}
          </div>
        )}

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
          {tab === "envanter" && (
            <InventoryPanel
              balance={balance}
              jettons={jettons}
              shieldHousesLeft={shieldHousesLeft}
              hasRetryCandidate={hasRetryCandidate}
              onBuy={onBuyInventoryItem}
            />
          )}
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
              earned={earned}
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
              earned={earned}
            />
          )}
          {tab === "teslimler" && (
            <DeliveriesPanel pendingDeliveries={pendingDeliveries} currentDateLabel={currentDateLabel} />
          )}
          {tab === "iliskiler" && (
            <RelationshipsPanel
              bossMood={bossMood}
              friendBonds={friendBonds}
              friendBondCounts={friendBondCounts}
              friendFavorAccepted={friendFavorAccepted}
              voiceTally={voiceTally}
              compassTally={compassTally}
            />
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
          {tab === "harita" && <CityMapPanel pins={districtPins} hintDistrict={keyHintDistrict} />}
          {tab === "beceri" && <SkillTreePanel ownedSkillIds={ownedSkillIds} skillXP={skillXP} onUnlock={onUnlockSkill} />}
        </div>
      </div>
    </div>
  );
}
