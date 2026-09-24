import { useEffect, useRef, useState, type ComponentType } from "react";
import { t } from "../data/language";

export type MiniGameTier = "fail" | "ok" | "great";

interface MiniGameProps {
  onComplete: (tier: MiniGameTier) => void;
}

const tierLabel: Record<MiniGameTier, { tr: string; en: string }> = {
  fail: { tr: "Idare eder...", en: "Could be better..." },
  ok: { tr: "Fena değil!", en: "Not bad!" },
  great: { tr: "Harika!", en: "Great!" },
};

function ResultBadge({ tier }: { tier: MiniGameTier }) {
  return <p className={`minigame-result minigame-result-${tier}`}>{t(tierLabel[tier])}</p>;
}

/**
 * 🔑 Anahtar Bul — one key in the grid is rotated and a different color
 * (highlighted from the very start, not hidden) — tap it before time runs
 * out. Trimmed from 4 mini-games down to 2 (this one + the walk) since the
 * message-sort and price-guess ones were confusing/unguessable — see
 * energyBreak.ts's comment.
 */
export function KeyFindMiniGame({ onComplete }: MiniGameProps) {
  const KEY_COUNT = 6;
  const TIME_LIMIT_MS = 5000;
  const [correctIndex] = useState(() => Math.floor(Math.random() * KEY_COUNT));
  const [done, setDone] = useState<MiniGameTier | null>(null);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const timeout = setTimeout(() => finish("fail"), TIME_LIMIT_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish(tier: MiniGameTier) {
    setDone((prev) => prev ?? tier);
    setTimeout(() => onComplete(tier), 700);
  }

  function pick(i: number) {
    if (done) return;
    if (i !== correctIndex) {
      finish("fail");
      return;
    }
    finish(Date.now() - startRef.current <= 2000 ? "great" : "ok");
  }

  return (
    <div className="minigame">
      <p className="minigame-prompt">🔑 {t({ tr: "Farklı duran anahtarı bul!", en: "Find the odd key out!" })}</p>
      <p className="minigame-subtitle">
        {t({
          tr: "Biri döndürülmüş ve renkli — o anahtara dokun, süre bitmeden.",
          en: "One is rotated and a different color — tap that one before time runs out.",
        })}
      </p>
      <div className="minigame-key-grid">
        {Array.from({ length: KEY_COUNT }, (_, i) => (
          <button
            key={i}
            className={`minigame-key-btn ${i === correctIndex ? "minigame-key-correct" : ""}`}
            onClick={() => pick(i)}
            disabled={!!done}
            aria-label={t({ tr: "anahtar", en: "key" })}
          >
            🔑
          </button>
        ))}
      </div>
      {done && <ResultBadge tier={done} />}
    </div>
  );
}

/** 🚶 Kısa Yürüyüş — tap the button as many times as possible before the clock runs out. */
export function WalkMiniGame({ onComplete }: MiniGameProps) {
  const DURATION_MS = 4000;
  const [steps, setSteps] = useState(0);
  const [remainingMs, setRemainingMs] = useState(DURATION_MS);
  const [done, setDone] = useState<MiniGameTier | null>(null);
  const stepsRef = useRef(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const left = Math.max(0, DURATION_MS - (Date.now() - start));
      setRemainingMs(left);
      if (left <= 0) {
        clearInterval(timer);
        const s = stepsRef.current;
        finish(s >= 10 ? "great" : s >= 5 ? "ok" : "fail");
      }
    }, 100);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish(tier: MiniGameTier) {
    setDone((prev) => prev ?? tier);
    setTimeout(() => onComplete(tier), 700);
  }

  function step() {
    if (done || remainingMs <= 0) return;
    stepsRef.current += 1;
    setSteps(stepsRef.current);
  }

  const pct = (remainingMs / DURATION_MS) * 100;

  return (
    <div className="minigame">
      <p className="minigame-prompt">🚶 {t({ tr: "Olabildiğince hızlı adım at!", en: "Take steps as fast as you can!" })}</p>
      <p className="minigame-subtitle">
        {t({
          tr: "Süre dolmadan butona olabildiğince çok tıkla — her tıklama bir adım.",
          en: "Tap the button as many times as you can before time runs out — each tap is one step.",
        })}
      </p>
      <div className="quick-call-timer-track">
        <div className="quick-call-timer-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="minigame-step-count">
        {steps} {t({ tr: "adım", en: "steps" })}
      </p>
      {done ? (
        <ResultBadge tier={done} />
      ) : (
        <button className="pixel-btn minigame-action-btn" onClick={step}>
          {t({ tr: "Adım At!", en: "Take a Step!" })}
        </button>
      )}
    </div>
  );
}

export const miniGameByActivityId: Record<string, ComponentType<MiniGameProps>> = {
  anahtar: KeyFindMiniGame,
  yuruyus: WalkMiniGame,
};
