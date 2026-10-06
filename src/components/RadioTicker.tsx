import { RadioIcon } from "./icons";

interface RadioTickerProps {
  text: string | null;
  /** B6 — üst üste dokunuşlar gizli frekansı açar (bkz. hooks/useSideQuests.ts onRadioTap). */
  onTap?: () => void;
  secret?: boolean;
  /** Yalnızca ofiste dokunulabilir (alt çubuğun üstünde durur); ev turunda seçeneklerin üstünden dokunuş çalmasın. */
  tappable?: boolean;
}

/** Small ambient "office radio" toast — see data/cityPulse.ts. Purely cosmetic, auto-cleared by App.tsx. */
export default function RadioTicker({ text, onTap, secret = false, tappable = false }: RadioTickerProps) {
  if (!text) return null;
  return (
    <button
      type="button"
      className={`radio-ticker-toast ${secret ? "radio-ticker-secret" : ""} ${tappable ? "radio-ticker-tappable" : ""}`}
      onClick={tappable ? onTap : undefined}
      tabIndex={tappable ? 0 : -1}
    >
      <span className="radio-ticker-tag">
        <RadioIcon size={16} />
      </span>
      <span className="radio-ticker-text">{text}</span>
    </button>
  );
}
