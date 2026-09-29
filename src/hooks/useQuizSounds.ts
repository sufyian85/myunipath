/**
 * useQuizSounds — Web Audio API synthesized sound effects for the quiz.
 * Zero external dependencies, zero audio files.
 * All sounds respect a global mute toggle stored in localStorage.
 */

import { useCallback, useRef } from 'react';

const STORAGE_KEY = 'myunipath_sound_enabled';

function getCtx(): AudioContext | null {
  try {
    return new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
}

function isSoundEnabled(): boolean {
  try { return localStorage.getItem(STORAGE_KEY) !== 'false'; } catch { return true; }
}

export function setSoundEnabled(on: boolean) {
  try { localStorage.setItem(STORAGE_KEY, on ? 'true' : 'false'); } catch { /* noop */ }
}

export function useQuizSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = useCallback((): AudioContext | null => {
    if (!isSoundEnabled()) return null;
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = getCtx();
    }
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume().catch(() => null);
    }
    return ctxRef.current;
  }, []);

  /** Schedule a single synthesized tone */
  const tone = useCallback((
    ac: AudioContext,
    freq: number,
    startAt: number,
    duration: number,
    gainPeak: number,
    type: OscillatorType = 'sine',
  ) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startAt);
    gain.gain.setValueAtTime(0, startAt);
    gain.gain.linearRampToValueAtTime(gainPeak, startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.05);
  }, []);

  /** Answer selected — satisfying click-pop */
  const playSelect = useCallback(() => {
    const ac = getAudioCtx(); if (!ac) return;
    const now = ac.currentTime;
    tone(ac, 120, now, 0.08, 0.25, 'sine');
    tone(ac, 800, now, 0.04, 0.12, 'square');
    tone(ac, 1400, now + 0.02, 0.12, 0.06, 'sine');
  }, [getAudioCtx, tone]);

  /** XP earned — rising chime trio */
  const playXp = useCallback(() => {
    const ac = getAudioCtx(); if (!ac) return;
    const now = ac.currentTime;
    tone(ac, 523, now,        0.18, 0.13, 'sine');   // C5
    tone(ac, 659, now + 0.08, 0.18, 0.13, 'sine');   // E5
    tone(ac, 784, now + 0.16, 0.22, 0.16, 'sine');   // G5
  }, [getAudioCtx, tone]);

  /** Speed bonus 2x — rapid ascending sparkle */
  const playSpeedBonus = useCallback(() => {
    const ac = getAudioCtx(); if (!ac) return;
    const now = ac.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => {
      tone(ac, f, now + i * 0.055, 0.15, 0.14 - i * 0.02, 'sine');
    });
  }, [getAudioCtx, tone]);

  /** Streak milestone — fanfare */
  const playStreak = useCallback((streakCount: number) => {
    const ac = getAudioCtx(); if (!ac) return;
    const now = ac.currentTime;
    if (streakCount >= 5) {
      [523, 659, 784, 1047, 1319].forEach((f, i) => {
        tone(ac, f, now + i * 0.07, 0.25, 0.16 - i * 0.01, 'sine');
        tone(ac, f * 1.5, now + i * 0.07, 0.15, 0.05, 'triangle');
      });
    } else {
      [659, 784, 1047].forEach((f, i) => {
        tone(ac, f, now + i * 0.08, 0.2, 0.14, 'sine');
      });
    }
  }, [getAudioCtx, tone]);

  /** Question advance — whoosh swipe */
  const playAdvance = useCallback(() => {
    const ac = getAudioCtx(); if (!ac) return;
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.14);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.start(now);
    osc.stop(now + 0.22);
  }, [getAudioCtx]);

  /** Halfway — motivational ding-dong */
  const playHalfway = useCallback(() => {
    const ac = getAudioCtx(); if (!ac) return;
    const now = ac.currentTime;
    tone(ac, 784, now,       0.3, 0.14, 'sine');
    tone(ac, 659, now + 0.2, 0.3, 0.11, 'sine');
  }, [getAudioCtx, tone]);

  /** Quiz complete — celebration fanfare */
  const playComplete = useCallback(() => {
    const ac = getAudioCtx(); if (!ac) return;
    const now = ac.currentTime;
    [[523, 0], [659, 0.12], [784, 0.24], [1047, 0.36]].forEach(([f, t]) => {
      tone(ac, f, now + t, 0.45, 0.16, 'sine');
    });
    [[392, 0], [523, 0.12], [659, 0.24], [784, 0.36]].forEach(([f, t]) => {
      tone(ac, f, now + t, 0.35, 0.07, 'triangle');
    });
    [523, 659, 784].forEach((f, i) => {
      tone(ac, f, now + 0.55, 0.7, 0.09 - i * 0.02, 'sine');
    });
  }, [getAudioCtx, tone]);

  /** Back button — soft reverse pop */
  const playBack = useCallback(() => {
    const ac = getAudioCtx(); if (!ac) return;
    const now = ac.currentTime;
    tone(ac, 400, now,       0.08, 0.09, 'sine');
    tone(ac, 250, now + 0.04, 0.12, 0.07, 'sine');
  }, [getAudioCtx, tone]);

  return {
    playSelect,
    playXp,
    playSpeedBonus,
    playStreak,
    playAdvance,
    playHalfway,
    playComplete,
    playBack,
  };
}
