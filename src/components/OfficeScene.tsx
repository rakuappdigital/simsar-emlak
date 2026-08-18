import { useEffect, useState } from "react";
import { formatTL } from "../data/economy";
import { officeTierForOwnedPerks, peekOfficeImage, loadOfficeImage } from "../data/officeImages";
import { ENERGY_MAX, ENERGY_LOW_THRESHOLD } from "../data/energy";
import { BOSS_MOOD_MAX, BOSS_MOOD_RAISE_THRESHOLD } from "../data/bossMood";
import { WalletIcon, ChatIcon } from "./icons";

interface OfficeSceneProps {
  rankTitleText: string;
  ownedPerks: string[];
  balance: number;
  unreadCount: number;
  energy: number;
  bossMood: number;
  currentDateLabel: string;
  prestigeTitle?: string | null;
  onGetJob: () => void;
  onOpenMessages: () => void;
}

/**
 * The main hub between houses — Emlah's office, replacing the old
 * always-on phone screen. Its art tier follows what's actually been bought
 * from the "Ofis Ekipmanı" market category (see officeTierForOwnedPerks) —
 * furnishing the office is a direct result of shopping, not just rank.
 * Messaging still exists (see PhoneScreen/MessagesPanel) but is now
 * something the player opts into from here, either to fetch today's job
 * or to browse past threads.
 */
export default function OfficeScene({ rankTitleText, ownedPerks, balance, unreadCount, energy, bossMood, currentDateLabel, prestigeTitle, onGetJob, onOpenMessages }: OfficeSceneProps) {
  const tier = officeTierForOwnedPerks(ownedPerks);
  const [image, setImage] = useState<string | undefined>(() => peekOfficeImage(tier));

  useEffect(() => {
    const cached = peekOfficeImage(tier);
    if (cached) {
      setImage(cached);
      return;
    }
    setImage(undefined);
    let cancelled = false;
    loadOfficeImage(tier)?.then((url) => {
      if (!cancelled) setImage(url);
    });
    return () => {
      cancelled = true;
    };
  }, [tier]);

  return (
    <div className="office-scene">
      <div className="office-stage">
        <div className={`pixel-bg office-bg scene-bg-enter ${image ? "" : `office-bg-tier-${tier}`}`} />
        {image && <div className="pixel-bg-photo" style={{ backgroundImage: `url(${image})` }} />}
        <div className="office-title">
          <span>Emlah'ın Ofisi</span>
          <span className="office-rank-tag">
            {rankTitleText}
            {prestigeTitle && <span className="office-prestige-tag"> 🏆 {prestigeTitle}</span>}
          </span>
        </div>
        <div className="office-date-tag">{currentDateLabel}</div>
      </div>

      <div className="energy-bar">
        <span className="energy-bar-label">
          ⚡ Enerji {energy < ENERGY_LOW_THRESHOLD && <span className="energy-bar-low">(düşük)</span>}
        </span>
        <div className="stat-track">
          <div
            className={`stat-fill energy-fill ${energy < ENERGY_LOW_THRESHOLD ? "energy-fill-low" : ""}`}
            style={{ width: `${Math.min(100, (energy / ENERGY_MAX) * 100)}%` }}
          />
        </div>
      </div>

      <div className="energy-bar">
        <span className="energy-bar-label">
          😊 Patron Memnuniyeti {bossMood < BOSS_MOOD_RAISE_THRESHOLD && <span className="energy-bar-low">(düşük)</span>}
        </span>
        <div className="stat-track">
          <div
            className={`stat-fill boss-mood-fill ${bossMood < BOSS_MOOD_RAISE_THRESHOLD ? "energy-fill-low" : ""}`}
            style={{ width: `${Math.min(100, (bossMood / BOSS_MOOD_MAX) * 100)}%` }}
          />
        </div>
      </div>

      <div className="office-panel">
        <span className="office-balance">
          <WalletIcon size={14} className="icon-inline" /> {formatTL(balance)}
        </span>
        <button className="pixel-btn office-get-job-btn" onClick={onGetJob}>
          Bugünün İşini Al
        </button>
        <button className="pixel-btn small ghost office-messages-btn" onClick={onOpenMessages}>
          <ChatIcon size={14} className="icon-inline" /> Mesajlar
          {unreadCount > 0 && (
            <span className="unread-dot" key={unreadCount}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
