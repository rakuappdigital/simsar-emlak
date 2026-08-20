interface RadioTickerProps {
  text: string | null;
}

/** Small ambient "office radio" toast — see data/cityPulse.ts. Purely cosmetic, auto-cleared by App.tsx. */
export default function RadioTicker({ text }: RadioTickerProps) {
  if (!text) return null;
  return (
    <div className="radio-ticker-toast">
      <span className="radio-ticker-tag">📻</span>
      <span className="radio-ticker-text">{text}</span>
    </div>
  );
}
