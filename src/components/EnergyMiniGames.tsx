import { useEffect, useRef, useState, type ComponentType } from "react";
import { formatTL } from "../data/economy";

export type MiniGameTier = "fail" | "ok" | "great";

interface MiniGameProps {
  onComplete: (tier: MiniGameTier) => void;
}

const tierLabel: Record<MiniGameTier, string> = {
  fail: "Idare eder...",
  ok: "Fena değil!",
  great: "Harika!",
};

function ResultBadge({ tier }: { tier: MiniGameTier }) {
  return <p className={`minigame-result minigame-result-${tier}`}>{tierLabel[tier]}</p>;
}

/** 🔑 Anahtar Bul — bir düzine görsel olarak neredeyse aynı anahtar arasından belirgin şekilde farklı olanı hızlıca bul. */
export function KeyFindMiniGame({ onComplete }: MiniGameProps) {
  const KEY_COUNT = 6;
  const [correctIndex] = useState(() => Math.floor(Math.random() * KEY_COUNT));
  const [done, setDone] = useState<MiniGameTier | null>(null);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const timeout = setTimeout(() => finish("fail"), 3500);
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
    finish(Date.now() - startRef.current <= 1400 ? "great" : "ok");
  }

  return (
    <div className="minigame">
      <p className="minigame-prompt">🔑 Farklı duran anahtarı hızlıca bul!</p>
      <div className="minigame-key-grid">
        {Array.from({ length: KEY_COUNT }, (_, i) => (
          <button
            key={i}
            className={`minigame-key-btn ${i === correctIndex ? "minigame-key-correct" : ""}`}
            onClick={() => pick(i)}
            disabled={!!done}
            aria-label="anahtar"
          >
            🔑
          </button>
        ))}
      </div>
      {done && <ResultBadge tier={done} />}
    </div>
  );
}

/** 📱 Mesajları Sırala — 3 karışık mesaj balonunu doğru kronolojik sırayla dokunarak seç. */
const MESSAGE_SETS: [string, string, string][] = [
  ["Bugün müsait misiniz?", "Evi gördüm, çok beğendim!", "O zaman sözleşmeyi imzalayalım."],
  ["Fiyat konusunda düşünüyorum.", "Biraz daha indirim olur mu acaba?", "Tamam, anlaştık o zaman!"],
  ["Merhaba, ilanınızla ilgileniyorum.", "Yarın bakabilir miyim?", "Harika, o zaman görüşürüz."],
];

export function MessageSortMiniGame({ onComplete }: MiniGameProps) {
  const [setIndex] = useState(() => Math.floor(Math.random() * MESSAGE_SETS.length));
  const correctOrder = MESSAGE_SETS[setIndex];
  const [displayOrder] = useState(() => {
    const idx = [0, 1, 2];
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx;
  });
  const [picked, setPicked] = useState<number[]>([]);
  const [done, setDone] = useState<MiniGameTier | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => finish("fail"), 7000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish(tier: MiniGameTier) {
    setDone((prev) => prev ?? tier);
    setTimeout(() => onComplete(tier), 700);
  }

  function pick(originalIdx: number) {
    if (done || picked.includes(originalIdx)) return;
    const expected = picked.length;
    const nextPicked = [...picked, originalIdx];
    setPicked(nextPicked);
    if (originalIdx !== expected) {
      finish(nextPicked.length >= 2 ? "ok" : "fail");
      return;
    }
    if (nextPicked.length === correctOrder.length) finish("great");
  }

  return (
    <div className="minigame">
      <p className="minigame-prompt">📱 Mesajları doğru kronolojik sırayla dokun!</p>
      <div className="minigame-message-list">
        {displayOrder.map((originalIdx) => (
          <button
            key={originalIdx}
            className="minigame-message-btn"
            disabled={!!done || picked.includes(originalIdx)}
            onClick={() => pick(originalIdx)}
          >
            {correctOrder[originalIdx]}
          </button>
        ))}
      </div>
      {done && <ResultBadge tier={done} />}
    </div>
  );
}

/** 🚶 Kısa Yürüyüş — tap "Adım At" as many times as possible before the clock runs out. */
export function WalkMiniGame({ onComplete }: MiniGameProps) {
  const DURATION_MS = 4000;
  const [steps, setSteps] = useState(0);
  const [remainingMs, setRemainingMs] = useState(DURATION_MS);
  const [done, setDone] = useState<MiniGameTier | null>(null);
  const stepsRef = useRef(0);

  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const left = Math.max(0, DURATION_MS - (Date.now() - start));
      setRemainingMs(left);
      if (left <= 0) {
        clearInterval(t);
        const s = stepsRef.current;
        finish(s >= 10 ? "great" : s >= 5 ? "ok" : "fail");
      }
    }, 100);
    return () => clearInterval(t);
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
      <p className="minigame-prompt">🚶 Süre bitmeden olabildiğince adım at!</p>
      <div className="quick-call-timer-track">
        <div className="quick-call-timer-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="minigame-step-count">{steps} adım</p>
      {done ? <ResultBadge tier={done} /> : (
        <button className="pixel-btn minigame-action-btn" onClick={step}>
          Adım At!
        </button>
      )}
    </div>
  );
}

/** 🏷️ Fiyat Tahmin Et — sentetik bir ev fiyatına en yakın seçeneği tahmin et (gerçek ev verisine bağımlı değil, kendi kendine yeterli). */
export function PriceGuessMiniGame({ onComplete }: MiniGameProps) {
  const [target] = useState(() => 500000 + Math.floor(1 + Math.random() * 20) * 250000);
  const [options] = useState(() => {
    const low = Math.round((target * (0.5 + Math.random() * 0.2)) / 1000) * 1000;
    const high = Math.round((target * (1.3 + Math.random() * 0.3)) / 1000) * 1000;
    const opts = [target, low, high];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  });
  const [done, setDone] = useState<MiniGameTier | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => finish("fail"), 4500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish(tier: MiniGameTier) {
    setDone((prev) => prev ?? tier);
    setTimeout(() => onComplete(tier), 700);
  }

  function pick(value: number) {
    if (done) return;
    if (value === target) {
      finish("great");
      return;
    }
    finish(Math.abs(value - target) / target <= 0.35 ? "ok" : "fail");
  }

  return (
    <div className="minigame">
      <p className="minigame-prompt">🏷️ Bu evin gerçek fiyatı hangisi?</p>
      <div className="minigame-price-options">
        {options.map((v) => (
          <button key={v} className="pixel-btn small minigame-action-btn" disabled={!!done} onClick={() => pick(v)}>
            {formatTL(v)}
          </button>
        ))}
      </div>
      {done && <ResultBadge tier={done} />}
    </div>
  );
}

export const miniGameByActivityId: Record<string, ComponentType<MiniGameProps>> = {
  anahtar: KeyFindMiniGame,
  "mesaj-sirala": MessageSortMiniGame,
  yuruyus: WalkMiniGame,
  "fiyat-tahmin": PriceGuessMiniGame,
};
