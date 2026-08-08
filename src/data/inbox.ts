import type { InboxMessage, PhoneMessage } from "../types";

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
