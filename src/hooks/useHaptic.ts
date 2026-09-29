/**
 * useHaptic — Vibration API wrapper for mobile haptic feedback.
 * Silently no-ops on desktop/unsupported browsers.
 */

const supported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

function vibe(pattern: number | number[]) {
  if (!supported) return;
  try { navigator.vibrate(pattern); } catch { /* noop */ }
}

export function useHaptic() {
  return {
    /** Quick tap — answer selected */
    tap:       () => vibe(40),
    /** Double pulse — XP earned */
    xp:        () => vibe([30, 60, 30]),
    /** Triple burst — speed bonus */
    speedBonus:() => vibe([20, 40, 20, 40, 20]),
    /** Strong buzz — streak milestone */
    streak:    (n: number) => vibe(n >= 5 ? [60, 50, 60, 50, 80] : [50, 60, 80]),
    /** Soft bump — question advance */
    advance:   () => vibe(25),
    /** Long celebration — quiz complete */
    complete:  () => vibe([50, 80, 50, 80, 100, 120, 200]),
    /** Tiny pop — back button */
    back:      () => vibe(20),
  };
}
