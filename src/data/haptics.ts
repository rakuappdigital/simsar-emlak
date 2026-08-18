/**
 * Native-wrapper-aware haptic feedback. This repo is a pure web app — there
 * is no Capacitor dependency installed here — so this deliberately does NOT
 * import @capacitor/haptics. Instead it looks for `window.Capacitor` at call
 * time, which a Capacitor-wrapped build injects automatically. On plain web
 * (or iOS Safari without a native wrapper, which has no Vibration API) this
 * silently no-ops; on Android web it falls back to navigator.vibrate. Once
 * the app is wrapped and `@capacitor/haptics` is added + `npx cap sync` is
 * run, these calls start actually buzzing without any further code changes.
 */
interface CapacitorHapticsPlugin {
  impact(options: { style: "LIGHT" | "MEDIUM" | "HEAVY" }): Promise<void>;
  notification(options: { type: "SUCCESS" | "WARNING" | "ERROR" }): Promise<void>;
}

function getCapacitorHaptics(): CapacitorHapticsPlugin | null {
  const w = window as unknown as { Capacitor?: { Plugins?: { Haptics?: CapacitorHapticsPlugin } } };
  return w.Capacitor?.Plugins?.Haptics ?? null;
}

export type HapticKind = "light" | "success";

export function triggerHaptic(kind: HapticKind): void {
  if (typeof window === "undefined") return;
  const haptics = getCapacitorHaptics();
  if (haptics) {
    if (kind === "success") haptics.notification({ type: "SUCCESS" }).catch(() => {});
    else haptics.impact({ style: "LIGHT" }).catch(() => {});
    return;
  }
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(kind === "success" ? [15, 30, 15] : 15);
  }
}
