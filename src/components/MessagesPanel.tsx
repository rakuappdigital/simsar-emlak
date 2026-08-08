import { useState } from "react";
import type { HouseResult, InboxMessage } from "../types";
import { groupThreads } from "../data/inbox";

interface MessagesPanelProps {
  inbox: InboxMessage[];
  results: HouseResult[];
  onRetry: (houseId: string) => void;
}

export default function MessagesPanel({ inbox, results, onRetry }: MessagesPanelProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const threads = groupThreads(inbox);
  const activeThread = threads.find((t) => t.threadId === selected);
  const activeResult = selected ? results.find((r) => r.houseId === selected) : undefined;
  const canRetry = activeResult?.outcome === "lost" && !activeResult.retriedLost;

  if (!selected) {
    return (
      <div className="thread-list">
        {threads.length === 0 && <p className="menu-empty">Henüz mesaj yok.</p>}
        {threads.map((t) => {
          const result = t.threadId !== "muzaffer" ? results.find((r) => r.houseId === t.threadId) : undefined;
          const replyable = result?.outcome === "lost" && !result.retriedLost;
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
        ‹ Tüm mesajlar
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
    </div>
  );
}
