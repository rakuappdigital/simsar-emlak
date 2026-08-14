import { useEffect, useState } from "react";
import type { WorkTaskDef } from "../data/workTasks";

interface QuickCallScreenProps {
  task: WorkTaskDef;
  onChoice: (choiceId: string) => void;
}

const TIME_LIMIT_MS = 6000;
const TICK_MS = 100;

/**
 * Same choice/reward shape as WorkTaskScreen, but with a shrinking timer —
 * if nothing is picked before it runs out, the round resolves with an
 * invalid choice id, which completeWorkTask already treats as "no reward"
 * (same as a normal task never being null-checked to a crash). No new
 * failure mode, just a different feel: decide fast or the moment passes.
 */
export default function QuickCallScreen({ task, onChoice }: QuickCallScreenProps) {
  const [remainingMs, setRemainingMs] = useState(TIME_LIMIT_MS);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (resolved) return;
    if (remainingMs <= 0) {
      setResolved(true);
      onChoice("timeout");
      return;
    }
    const t = setTimeout(() => setRemainingMs((ms) => Math.max(0, ms - TICK_MS)), TICK_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs, resolved]);

  function pick(choiceId: string) {
    if (resolved) return;
    setResolved(true);
    onChoice(choiceId);
  }

  const pct = Math.max(0, (remainingMs / TIME_LIMIT_MS) * 100);
  const urgent = pct < 30;

  return (
    <div className="work-task-screen quick-call-screen">
      <p className="work-task-tag">⚡ Hızlı Karar</p>
      <p className="work-task-title">{task.title}</p>
      <p className="work-task-prompt">{task.prompt}</p>
      <div className="quick-call-timer-track">
        <div
          className={`quick-call-timer-fill ${urgent ? "urgent" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="choices">
        {task.choices.map((c) => (
          <button key={c.id} className="choice-btn" onClick={() => pick(c.id)}>
            {c.text}
          </button>
        ))}
      </div>
    </div>
  );
}
