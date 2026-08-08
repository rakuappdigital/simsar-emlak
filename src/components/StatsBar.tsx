import type { GameStats } from "../types";

const FUN_BONUS_THRESHOLD = 30;

interface StatsBarProps {
  stats: GameStats;
}

function clamp(v: number) {
  return Math.max(0, Math.min(100, v));
}

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

function mixHex(from: string, to: string, t: number) {
  const f = [1, 3, 5].map((i) => parseInt(from.slice(i, i + 2), 16));
  const s = [1, 3, 5].map((i) => parseInt(to.slice(i, i + 2), 16));
  const [r, g, b] = f.map((v, i) => lerp(v, s[i], t));
  return `rgb(${r}, ${g}, ${b})`;
}

/** Green (safe) -> gold (caution) -> red (danger), matching the sale-risk meaning of suspicion. */
function suspicionColor(value: number): string {
  const v = clamp(value);
  if (v <= 40) return mixHex("#06d6a0", "#ffd166", v / 40);
  return mixHex("#ffd166", "#ef476f", (v - 40) / 60);
}

export default function StatsBar({ stats }: StatsBarProps) {
  const funUnlocked = stats.fun >= FUN_BONUS_THRESHOLD;

  return (
    <div className="stats-bar">
      <div className="stat">
        <span className="stat-label">Şüphe</span>
        <div className="stat-track">
          <div
            className="stat-fill suspicion"
            style={{ width: `${clamp(stats.suspicion)}%`, background: suspicionColor(stats.suspicion) }}
          />
        </div>
      </div>
      <div className="stat">
        <span className="stat-label">İlgi</span>
        <div className="stat-track">
          <div className="stat-fill interest" style={{ width: `${clamp(stats.interest)}%` }} />
        </div>
      </div>
      <div className="stat">
        <span className="stat-label">Eğlence</span>
        <div className="stat-track">
          <div
            className={`stat-fill fun ${funUnlocked ? "fun-unlocked" : ""}`}
            style={{ width: `${clamp(stats.fun)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
