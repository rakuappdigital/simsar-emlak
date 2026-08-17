import { useEffect, useState } from "react";
import type { PhoneMessage } from "../types";
import { SignalIcon, BatteryIcon, BellIcon, VideoCamIcon, PhoneCallIcon, ChevronLeftIcon } from "./icons";
import { playMessage } from "../data/sound";

interface PhoneScreenProps {
  messages: PhoneMessage[];
  thought?: string;
  onContinue: () => void;
  contactName?: string;
  avatarSrc?: string;
  statusText?: string;
  choices?: { id: string; text: string }[];
  onChoice?: (id: string) => void;
  batteryPercent?: number;
  statusTime?: string;
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
  avatarSrc,
  statusText = "yazıyor...",
  choices,
  onChoice,
  batteryPercent = 100,
  statusTime = "14:47",
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
    const nextMessage = messages[visibleCount];
    const timer = setTimeout(() => {
      if (nextMessage && nextMessage.from !== "Emlah") playMessage();
      setVisibleCount((c) => c + 1);
    }, 1400);
    return () => clearTimeout(timer);
  }, [visibleCount, messages, thought]);

  const allShown = visibleCount >= messages.length + (thought ? 1 : 0);

  return (
    <div className="phone-wrap">
      <div className="phone-frame">
        <div className="phone-notch" />

        <div className="phone-statusbar">
          <span className="status-time">{statusTime}</span>
          <span className="status-icons">
            <SignalIcon size={13} aria-hidden />
            <span className={batteryPercent <= 20 ? "battery-low" : undefined} aria-hidden>
              <BatteryIcon size={15} /> {batteryPercent}%
            </span>
          </span>
        </div>

        {showBanner && (
          <div className="ios-banner">
            <span className="ios-banner-icon">
              <BellIcon size={14} />
            </span>
            <span className="ios-banner-text">{banner}</span>
          </div>
        )}

        <div className="whatsapp-header">
          <span className="wa-back">
            <ChevronLeftIcon size={14} />
          </span>
          <div className="wa-avatar">
            {avatarSrc ? <img src={avatarSrc} alt={contactName} className="wa-avatar-img" /> : contactName.charAt(0)}
          </div>
          <div className="wa-title">
            <span className="wa-name">{contactName}</span>
            <span className="wa-status">
              {statusText === "yazıyor..." ? (
                <>
                  yazıyor
                  <span className="typing-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </>
              ) : (
                statusText
              )}
            </span>
          </div>
          <span className="wa-icons">
            <VideoCamIcon size={15} />
            <PhoneCallIcon size={13} />
          </span>
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
