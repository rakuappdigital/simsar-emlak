import { useEffect, useState } from "react";
import type { PhoneMessage } from "../types";

interface PhoneScreenProps {
  messages: PhoneMessage[];
  thought?: string;
  onContinue: () => void;
  contactName?: string;
  statusText?: string;
  choices?: { id: string; text: string }[];
  onChoice?: (id: string) => void;
}

const funnyBanner = [
  "🏦 XBank: Ekstreniz hazır, bakmasanız da olur 💳",
  "🔋 Pil %8 kaldı — şarj cihazını unuttun yine",
  "📸 Anne: Bu ne kılık böyle, düzgün giyin",
  "📢 Kirve İnşaat: Havuzlu villa, peşinatsız, hemen ara!",
];

export default function PhoneScreen({
  messages,
  thought,
  onContinue,
  contactName = "Muzaffer Bey",
  statusText = "yazıyor...",
  choices,
  onChoice,
}: PhoneScreenProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [banner] = useState(() => funnyBanner[Math.floor(Math.random() * funnyBanner.length)]);
  const [showBanner, setShowBanner] = useState(true);

  // Deliberately no reset-on-`messages`-change here: when the same
  // conversation grows (e.g. a reply gets appended), we want to keep
  // whatever has already been revealed and only animate in the new
  // message(s) — not replay the whole thread from scratch. A genuinely
  // new conversation gets a fresh `key` from the parent, which remounts
  // this component and naturally resets visibleCount to 0 via useState.

  useEffect(() => {
    const t = setTimeout(() => setShowBanner(false), 2600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (visibleCount >= messages.length + (thought ? 1 : 0)) return;
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), 1400);
    return () => clearTimeout(timer);
  }, [visibleCount, messages.length, thought]);

  const allShown = visibleCount >= messages.length + (thought ? 1 : 0);

  return (
    <div className="phone-wrap">
      <div className="phone-frame">
        <div className="phone-notch" />

        <div className="phone-statusbar">
          <span className="status-time">14:47</span>
          <span className="status-icons">
            <span className="signal-bars" aria-hidden>
              ▂▄▆█
            </span>
            <span aria-hidden>📶</span>
            <span className="battery-low" aria-hidden>
              🔋 8%
            </span>
          </span>
        </div>

        {showBanner && (
          <div className="ios-banner">
            <span className="ios-banner-icon">🔔</span>
            <span className="ios-banner-text">{banner}</span>
          </div>
        )}

        <div className="whatsapp-header">
          <span className="wa-back">‹</span>
          <div className="wa-avatar">{contactName.charAt(0)}</div>
          <div className="wa-title">
            <span className="wa-name">{contactName}</span>
            <span className="wa-status">{statusText}</span>
          </div>
          <span className="wa-icons">📹 📞</span>
        </div>

        <div className="whatsapp-body">
          {messages.slice(0, visibleCount).map((m, i) => (
            <div className={`wa-bubble ${m.from === "Emlah" ? "outgoing" : "incoming"}`} key={i}>
              {m.text}
              <span className="wa-time">14:4{Math.min(9, i)}</span>
            </div>
          ))}
          {thought && visibleCount > messages.length && (
            <div className="wa-bubble thought">{thought}</div>
          )}
        </div>

        <div className="phone-home-indicator" />
      </div>

      {allShown && choices && choices.length > 0 && (
        <div className="phone-choices">
          {choices.map((c) => (
            <button key={c.id} className="choice-btn" onClick={() => onChoice?.(c.id)}>
              {c.text}
            </button>
          ))}
        </div>
      )}

      {allShown && (!choices || choices.length === 0) && (
        <button className="pixel-btn phone-continue" onClick={onContinue}>
          Devam Et
        </button>
      )}
    </div>
  );
}
