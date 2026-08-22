import { useEffect, useState } from "react";
import { energyBreakActivities } from "../data/energyBreak";
import { MINIGAME_MAX_PLAYS } from "../data/energy";
import { miniGameByActivityId, type MiniGameTier } from "./EnergyMiniGames";

interface EnergyBreakScreenProps {
  energy: number;
  /** Already resolved against the real-time cooldown — see App.tsx's effectiveMinigamePlaysRemaining() call. */
  playsRemaining: number;
  /** Real wall-clock timestamp the plays next refill to MINIGAME_MAX_PLAYS, only meaningful while playsRemaining is 0. */
  nextAvailableAt: number;
  onChoose: (activityId: string, tier: MiniGameTier) => void;
  onClose: () => void;
}

function formatCountdown(ms: number): string {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60000));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h > 0) return `${h} sa ${m} dk`;
  return `${m} dk`;
}

/** Shown when energy is too low to take on today's job — three recovery paths: mini oyunlar (real skill-based games, see EnergyMiniGames.tsx), reklam izleme and satın alma (placeholders, wired later). */
export default function EnergyBreakScreen({ energy, playsRemaining, nextAvailableAt, onChoose, onClose }: EnergyBreakScreenProps) {
  const [now, setNow] = useState(() => Date.now());
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  useEffect(() => {
    if (playsRemaining > 0) return;
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(t);
  }, [playsRemaining]);

  const locked = playsRemaining <= 0;
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

        <p className="market-category-title">
          🎮 Mini Oyunlar {!locked && <span className="energy-break-plays">({playsRemaining}/{MINIGAME_MAX_PLAYS} hak)</span>}
        </p>
        {locked ? (
          <p className="rehber-note">Mini oyun hakların bitti — {formatCountdown(nextAvailableAt - now)} sonra yenilenecek.</p>
        ) : (
          <div className="energy-break-list">
            {energyBreakActivities.map((a) => (
              <button key={a.id} className="energy-break-card" onClick={() => setActiveActivityId(a.id)}>
                <span className="energy-break-icon">{a.icon}</span>
                <span className="energy-break-label">{a.label}</span>
                <span className="energy-break-gain">en fazla +{a.energyGain} Enerji</span>
              </button>
            ))}
          </div>
        )}

        <p className="market-category-title">Diğer Yollar</p>
        <div className="energy-break-other-list">
          <button className="energy-break-other-btn" disabled title="Yakında aktif olacak">
            <span>📺 Reklam İzle</span>
            <span className="energy-break-soon">Yakında</span>
          </button>
          <button className="energy-break-other-btn" disabled title="Yakında aktif olacak">
            <span>💳 Enerji Satın Al</span>
            <span className="energy-break-soon">Yakında</span>
          </button>
        </div>
      </div>
    </div>
  );
}
