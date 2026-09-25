import { useState } from "react";
import { energyBreakActivities } from "../data/energyBreak";
import { resolveText, t } from "../data/language";
import { showRewardedAd } from "../data/ads";
import { canWatchRewardedAd, consumeAdCharge } from "../data/adCharges";
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
 * Shown when energy is too low to take on today's job. Mini oyunlar are
 * always available, no real-time cooldown, purely skill-gated (see
 * EnergyMiniGames.tsx). The rewarded ad is separately gated by a hidden
 * charge system (see data/adCharges.ts) so it can't fully replace Jetton/
 * Tam Sürüm as a free unlimited energy source.
 */
function formatLockedIn(nextAvailableAt: number): string {
  const ms = Math.max(0, nextAvailableAt - Date.now());
  const totalMinutes = Math.round(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return t({ tr: `${minutes} dk sonra`, en: `in ${minutes} min` });
  return t({ tr: `${hours} sa ${minutes} dk sonra`, en: `in ${hours}h ${minutes}m` });
}

export default function EnergyBreakScreen({ energy, jettons, onChoose, onWatchAd, onSpendJettons, onClose }: EnergyBreakScreenProps) {
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const [watchingAd, setWatchingAd] = useState(false);
  const [adFailed, setAdFailed] = useState(false);
  // Deliberately just a boolean — see data/adCharges.ts for why the exact
  // count/reset time is never surfaced to the player.
  const [adAvailable, setAdAvailable] = useState(canWatchRewardedAd);
  // minigameSchedule reads localStorage directly (not React state) — bump this after every play to force a re-render.
  const [scheduleTick, setScheduleTick] = useState(0);
  const ActiveMiniGame = activeActivityId ? miniGameByActivityId[activeActivityId] : null;

  async function handleWatchAd() {
    if (!adAvailable) return;
    setWatchingAd(true);
    setAdFailed(false);
    const rewarded = await showRewardedAd();
    setWatchingAd(false);
    if (rewarded) {
      consumeAdCharge();
      setAdAvailable(canWatchRewardedAd());
      onWatchAd();
    } else {
      setAdFailed(true);
    }
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
          <h2 className="market-title">{t({ tr: "Enerji Molası", en: "Energy Break" })}</h2>
          <button className="market-close" onClick={onClose} aria-label={t({ tr: "Kapat", en: "Close" })}>
            ×
          </button>
        </div>
        <p className="menu-empty">
          {t({
            tr: `Emlah bugün çok yorgun (%${Math.round(energy)} enerji) — bir işe girişmeden önce biraz toparlanması lazım.`,
            en: `Estetan is very tired today (${Math.round(energy)}% energy) — he needs to recover a bit before taking on a job.`,
          })}
        </p>

        <p className="market-category-title">🎬 {t({ tr: "Reklam", en: "Ad" })} / 🪙 {t({ tr: "Jetton", en: "Token" })}</p>
        <div className="energy-break-list">
          <button className="energy-break-card" onClick={handleWatchAd} disabled={watchingAd || !adAvailable}>
            <span className="energy-break-icon">🎬</span>
            <span className="energy-break-label">
              {watchingAd
                ? t({ tr: "Reklam oynatılıyor…", en: "Playing ad…" })
                : adAvailable
                  ? t({ tr: "Reklam İzle", en: "Watch Ad" })
                  : t({ tr: "Reklam Şu An Yok", en: "No Ad Right Now" })}
            </span>
            <span className="energy-break-gain">
              +{AD_ENERGY_REWARD} {t({ tr: "Enerji", en: "Energy" })}
            </span>
          </button>
          <button className="energy-break-card" onClick={onSpendJettons} disabled={jettons < JETTON_ENERGY_REFILL_COST}>
            <span className="energy-break-icon">🪙</span>
            <span className="energy-break-label">
              {t({ tr: "Jetton Kullan", en: "Use Tokens" })} ({jettons})
            </span>
            <span className="energy-break-gain">
              -{JETTON_ENERGY_REFILL_COST} {t({ tr: "Jetton", en: "Tokens" })} → +{JETTON_ENERGY_REFILL_AMOUNT}{" "}
              {t({ tr: "Enerji", en: "Energy" })}
            </span>
          </button>
        </div>
        {adFailed && (
          <p className="rehber-note">
            {t({
              tr: "Reklam şu an yüklenemedi — birazdan tekrar dene.",
              en: "The ad couldn't load right now — try again shortly.",
            })}
          </p>
        )}

        <p className="market-category-title">🎮 {t({ tr: "Mini Oyunlar", en: "Mini Games" })}</p>
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
                    ? `${t({ tr: "Kilitli", en: "Locked" })} — ${nextAvailableAt ? formatLockedIn(nextAvailableAt) : ""}`
                    : t({
                        tr: `en fazla +${a.energyGain} Enerji · ${remaining} hak kaldı`,
                        en: `up to +${a.energyGain} Energy · ${remaining} left`,
                      })}
                </span>
              </button>
            );
          })}
        </div>
        <p className="rehber-note">
          {t({ tr: 'Yeterince toparlanınca "Kapat" ile devam edebilirsin.', en: 'Once you\'ve recovered enough, tap "Close" to continue.' })}
        </p>
      </div>
    </div>
  );
}
