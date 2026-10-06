import { useState } from "react";
import type { Badge, SignificantMemory } from "../types";
import { MedalIcon } from "./icons";
import { resolveText } from "../data/language";
import type { ReactNode } from "react";
import { ShadesIcon, HandshakeIcon, BrokenHeartIcon } from "./icons";

interface MemoryWallProps {
  badges: string[];
  allBadges: Record<string, Badge>;
  significantMemories: SignificantMemory[];
}

interface WallItem {
  id: string;
  label: string;
  icon?: ReactNode;
  useMedalIcon?: boolean;
}

const memoryIcon: Record<SignificantMemory["kind"], ReactNode> = {
  "kurnaz-satis": <ShadesIcon size={13} />,
  "durust-satis": <HandshakeIcon size={13} />,
  "buyuk-kayip": <BrokenHeartIcon size={13} />,
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
    label: allBadges[id] ? resolveText(allBadges[id].title) : id,
    useMedalIcon: true,
  }));
  const memoryItems: WallItem[] = significantMemories.map((m) => ({
    id: `memory-${m.id}`,
    label: m.houseTitle,
    icon: memoryIcon[m.kind],
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
          {item.useMedalIcon ? <MedalIcon size={13} /> : item.icon}
        </button>
      ))}
      {activeLabel && <div className="memory-wall-toast">{activeLabel}</div>}
    </div>
  );
}
