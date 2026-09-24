import { useState } from "react";
import { t } from "../data/language";
import type { HouseResult, InboxMessage } from "../types";
import { groupThreads } from "../data/inbox";
import { ChevronLeftIcon } from "./icons";
import { HARD_TIMES_BOND_THRESHOLD } from "../data/relationshipStages";

interface MessagesPanelProps {
  inbox: InboxMessage[];
  results: HouseResult[];
  onRetry: (houseId: string) => void;
  onFollowUp: (houseId: string) => void;
  /** "İlişki Evreleri" — friend id -> a Güven-stage favor is awaiting a reply. See data/relationshipStages.ts. */
  pendingFriendFavors: Record<string, boolean>;
  onFriendFavor: (friendId: string, accepted: boolean) => void;
  /** "Zor Zamanlar" — see data/relationshipStages.ts. */
  friendBondCounts: Record<string, number>;
  hardTimesUsed: Record<string, boolean>;
  emlahStruggling: boolean;
  onAskForHelp: (friendId: string) => void;
}

export default function MessagesPanel({
  inbox,
  results,
  onRetry,
  onFollowUp,
  pendingFriendFavors,
  onFriendFavor,
  friendBondCounts,
  hardTimesUsed,
  emlahStruggling,
  onAskForHelp,
}: MessagesPanelProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const threads = groupThreads(inbox);
  const activeThread = threads.find((thread) => thread.threadId === selected);
  const activeResult = selected ? results.find((r) => r.houseId === selected) : undefined;
  const canRetry = activeResult?.outcome === "lost" && !activeResult.retriedLost;
  const canFollowUp = activeResult?.outcome === "thinking" && !activeResult.followedUpThinking;
  const friendIdFromThread = selected?.startsWith("friend-") ? selected.slice(7) : null;
  const hasPendingFavor = friendIdFromThread ? !!pendingFriendFavors[friendIdFromThread] : false;
  const canAskForHelp =
    !!friendIdFromThread &&
    emlahStruggling &&
    !hardTimesUsed[friendIdFromThread] &&
    (friendBondCounts[friendIdFromThread] ?? 0) >= HARD_TIMES_BOND_THRESHOLD;

  if (!selected) {
    return (
      <div className="thread-list">
        {threads.length === 0 && <p className="menu-empty">{t({ tr: "Henüz mesaj yok.", en: "No messages yet." })}</p>}
        {threads.map((thread) => {
          const result = thread.threadId !== "muzaffer" ? results.find((r) => r.houseId === thread.threadId) : undefined;
          const threadFriendId = thread.threadId.startsWith("friend-") ? thread.threadId.slice(7) : null;
          const replyable =
            (result?.outcome === "lost" && !result.retriedLost) ||
            (result?.outcome === "thinking" && !result.followedUpThinking) ||
            (threadFriendId ? !!pendingFriendFavors[threadFriendId] : false);
          return (
            <button className="thread-row" key={thread.threadId} onClick={() => setSelected(thread.threadId)}>
              <div className="thread-row-info">
                <p className="thread-row-name">{thread.contactName}</p>
                <p className="thread-row-preview">{thread.lastMessage.text}</p>
              </div>
              {replyable && <span className="thread-row-badge">{t({ tr: "Yanıtla", en: "Reply" })}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  if (!activeThread) return null;

  return (
    <div className="thread-detail">
      <button className="thread-back" onClick={() => setSelected(null)}>
        <ChevronLeftIcon size={12} className="icon-inline" /> {t({ tr: "Tüm mesajlar", en: "All messages" })}
      </button>
      <div className="thread-messages">
        {activeThread.messages.map((m) => (
          <div key={m.id} className={`wa-bubble ${m.fromPlayer ? "outgoing" : "incoming"}`}>
            {m.text}
          </div>
        ))}
      </div>
      {canRetry && (
        <button className="pixel-btn small" onClick={() => onRetry(selected)}>
          {t({ tr: "Tekrar Dene", en: "Try Again" })}
        </button>
      )}
      {activeResult?.outcome === "lost" && activeResult.retriedLost && (
        <p className="menu-empty">{t({ tr: "Bu müşteriyle bir daha görüşme şansın kalmadı.", en: "You have no more chances to talk with this customer." })}</p>
      )}
      {canFollowUp && (
        <button className="pixel-btn small" onClick={() => onFollowUp(selected)}>
          {t({ tr: "Takip Mesajı Gönder", en: "Send Follow-Up Message" })}
        </button>
      )}
      {activeResult?.outcome === "thinking" && activeResult.followedUpThinking && (
        <p className="menu-empty">{t({ tr: "Bu müşteriye zaten bir takip mesajı gönderdin.", en: "You already sent a follow-up message to this customer." })}</p>
      )}
      {hasPendingFavor && friendIdFromThread && (
        <div className="favor-choice-row">
          <button className="pixel-btn small" onClick={() => onFriendFavor(friendIdFromThread, true)}>
            {t({ tr: "Yardım Et", en: "Help Out" })}
          </button>
          <button className="pixel-btn small ghost" onClick={() => onFriendFavor(friendIdFromThread, false)}>
            {t({ tr: "Şimdi Olmaz", en: "Not Now" })}
          </button>
        </div>
      )}
      {canAskForHelp && friendIdFromThread && (
        <button className="pixel-btn small" onClick={() => onAskForHelp(friendIdFromThread)}>
          {t({ tr: "Yardım İste", en: "Ask for Help" })}
        </button>
      )}
    </div>
  );
}
