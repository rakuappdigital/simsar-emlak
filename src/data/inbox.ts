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
  }));
  return [...current, ...additions];
}

/**
 * How many house-visits have passed since a customer last messaged in
 * (via the automatic callback system). Used to pace callbacks so they
 * feel like an occasional, organic thing rather than either back-to-back
 * spam or a rare event that never shows up.
 */
export function housesSinceLastCallback(inbox: InboxMessage[], currentDay: number): number {
  const customerDays = inbox.filter((m) => m.threadId !== "muzaffer").map((m) => m.day);
  if (customerDays.length === 0) return 99;
  return currentDay - Math.max(...customerDays);
}

export interface InboxThread {
  threadId: string;
  contactName: string;
  messages: InboxMessage[];
  lastMessage: InboxMessage;
}

export function groupThreads(inbox: InboxMessage[]): InboxThread[] {
  const map = new Map<string, InboxMessage[]>();
  for (const msg of inbox) {
    if (!map.has(msg.threadId)) map.set(msg.threadId, []);
    map.get(msg.threadId)!.push(msg);
  }
  const threads: InboxThread[] = [];
  for (const [threadId, messages] of map) {
    threads.push({
      threadId,
      contactName: messages[messages.length - 1].contactName,
      messages,
      lastMessage: messages[messages.length - 1],
    });
  }
  // Muzaffer's thread always first, rest ordered by most recent activity.
  threads.sort((a, b) => {
    if (a.threadId === "muzaffer") return -1;
    if (b.threadId === "muzaffer") return 1;
    return b.lastMessage.day - a.lastMessage.day;
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
