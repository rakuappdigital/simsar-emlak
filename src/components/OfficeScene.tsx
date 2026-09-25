import { useEffect, useState } from "react";
import { formatTL } from "../data/economy";
import { officeTierForOwnedPerks, peekOfficeImage, loadOfficeImage } from "../data/officeImages";
import { ENERGY_MAX, ENERGY_LOW_THRESHOLD, ENERGY_WORK_MIN_THRESHOLD } from "../data/energy";
import { BOSS_MOOD_MAX, BOSS_MOOD_RAISE_THRESHOLD } from "../data/bossMood";
import { emlahMoodFor, emlahMoodLabel, emlahMoodPortrait } from "../data/emlahMood";
import { rankTitleDisplay } from "../data/scoring";
import { resolveText, t, getLanguage } from "../data/language";
import { dayActivities } from "../data/dayActivities";
import { WalletIcon, PhoneDeviceIcon } from "./icons";
import MemoryWall from "./MemoryWall";
import type { Badge, PausedVisit, SignificantMemory } from "../types";

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
  dayAdvanced: boolean;
  /** Whether today's job roll succeeded (see App.tsx's handleAdvanceDay) — only meaningful once dayAdvanced is true. */
  jobAvailable: boolean;
  /** Today's job, deferred via "Ofise Dön" instead of toured right away — see İşler. */
  pausedVisit: PausedVisit | null;
  dayActivitiesDone: string[];
  onAdvanceDay: () => void;
  onDoActivity: (activityId: string) => void;
  onGetJob: () => void;
  onOpenMessages: () => void;
  onOpenIsler: () => void;
  onOpenEnergyBreak: () => void;
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
  dayAdvanced,
  jobAvailable,
  pausedVisit,
  dayActivitiesDone,
  onAdvanceDay,
  onDoActivity,
  onGetJob,
  onOpenMessages,
  onOpenIsler,
  onOpenEnergyBreak,
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
  const emlahMood = emlahMoodFor(energy, bossMood);

  return (
    <div className="office-scene">
      <div className="office-stage">
        <div
          className={`pixel-bg office-bg scene-bg-enter ${image ? "" : `office-bg-tier-${tier}`}`}
          style={{ filter: combinedFilter }}
        />
        {image && <div className="pixel-bg-photo" style={{ backgroundImage: `url(${image})`, filter: combinedFilter }} />}
        <div className="office-title" onClick={onTitleTap}>
          <span>{t({ tr: "Emlah'ın Ofisi", en: "Estetan's Office" })}</span>
          <span className="office-rank-tag">
            {rankTitleDisplay(rankTitleText)}
            {prestigeTitle && <span className="office-prestige-tag"> 🏆 {prestigeTitle}</span>}
          </span>
        </div>
        <div
          className="emlah-mood-portrait"
          title={t({
            tr: `Emlah şu an ${resolveText(emlahMoodLabel[emlahMood])}`,
            en: `Estetan is currently ${resolveText(emlahMoodLabel[emlahMood])}`,
          })}
        >
          <img className="emlah-mood-portrait-img" src={emlahMoodPortrait[emlahMood]} alt={t({ tr: "Emlah", en: "Estetan" })} />
        </div>
        {(() => {
          const [datePart, timePart] = currentDateLabel.split(" • ");
          const [day, month, year] = (datePart ?? currentDateLabel).split(" ");
          return (
            <div className="office-calendar" key={currentDateLabel} title={currentDateLabel}>
              <div className="office-calendar-rings">
                <span />
                <span />
              </div>
              <div className="office-calendar-header">
                {month ? month.slice(0, 3).toLocaleUpperCase(getLanguage() === "en" ? "en-US" : "tr-TR") : ""}
              </div>
              <div className="office-calendar-day">{day}</div>
              <div className="office-calendar-footer">
                {year && <span className="office-calendar-year">{year}</span>}
                {timePart && <span className="office-calendar-time">🕐 {timePart}</span>}
              </div>
            </div>
          );
        })()}
        <MemoryWall badges={badges} allBadges={allBadges} significantMemories={significantMemories} />
      </div>

      <div className="energy-bar">
        <span className="energy-bar-label">
          ⚡ {t({ tr: "Enerji", en: "Energy" })}{" "}
          {energy < ENERGY_LOW_THRESHOLD && <span className="energy-bar-low">({t({ tr: "düşük", en: "low" })})</span>}
        </span>
        <div className="stat-track">
          <div
            className={`stat-fill energy-fill ${energy < ENERGY_LOW_THRESHOLD ? "energy-fill-low" : ""}`}
            style={{ width: `${Math.min(100, (energy / ENERGY_MAX) * 100)}%` }}
          />
        </div>
        {energy < ENERGY_WORK_MIN_THRESHOLD && (
          <button className="pixel-btn small energy-ad-btn" onClick={onOpenEnergyBreak}>
            🎬 {t({ tr: "Enerji Molası", en: "Energy Break" })}
          </button>
        )}
      </div>

      <div className="energy-bar">
        <span className="energy-bar-label">
          😊 {t({ tr: "Patron Memnuniyeti", en: "Boss Mood" })}{" "}
          {bossMood < BOSS_MOOD_RAISE_THRESHOLD && <span className="energy-bar-low">({t({ tr: "düşük", en: "low" })})</span>}
        </span>
        <div className="stat-track">
          <div
            className={`stat-fill boss-mood-fill ${bossMood < BOSS_MOOD_RAISE_THRESHOLD ? "energy-fill-low" : ""}`}
            style={{ width: `${Math.min(100, (bossMood / BOSS_MOOD_MAX) * 100)}%` }}
          />
        </div>
      </div>

      {dayAdvanced && (
        <div className="day-activities">
          <p className="market-category-title">📋 {t({ tr: "Bugünün Aktiviteleri", en: "Today's Activities" })}</p>
          <div className="day-activity-list">
            {dayActivities.map((a) => {
              const done = dayActivitiesDone.includes(a.id);
              return (
                <button
                  key={a.id}
                  className="day-activity-card"
                  onClick={() => onDoActivity(a.id)}
                  disabled={done}
                >
                  <span className="day-activity-icon">{a.icon}</span>
                  <span className="day-activity-label">{resolveText(a.label)}</span>
                  <span className="day-activity-gain">{done ? "✅" : `-${a.energyCost} ${t({ tr: "Enerji", en: "Energy" })}`}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="office-panel">
        <span className="office-balance">
          <WalletIcon size={14} className="icon-inline" /> {formatTL(balance)}
        </span>
        {pausedVisit ? (
          <button className="pixel-btn office-get-job-btn ghost" onClick={onOpenIsler}>
            {pausedVisit.status === "office"
              ? t({ tr: "Bugünün müşterisi İşler'de bekliyor", en: "Today's customer is waiting in Jobs" })
              : t({ tr: "Bugünün müşterisi yanıt bekliyor — İşler'e bak", en: "Today's customer is thinking it over — check Jobs" })}
          </button>
        ) : dayAdvanced && jobAvailable ? (
          <button className="pixel-btn office-get-job-btn" onClick={onGetJob}>
            {t({ tr: "Bugünün İşini Al", en: "Get Today's Job" })}
          </button>
        ) : (
          <button className="pixel-btn office-get-job-btn" onClick={onAdvanceDay}>
            📅{" "}
            {dayAdvanced
              ? t({ tr: "Müşteri yok — Tekrar Dene", en: "No customer — Try Again" })
              : t({ tr: "Yeni Güne Geç", en: "Advance to New Day" })}
          </button>
        )}
        <button
          className={`pixel-btn small office-messages-btn ${unreadCount > 0 ? "office-messages-btn-alert" : "ghost"}`}
          onClick={onOpenMessages}
        >
          <PhoneDeviceIcon size={16} className="icon-inline office-messages-icon" /> {t({ tr: "Mesajlar", en: "Messages" })}
          {unreadCount > 0 && (
            <span className="unread-dot" key={unreadCount}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
        <button
          className={`pixel-btn small office-messages-btn ${pausedVisit?.status === "office" ? "office-messages-btn-alert" : "ghost"}`}
          onClick={onOpenIsler}
        >
          {t({ tr: "İşler", en: "Jobs" })}
          {pausedVisit?.status === "office" && <span className="unread-dot">1</span>}
        </button>
      </div>
    </div>
  );
}
