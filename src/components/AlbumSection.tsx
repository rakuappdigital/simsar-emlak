import { useMemo } from "react";
import { albumEntries, getAlbumSeen, ALBUM_REWARDS } from "../data/album";
import { resolveText, t } from "../data/language";
import { LockIcon, StarIcon } from "./icons";

/** B1 — Tuhaf Anlar Albümü: Kariyer sekmesinin altında, oyunlar arası kalıcı. */
export default function AlbumSection() {
  const seen = useMemo(() => getAlbumSeen(), []);
  const total = albumEntries.length;
  const nextReward = ALBUM_REWARDS.find((r) => (r.at === "all" ? seen.length < total : seen.length < r.at));
  return (
    <div className="album">
      <p className="settings-subsection-title">
        {t({ tr: "Tuhaf Anlar Albümü", en: "Album of Odd Moments" })} · {seen.length}/{total}
      </p>
      {nextReward && (
        <p className="album-reward">
          {t({
            tr: `${nextReward.at === "all" ? "Tamamı" : `${nextReward.at} kart`} için +${nextReward.jettons} Jetton`,
            en: `+${nextReward.jettons} Jetton at ${nextReward.at === "all" ? "all cards" : `${nextReward.at} cards`}`,
          })}
        </p>
      )}
      <div className="album-grid">
        {albumEntries.map((e) => {
          const open = seen.includes(e.id);
          return (
            <div key={e.id} className={`album-card ${open ? "album-card-open" : ""}`}>
              <span className="album-card-icon">{open ? <StarIcon size={14} /> : <LockIcon size={14} />}</span>
              <span className="album-card-title">{open ? resolveText(e.title) : "???"}</span>
              {!open && <span className="album-card-hint">{resolveText(e.hint)}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
