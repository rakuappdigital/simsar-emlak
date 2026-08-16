import { useEffect, useState } from "react";
import { formatTL } from "../data/economy";
import { officeTierForRank, peekOfficeImage, loadOfficeImage } from "../data/officeImages";
import { WalletIcon, ChatIcon } from "./icons";

interface OfficeSceneProps {
  rankTitleText: string;
  balance: number;
  unreadCount: number;
  onGetJob: () => void;
  onOpenMessages: () => void;
}

/**
 * The main hub between houses — Emlah's office, replacing the old
 * always-on phone screen. Its art tier follows career rank (see
 * officeTierForRank), the same rank already tracked everywhere else, so it
 * upgrades automatically as the player progresses — no new state needed.
 * Messaging still exists (see PhoneScreen/MessagesPanel) but is now
 * something the player opts into from here, either to fetch today's job
 * or to browse past threads.
 */
export default function OfficeScene({ rankTitleText, balance, unreadCount, onGetJob, onOpenMessages }: OfficeSceneProps) {
  const tier = officeTierForRank(rankTitleText);
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
          <span className="office-rank-tag">{rankTitleText}</span>
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
