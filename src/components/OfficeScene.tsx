import { useEffect, useState } from "react";
import { officeTierForOwnedPerks, peekOfficeImage, loadOfficeImage } from "../data/officeImages";
import { ENERGY_MAX, ENERGY_LOW_THRESHOLD, ENERGY_WORK_MIN_THRESHOLD } from "../data/energy";
import { BOSS_MOOD_MAX, BOSS_MOOD_RAISE_THRESHOLD } from "../data/bossMood";
import { emlahMoodFor, emlahMoodLabel, emlahMoodPortrait } from "../data/emlahMood";
import { rankTitleDisplay } from "../data/scoring";
import { resolveText, t, getLanguage } from "../data/language";
import { dayActivities } from "../data/dayActivities";
import { CupIcon, BoltIcon, TieIcon, ClapperIcon, FolderIcon, MagnifierIcon, MegaphoneIcon, BriefcaseIcon, ClockIcon, TrophyIcon } from "./icons";
import type { ComponentType } from "react";

const activityIcon: Record<string, ComponentType<{ size?: number }>> = {
  research: MagnifierIcon,
  marketing: MegaphoneIcon,
  "office-work": FolderIcon,
  tea: CupIcon,
};
import MemoryWall from "./MemoryWall";
import GameIcon from "./GameIcon";
import type { Badge, PausedVisit, SignificantMemory } from "../types";

interface OfficeSceneProps {
  rankTitleText: string;
  ownedPerks: string[];
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
  onOpenIsler: () => void;
  onOpenEnergyBreak: () => void;
  /** Gizli Dokunuş Menüsü — called on every tap of the office title. See App.tsx's handleOfficeTitleTap. */
  onTitleTap?: () => void;
  badges: string[];
  allBadges: Record<string, Badge>;
  significantMemories: SignificantMemory[];
  /** Yan görevler — "Peşindekiler" kartları (hooks/useSideQuests.ts). */
  sideCards?: { id: string; title: string; subtitle: string; icon: string; onClick: () => void }[];
  /** B4 — gerçek takvim günü şeridi. */
  specialDayBanner?: string | null;
  festive?: boolean;
  /** B5 — gerçek saat 00:00–04:00: ofis kararır. */
  night?: boolean;
}

/**
 * The main hub between houses — Emlah's office, replacing the old
 * always-on phone screen. Its art tier follows what's actually been bought
 * from the "Ofis Ekipmanı" market category (see officeTierForOwnedPerks) —
 * furnishing the office is a direct result of shopping, not just rank.
 * Mesajlar alt çubuktaki Telefon sekmesinden açılır (App.tsx, S1).
 */
export default function OfficeScene({
  rankTitleText,
  ownedPerks,
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
  onOpenIsler,
  onOpenEnergyBreak,
  onTitleTap,
  badges,
  allBadges,
  significantMemories,
  sideCards = [],
  specialDayBanner = null,
  festive = false,
  night = false,
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
  const combinedFilter = `${moodFilter} ${seasonalFilter}${night ? " brightness(0.62) saturate(0.8) hue-rotate(12deg)" : ""}`;
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
            {prestigeTitle && (
              <span className="office-prestige-tag">
                {" "}
                <TrophyIcon size={10} className="icon-inline" /> {prestigeTitle}
              </span>
            )}
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
                {timePart && (
                  <span className="office-calendar-time">
                    <ClockIcon size={8} className="icon-inline" /> {timePart}
                  </span>
                )}
              </div>
            </div>
          );
        })()}
        <MemoryWall badges={badges} allBadges={allBadges} significantMemories={significantMemories} />
      </div>

      {specialDayBanner && (
        <div className={`office-special-day ${festive ? "office-special-day-festive" : ""}`}>
          {festive && <span className="office-garland" aria-hidden />}
          <span>{specialDayBanner}</span>
        </div>
      )}

      {/* S9 — iki durum yan yana, sayılı. */}
      <div className="office-meters">
        <div className={`office-meter ${energy < ENERGY_LOW_THRESHOLD ? "office-meter-low" : ""}`}>
          <span className="office-meter-head">
            <BoltIcon size={12} className="icon-inline" /> {t({ tr: "Enerji", en: "Energy" })}
            <strong className="office-meter-num">{Math.round(energy)}</strong>
          </span>
          <div className="stat-track">
            <div
              className={`stat-fill energy-fill ${energy < ENERGY_LOW_THRESHOLD ? "energy-fill-low" : ""}`}
              style={{ width: `${Math.min(100, (energy / ENERGY_MAX) * 100)}%` }}
            />
          </div>
          {energy < ENERGY_WORK_MIN_THRESHOLD && (
            <button className="pixel-btn small ghost energy-ad-btn" onClick={onOpenEnergyBreak}>
              <ClapperIcon size={12} className="icon-inline" /> {t({ tr: "Enerji Molası", en: "Energy Break" })}
            </button>
          )}
        </div>
        <div className={`office-meter ${bossMood < BOSS_MOOD_RAISE_THRESHOLD ? "office-meter-low" : ""}`}>
          <span className="office-meter-head">
            <TieIcon size={12} className="icon-inline" /> {t({ tr: "Patron", en: "Boss" })}
            <strong className="office-meter-num">{Math.round(bossMood)}</strong>
          </span>
          <div className="stat-track">
            <div
              className={`stat-fill boss-mood-fill ${bossMood < BOSS_MOOD_RAISE_THRESHOLD ? "energy-fill-low" : ""}`}
              style={{ width: `${Math.min(100, (bossMood / BOSS_MOOD_MAX) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {dayAdvanced && (
        <div className="day-activities">
          <p className="office-section-label">{t({ tr: "Bugünün aktiviteleri", en: "Today's activities" })}</p>
          <div className="day-activity-list day-activity-strip">
            {dayActivities.map((a) => {
              const done = dayActivitiesDone.includes(a.id);
              const Icon = activityIcon[a.id] ?? FolderIcon;
              return (
                <button
                  key={a.id}
                  className="day-activity-card"
                  onClick={() => onDoActivity(a.id)}
                  disabled={done}
                >
                  <span className="day-activity-icon"><Icon size={22} /></span>
                  <span className="day-activity-label">{resolveText(a.label)}</span>
                  <span className="day-activity-effect">{resolveText(a.effect)}</span>
                  <span className="day-activity-gain">
                    {done ? t({ tr: "Yapıldı", en: "Done" }) : `-${a.energyCost} ${t({ tr: "Enerji", en: "Energy" })}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sideCards.length > 0 && (
        <div className="office-side">
          <p className="office-section-label">{t({ tr: "Peşindekiler", en: "On your trail" })}</p>
          <div className="office-side-list">
            {sideCards.map((c) => (
              <button key={c.id} className="office-side-card" onClick={c.onClick}>
                <span className="office-side-icon">
                  <GameIcon name={c.icon} size={20} />
                </span>
                <span className="office-side-text">
                  <strong>{c.title}</strong>
                  <span>{c.subtitle}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* S9 — tek birincil eylem altta sabit; İşler yanında ikincil. Mesajlar alt çubukta (Telefon). */}
      <div className="office-actionbar">
        <button
          className={`pixel-btn small ghost office-messages-btn office-isler-btn ${pausedVisit?.status === "office" ? "office-isler-alert" : ""}`}
          onClick={onOpenIsler}
        >
          <BriefcaseIcon size={14} className="icon-inline" /> {t({ tr: "İşler", en: "Jobs" })}
          {pausedVisit?.status === "office" && <span className="office-messages-new">1</span>}
        </button>
        {pausedVisit?.status === "office" ? (
          <button className="pixel-btn office-get-job-btn" onClick={onOpenIsler}>
            {t({ tr: "Bugünün müşterisi İşler'de bekliyor", en: "Today's customer is waiting in Jobs" })}
          </button>
        ) : pausedVisit?.status === "scheduled" ? (
          // Randevu verilmiş müşteri — geri sayım yalnızca "Yeni Güne Geç" ile ilerler, bu yüzden buton burada şart.
          <button className="pixel-btn office-get-job-btn" onClick={onAdvanceDay}>
            {t({
              tr: `Yeni Güne Geç — randevuya ${pausedVisit.daysRemaining ?? 1} gün`,
              en: `Advance to New Day — ${pausedVisit.daysRemaining ?? 1} day(s) to appointment`,
            })}
          </button>
        ) : dayAdvanced && jobAvailable ? (
          <button className="pixel-btn office-get-job-btn" onClick={onGetJob}>
            {t({ tr: "Bugünün İşini Al", en: "Get Today's Job" })}
          </button>
        ) : (
          <button className="pixel-btn office-get-job-btn" onClick={onAdvanceDay}>
            {dayAdvanced
              ? t({ tr: "Müşteri yok — Tekrar Dene", en: "No customer — Try Again" })
              : t({ tr: "Yeni Güne Geç", en: "Advance to New Day" })}
          </button>
        )}
      </div>
    </div>
  );
}
