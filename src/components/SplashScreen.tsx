import { useEffect, useState } from "react";
import rakusunLogo from "../assets/branding/rakusun-logo.png";
import oddEstateLogo from "../assets/branding/oddestate-logo.png";

interface SplashScreenProps {
  onDone: () => void;
}

const STUDIO_HOLD_MS = 2000;
const STUDIO_FADE_MS = 500;
const GAME_FADE_MS = 500;
const GAME_HOLD_MS = 4000;
const BAR_START_PERCENT = 40;

type Stage = "studio" | "studio-fading" | "game";

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [stage, setStage] = useState<Stage>("studio");
  const [gameVisible, setGameVisible] = useState(false);
  const [barPercent, setBarPercent] = useState(BAR_START_PERCENT);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setStage("studio-fading"), STUDIO_HOLD_MS));
    timers.push(setTimeout(() => setStage("game"), STUDIO_HOLD_MS + STUDIO_FADE_MS));
    // Mount at opacity 0 first, then flip on the next frame so the CSS transition actually fires.
    timers.push(
      setTimeout(() => requestAnimationFrame(() => setGameVisible(true)), STUDIO_HOLD_MS + STUDIO_FADE_MS + 16)
    );
    timers.push(setTimeout(() => onDone(), STUDIO_HOLD_MS + STUDIO_FADE_MS + GAME_FADE_MS + GAME_HOLD_MS));

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage !== "game") return;
    const start = Date.now();
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / GAME_HOLD_MS);
      setBarPercent(BAR_START_PERCENT + t * (100 - BAR_START_PERCENT));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  return (
    <div className={`splash-root ${stage === "game" ? "splash-root-game" : ""}`}>
      {stage !== "game" && (
        <div className={`splash-layer ${stage === "studio-fading" ? "splash-fade-out" : ""}`}>
          <img src={rakusunLogo} alt="Rakusun" className="splash-studio-img" />
        </div>
      )}
      {stage === "game" && (
        <div className={`splash-layer ${gameVisible ? "splash-fade-in-visible" : "splash-fade-in-hidden"}`}>
          <img src={oddEstateLogo} alt="Odd Estate" className="splash-game-img" />
          <div className="splash-progress-track">
            <div className="splash-progress-fill" style={{ width: `${barPercent}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
