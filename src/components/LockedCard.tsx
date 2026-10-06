import type { ReactNode } from "react";
import { LockIcon } from "./icons";

interface LockedCardProps {
  title: string;
  hint: string;
  /** Opsiyonel ilerleme: çubuk + altında "₺x / ₺y" gibi bir etiket. */
  progress?: { current: number; target: number; label: string };
  icon?: ReactNode;
}

/** S8 / G11 — kilitli ya da henüz boş bölümler: ne açılacak, ne kadar kaldı, nasıl ilerlenir. */
export default function LockedCard({ title, hint, progress, icon }: LockedCardProps) {
  const pct = progress && progress.target > 0 ? Math.min(100, Math.round((progress.current / progress.target) * 100)) : 0;
  return (
    <div className="locked-card">
      <div className="locked-card-head">
        <span className="locked-card-icon">{icon ?? <LockIcon size={16} />}</span>
        <span className="locked-card-title">{title}</span>
      </div>
      <p className="locked-card-hint">{hint}</p>
      {progress && (
        <>
          <div className="locked-card-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <i style={{ width: `${pct}%` }} />
          </div>
          <p className="locked-card-progress">{progress.label}</p>
        </>
      )}
    </div>
  );
}
