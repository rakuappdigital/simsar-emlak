import { useEffect, useRef, useState } from "react";
import { t } from "../data/language";
import type { HouseResult, InboxMessage } from "../types";
import { groupThreads, isUnread } from "../data/inbox";
import { ChevronLeftIcon, CloseIcon, PinIcon } from "./icons";
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
  /** Sohbet açılınca okundu işaretlenir — okunmamış ayrımı artık sohbet bazında. */
  onMarkRead: (threadId: string) => void;
  /** Sohbet listesi/başlığı için portre; yoksa baş harf gösterilir. */
  avatarFor: (threadId: string, contactName: string) => string | undefined;
  onClose: () => void;
  /** S5 — bildirime dokununca doğrudan bu sohbet açılır. */
  initialThreadId?: string | null;
}

function Avatar({ src, name, size = "md" }: { src?: string; name: string; size?: "md" | "sm" }) {
  return (
    <span className={`msg-avatar msg-avatar-${size}`} aria-hidden>
      {src ? <img src={src} alt="" /> : name.charAt(0).toLocaleUpperCase("tr-TR")}
    </span>
  );
}

const dayLabel = (day: number) => t({ tr: `${day}. Gün`, en: `Day ${day}` });

/**
 * Mesajlar — telefonun içindeki bir sohbet uygulaması gibi: liste ekranında
 * okunmamış sohbetler kalın + yeşil sayaçla öne çıkar; sohbetin içinde gün
 * ayraçları ve "Okunmamış mesajlar" çizgisi var, aksiyonlar alttaki yanıt
 * çubuğunda.
 */
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
  onMarkRead,
  avatarFor,
  onClose,
  initialThreadId = null,
}: MessagesPanelProps) {
  const [selected, setSelected] = useState<string | null>(() =>
    initialThreadId && inbox.some((m) => m.threadId === initialThreadId) ? initialThreadId : null,
  );
  // Sohbet açıldığı andaki ilk okunmamış mesaj — okundu işaretlendikten sonra da ayraç yerinde kalsın.
  const [firstUnreadId, setFirstUnreadId] = useState<string | null>(() =>
    initialThreadId ? (inbox.find((m) => m.threadId === initialThreadId && isUnread(m))?.id ?? null) : null,
  );
  useEffect(() => {
    if (selected) onMarkRead(selected);
    // Yalnızca ilk açılışta (bildirimden gelindiyse) — sonraki seçimler openThread'de işaretleniyor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const bodyRef = useRef<HTMLDivElement>(null);

  const threads = groupThreads(inbox);
  const totalUnread = threads.reduce((sum, th) => sum + th.unreadCount, 0);
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

  function openThread(threadId: string) {
    const thread = threads.find((th) => th.threadId === threadId);
    setFirstUnreadId(thread?.messages.find(isUnread)?.id ?? null);
    setSelected(threadId);
    onMarkRead(threadId);
  }

  useEffect(() => {
    if (!selected || !bodyRef.current) return;
    const divider = bodyRef.current.querySelector(".msg-unread-divider");
    if (divider) divider.scrollIntoView({ block: "start" });
    else bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [selected]);

  if (!selected || !activeThread) {
    return (
      <div className="msg-app">
        <div className="msg-appbar">
          <span className="msg-appbar-title">{t({ tr: "Sohbetler", en: "Chats" })}</span>
          {totalUnread > 0 && (
            <span className="msg-appbar-unread">
              {t({ tr: `${totalUnread} okunmamış`, en: `${totalUnread} unread` })}
            </span>
          )}
          <button className="msg-close" onClick={onClose} aria-label={t({ tr: "Kapat", en: "Close" })}>
            <CloseIcon size={10} />
          </button>
        </div>
        <div className="msg-list">
          {threads.length === 0 && <p className="msg-empty">{t({ tr: "Henüz mesaj yok.", en: "No messages yet." })}</p>}
          {threads.map((thread) => {
            const result = thread.threadId !== "muzaffer" ? results.find((r) => r.houseId === thread.threadId) : undefined;
            const threadFriendId = thread.threadId.startsWith("friend-") ? thread.threadId.slice(7) : null;
            const replyable =
              (result?.outcome === "lost" && !result.retriedLost) ||
              (result?.outcome === "thinking" && !result.followedUpThinking) ||
              (threadFriendId ? !!pendingFriendFavors[threadFriendId] : false);
            const unread = thread.unreadCount > 0;
            const last = thread.lastMessage;
            return (
              <button
                className={`msg-row ${unread ? "msg-row-unread" : ""}`}
                key={thread.threadId}
                onClick={() => openThread(thread.threadId)}
              >
                <Avatar src={avatarFor(thread.threadId, thread.contactName)} name={thread.contactName} />
                <span className="msg-row-main">
                  <span className="msg-row-top">
                    <span className="msg-row-name">
                      {thread.threadId === "muzaffer" && <span className="msg-pin" aria-label={t({ tr: "Sabit", en: "Pinned" })}><PinIcon size={11} /> </span>}
                      {thread.contactName}
                    </span>
                    <span className="msg-row-day">{dayLabel(last.day)}</span>
                  </span>
                  <span className="msg-row-bottom">
                    <span className="msg-row-preview">
                      {last.fromPlayer && <span className="msg-row-you">{t({ tr: "Sen: ", en: "You: " })}</span>}
                      {last.text}
                    </span>
                    {unread ? (
                      <span className="msg-row-count">{thread.unreadCount > 9 ? "9+" : thread.unreadCount}</span>
                    ) : replyable ? (
                      <span className="msg-row-reply">{t({ tr: "Yanıt bekliyor", en: "Awaiting reply" })}</span>
                    ) : null}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const hasActions = canRetry || canFollowUp || (hasPendingFavor && !!friendIdFromThread) || canAskForHelp;
  let lastDay: number | null = null;

  return (
    <div className="msg-app">
      <div className="msg-chatbar">
        <button className="msg-back" onClick={() => setSelected(null)} aria-label={t({ tr: "Sohbetlere dön", en: "Back to chats" })}>
          <ChevronLeftIcon size={14} />
          {totalUnread > 0 && <span className="msg-back-count">{totalUnread}</span>}
        </button>
        <Avatar src={avatarFor(activeThread.threadId, activeThread.contactName)} name={activeThread.contactName} size="sm" />
        <span className="msg-chatbar-name">{activeThread.contactName}</span>
        <button className="msg-close" onClick={onClose} aria-label={t({ tr: "Kapat", en: "Close" })}>
          <CloseIcon size={10} />
        </button>
      </div>
      <div className="msg-body" ref={bodyRef}>
        {activeThread.messages.map((m) => {
          const showDay = m.day !== lastDay;
          lastDay = m.day;
          return (
            <div key={m.id} className="msg-item">
              {showDay && <div className="msg-day-chip">{dayLabel(m.day)}</div>}
              {m.id === firstUnreadId && (
                <div className="msg-unread-divider">{t({ tr: "Okunmamış mesajlar", en: "Unread messages" })}</div>
              )}
              <div className={`wa-bubble msg-bubble ${m.fromPlayer ? "outgoing" : "incoming"}`}>
                {!m.fromPlayer && m.contactName !== activeThread.contactName && (
                  <span className="msg-bubble-sender">{m.contactName}</span>
                )}
                {m.text}
              </div>
            </div>
          );
        })}
      </div>
      <div className="msg-replybar">
        {canRetry && (
          <button className="pixel-btn small" onClick={() => onRetry(selected)}>
            {t({ tr: "Tekrar Dene", en: "Try Again" })}
          </button>
        )}
        {canFollowUp && (
          <button className="pixel-btn small" onClick={() => onFollowUp(selected)}>
            {t({ tr: "Takip Mesajı Gönder", en: "Send Follow-Up Message" })}
          </button>
        )}
        {hasPendingFavor && friendIdFromThread && (
          <>
            <button className="pixel-btn small" onClick={() => onFriendFavor(friendIdFromThread, true)}>
              {t({ tr: "Yardım Et", en: "Help Out" })}
            </button>
            <button className="pixel-btn small ghost" onClick={() => onFriendFavor(friendIdFromThread, false)}>
              {t({ tr: "Şimdi Olmaz", en: "Not Now" })}
            </button>
          </>
        )}
        {canAskForHelp && friendIdFromThread && (
          <button className="pixel-btn small" onClick={() => onAskForHelp(friendIdFromThread)}>
            {t({ tr: "Yardım İste", en: "Ask for Help" })}
          </button>
        )}
        {!hasActions && (
          <p className="msg-replybar-note">
            {activeResult?.outcome === "lost" && activeResult.retriedLost
              ? t({ tr: "Bu müşteriyle bir daha görüşme şansın kalmadı.", en: "You have no more chances to talk with this customer." })
              : activeResult?.outcome === "thinking" && activeResult.followedUpThinking
                ? t({ tr: "Bu müşteriye zaten bir takip mesajı gönderdin.", en: "You already sent a follow-up message to this customer." })
                : t({ tr: "Yanıt gerektiren bir şey yok.", en: "Nothing needs a reply." })}
          </p>
        )}
      </div>
    </div>
  );
}
