import { useEffect, useMemo, useState } from "react";
import type { Choice, ChoiceEffects, DialogueLine, GameStats, HouseScene, SceneOutcome } from "../types";
import { loadHouseImage, peekHouseImage } from "../data/houseImages";
import { characterImages } from "../data/characterImages";
import { formatTL } from "../data/economy";
import { resolveOutcome, closingBiasMultiplier, personalityHint } from "../data/scoring";
import { shuffle } from "../data/shuffle";
import { resolveCustomerNames, resolvePortrait, interpolateNames, poolCharacterById } from "../data/characterPool";
import { FLIRT_FUN_THRESHOLD, FLIRT_CHANCE } from "../data/meetup";
import { celebrityById, CELEBRITY_DISCOUNT_BONUS, CELEBRITY_FAN_BONUS } from "../data/celebrities";

const FUN_BONUS_THRESHOLD = 30;
const TYPE_MS_PER_CHAR = 16;

const bonusChoice: Choice = {
  id: "bonus-fun",
  text: "(Şakalaşarak) Görüyorum ki iyi anlaşıyoruz, hadi imzalayalım o zaman!",
  next: "",
  effects: { closingBias: 20, fun: 5 },
};

/** Matches the common "fiyatta esneklik/indirim var mı" closing prompts — used
 *  to safely swap only the generic discount-ask lines, never touching
 *  specially-authored closing framings (e.g. Miras Kavgası's heir dispute). */
const DISCOUNT_ASK_PATTERN = /esneklik|indirim/i;
const WON_DEAL_LINE = "Açıkçası burayı gerçekten beğendim, karar vermeye hazırım.";
const WON_DEAL_CHOICE_TEXT = "\"O zaman bu şartlarla ilerleyelim, teklif gayet makul.\"";

const flirtChoice: Choice = {
  id: "flirt-bond",
  text: "(Göz kırparak) İş ciddi ama bu kadar keyifli bir görüşme az oluyor doğrusu.",
  next: "",
  effects: { closingBias: 10, fun: 5 },
};

interface DialogueSceneProps {
  house: HouseScene;
  stats: GameStats;
  ownedPerks: string[];
  castAssignment: Record<string, string[]>;
  onChoiceEffects: (effects: ChoiceEffects) => void;
  onSceneEnd: (outcome: SceneOutcome) => void;
  onLineChosen?: (text: string, fun: number) => void;
  onFlirt?: (characterId: string, characterName: string) => void;
}

const speakerLabel: Record<string, string> = {
  emlah: "Emlah",
  thought: "Emlah (içinden)",
};

const speakerSlot: Record<string, number> = {
  customer1: 0,
  customer2: 1,
};

export default function DialogueScene({
  house,
  stats,
  ownedPerks,
  castAssignment,
  onChoiceEffects,
  onSceneEnd,
  onLineChosen,
  onFlirt,
}: DialogueSceneProps) {
  const resolvedNames = useMemo(() => resolveCustomerNames(house, castAssignment), [house, castAssignment]);
  const [nodeId, setNodeId] = useState(house.startNode);
  const [lineIndex, setLineIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    setNodeId(house.startNode);
    setLineIndex(0);
  }, [house]);

  const node = house.nodes[nodeId];
  // A rare "Özel Davetler" easter egg — see celebrities.ts. Only ever set
  // for a single-customer house whose assigned character happens to be a
  // celebrity (injected once at game start, never during play).
  const celebrityCharacterId = house.dynamicCast?.length === 1 ? castAssignment[house.id]?.[0] : undefined;
  const celebrity = celebrityCharacterId ? celebrityById(celebrityCharacterId) : undefined;
  const celebrityIntroLines: DialogueLine[] =
    celebrity && nodeId === house.startNode
      ? [
          { speaker: "thought", text: celebrity.introLine },
          { speaker: "thought", text: "(içinden) Ünlü biri karşımda, pazarlık payını biraz daha esnek tutabilirim." },
          { speaker: "emlah", text: celebrity.fanLine },
          { speaker: "customer1", text: celebrity.fanReplyLine },
        ]
      : [];
  const effectiveLines = celebrityIntroLines.length > 0 ? [...celebrityIntroLines, ...node.lines] : node.lines;
  const linesShown = effectiveLines.slice(0, lineIndex + 1);
  const atLastLine = lineIndex >= effectiveLines.length - 1;

  useEffect(() => {
    if (celebrity) onChoiceEffects(CELEBRITY_FAN_BONUS[celebrity.personality]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [house.id]);
  const portraitOutcomeClass =
    nodeId === house.closingNodes.sold ? "portrait-sold" : nodeId === house.closingNodes.lost ? "portrait-lost" : "";

  const isClosingNode = node.choices?.some((c) => c.effects?.closingBias !== undefined) ?? false;
  // A discount only makes narrative sense when the deal is genuinely shaky —
  // if it'd already resolve to "sold" with a perfectly neutral closing bias,
  // Emlah has no real reason to offer one unprompted.
  const dealAlreadyWon = isClosingNode && resolveOutcome(stats, 0, house.profile) === "sold";

  function getLineText(line: { text: string; speaker: string }) {
    const base = house.dynamicCast ? interpolateNames(line.text, resolvedNames) : line.text;
    if (isClosingNode && dealAlreadyWon && line.speaker !== "emlah" && line.speaker !== "thought" && DISCOUNT_ASK_PATTERN.test(base)) {
      return WON_DEAL_LINE;
    }
    return base;
  }

  const currentLine = linesShown[linesShown.length - 1];
  const currentText = currentLine ? getLineText(currentLine) : "";
  const isTyping = typedLength < currentText.length;

  useEffect(() => {
    setTypedLength(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId, lineIndex]);

  useEffect(() => {
    if (typedLength >= currentText.length) return;
    const timer = setTimeout(() => setTypedLength((n) => n + 1), TYPE_MS_PER_CHAR);
    return () => clearTimeout(timer);
  }, [typedLength, currentText.length]);

  const bonusUnlocked = isClosingNode && stats.fun >= FUN_BONUS_THRESHOLD;

  // A flirty option can only ever appear with a single, female dynamicCast
  // customer (never in front of a partner/co-buyer), on a closing node, once
  // fun is high enough — and even then only on a rare roll, re-rolled fresh
  // each time a new node is entered so it can't be gamed by re-rendering.
  const flirtCharacterId = house.dynamicCast?.length === 1 ? castAssignment[house.id]?.[0] : undefined;
  const flirtCharacter = flirtCharacterId ? poolCharacterById(flirtCharacterId) : undefined;
  const flirtEligible =
    isClosingNode && !!onFlirt && !!flirtCharacter && flirtCharacter.gender === "k" && stats.fun >= FLIRT_FUN_THRESHOLD;
  const flirtRoll = useMemo(() => Math.random(), [nodeId]);
  const flirtUnlocked = flirtEligible && flirtRoll < FLIRT_CHANCE;

  const displayChoices = useMemo(() => {
    if (!node.choices) return undefined;
    let list = node.choices;
    if (dealAlreadyWon) {
      list = list.map((c) =>
        c.effects?.discountPercent && c.effects.discountPercent > 0
          ? { ...c, text: WON_DEAL_CHOICE_TEXT, effects: { ...c.effects, discountPercent: 0 } }
          : c,
      );
    }
    if (celebrity) {
      list = list.map((c) =>
        c.effects?.discountPercent
          ? { ...c, effects: { ...c.effects, discountPercent: c.effects.discountPercent + CELEBRITY_DISCOUNT_BONUS } }
          : c,
      );
    }
    let finalList = bonusUnlocked ? [...list, bonusChoice] : list;
    if (flirtUnlocked) finalList = [...finalList, flirtChoice];
    return shuffle(finalList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId, bonusUnlocked, dealAlreadyWon, flirtUnlocked]);

  function advanceLine() {
    if (!atLastLine) {
      setLineIndex((i) => i + 1);
      return;
    }
    if (node.end) {
      onSceneEnd(node.end);
      return;
    }
    if (node.next && !node.choices) {
      setNodeId(node.next);
      setLineIndex(0);
    }
  }

  function handleBoxClick() {
    if (isTyping) {
      setTypedLength(currentText.length);
      return;
    }
    if (!atLastLine) advanceLine();
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.code !== "Space" && e.code !== "Enter") return;
      if (displayChoices) return;
      e.preventDefault();
      handleBoxClick();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping, atLastLine, currentText, displayChoices]);

  function pickChoice(choice: Choice) {
    if (choice.effects) onChoiceEffects(choice.effects);
    if (choice.effects?.fun) onLineChosen?.(choice.text, choice.effects.fun);
    if (choice.id === "flirt-bond" && flirtCharacterId && flirtCharacter) {
      onFlirt?.(flirtCharacterId, flirtCharacter.name);
    }

    if (choice.effects?.closingBias !== undefined) {
      const projected: GameStats = {
        suspicion: stats.suspicion + (choice.effects.suspicion ?? 0),
        interest: stats.interest + (choice.effects.interest ?? 0),
        fun: stats.fun + (choice.effects.fun ?? 0),
        discountPercent: stats.discountPercent + (choice.effects.discountPercent ?? 0),
      };
      const bias = choice.effects.closingBias * closingBiasMultiplier(ownedPerks);
      const outcome = resolveOutcome(projected, bias, house.profile);
      setNodeId(house.closingNodes[outcome]);
    } else {
      setNodeId(choice.next);
    }
    setLineIndex(0);
  }

  const [image, setImage] = useState<string | undefined>(() => peekHouseImage(house.id));

  useEffect(() => {
    const cached = peekHouseImage(house.id);
    if (cached) {
      setImage(cached);
      return;
    }
    setImage(undefined);
    let cancelled = false;
    loadHouseImage(house.id)?.then((url) => {
      if (!cancelled) setImage(url);
    });
    return () => {
      cancelled = true;
    };
  }, [house.id]);

  return (
    <div className="dialogue-scene">
      <div className="scene-stage">
        <div className={`pixel-bg scene-bg-enter ${image ? "" : house.background}`} />
        {image && <div className="pixel-bg-photo" style={{ backgroundImage: `url(${image})` }} />}
        {personalityHint(house.profile) && (
          <span className="personality-tag">{personalityHint(house.profile)}</span>
        )}
        <div className="scene-title">
          <span>{house.title} — {house.location}</span>
          <span className="scene-price">{formatTL(house.askingPrice)}</span>
        </div>
      </div>

      <div className="dialogue-box" onClick={handleBoxClick}>
        {linesShown.map((line, i) => {
          const isCurrent = i === linesShown.length - 1;
          const slot = speakerSlot[line.speaker];
          const dynamicName = house.dynamicCast && slot !== undefined ? resolvedNames[slot] : undefined;
          const displayName = dynamicName ?? line.name ?? speakerLabel[line.speaker] ?? "";
          const fullText = getLineText(line);
          const text = isCurrent ? fullText.slice(0, typedLength) : fullText;
          if (line.speaker === "thought") {
            return (
              <div key={i} className="dialogue-line speaker-thought">
                <div className="dialogue-line-body">
                  <span className="speaker-name">{displayName}</span>
                  <span className="line-text">
                    {text}
                    {isCurrent && isTyping && <span className="type-cursor" aria-hidden />}
                  </span>
                </div>
              </div>
            );
          }
          const portrait = resolvePortrait(displayName, house, castAssignment) ?? characterImages[displayName];
          return (
            <div key={i} className={`dialogue-line speaker-${line.speaker}`}>
              {portrait ? (
                <img className={`portrait-avatar ${portraitOutcomeClass}`} src={portrait} alt={displayName} />
              ) : (
                <div className="portrait-avatar portrait-placeholder" aria-hidden />
              )}
              <div className="dialogue-line-body">
                <span className="speaker-name">{displayName}</span>
                <span className="line-text">
                  {text}
                  {isCurrent && isTyping && <span className="type-cursor" aria-hidden />}
                </span>
              </div>
            </div>
          );
        })}

        {!atLastLine && !isTyping && (
          <button className="pixel-btn small" onClick={advanceLine}>
            Devam ▸
          </button>
        )}

        {atLastLine && !isTyping && displayChoices && (
          <div className="choices">
            {displayChoices.map((c) => (
              <button
                key={c.id}
                className="choice-btn"
                onClick={() => pickChoice(c)}
              >
                {c.text}
              </button>
            ))}
          </div>
        )}

        {atLastLine && !isTyping && !node.choices && (node.next || node.end) && (
          <button className="pixel-btn small" onClick={advanceLine}>
            {node.end ? "Sahneyi Bitir" : "Devam ▸"}
          </button>
        )}
      </div>
    </div>
  );
}
