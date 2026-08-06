import type { GameStats } from "../types";

interface StatsBarProps {
  stats: GameStats;
}

function clamp(v: number) {
  return Math.max(0, Math.min(100, v));
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="stats-bar">
      <div className="stat">
        <span className="stat-label">Şüphe</span>
        <div className="stat-track">
          <div className="stat-fill suspicion" style={{ width: `${clamp(stats.suspicion)}%` }} />
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
          <div className="stat-fill fun" style={{ width: `${clamp(stats.fun)}%` }} />
        </div>
      </div>
    </div>
  );
}
