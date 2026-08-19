import { useState } from "react";
import type { Badge, SignificantMemory } from "../types";
import { MedalIcon } from "./icons";

interface MemoryWallProps {
  badges: string[];
  allBadges: Record<string, Badge>;
  significantMemories: SignificantMemory[];
}

interface WallItem {
  id: string;
  label: string;
  emoji?: string;
  useMedalIcon?: boolean;
}

const memoryEmoji: Record<SignificantMemory["kind"], string> = {
  "kurnaz-satis": "🕶️",
  "durust-satis": "🤝",
  "buyuk-kayip": "💔",
};

const MAX_WALL_ITEMS = 6;

/**
 * "Görsel Anı Duvarı" — turns already-persisted badges/significantMemories
 * into a small, growing pinboard on the office wall, instead of leaving
 * them buried in menu screens. No new state: purely derived from data the
 * game already tracks. Tapping a pin shows what it was.
 */
export default function MemoryWall({ badges, allBadges, significantMemories }: MemoryWallProps) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const badgeItems: WallItem[] = badges.map((id) => ({
    id: `badge-${id}`,
    label: allBadges[id]?.title ?? id,
    useMedalIcon: true,
  }));
  const memoryItems: WallItem[] = significantMemories.map((m) => ({
    id: `memory-${m.id}`,
    label: m.houseTitle,
    emoji: memoryEmoji[m.kind],
  }));
  const items = [...badgeItems, ...memoryItems].slice(-MAX_WALL_ITEMS);

  if (items.length === 0) return null;

  function handlePin(label: string) {
    setActiveLabel(label);
    setTimeout(() => setActiveLabel((cur) => (cur === label ? null : cur)), 2400);
  }

  return (
    <div className="memory-wall">
      {items.map((item) => (
        <button key={item.id} className="memory-wall-pin" onClick={() => handlePin(item.label)} aria-label={item.label}>
          {item.useMedalIcon ? <MedalIcon size={13} /> : <span>{item.emoji}</span>}
        </button>
      ))}
      {activeLabel && <div className="memory-wall-toast">{activeLabel}</div>}
    </div>
  );
}
