import { useEffect, useMemo, useRef, useState } from "react";
import type { Choice, ChoiceEffects, DialogueLine, DialogueNode, GameStats, HouseScene, SceneOutcome, ToneBucket } from "../types";
import { loadHouseImage, peekHouseImage } from "../data/houseImages";
import { characterImages } from "../data/characterImages";
import { formatTL } from "../data/economy";
import { resolveOutcome, closingBiasMultiplier, personalityHint } from "../data/scoring";
import { shuffle } from "../data/shuffle";
import { resolveCustomerNames, resolvePortrait, interpolateNames, poolCharacterById } from "../data/characterPool";
import { FLIRT_FUN_THRESHOLD, FLIRT_CHANCE } from "../data/meetup";
import { pickFlirtExchangeLines, pickFlirtClosingLine } from "../data/flirtDialogue";
import { celebrityById, CELEBRITY_DISCOUNT_BONUS, CELEBRITY_FAN_BONUS } from "../data/celebrities";
import { pickConditionWarningThought, pickConditionWarningLine } from "../data/renovation";
import type { EasterEgg } from "../data/easterEggs";
import { ECHO_CHANCE, pickEchoLines } from "../data/echoNetwork";
import { dominantTone, pickVoiceLine, VOICE_LINE_CHANCE } from "../data/voiceTone";
import { LAST_MINUTE_PRESSURE_CHANCE, pickPressureChoice } from "../data/lastMinutePressure";
import type { OriginDef } from "../data/origin";
import { firatPortraits, type FiratMoodDef } from "../data/rivalCharacter";
import { pickMemoryReferenceLine } from "../data/significantMemory";
import { ORIGIN_RECOGNITION_CHANCE, pickOriginRecognitionLine } from "../data/originRecognition";
import { getDialogueStyle, styleEmlahLine } from "../data/dialogueStyle";
import {
  isHeldFirmChoice,
  isDiscountContradiction,
  CONTRADICTION_SUSPICION_PENALTY,
  pickDiscountContradictionLine,
  contradictionRankMultiplier,
} from "../data/contradiction";
import type { ContactedCustomer, SignificantMemory } from "../types";

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
  /** "Emlah'ın Sesi" — reports every picked choice's effects so App.tsx can classify/tally its tone. See data/voiceTone.ts. */
  onToneChoice?: (effects: ChoiceEffects) => void;
  /** "Son Dakika Baskısı" — fires only when the player actually falls for the trap choice. See data/lastMinutePressure.ts. */
  onPressureChoicePicked?: () => void;
  /** True when a rival ladder opponent is also circling this exact house (see rivalDuel.ts) — purely a visible warning tag, no stat effect. */
  isDuel?: boolean;
  /** Name shown in the duel tag — the current rival ladder rung. See data/rivalLadder.ts. */
  duelRivalName?: string;
  /** Fırat Bey's face-to-face mood for this same encounter — see data/rivalCharacter.ts. Prepends a short exchange, no stat effect. */
  firatEncounter?: FiratMoodDef;
  /** Yatırım Evleri only — the owned house wasn't renovated enough for its condition (see renovation.ts). Adds a flavor exchange, no stat effect (the price penalty is applied separately in computeInvestmentSale). */
  conditionWarning?: boolean;
  /** Rare, house-agnostic flavor moment — see data/easterEggs.ts. Adds a tiny one-off fun bonus, nothing else. */
  easterEgg?: EasterEgg;
  /** Past customers who might get namedropped by this house's customer — see data/echoNetwork.ts. Pure flavor, no stat effect. */
  contactedCustomers?: ContactedCustomer[];
  /** "Emlah'ın Sesi" — running tone tally, occasionally colors an opening thought line. See data/voiceTone.ts. */
  voiceTally?: Record<ToneBucket, number>;
  /** "Emlah'ın Geçmişi" — one-time backstory pick. Adds an always-available closing choice + a one-time intro line on the very first house. See data/origin.ts. */
  origin?: OriginDef;
  /** True only for the very first house of the game, gates the one-time origin intro line. */
  showOriginIntro?: boolean;
  /** "Karar Anıları" — a past defining moment being referenced by this (unrelated) customer. See data/significantMemory.ts. */
  memoryReference?: SignificantMemory;
  /** Reports when the player picks THIS origin's closing choice, for the loyalty count. */
  onOriginChoicePicked?: () => void;
  /** "Çelişki Motoru" — customers get sharper-eyed at higher career ranks. See data/contradiction.ts. */
  rankTitleText?: string;
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
  isDuel,
  duelRivalName,
  firatEncounter,
  conditionWarning,
  easterEgg,
  contactedCustomers = [],
  onToneChoice,
  voiceTally,
  onPressureChoicePicked,
  origin,
  showOriginIntro,
  memoryReference,
  onOriginChoicePicked,
  rankTitleText,
}: DialogueSceneProps) {
  const resolvedNames = useMemo(() => resolveCustomerNames(house, castAssignment), [house, castAssignment]);
  const [dialogueStyle] = useState(getDialogueStyle);
  const [nodeId, setNodeId] = useState(house.startNode);
  const [lineIndex, setLineIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  // "Flörtöz Kapanış" — a short bonus exchange overlaid on top of the real
  // node graph instead of a new authored node id (see flirtDialogue.ts).
  const [syntheticNode, setSyntheticNode] = useState<DialogueNode | null>(null);
  // "Çelişki Motoru" — counts "confident, holding firm" choices picked
  // this visit; a ref (not state) since it's read-only bookkeeping that
  // shouldn't trigger its own re-render. See data/contradiction.ts.
  const heldFirmCountRef = useRef(0);

  useEffect(() => {
    setNodeId(house.startNode);
    setLineIndex(0);
    heldFirmCountRef.current = 0;
  }, [house]);

  const node = syntheticNode ?? house.nodes[nodeId];
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
  // Rolled once per house at purchase time (see renovation.ts) — never
  // touches suspicion/interest/fun here, the price effect lives entirely
  // in computeInvestmentSale. Just tells the player why, in character.
  // Picked once via useMemo so it can't change wording across re-renders.
  const conditionWarningThought = useMemo(() => pickConditionWarningThought(), [house.id]);
  const conditionWarningLine = useMemo(() => pickConditionWarningLine(), [house.id]);
  const conditionWarningLines: DialogueLine[] =
    conditionWarning && nodeId === house.startNode
      ? [
          { speaker: "thought", text: conditionWarningThought },
          { speaker: "customer1", text: conditionWarningLine },
        ]
      : [];
  const easterEggLines: DialogueLine[] =
    easterEgg && nodeId === house.startNode
      ? easterEgg.lines.map((l) => ({ speaker: l.speaker, text: l.text }))
      : [];
  // "Yankı Ağı" — skipped when a celebrity or easter egg already fired for
  // this house, so the opening never stacks more than one flavor moment.
  const echoLines = useMemo(() => {
    if (celebrity || easterEgg) return null;
    if (Math.random() >= ECHO_CHANCE) return null;
    return pickEchoLines(contactedCustomers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [house.id]);
  const echoDialogueLines: DialogueLine[] = echoLines && nodeId === house.startNode ? echoLines : [];
  // "Emlah'ın Sesi" — same one-flavor-moment-per-intro guard as echo above.
  const voiceLine = useMemo(() => {
    if (celebrity || easterEgg || echoLines) return null;
    if (!voiceTally) return null;
    const tone = dominantTone(voiceTally);
    if (!tone) return null;
    if (Math.random() >= VOICE_LINE_CHANCE) return null;
    return pickVoiceLine(tone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [house.id]);
  const voiceDialogueLines: DialogueLine[] =
    voiceLine && nodeId === house.startNode ? [{ speaker: "thought", text: voiceLine }] : [];
  // "Geçmişini Hatırlıyor" — same one-flavor-moment-per-intro guard as
  // echo/voice above, plus never on the very first house (that one already
  // has its own dedicated originIntroLines below).
  const originRecognitionLine = useMemo(() => {
    if (celebrity || easterEgg || echoLines || voiceLine) return null;
    if (!origin || showOriginIntro) return null;
    if (Math.random() >= ORIGIN_RECOGNITION_CHANCE) return null;
    return pickOriginRecognitionLine(origin.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [house.id]);
  const originRecognitionLines: DialogueLine[] =
    originRecognitionLine && nodeId === house.startNode ? [{ speaker: "customer1", text: originRecognitionLine }] : [];
  // "Emlah'ın Geçmişi" — one-time, only ever on the very first house.
  const originIntroLines: DialogueLine[] =
    origin && showOriginIntro && nodeId === house.startNode ? [{ speaker: "thought", text: origin.introLine }] : [];
  // "Karar Anıları" — decided entirely by App.tsx (which memory, if any, is
  // eligible this house); picked once via useMemo so the line can't change
  // wording mid-typing across re-renders (same reasoning as
  // conditionWarningThought/Line above).
  const memoryReferenceText = useMemo(() => {
    if (!memoryReference) return null;
    return pickMemoryReferenceLine(memoryReference);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [house.id]);
  const memoryLines: DialogueLine[] =
    memoryReferenceText && nodeId === house.startNode ? [{ speaker: "customer1", text: memoryReferenceText }] : [];
  // Fırat Bey'in yüzü — App.tsx only sets this when isDuel is also true for
  // this exact house, so no extra roll/guard needed here.
  const firatLines: DialogueLine[] = firatEncounter && nodeId === house.startNode ? firatEncounter.lines : [];
  const prependedLines = [
    ...originIntroLines,
    ...celebrityIntroLines,
    ...conditionWarningLines,
    ...easterEggLines,
    ...echoDialogueLines,
    ...voiceDialogueLines,
    ...originRecognitionLines,
    ...memoryLines,
    ...firatLines,
  ];
  const effectiveLines = prependedLines.length > 0 ? [...prependedLines, ...node.lines] : node.lines;
  const linesShown = effectiveLines.slice(0, lineIndex + 1);
  const atLastLine = lineIndex >= effectiveLines.length - 1;

  useEffect(() => {
    if (celebrity) onChoiceEffects(CELEBRITY_FAN_BONUS[celebrity.personality]);
    if (easterEgg) onChoiceEffects({ fun: easterEgg.funBonus });
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
    // Konuşma Tarzı — purely cosmetic suffix on Emlah's own spoken lines only, see data/dialogueStyle.ts.
    if (line.speaker === "emlah") return styleEmlahLine(base, dialogueStyle);
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

  // "Son Dakika Baskısı" — only ever on a genuinely open closing decision
  // (never when the deal's already effectively won), re-rolled per node
  // like the flirt option so it can't be gamed by re-rendering.
  const pressureRoll = useMemo(() => Math.random(), [nodeId]);
  const pressureUnlocked = isClosingNode && !dealAlreadyWon && pressureRoll < LAST_MINUTE_PRESSURE_CHANCE;
  const pressureChoice = useMemo(() => pickPressureChoice(), [nodeId]);

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
    if (pressureUnlocked) finalList = [...finalList, pressureChoice];
    if (isClosingNode && origin) finalList = [...finalList, origin.closingChoice];
    return shuffle(finalList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId, bonusUnlocked, dealAlreadyWon, flirtUnlocked, pressureUnlocked, pressureChoice, origin]);
  // The synthetic flirt-exchange node carries its own single resolving
  // choice — bypass the bonus/flirt/pressure/origin augmentation above so
  // nothing stacks on top of it a second time.
  const choicesToShow = syntheticNode ? syntheticNode.choices : displayChoices;

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
      if (choicesToShow) return;
      e.preventDefault();
      handleBoxClick();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping, atLastLine, currentText, choicesToShow]);

  function pickChoice(choice: Choice) {
    // "Çelişki Motoru" — checked BEFORE the choice's own effects apply, off
    // the SAME onChoiceEffects channel everything else uses (just a much
    // sharper one-off penalty), so a held-firm-then-big-discount about-face
    // gets called out instead of silently resolving. See data/contradiction.ts.
    if (choice.id !== "flirt-bond" && isDiscountContradiction(heldFirmCountRef.current, choice.effects)) {
      const rankMultiplier = contradictionRankMultiplier[rankTitleText ?? "Stajyer"] ?? 1;
      onChoiceEffects({ suspicion: Math.round(CONTRADICTION_SUSPICION_PENALTY * rankMultiplier) });
      heldFirmCountRef.current = 0;
      setSyntheticNode({
        id: "contradiction-callout",
        lines: [{ speaker: "customer1", text: pickDiscountContradictionLine() }],
        choices: [
          {
            id: "contradiction-continue",
            text: "Devam ▸",
            next: choice.next,
            effects: choice.effects?.closingBias !== undefined ? { closingBias: choice.effects.closingBias } : undefined,
          },
        ],
      });
      setLineIndex(0);
      return;
    }
    if (isHeldFirmChoice(choice.effects)) heldFirmCountRef.current += 1;

    if (choice.effects) onChoiceEffects(choice.effects);
    if (choice.effects?.fun) onLineChosen?.(choice.text, choice.effects.fun);
    if (choice.effects) onToneChoice?.(choice.effects);
    if (choice.id === "flirt-bond" && flirtCharacterId && flirtCharacter) {
      onFlirt?.(flirtCharacterId, flirtCharacter.name);
      // Defer the actual sale resolution to a short bonus exchange instead
      // of resolving instantly — same closingBias, just felt as a scene
      // instead of an invisible number. See flirtDialogue.ts.
      // "İçten Soru" — a second, honest-path choice alongside the flirty
      // close. Its suspicion:-5 rides the SAME classifyCompassChoice
      // pipeline every other choice already uses (negative suspicion =
      // durustluk), no bespoke callback needed — and the halved closingBias
      // makes honesty a real, felt tradeoff instead of a free virtue point.
      setSyntheticNode({
        id: "flirt-extra",
        lines: [...pickFlirtExchangeLines(), { speaker: "thought", text: "(içinden) Bu satışı gerçekten hak ediyor muyum, yoksa bu sohbetin tadını mı çıkarıyorum?" }],
        choices: [
          { id: "flirt-bond-resolve", text: pickFlirtClosingLine(), next: "", effects: { closingBias: choice.effects?.closingBias ?? 0 } },
          {
            id: "flirt-honest-check",
            text: "(Ciddileşerek) Dur biraz, bu evi gerçekten istediğinizden emin misiniz?",
            next: "",
            effects: { closingBias: (choice.effects?.closingBias ?? 0) * 0.5, suspicion: -5 },
          },
        ],
      });
      setLineIndex(0);
      return;
    }
    setSyntheticNode(null);
    if (choice.id.startsWith("son-dakika")) onPressureChoicePicked?.();
    if (origin && choice.id === origin.closingChoice.id) onOriginChoicePicked?.();

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
        {isDuel && <span className="duel-tag">⏱️ {duelRivalName ?? "Fırat Bey"} de bu evle ilgileniyor!</span>}
        {easterEgg && nodeId === house.startNode && <span className="easter-egg-tag">{easterEgg.tag}</span>}
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
          const portrait =
            (firatEncounter && displayName === "Fırat Bey" ? firatPortraits[firatEncounter.portraitKey] : undefined) ??
            resolvePortrait(displayName, house, castAssignment) ??
            characterImages[displayName];
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

        {atLastLine && !isTyping && choicesToShow && (
          <div className="choices">
            {choicesToShow.map((c) => (
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
