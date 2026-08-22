import { useEffect, useRef, useState, type ComponentType } from "react";

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

/** ☕ Kahve Molası — a marker ping-pongs across a track, tap "Dur!" while it's inside the highlighted zone. */
export function CoffeeMiniGame({ onComplete }: MiniGameProps) {
  const [pos, setPos] = useState(0);
  const [done, setDone] = useState<MiniGameTier | null>(null);
  const posRef = useRef(0);
  const dirRef = useRef(1);
  const zone = useRef({ start: 30 + Math.random() * 40 - 10, width: 14 });

  useEffect(() => {
    const speed = 1.6; // percent per tick
    const t = setInterval(() => {
      let next = posRef.current + dirRef.current * speed;
      if (next >= 100) {
        next = 100;
        dirRef.current = -1;
      } else if (next <= 0) {
        next = 0;
        dirRef.current = 1;
      }
      posRef.current = next;
      setPos(next);
    }, 16);
    const timeout = setTimeout(() => finish("fail"), 6000);
    return () => {
      clearInterval(t);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish(tier: MiniGameTier) {
    setDone(tier);
    setTimeout(() => onComplete(tier), 700);
  }

  function stop() {
    if (done) return;
    const zoneCenter = zone.current.start + zone.current.width / 2;
    const dist = Math.abs(posRef.current - zoneCenter);
    if (dist <= zone.current.width / 2) finish("great");
    else if (dist <= zone.current.width) finish("ok");
    else finish("fail");
  }

  return (
    <div className="minigame">
      <p className="minigame-prompt">☕ Kahveyi tam kıvamında durdur!</p>
      <div className="minigame-track">
        <div className="minigame-zone" style={{ left: `${zone.current.start}%`, width: `${zone.current.width}%` }} />
        <div className="minigame-marker" style={{ left: `${pos}%` }} />
      </div>
      {done ? <ResultBadge tier={done} /> : (
        <button className="pixel-btn minigame-action-btn" onClick={stop}>
          Dur!
        </button>
      )}
    </div>
  );
}

/** 🎧 Müzik Dinle — 5 beats pulse at a fixed tempo, tap "Vur" in sync with each one. */
export function MusicMiniGame({ onComplete }: MiniGameProps) {
  const BEAT_MS = 750;
  const TOLERANCE_MS = 280;
  const BEAT_COUNT = 5;
  const [beatIndex, setBeatIndex] = useState(-1);
  const [pulse, setPulse] = useState(false);
  const [done, setDone] = useState<MiniGameTier | null>(null);
  const hitsRef = useRef(0);
  const lastBeatAtRef = useRef(0);
  const hitThisBeatRef = useRef(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < BEAT_COUNT; i++) {
      timers.push(
        setTimeout(() => {
          setBeatIndex(i);
          setPulse(true);
          lastBeatAtRef.current = Date.now();
          hitThisBeatRef.current = false;
          setTimeout(() => setPulse(false), TOLERANCE_MS);
        }, i * BEAT_MS + 400),
      );
    }
    timers.push(
      setTimeout(() => {
        const hits = hitsRef.current;
        finish(hits >= 4 ? "great" : hits >= 2 ? "ok" : "fail");
      }, BEAT_COUNT * BEAT_MS + 700),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish(tier: MiniGameTier) {
    setDone((prev) => prev ?? tier);
    setTimeout(() => onComplete(tier), 700);
  }

  function hit() {
    if (done) return;
    if (hitThisBeatRef.current) return;
    const sinceBeat = Date.now() - lastBeatAtRef.current;
    if (sinceBeat >= 0 && sinceBeat <= TOLERANCE_MS + 120) {
      hitThisBeatRef.current = true;
      hitsRef.current += 1;
    }
  }

  return (
    <div className="minigame">
      <p className="minigame-prompt">🎧 Ritme uyup her vuruşta dokun!</p>
      <div className="minigame-beats">
        {Array.from({ length: BEAT_COUNT }, (_, i) => (
          <span key={i} className={`minigame-beat ${i === beatIndex && pulse ? "minigame-beat-active" : ""} ${i < beatIndex || (i === beatIndex && !pulse) ? "minigame-beat-passed" : ""}`}>
            🎵
          </span>
        ))}
      </div>
      {done ? <ResultBadge tier={done} /> : (
        <button className="pixel-btn minigame-action-btn" onClick={hit}>
          Vur!
        </button>
      )}
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

/** 😴 Masada Şekerleme — a one-shot sleep bar fills, press "Uyan!" inside the highlighted window: not too early, not too late. */
export function NapMiniGame({ onComplete }: MiniGameProps) {
  const DURATION_MS = 4200;
  const [pos, setPos] = useState(0);
  const [done, setDone] = useState<MiniGameTier | null>(null);
  const posRef = useRef(0);
  const window_ = useRef({ start: 55, width: 18 });

  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const elapsed = Date.now() - start;
      const next = Math.min(100, (elapsed / DURATION_MS) * 100);
      posRef.current = next;
      setPos(next);
      if (next >= 100) {
        clearInterval(t);
        finish("fail");
      }
    }, 16);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish(tier: MiniGameTier) {
    setDone((prev) => prev ?? tier);
    setTimeout(() => onComplete(tier), 700);
  }

  function wake() {
    if (done) return;
    const { start: zStart, width } = window_.current;
    const p = posRef.current;
    if (p >= zStart && p <= zStart + width) finish("great");
    else if (p >= zStart - 12 && p <= zStart + width + 12) finish("ok");
    else finish("fail");
  }

  return (
    <div className="minigame">
      <p className="minigame-prompt">😴 Ne çok erken ne çok geç, tam kıvamında uyan!</p>
      <div className="minigame-track">
        <div className="minigame-zone" style={{ left: `${window_.current.start}%`, width: `${window_.current.width}%` }} />
        <div className="minigame-marker" style={{ left: `${pos}%` }} />
      </div>
      {done ? <ResultBadge tier={done} /> : (
        <button className="pixel-btn minigame-action-btn" onClick={wake}>
          Uyan!
        </button>
      )}
    </div>
  );
}

export const miniGameByActivityId: Record<string, ComponentType<MiniGameProps>> = {
  kahve: CoffeeMiniGame,
  muzik: MusicMiniGame,
  yuruyus: WalkMiniGame,
  sekerleme: NapMiniGame,
};
