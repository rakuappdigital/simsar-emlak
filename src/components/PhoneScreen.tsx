import { useEffect, useState } from "react";
import type { PhoneMessage } from "../types";

interface PhoneScreenProps {
  messages: PhoneMessage[];
  thought?: string;
  onContinue: () => void;
}

export default function PhoneScreen({ messages, thought, onContinue }: PhoneScreenProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
  }, [messages]);

  useEffect(() => {
    if (visibleCount >= messages.length + (thought ? 1 : 0)) return;
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), 550);
    return () => clearTimeout(timer);
  }, [visibleCount, messages.length, thought]);

  const allShown = visibleCount >= messages.length + (thought ? 1 : 0);

  return (
    <div className="phone-wrap">
      <div className="phone">
        <div className="phone-header">Muzaffer Bey</div>
        <div className="phone-body">
          {messages.slice(0, visibleCount).map((m, i) => (
            <div className="bubble incoming" key={i}>
              {m.text}
            </div>
          ))}
          {thought && visibleCount > messages.length && (
            <div className="bubble thought">{thought}</div>
          )}
        </div>
        {allShown && (
          <button className="pixel-btn" onClick={onContinue}>
            Devam Et
          </button>
        )}
      </div>
    </div>
  );
}
