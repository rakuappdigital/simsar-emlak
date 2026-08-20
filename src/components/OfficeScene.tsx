import { useEffect, useState } from "react";
import { formatTL } from "../data/economy";
import { officeTierForOwnedPerks, peekOfficeImage, loadOfficeImage } from "../data/officeImages";
import { ENERGY_MAX, ENERGY_LOW_THRESHOLD } from "../data/energy";
import { BOSS_MOOD_MAX, BOSS_MOOD_RAISE_THRESHOLD } from "../data/bossMood";
import { WalletIcon, ChatIcon } from "./icons";
import MemoryWall from "./MemoryWall";
import type { Badge, SignificantMemory } from "../types";

interface OfficeSceneProps {
  rankTitleText: string;
  ownedPerks: string[];
  balance: number;
  unreadCount: number;
  energy: number;
  bossMood: number;
  currentDateLabel: string;
  /** Takvime Bağlı Mevsimsel Ton — a CSS filter fragment from data/seasonalTint.ts, combined with the mood filter below. */
  seasonalFilter: string;
  prestigeTitle?: string | null;
  onGetJob: () => void;
  onOpenMessages: () => void;
  /** Gizli Dokunuş Menüsü — called on every tap of the office title. See App.tsx's handleOfficeTitleTap. */
  onTitleTap?: () => void;
  badges: string[];
  allBadges: Record<string, Badge>;
  significantMemories: SignificantMemory[];
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
export default function OfficeScene({
  rankTitleText,
  ownedPerks,
  balance,
  unreadCount,
  energy,
  bossMood,
  currentDateLabel,
  seasonalFilter,
  prestigeTitle,
  onGetJob,
  onOpenMessages,
  onTitleTap,
  badges,
  allBadges,
  significantMemories,
}: OfficeSceneProps) {
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

  // Patron Memnuniyeti'nin ofis ışığına yansıması — a purely cosmetic filter
  // tying the invisible bossMood number to something felt: cold/dim when
  // he's unhappy, warm/bright when he's pleased. Continuous interpolation,
  // no discrete "low/high" jump.
  const moodT = Math.max(0, Math.min(1, bossMood / 100));
  const moodFilter = `brightness(${(0.72 + moodT * 0.43).toFixed(2)}) saturate(${(0.6 + moodT * 0.6).toFixed(2)}) hue-rotate(${(-8 + moodT * 8).toFixed(1)}deg)`;
  // CSS only takes one `filter` value per element, so the mood tint and the
  // seasonal tint are combined into a single string here.
  const combinedFilter = `${moodFilter} ${seasonalFilter}`;

  return (
    <div className="office-scene">
      <div className="office-stage">
        <div
          className={`pixel-bg office-bg scene-bg-enter ${image ? "" : `office-bg-tier-${tier}`}`}
          style={{ filter: combinedFilter }}
        />
        {image && <div className="pixel-bg-photo" style={{ backgroundImage: `url(${image})`, filter: combinedFilter }} />}
        <div className="office-title" onClick={onTitleTap}>
          <span>Emlah'ın Ofisi</span>
          <span className="office-rank-tag">
            {rankTitleText}
            {prestigeTitle && <span className="office-prestige-tag"> 🏆 {prestigeTitle}</span>}
          </span>
        </div>
        <div className="office-date-tag">
          <span key={currentDateLabel} className="office-date-tag-inner">
            {currentDateLabel}
          </span>
        </div>
        <MemoryWall badges={badges} allBadges={allBadges} significantMemories={significantMemories} />
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
