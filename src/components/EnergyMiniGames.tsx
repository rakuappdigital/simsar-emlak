import { useEffect, useRef, useState, type ComponentType } from "react";
import { t } from "../data/language";

export type MiniGameTier = "fail" | "ok" | "great";

interface MiniGameProps {
  onComplete: (tier: MiniGameTier) => void;
}

const ATTEMPTS_PER_SESSION = 3;

function AttemptRow({ statuses, current }: { statuses: (MiniGameTier | null)[]; current: number }) {
  return (
    <div className="minigame-attempt-row">
      {statuses.map((status, i) => (
        <span
          key={i}
          className={`minigame-attempt-chip ${status === "great" ? "minigame-attempt-done" : status === "fail" ? "minigame-attempt-failed" : i === current ? "minigame-attempt-current" : ""}`}
        >
          {i + 1}
        </span>
      ))}
    </div>
  );
}

/**
 * 🔑 Anahtar Bul — shell game. One key is shown for a beat, boxes close and
 * shuffle, then the player picks. Up to ATTEMPTS_PER_SESSION tries in a row;
 * the first correct pick wins and ends the session, 3 misses end it with no
 * reward. See EnergyBreakScreen for how a whole session maps to one "play"
 * of the 8h/2-play schedule in minigameSchedule.ts.
 */
export function KeyFindMiniGame({ onComplete }: MiniGameProps) {
  const KEY_COUNT = 4;
  const REVEAL_MS = 2000;
  const SWAP_STEP_MS = 300;

  const [attemptIndex, setAttemptIndex] = useState(0);
  const [attemptStatus, setAttemptStatus] = useState<(MiniGameTier | null)[]>(Array(ATTEMPTS_PER_SESSION).fill(null));
  const [phase, setPhase] = useState<"watch" | "shuffle" | "pick" | "between" | "done">("watch");
  const [slots, setSlots] = useState<{ id: number; correct: boolean }[]>([]);
  const [correctSlotId, setCorrectSlotId] = useState(0);
  const [pickedId, setPickedId] = useState<number | null>(null);
  const [sessionResult, setSessionResult] = useState<MiniGameTier | null>(null);
  const nextIdRef = useRef(0);

  useEffect(() => {
    startAttempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startAttempt() {
    const correct = Math.floor(Math.random() * KEY_COUNT);
    const fresh = Array.from({ length: KEY_COUNT }, (_, i) => ({ id: nextIdRef.current++, correct: i === correct }));
    setSlots(fresh);
    setCorrectSlotId(fresh[correct].id);
    setPickedId(null);
    setPhase("watch");

    setTimeout(() => {
      setPhase("shuffle");
      runShuffle(fresh);
    }, REVEAL_MS);
  }

  function runShuffle(startSlots: { id: number; correct: boolean }[]) {
    let arr = startSlots.slice();
    const touched = new Set<number>();
    const swaps: [number, number][] = [];
    while (swaps.length < 10 || touched.size < KEY_COUNT) {
      const a = Math.floor(Math.random() * KEY_COUNT);
      const b = Math.floor(Math.random() * KEY_COUNT);
      if (a === b) continue;
      swaps.push([a, b]);
      touched.add(a);
      touched.add(b);
      if (swaps.length > 30) break;
    }

    let step = 0;
    function doStep() {
      if (step >= swaps.length) {
        setPhase("pick");
        return;
      }
      const [a, b] = swaps[step];
      arr = arr.slice();
      const tmp = arr[a];
      arr[a] = arr[b];
      arr[b] = tmp;
      setSlots(arr);
      step += 1;
      setTimeout(doStep, SWAP_STEP_MS);
    }
    doStep();
  }

  function pick(id: number) {
    if (phase !== "pick") return;
    setPickedId(id);
    const won = id === correctSlotId;
    const newStatus = attemptStatus.slice();
    newStatus[attemptIndex] = won ? "great" : "fail";
    setAttemptStatus(newStatus);

    if (won) {
      setPhase("done");
      setSessionResult("great");
      setTimeout(() => onComplete("great"), 900);
      return;
    }

    if (attemptIndex < ATTEMPTS_PER_SESSION - 1) {
      setPhase("between");
      setTimeout(() => {
        setAttemptIndex((n) => n + 1);
        startAttempt();
      }, 900);
    } else {
      setPhase("done");
      setSessionResult("fail");
      setTimeout(() => onComplete("fail"), 900);
    }
  }

  const promptText =
    phase === "watch"
      ? t({ tr: "🔑 Doğru anahtarı ezberle!", en: "🔑 Memorize the right key!" })
      : phase === "shuffle"
        ? t({ tr: "🔀 Karıştırılıyor...", en: "🔀 Shuffling..." })
        : phase === "pick"
          ? t({ tr: "🔑 Hangi kutu?", en: "🔑 Which box?" })
          : phase === "between"
            ? t({ tr: "Olmadı, sıradaki deneme...", en: "Missed it, next try..." })
            : sessionResult === "great"
              ? ""
              : "";

  return (
    <div className="minigame">
      <AttemptRow statuses={attemptStatus} current={attemptIndex} />
      <p className="minigame-prompt">{promptText}</p>
      {phase === "watch" && (
        <p className="minigame-subtitle">{t({ tr: "Kutular birazdan kapanıp karışacak.", en: "The boxes will close and shuffle shortly." })}</p>
      )}
      <div className="minigame-key-grid">
        {slots.map((slot) => {
          const isRevealed = phase === "watch" && slot.correct;
          const isPicked = pickedId === slot.id;
          const showKey = isRevealed || (isPicked && phase === "done") || (phase === "done" && sessionResult === "fail" && slot.id === correctSlotId);
          return (
            <button
              key={slot.id}
              className={`minigame-key-btn ${isRevealed ? "minigame-key-correct" : ""} ${isPicked && phase === "done" && sessionResult === "great" ? "minigame-key-hit" : ""} ${isPicked && phase === "done" && sessionResult === "fail" && slot.id !== correctSlotId ? "minigame-key-miss" : ""} ${phase === "done" && slot.id === correctSlotId ? "minigame-key-hit" : ""}`}
              onClick={() => pick(slot.id)}
              disabled={phase !== "pick"}
              aria-label={t({ tr: "kutu", en: "box" })}
            >
              {showKey ? "🔑" : "📦"}
            </button>
          );
        })}
      </div>
      {phase === "done" && sessionResult && (
        <p className={`minigame-result minigame-result-${sessionResult}`}>
          {sessionResult === "great" ? t({ tr: "Enerji kazandın!", en: "You earned energy!" }) : t({ tr: "3 deneme de tutmadı, ödül yok.", en: "All 3 tries missed, no reward." })}
        </p>
      )}
    </div>
  );
}

/**
 * 🚶 Kısa Yürüyüş — tap as many times as possible in 4s. Up to
 * ATTEMPTS_PER_SESSION tries in a row, target rising by 5 steps each try
 * (10 / 15 / 20); the first try that reaches its target wins and ends the
 * session, missing all 3 ends it with no reward.
 */
export function WalkMiniGame({ onComplete }: MiniGameProps) {
  const DURATION_MS = 4000;
  const STAGE_TARGETS = [10, 15, 20];

  const [attemptIndex, setAttemptIndex] = useState(0);
  const [attemptStatus, setAttemptStatus] = useState<(MiniGameTier | null)[]>(Array(ATTEMPTS_PER_SESSION).fill(null));
  const [steps, setSteps] = useState(0);
  const [remainingMs, setRemainingMs] = useState(DURATION_MS);
  const [running, setRunning] = useState(true);
  const [sessionResult, setSessionResult] = useState<MiniGameTier | null>(null);
  const stepsRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const left = Math.max(0, DURATION_MS - (Date.now() - start));
      setRemainingMs(left);
      if (left <= 0) {
        clearInterval(timer);
        finishAttempt();
      }
    }, 100);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptIndex, running]);

  function finishAttempt() {
    const target = STAGE_TARGETS[attemptIndex];
    const won = stepsRef.current >= target;
    const newStatus = attemptStatus.slice();
    newStatus[attemptIndex] = won ? "great" : "fail";
    setAttemptStatus(newStatus);
    setRunning(false);

    if (won) {
      setSessionResult("great");
      setTimeout(() => onComplete("great"), 700);
      return;
    }

    if (attemptIndex < ATTEMPTS_PER_SESSION - 1) {
      setTimeout(() => {
        stepsRef.current = 0;
        setSteps(0);
        setRemainingMs(DURATION_MS);
        setAttemptIndex((n) => n + 1);
        setRunning(true);
      }, 700);
    } else {
      setSessionResult("fail");
      setTimeout(() => onComplete("fail"), 700);
    }
  }

  function step() {
    if (!running) return;
    stepsRef.current += 1;
    setSteps(stepsRef.current);
  }

  const target = STAGE_TARGETS[attemptIndex];
  const pct = (remainingMs / DURATION_MS) * 100;

  return (
    <div className="minigame">
      <AttemptRow statuses={attemptStatus} current={attemptIndex} />
      <p className="minigame-prompt">
        🚶 {t({ tr: "Hedef:", en: "Target:" })} {target} {t({ tr: "adım", en: "steps" })}
      </p>
      {running && (
        <>
          <div className="quick-call-timer-track">
            <div className="quick-call-timer-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="minigame-step-count">
            {steps} {t({ tr: "adım", en: "steps" })}
          </p>
          <button className="pixel-btn minigame-action-btn" onClick={step}>
            {t({ tr: "Adım At!", en: "Take a Step!" })}
          </button>
        </>
      )}
      {!running && sessionResult && (
        <p className={`minigame-result minigame-result-${sessionResult}`}>
          {sessionResult === "great" ? t({ tr: "Enerji kazandın!", en: "You earned energy!" }) : t({ tr: "3 deneme de tutmadı, ödül yok.", en: "All 3 tries missed, no reward." })}
        </p>
      )}
    </div>
  );
}

export const miniGameByActivityId: Record<string, ComponentType<MiniGameProps>> = {
  anahtar: KeyFindMiniGame,
  yuruyus: WalkMiniGame,
};
