import { useState } from "react";
import { energyBreakActivities } from "../data/energyBreak";
import { miniGameByActivityId, type MiniGameTier } from "./EnergyMiniGames";

interface EnergyBreakScreenProps {
  energy: number;
  onChoose: (activityId: string, tier: MiniGameTier) => void;
  onClose: () => void;
}

/**
 * Shown when energy is too low to take on today's job. Mini oyunlar are the
 * only recovery path — always available, no real-time cooldown, purely
 * skill-gated (see EnergyMiniGames.tsx). No ads, no purchases: the game is
 * paid up front, so there's nothing to gate behind a wait timer — the only
 * cost is the player's actual attention for a few seconds per play.
 */
export default function EnergyBreakScreen({ energy, onChoose, onClose }: EnergyBreakScreenProps) {
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const ActiveMiniGame = activeActivityId ? miniGameByActivityId[activeActivityId] : null;

  if (ActiveMiniGame && activeActivityId) {
    return (
      <div className="modal-overlay">
        <div className="market-modal energy-break-modal">
          <ActiveMiniGame
            onComplete={(tier) => {
              onChoose(activeActivityId, tier);
              setActiveActivityId(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="market-modal energy-break-modal">
        <div className="market-header">
          <h2 className="market-title">Enerji Molası</h2>
          <button className="market-close" onClick={onClose} aria-label="Kapat">
            ×
          </button>
        </div>
        <p className="menu-empty">
          Emlah bugün çok yorgun (%{Math.round(energy)} enerji) — bir işe girişmeden önce biraz toparlanması lazım.
        </p>

        <p className="market-category-title">🎮 Mini Oyunlar</p>
        <div className="energy-break-list">
          {energyBreakActivities.map((a) => (
            <button key={a.id} className="energy-break-card" onClick={() => setActiveActivityId(a.id)}>
              <span className="energy-break-icon">{a.icon}</span>
              <span className="energy-break-label">{a.label}</span>
              <span className="energy-break-gain">en fazla +{a.energyGain} Enerji</span>
            </button>
          ))}
        </div>
        <p className="rehber-note">Yeterince toparlanınca "Kapat" ile devam edebilirsin.</p>
      </div>
    </div>
  );
}
