import { useEffect, useRef, useState, type ComponentType } from "react";
import { t } from "../data/language";

/**
 * "Bugünün Aktiviteleri" mini oyunları — enerji aktivitenin giriş ücreti,
 * ödül ise performansa göre 3 kademe: 0 = yarım, 1 = tam, 2 = mükemmel.
 * Oyun bitince sonuç ekranı gösterilir; ödül ancak oyuncu "Tamam"a basınca
 * onComplete ile App'e bildirilir (App etkiyi ve enerjiyi o anda uygular).
 * Ödül metinleri App'ten gelir ki tek doğruluk kaynağı data/dayActivities.ts olsun.
 */
export type ActivityTier = 0 | 1 | 2;

export interface ActivityMiniGameProps {
  /** Her kademe için oyuncuya gösterilecek ödül metni. */
  rewardLabels: [string, string, string];
  /** Sonuç ekranına eklenecek ekstra satır (ör. "Unutulmuş dosya bulundu") — kademeye göre App karar verir. */
  onFinish: (tier: ActivityTier) => string | null;
  onComplete: (tier: ActivityTier) => void;
}

const TIER_TITLE: Record<ActivityTier, { tr: string; en: string }> = {
  0: { tr: "Yarım Ödül", en: "Half Reward" },
  1: { tr: "Tam Ödül", en: "Full Reward" },
  2: { tr: "Mükemmel!", en: "Perfect!" },
};

function ResultPanel({
  tier,
  summary,
  reward,
  extra,
  onDone,
}: {
  tier: ActivityTier;
  summary: string;
  reward: string;
  extra: string | null;
  onDone: () => void;
}) {
  return (
    <div className="activity-game-overlay">
      <p className={`activity-game-result-title activity-tier-${tier}`}>{t(TIER_TITLE[tier])}</p>
      <p className="activity-game-summary">{summary}</p>
      <p className="activity-game-reward">{reward}</p>
      {extra && <p className="activity-game-extra">{extra}</p>}
      <button className="pixel-btn" onClick={onDone}>
        {t({ tr: "Tamam", en: "OK" })}
      </button>
    </div>
  );
}

/* ================================================================ */
/* 📣 Vitrin Karesi — ilan için 3 fotoğraf                            */
/* ================================================================ */

const VITRIN_W = 320;
const VITRIN_H = 380;
const ROOM_W = 900;
const FRAME_W = 220;
const FRAME_Y = 36;
const FRAME_H = 226;
const FLOOR_Y = 200;
const VITRIN_DURATION = 25;

type RoomItem = { e: string; x: number; y: number; s: number; points: number };

const VITRIN_FULL = 7;
const VITRIN_BEST = 13;

function buildRoom(): RoomItem[] {
  return [
    { e: "🪟", x: 120 + Math.random() * 60, y: 105, s: 60, points: 3 },
    { e: "🪴", x: 330 + Math.random() * 60, y: 200, s: 46, points: 2 },
    { e: "🛋️", x: 560 + Math.random() * 60, y: 200, s: 60, points: 2 },
    { e: "🖼️", x: 760 + Math.random() * 50, y: 105, s: 42, points: 1 },
    { e: "🧺", x: 240 + Math.random() * 380, y: 222, s: 38, points: -2 },
    { e: "crack", x: 180 + Math.random() * 560, y: 135, s: 40, points: -3 },
  ];
}

export function VitrinKaresiGame({ rewardLabels, onFinish, onComplete }: ActivityMiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [scores, setScores] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(VITRIN_DURATION);
  const [flash, setFlash] = useState(false);
  const [result, setResult] = useState<{ tier: ActivityTier; extra: string | null } | null>(null);
  const scoresRef = useRef<number[]>([]);
  const finishedRef = useRef(false);
  // Animasyon durumu her karede değişir — React state yerine ref (gereksiz render yok).
  const sim = useRef({
    items: buildRoom(),
    cat: { x: Math.random() * ROOM_W, dir: Math.random() < 0.5 ? -1 : 1, pause: 0 },
    cam: 40,
    camDir: 1,
    shot: 0,
    t: VITRIN_DURATION,
  });

  const toScreen = (roomX: number, cam: number) => roomX - cam + (VITRIN_W - FRAME_W) / 2;
  const inFrame = (roomX: number, cam: number) => {
    const sx = toScreen(roomX, cam);
    const left = (VITRIN_W - FRAME_W) / 2;
    return sx > left + 8 && sx < left + FRAME_W - 8;
  };

  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const s = sim.current;
    const cam = s.cam;
    ctx.setTransform(canvas.width / VITRIN_W, 0, 0, canvas.height / VITRIN_H, 0, 0);
    ctx.fillStyle = "#2b2140";
    ctx.fillRect(0, 0, VITRIN_W, VITRIN_H);
    for (let x = -(cam % 60); x < VITRIN_W; x += 60) {
      ctx.fillStyle = "#302548";
      ctx.fillRect(x, 20, 30, FLOOR_Y - 20);
    }
    ctx.fillStyle = "#4a3426";
    ctx.fillRect(0, FLOOR_Y, VITRIN_W, VITRIN_H - FLOOR_Y);
    for (let x = -(cam % 44); x < VITRIN_W; x += 44) {
      ctx.fillStyle = "#3f2c20";
      ctx.fillRect(x, FLOOR_Y, 2, VITRIN_H - FLOOR_Y);
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const it of s.items) {
      const sx = toScreen(it.x, cam);
      if (sx < -80 || sx > VITRIN_W + 80) continue;
      if (it.e === "crack") {
        ctx.strokeStyle = "#140d1c";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(sx - 18, it.y - 16);
        ctx.lineTo(sx - 4, it.y);
        ctx.lineTo(sx - 12, it.y + 6);
        ctx.lineTo(sx + 16, it.y + 20);
        ctx.stroke();
      } else {
        ctx.font = `${it.s}px serif`;
        ctx.fillText(it.e, sx, it.y);
      }
    }
    ctx.font = "38px serif";
    ctx.save();
    ctx.translate(toScreen(s.cat.x, cam), 238);
    ctx.scale(s.cat.dir, 1);
    ctx.fillText("🐈", 0, 0);
    ctx.restore();

    const left = (VITRIN_W - FRAME_W) / 2;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, VITRIN_W, FRAME_Y);
    ctx.fillRect(0, FRAME_Y + FRAME_H, VITRIN_W, VITRIN_H);
    ctx.fillRect(0, FRAME_Y, left, FRAME_H);
    ctx.fillRect(left + FRAME_W, FRAME_Y, VITRIN_W - left - FRAME_W, FRAME_H);
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 3;
    const L = 18;
    const corners: [number, number, number, number][] = [
      [left, FRAME_Y, 1, 1],
      [left + FRAME_W, FRAME_Y, -1, 1],
      [left, FRAME_Y + FRAME_H, 1, -1],
      [left + FRAME_W, FRAME_Y + FRAME_H, -1, -1],
    ];
    for (const [x, y, dx, dy] of corners) {
      ctx.beginPath();
      ctx.moveTo(x + dx * L, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + dy * L);
      ctx.stroke();
    }
  }

  function finish(finalScores: number[]) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const padded = [...finalScores];
    while (padded.length < 3) padded.push(-2); // çekilmeyen kare ceza sayılır
    setScores(padded);
    const total = padded.reduce((a, b) => a + b, 0);
    const tier: ActivityTier = total >= VITRIN_BEST ? 2 : total >= VITRIN_FULL ? 1 : 0;
    setResult({ tier, extra: onFinish(tier) });
    setPhase("done");
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = VITRIN_W * dpr;
      canvas.height = VITRIN_H * dpr;
    }
    draw();
    if (phase !== "play") return;
    let raf = 0;
    let last = 0;
    let lastShownSecond = VITRIN_DURATION;
    const tick = (now: number) => {
      const s = sim.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      s.t -= dt;
      s.cam += s.camDir * (150 + s.shot * 70) * dt; // her karede hızlanır
      if (s.cam > ROOM_W - 40) { s.cam = ROOM_W - 40; s.camDir = -1; }
      if (s.cam < 40) { s.cam = 40; s.camDir = 1; }
      const c = s.cat;
      if (c.pause > 0) c.pause -= dt;
      else {
        c.x += c.dir * 70 * dt;
        if (c.x < 30 || c.x > ROOM_W - 30 || Math.random() < 0.006) c.dir *= -1;
        if (Math.random() < 0.004) c.pause = 0.8 + Math.random();
      }
      draw();
      const sec = Math.ceil(Math.max(0, s.t));
      if (sec !== lastShownSecond) {
        lastShownSecond = sec;
        setTimeLeft(sec);
      }
      if (s.t <= 0) {
        finish(scoresRef.current);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function snap() {
    if (phase !== "play" || finishedRef.current) return;
    const s = sim.current;
    let score = 0;
    for (const it of s.items) if (inFrame(it.x, s.cam)) score += it.points;
    if (inFrame(s.cat.x, s.cam)) score -= 3;
    s.shot += 1;
    setFlash(true);
    setTimeout(() => setFlash(false), 90);
    const next = [...scoresRef.current, score];
    scoresRef.current = next;
    setScores(next);
    if (next.length >= 3) finish(next);
  }

  const total = scores.reduce((a, b) => a + b, 0);

  return (
    <div className="activity-game">
      <div className="activity-game-head">
        <span className="activity-game-title">📣 {t({ tr: "Vitrin Karesi", en: "Listing Shot" })}</span>
        <span className="activity-game-meta">
          {phase === "play" ? `⏱ ${timeLeft}s · ${total} ${t({ tr: "puan", en: "pts" })}` : ""}
        </span>
      </div>
      <div className="activity-game-stage">
        <canvas ref={canvasRef} className="activity-game-canvas" />
        <div className="vitrin-shots">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`vitrin-shot ${scores[i] !== undefined ? "vitrin-shot-done" : ""}`}>
              {scores[i] !== undefined ? (scores[i] > 0 ? `+${scores[i]}` : `${scores[i]}`) : i + 1}
            </span>
          ))}
        </div>
        {phase === "play" && (
          <button className="pixel-btn vitrin-snap" onClick={snap}>
            📸 {t({ tr: "ÇEK", en: "SNAP" })}
          </button>
        )}
        {flash && <div className="vitrin-flash" />}
        {phase === "intro" && (
          <div className="activity-game-overlay">
            <p className="activity-game-summary">
              {t({
                tr: "İlan için 3 fotoğraf çek. Pencere +3, bitki ve koltuk +2, tablo +1. Çatlak −3, kedi −3, çamaşır −2. Vizör her karede hızlanır.",
                en: "Take 3 photos for the listing. Window +3, plant and sofa +2, painting +1. Crack −3, cat −3, laundry −2. The viewfinder speeds up each shot.",
              })}
            </p>
            <div className="activity-game-rewards">
              {rewardLabels.map((r, i) => (
                <span key={i} className={`activity-game-reward-chip activity-tier-${i}`}>
                  {t(TIER_TITLE[i as ActivityTier])}: {r}
                </span>
              ))}
            </div>
            <button className="pixel-btn" onClick={() => setPhase("play")}>
              {t({ tr: "Başla", en: "Start" })}
            </button>
          </div>
        )}
        {phase === "done" && result && (
          <ResultPanel
            tier={result.tier}
            summary={`${scores.map((s) => (s > 0 ? `+${s}` : `${s}`)).join(" · ")} = ${total} ${t({ tr: "puan", en: "pts" })}`}
            reward={rewardLabels[result.tier]}
            extra={result.extra}
            onDone={() => onComplete(result.tier)}
          />
        )}
      </div>
    </div>
  );
}

/* ================================================================ */
/* 🗂️ Tapu Masası — kurallara göre onayla / reddet                    */
/* ================================================================ */

const TAPU_DURATION = 25;
const TAPU_NAMES = ["Ayşe Kaya", "Mehmet Demir", "Zeynep Arslan", "Can Öztürk", "Elif Şahin", "Murat Yıldız"];
const TAPU_SIGNATURES = ["M.Demir", "A.Kaya", "Z.Arslan", "E.Şahin", "C.Öztürk"];
const NUMBER_WORDS: Record<number, { tr: string; en: string }> = {
  1: { tr: "bir", en: "one" },
  2: { tr: "iki", en: "two" },
  3: { tr: "üç", en: "three" },
  4: { tr: "dört", en: "four" },
  5: { tr: "beş", en: "five" },
  6: { tr: "altı", en: "six" },
  7: { tr: "yedi", en: "seven" },
  8: { tr: "sekiz", en: "eight" },
  9: { tr: "dokuz", en: "nine" },
};

type Flaw = "sig" | "year" | "amount" | "seal";
interface TapuDoc {
  key: number;
  name: string;
  month: number;
  year: number;
  num: number;
  word: number;
  signature: string | null;
  sealed: boolean;
  flaw: Flaw | null;
}

/** Yeni kuralın (mühür) devreye girdiği belge sırası. */
const SEAL_RULE_AFTER = 5;

function makeTapuDoc(key: number, sealRule: boolean): TapuDoc {
  const pickOne = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const num = 2 + Math.floor(Math.random() * 8);
  const doc: TapuDoc = {
    key,
    name: pickOne(TAPU_NAMES),
    month: 1 + Math.floor(Math.random() * 9),
    year: 2026,
    num,
    word: num,
    signature: pickOne(TAPU_SIGNATURES),
    sealed: sealRule ? true : Math.random() < 0.5,
    flaw: null,
  };
  // Belgelerin yaklaşık yarısında tek bir hata olur.
  if (Math.random() < 0.5) {
    const flaws: Flaw[] = sealRule ? ["sig", "year", "amount", "seal"] : ["sig", "year", "amount"];
    const flaw = pickOne(flaws);
    if (flaw === "sig") doc.signature = null;
    if (flaw === "year") doc.year = pickOne([2024, 2025, 2027]);
    if (flaw === "amount") doc.word = num === 9 ? 8 : num + 1;
    if (flaw === "seal") doc.sealed = false;
    doc.flaw = flaw;
  }
  return doc;
}

const FLAW_TEXT: Record<Flaw, { tr: string; en: string }> = {
  sig: { tr: "İmza yoktu!", en: "No signature!" },
  year: { tr: "Tarih yanlıştı!", en: "Wrong date!" },
  amount: { tr: "Tutar tutmuyordu!", en: "Amounts didn't match!" },
  seal: { tr: "Mühür yoktu!", en: "No seal!" },
};

export function TapuMasasiGame({ rewardLabels, onFinish, onComplete }: ActivityMiniGameProps) {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [timeLeft, setTimeLeft] = useState(TAPU_DURATION);
  const [doc, setDoc] = useState<TapuDoc | null>(null);
  const [leaving, setLeaving] = useState<"ok" | "no" | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [toast, setToast] = useState<{ text: string; good: boolean } | null>(null);
  const [result, setResult] = useState<{ tier: ActivityTier; extra: string | null } | null>(null);
  const countRef = useRef(0);
  const scoreRef = useRef({ correct: 0, wrong: 0 });
  const sealRule = countRef.current > SEAL_RULE_AFTER;

  function nextDoc() {
    countRef.current += 1;
    setDoc(makeTapuDoc(countRef.current, countRef.current > SEAL_RULE_AFTER));
    setLeaving(null);
  }

  useEffect(() => {
    if (phase !== "play") return;
    const endAt = Date.now() + TAPU_DURATION * 1000;
    const timer = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(timer);
        const { correct: c, wrong: w } = scoreRef.current;
        const net = c - w;
        const tier: ActivityTier = net >= 11 && w <= 1 ? 2 : net >= 6 ? 1 : 0;
        setResult({ tier, extra: onFinish(tier) });
        setPhase("done");
      }
    }, 200);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 650);
    return () => clearTimeout(timer);
  }, [toast]);

  function start() {
    countRef.current = 0;
    scoreRef.current = { correct: 0, wrong: 0 };
    setCorrect(0);
    setWrong(0);
    nextDoc();
    setPhase("play");
  }

  function decide(approve: boolean) {
    if (phase !== "play" || !doc || leaving) return;
    const valid = doc.flaw === null;
    if (approve === valid) {
      scoreRef.current.correct += 1;
      setCorrect(scoreRef.current.correct);
      setToast({ text: t({ tr: "DOĞRU ✓", en: "CORRECT ✓" }), good: true });
    } else {
      scoreRef.current.wrong += 1;
      setWrong(scoreRef.current.wrong);
      setToast({ text: approve && doc.flaw ? t(FLAW_TEXT[doc.flaw]) : t({ tr: "Belge temizdi!", en: "It was clean!" }), good: false });
    }
    setLeaving(approve ? "ok" : "no");
    setTimeout(nextDoc, 230);
  }

  const rules = [
    t({ tr: "✍️ İmza olmalı", en: "✍️ Must be signed" }),
    t({ tr: "📅 Tarih 2026 olmalı", en: "📅 Date must be 2026" }),
    t({ tr: "₺ Rakam ve yazı aynı olmalı", en: "₺ Figures and words must match" }),
  ];

  return (
    <div className="activity-game">
      <div className="activity-game-head">
        <span className="activity-game-title">🗂️ {t({ tr: "Tapu Masası", en: "Deed Desk" })}</span>
        <span className="activity-game-meta">
          {phase === "play" ? `⏱ ${timeLeft}s · ${correct} ${t({ tr: "doğru", en: "correct" })}` : ""}
        </span>
      </div>
      <div className="activity-game-stage tapu-stage">
        <div className={`tapu-rules ${sealRule ? "tapu-rules-updated" : ""}`}>
          <span className="tapu-rules-title">{t({ tr: "BUGÜNÜN KURALLARI", en: "TODAY'S RULES" })}</span>
          {rules.join(" · ")}
          {sealRule && <span className="tapu-rule-new"> · {t({ tr: "🔴 YENİ: Mühür olmalı", en: "🔴 NEW: Must be sealed" })}</span>}
        </div>
        {toast && <p className={`tapu-toast ${toast.good ? "tapu-toast-good" : "tapu-toast-bad"}`}>{toast.text}</p>}
        {phase === "play" && doc && (
          <div key={doc.key} className={`tapu-doc ${leaving === "ok" ? "tapu-doc-out-ok" : leaving === "no" ? "tapu-doc-out-no" : ""}`}>
            <p className="tapu-doc-title">{t({ tr: "TAPU DEVİR SENEDİ", en: "TITLE DEED TRANSFER" })}</p>
            <div className="tapu-row">
              <span>{t({ tr: "Alıcı", en: "Buyer" })}</span>
              <span>{doc.name}</span>
            </div>
            <div className="tapu-row">
              <span>{t({ tr: "Tarih", en: "Date" })}</span>
              <span>
                12.0{doc.month}.{doc.year}
              </span>
            </div>
            <div className="tapu-row">
              <span>{t({ tr: "Bedel", en: "Amount" })}</span>
              <span>₺{doc.num}.000.000</span>
            </div>
            <div className="tapu-row">
              <span>{t({ tr: "Yazıyla", en: "In words" })}</span>
              <span>{t({ tr: `${NUMBER_WORDS[doc.word].tr} milyon TL`, en: `${NUMBER_WORDS[doc.word].en} million TL` })}</span>
            </div>
            <div className="tapu-row">
              <span>{t({ tr: "İmza", en: "Signature" })}</span>
              <span className="tapu-signature">{doc.signature ?? ""}</span>
            </div>
            {doc.sealed && (
              <span className="tapu-seal">
                {t({ tr: "TAPU", en: "LAND" })}
                <br />
                {t({ tr: "MÜD.", en: "REG." })}
              </span>
            )}
          </div>
        )}
        {phase === "play" && (
          <div className="tapu-choices">
            <button className="tapu-choice tapu-choice-no" onClick={() => decide(false)}>
              ✖ {t({ tr: "REDDET", en: "REJECT" })}
            </button>
            <button className="tapu-choice tapu-choice-yes" onClick={() => decide(true)}>
              ✔ {t({ tr: "ONAYLA", en: "APPROVE" })}
            </button>
          </div>
        )}
        {phase === "intro" && (
          <div className="activity-game-overlay">
            <p className="activity-game-summary">
              {t({
                tr: `Kurala uymayan belgeyi reddet, temiz olanı onayla. ${SEAL_RULE_AFTER}. belgeden sonra yeni bir kural eklenir. ${TAPU_DURATION} saniye.`,
                en: `Reject documents that break a rule, approve the clean ones. A new rule is added after document ${SEAL_RULE_AFTER}. ${TAPU_DURATION} seconds.`,
              })}
            </p>
            <div className="activity-game-rewards">
              {rewardLabels.map((r, i) => (
                <span key={i} className={`activity-game-reward-chip activity-tier-${i}`}>
                  {t(TIER_TITLE[i as ActivityTier])}: {r}
                </span>
              ))}
            </div>
            <button className="pixel-btn" onClick={start}>
              {t({ tr: "Başla", en: "Start" })}
            </button>
          </div>
        )}
        {phase === "done" && result && (
          <ResultPanel
            tier={result.tier}
            summary={t({ tr: `${correct} doğru · ${wrong} yanlış`, en: `${correct} correct · ${wrong} wrong` })}
            reward={rewardLabels[result.tier]}
            extra={result.extra}
            onDone={() => onComplete(result.tier)}
          />
        )}
      </div>
    </div>
  );
}

/** Hangi aktivitenin hangi mini oyunla oynandığı — listede olmayan aktiviteler (araştırma) doğrudan uygulanır. */
export const activityMiniGames: Record<string, ComponentType<ActivityMiniGameProps>> = {
  marketing: VitrinKaresiGame,
  "office-work": TapuMasasiGame,
};
