import { useState } from "react";
import type { HouseResult, InboxMessage } from "../types";
import { groupThreads } from "../data/inbox";
import { ChevronLeftIcon } from "./icons";

interface MessagesPanelProps {
  inbox: InboxMessage[];
  results: HouseResult[];
  onRetry: (houseId: string) => void;
  onFollowUp: (houseId: string) => void;
  /** "İlişki Evreleri" — friend id -> a Güven-stage favor is awaiting a reply. See data/relationshipStages.ts. */
  pendingFriendFavors: Record<string, boolean>;
  onFriendFavor: (friendId: string, accepted: boolean) => void;
}

export default function MessagesPanel({ inbox, results, onRetry, onFollowUp, pendingFriendFavors, onFriendFavor }: MessagesPanelProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const threads = groupThreads(inbox);
  const activeThread = threads.find((t) => t.threadId === selected);
  const activeResult = selected ? results.find((r) => r.houseId === selected) : undefined;
  const canRetry = activeResult?.outcome === "lost" && !activeResult.retriedLost;
  const canFollowUp = activeResult?.outcome === "thinking" && !activeResult.followedUpThinking;
  const friendIdFromThread = selected?.startsWith("friend-") ? selected.slice(7) : null;
  const hasPendingFavor = friendIdFromThread ? !!pendingFriendFavors[friendIdFromThread] : false;

  if (!selected) {
    return (
      <div className="thread-list">
        {threads.length === 0 && <p className="menu-empty">Henüz mesaj yok.</p>}
        {threads.map((t) => {
          const result = t.threadId !== "muzaffer" ? results.find((r) => r.houseId === t.threadId) : undefined;
          const threadFriendId = t.threadId.startsWith("friend-") ? t.threadId.slice(7) : null;
          const replyable =
            (result?.outcome === "lost" && !result.retriedLost) ||
            (result?.outcome === "thinking" && !result.followedUpThinking) ||
            (threadFriendId ? !!pendingFriendFavors[threadFriendId] : false);
          return (
            <button className="thread-row" key={t.threadId} onClick={() => setSelected(t.threadId)}>
              <div className="thread-row-info">
                <p className="thread-row-name">{t.contactName}</p>
                <p className="thread-row-preview">{t.lastMessage.text}</p>
              </div>
              {replyable && <span className="thread-row-badge">Yanıtla</span>}
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
        <ChevronLeftIcon size={12} className="icon-inline" /> Tüm mesajlar
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
          Tekrar Dene
        </button>
      )}
      {activeResult?.outcome === "lost" && activeResult.retriedLost && (
        <p className="menu-empty">Bu müşteriyle bir daha görüşme şansın kalmadı.</p>
      )}
      {canFollowUp && (
        <button className="pixel-btn small" onClick={() => onFollowUp(selected)}>
          Takip Mesajı Gönder
        </button>
      )}
      {activeResult?.outcome === "thinking" && activeResult.followedUpThinking && (
        <p className="menu-empty">Bu müşteriye zaten bir takip mesajı gönderdin.</p>
      )}
      {hasPendingFavor && friendIdFromThread && (
        <div className="favor-choice-row">
          <button className="pixel-btn small" onClick={() => onFriendFavor(friendIdFromThread, true)}>
            Yardım Et
          </button>
          <button className="pixel-btn small ghost" onClick={() => onFriendFavor(friendIdFromThread, false)}>
            Şimdi Olmaz
          </button>
        </div>
      )}
    </div>
  );
}
