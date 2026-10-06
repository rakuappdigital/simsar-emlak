import type { HouseResult, InboxMessage, PhoneMessage } from "../types";

let counter = 0;
function nextId(): string {
  counter += 1;
  return `msg-${Date.now()}-${counter}`;
}

export function logMessages(
  current: InboxMessage[],
  threadId: string,
  contactName: string,
  messages: PhoneMessage[],
  day: number,
  fromPlayer = false,
): InboxMessage[] {
  const additions: InboxMessage[] = messages.map((m) => ({
    id: nextId(),
    threadId,
    contactName: m.from ?? contactName,
    text: m.text,
    fromPlayer,
    day,
    read: fromPlayer,
  }));
  return [...current, ...additions];
}

export function isUnread(m: InboxMessage): boolean {
  return !m.fromPlayer && m.read === false;
}

export function unreadCountOf(inbox: InboxMessage[]): number {
  return inbox.filter(isUnread).length;
}

/** Bir sohbetin tüm mesajlarını okundu işaretler; değişiklik yoksa aynı diziyi döndürür (gereksiz render olmasın). */
export function markThreadRead(inbox: InboxMessage[], threadId: string): InboxMessage[] {
  if (!inbox.some((m) => m.threadId === threadId && isUnread(m))) return inbox;
  return inbox.map((m) => (m.threadId === threadId && isUnread(m) ? { ...m, read: true } : m));
}

/** Eski kayıtlarda `read` alanı yok — o zamanki davranışla uyumlu olarak hepsini okundu say. */
export function migrateInboxReadFlags(inbox: InboxMessage[]): InboxMessage[] {
  return inbox.map((m) => (m.read === undefined ? { ...m, read: true } : m));
}

/**
 * How many house-visits have passed since a customer last messaged in
 * (via the automatic callback system). Used to pace callbacks so they
 * feel like an occasional, organic thing rather than either back-to-back
 * spam or a rare event that never shows up.
 */
export function housesSinceLastCallback(inbox: InboxMessage[], currentDay: number): number {
  const customerDays = inbox.filter((m) => m.threadId !== "muzaffer" && !isFlavorThread(m.threadId)).map((m) => m.day);
  if (customerDays.length === 0) return 99;
  return currentDay - Math.max(...customerDays);
}

export interface InboxThread {
  threadId: string;
  contactName: string;
  messages: InboxMessage[];
  lastMessage: InboxMessage;
  unreadCount: number;
  /** Gelen kutusundaki son mesajın sırası — "en yeni üstte" sıralaması için (gün numarası aynı günde eşitleniyor). */
  lastPosition: number;
}

export function groupThreads(inbox: InboxMessage[]): InboxThread[] {
  const map = new Map<string, InboxMessage[]>();
  const lastPos = new Map<string, number>();
  inbox.forEach((msg, i) => {
    if (!map.has(msg.threadId)) map.set(msg.threadId, []);
    map.get(msg.threadId)!.push(msg);
    lastPos.set(msg.threadId, i);
  });
  const threads: InboxThread[] = [];
  for (const [threadId, messages] of map) {
    // Sohbet adı: karşı tarafın adı (son mesaj Emlah'tansa "Emlah" yazmasın).
    const other = [...messages].reverse().find((m) => !m.fromPlayer);
    threads.push({
      threadId,
      contactName: (other ?? messages[messages.length - 1]).contactName,
      messages,
      lastMessage: messages[messages.length - 1],
      unreadCount: messages.filter(isUnread).length,
      lastPosition: lastPos.get(threadId) ?? 0,
    });
  }
  // Muzaffer's thread is pinned first, rest ordered by most recent activity.
  threads.sort((a, b) => {
    if (a.threadId === "muzaffer") return -1;
    if (b.threadId === "muzaffer") return 1;
    return b.lastPosition - a.lastPosition;
  });
  return threads;
}

const PRUNE_GRACE_HOUSES = 3;

/**
 * Drops customer threads that are truly done — sold, or lost with the
 * one-time "Tekrar Dene" already used — a few houses after their last
 * message, so the saved inbox doesn't grow forever. Threads still worth
 * keeping (open "thinking" negotiations, or a "lost" sale that hasn't been
 * retried yet, since that's what powers the inbox retry option) are left
 * alone, as is the Muzaffer thread.
 */
export function pruneInbox(
  inbox: InboxMessage[],
  results: HouseResult[],
  currentDay: number,
  graceHouses = PRUNE_GRACE_HOUSES,
): InboxMessage[] {
  const threads = groupThreads(inbox);
  const closedThreadIds = new Set<string>();
  for (const t of threads) {
    if (t.threadId === "muzaffer") continue;
    if (currentDay - t.lastMessage.day <= graceHouses) continue;
    const result = results.find((r) => r.houseId === t.threadId);
    const isDone = result && (result.outcome === "sold" || (result.outcome === "lost" && result.retriedLost));
    if (isDone) closedThreadIds.add(t.threadId);
  }
  if (closedThreadIds.size === 0) return inbox;
  return inbox.filter((m) => !closedThreadIds.has(m.threadId));
}

/**
 * G7 — telefon sahnesindeki eski "sahte bildirim" (Annem, apartman grubu…)
 * artık sohbetin üstüne binmiyor; bunun yerine Mesajlar'da kozmetik bir
 * okunmamış sohbet olarak birikiyor. Bildirim kayması (S5) bunlar için
 * çıkmaz, hiçbir oyun mekaniğine dokunmaz.
 */
export const FLAVOR_THREAD_PREFIX = "flavor-";
const FLAVOR_MAX_THREADS = 3;
const FLAVOR_MAX_MESSAGES_PER_THREAD = 4;

export function isFlavorThread(threadId: string): boolean {
  return threadId.startsWith(FLAVOR_THREAD_PREFIX);
}

function slugify(name: string): string {
  return name
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function logFlavorMessage(inbox: InboxMessage[], name: string, text: string, day: number): InboxMessage[] {
  const threadId = `${FLAVOR_THREAD_PREFIX}${slugify(name)}`;
  let next = logMessages(inbox, threadId, name, [{ from: name, text }], day);
  // En yeni FLAVOR_MAX_THREADS sohbeti ve her birinde son birkaç mesajı tut.
  const flavorThreads = groupThreads(next).filter((th) => isFlavorThread(th.threadId));
  const keep = new Set(flavorThreads.sort((a, b) => b.lastPosition - a.lastPosition).slice(0, FLAVOR_MAX_THREADS).map((th) => th.threadId));
  const perThreadKeep = new Map<string, Set<string>>();
  for (const th of flavorThreads) {
    perThreadKeep.set(th.threadId, new Set(th.messages.slice(-FLAVOR_MAX_MESSAGES_PER_THREAD).map((m) => m.id)));
  }
  next = next.filter((m) => !isFlavorThread(m.threadId) || (keep.has(m.threadId) && perThreadKeep.get(m.threadId)!.has(m.id)));
  return next;
}
