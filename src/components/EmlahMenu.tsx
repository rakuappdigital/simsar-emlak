import { useState } from "react";
import type { Badge, HouseResult, HouseScene, InboxMessage } from "../types";
import { formatTL } from "../data/economy";
import MarketPanel from "./MarketPanel";
import MessagesPanel from "./MessagesPanel";
import PortfolioPanel from "./PortfolioPanel";
import CareerPanel from "./CareerPanel";

export type EmlahTab = "market" | "mesajlar" | "portfoy" | "kariyer";

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
  onClose: () => void;
}

const tabs: { id: EmlahTab; label: string }[] = [
  { id: "market", label: "🛒 Market" },
  { id: "mesajlar", label: "💬 Mesajlar" },
  { id: "portfoy", label: "🏠 Portföy" },
  { id: "kariyer", label: "⭐ Kariyer" },
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
  onClose,
}: EmlahMenuProps) {
  const [tab, setTab] = useState<EmlahTab>(initialTab);

  return (
    <div className="modal-overlay">
      <div className="market-modal emlah-menu">
        <div className="market-header">
          <h2 className="market-title">Emlah</h2>
          <span className="market-balance">💰 {formatTL(balance)}</span>
          <button className="market-close" onClick={onClose} aria-label="Kapat">
            ✕
          </button>
        </div>

        <div className="emlah-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`emlah-tab-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
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
            />
          )}
        </div>
      </div>
    </div>
  );
}
