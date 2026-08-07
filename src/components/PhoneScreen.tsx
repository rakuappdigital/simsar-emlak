import { useEffect, useState } from "react";
import type { PhoneMessage } from "../types";

interface PhoneScreenProps {
  messages: PhoneMessage[];
  thought?: string;
  onContinue: () => void;
  contactName?: string;
  statusText?: string;
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
}: PhoneScreenProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [banner] = useState(() => funnyBanner[Math.floor(Math.random() * funnyBanner.length)]);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    setVisibleCount(0);
  }, [messages]);

  useEffect(() => {
    const t = setTimeout(() => setShowBanner(false), 2600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (visibleCount >= messages.length + (thought ? 1 : 0)) return;
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), 550);
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
            <div className="wa-bubble incoming" key={i}>
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

      {allShown && (
        <button className="pixel-btn phone-continue" onClick={onContinue}>
          Devam Et
        </button>
      )}
    </div>
  );
}
