import { useState } from "react";

export interface EndingSlide {
  icon: string;
  eyebrow: string;
  title: string;
  body: string[];
}

interface EndingSequenceProps {
  slides: EndingSlide[];
  onFinish: () => void;
}

/**
 * A short, auto-paced highlight reel shown once, right before the existing
 * plain "summary" stats screen (which stays as the full detail view). Pure
 * presentation over data App.tsx already computes for that screen — no new
 * state, no scoring involvement, entirely skippable.
 */
export default function EndingSequence({ slides, onFinish }: EndingSequenceProps) {
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;
  const slide = slides[index];
  if (!slide) return null;

  function advance() {
    if (isLast) onFinish();
    else setIndex((i) => i + 1);
  }

  return (
    <div className="ending-sequence-overlay">
      <button className="ending-sequence-skip" onClick={onFinish}>
        Atla ›
      </button>
      <div className="ending-sequence-card" key={index}>
        <span className="ending-sequence-icon">{slide.icon}</span>
        <p className="ending-sequence-eyebrow">{slide.eyebrow}</p>
        <p className="ending-sequence-title">{slide.title}</p>
        {slide.body.map((line, i) => (
          <p className="ending-sequence-body" key={i}>
            {line}
          </p>
        ))}
      </div>
      <div className="ending-sequence-dots">
        {slides.map((_, i) => (
          <span key={i} className={`ending-sequence-dot ${i === index ? "ending-sequence-dot-active" : ""}`} />
        ))}
      </div>
      <button className="pixel-btn small ending-sequence-next" onClick={advance}>
        {isLast ? "Özete Geç" : "İleri ›"}
      </button>
    </div>
  );
}
