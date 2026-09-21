import { useState } from "react";
import { energyBreakActivities } from "../data/energyBreak";
import { resolveText } from "../data/language";
import { showRewardedAd } from "../data/ads";
import { AD_ENERGY_REWARD } from "../data/energy";
import { JETTON_ENERGY_REFILL_COST, JETTON_ENERGY_REFILL_AMOUNT } from "../data/jettons";
import { miniGameByActivityId, type MiniGameTier } from "./EnergyMiniGames";
import { getPlaysRemaining, getNextAvailableAt } from "../data/minigameSchedule";
import { playReward, playThinking, playLost } from "../data/sound";

interface EnergyBreakScreenProps {
  energy: number;
  jettons: number;
  onChoose: (activityId: string, tier: MiniGameTier) => void;
  onWatchAd: () => void;
  onSpendJettons: () => void;
  onClose: () => void;
}

/**
 * Shown when energy is too low to take on today's job. Mini oyunlar are the
 * only recovery path — always available, no real-time cooldown, purely
 * skill-gated (see EnergyMiniGames.tsx). No ads, no purchases: the game is
 * paid up front, so there's nothing to gate behind a wait timer — the only
 * cost is the player's actual attention for a few seconds per play.
 */
function formatLockedIn(nextAvailableAt: number): string {
  const ms = Math.max(0, nextAvailableAt - Date.now());
  const totalMinutes = Math.round(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes} dk sonra`;
  return `${hours} sa ${minutes} dk sonra`;
}

export default function EnergyBreakScreen({ energy, jettons, onChoose, onWatchAd, onSpendJettons, onClose }: EnergyBreakScreenProps) {
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const [watchingAd, setWatchingAd] = useState(false);
  // minigameSchedule reads localStorage directly (not React state) — bump this after every play to force a re-render.
  const [scheduleTick, setScheduleTick] = useState(0);
  const ActiveMiniGame = activeActivityId ? miniGameByActivityId[activeActivityId] : null;

  async function handleWatchAd() {
    setWatchingAd(true);
    const rewarded = await showRewardedAd();
    setWatchingAd(false);
    if (rewarded) onWatchAd();
  }

  if (ActiveMiniGame && activeActivityId) {
    return (
      <div className="modal-overlay">
        <div className="market-modal energy-break-modal">
          <ActiveMiniGame
            onComplete={(tier) => {
              if (tier === "great") playReward();
              else if (tier === "ok") playThinking();
              else playLost();
              onChoose(activeActivityId, tier);
              setActiveActivityId(null);
              setScheduleTick((t) => t + 1);
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

        <p className="market-category-title">🎬 Reklam / 🪙 Jetton</p>
        <div className="energy-break-list">
          <button className="energy-break-card" onClick={handleWatchAd} disabled={watchingAd}>
            <span className="energy-break-icon">🎬</span>
            <span className="energy-break-label">{watchingAd ? "Reklam oynatılıyor…" : "Reklam İzle"}</span>
            <span className="energy-break-gain">+{AD_ENERGY_REWARD} Enerji</span>
          </button>
          <button className="energy-break-card" onClick={onSpendJettons} disabled={jettons < JETTON_ENERGY_REFILL_COST}>
            <span className="energy-break-icon">🪙</span>
            <span className="energy-break-label">Jetton Kullan ({jettons})</span>
            <span className="energy-break-gain">
              -{JETTON_ENERGY_REFILL_COST} Jetton → +{JETTON_ENERGY_REFILL_AMOUNT} Enerji
            </span>
          </button>
        </div>

        <p className="market-category-title">🎮 Mini Oyunlar</p>
        <div className="energy-break-list" key={scheduleTick}>
          {energyBreakActivities.map((a) => {
            const remaining = getPlaysRemaining(a.id);
            const locked = remaining <= 0;
            const nextAvailableAt = locked ? getNextAvailableAt(a.id) : null;
            return (
              <button
                key={a.id}
                className="energy-break-card"
                onClick={() => !locked && setActiveActivityId(a.id)}
                disabled={locked}
              >
                <span className="energy-break-icon">{a.icon}</span>
                <span className="energy-break-label">{resolveText(a.label)}</span>
                <span className="energy-break-gain">
                  {locked
                    ? `Kilitli — ${nextAvailableAt ? formatLockedIn(nextAvailableAt) : ""}`
                    : `en fazla +${a.energyGain} Enerji · ${remaining} hak kaldı`}
                </span>
              </button>
            );
          })}
        </div>
        <p className="rehber-note">Yeterince toparlanınca "Kapat" ile devam edebilirsin.</p>
      </div>
    </div>
  );
}
