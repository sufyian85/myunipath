import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useStudent } from './StudentContext';
import { api } from '../lib/api';

// ── Level config ─────────────────────────────────────────────────────────────
export const LEVELS = [
  { level: 1, name: 'Freshman',  minXp: 0,    color: '#6b7280', emoji: '🎓' },
  { level: 2, name: 'Explorer',  minXp: 100,  color: '#3b82f6', emoji: '🔭' },
  { level: 3, name: 'Pathfinder',minXp: 300,  color: '#8b5cf6', emoji: '🧭' },
  { level: 4, name: 'Navigator', minXp: 600,  color: '#f59e0b', emoji: '⚓' },
  { level: 5, name: 'Champion',  minXp: 1100, color: '#e34628', emoji: '🏆' },
] as const;

export function xpToLevel(xp: number): typeof LEVELS[number] {
  return [...LEVELS].reverse().find(l => xp >= l.minXp) ?? LEVELS[0];
}

export function xpToNextLevel(xp: number): { current: typeof LEVELS[number]; next: typeof LEVELS[number] | null; progress: number } {
  const current = xpToLevel(xp);
  const nextIdx = LEVELS.findIndex(l => l.level === current.level) + 1;
  const next = LEVELS[nextIdx] ?? null;
  if (!next) return { current, next: null, progress: 100 };
  const range = next.minXp - current.minXp;
  const progress = Math.min(100, Math.round(((xp - current.minXp) / range) * 100));
  return { current, next, progress };
}

// ── XP popup ────────────────────────────────────────────────────────────────
export interface XPEvent {
  id: string;
  amount: number;
  label: string;
  multiplier: number;
}

// ── Context ──────────────────────────────────────────────────────────────────
interface GamificationContextType {
  xp: number;
  level: typeof LEVELS[number];
  quizCount: number;
  bestCombo: number;
  xpEvents: XPEvent[];
  pendingXp: number;           // accumulated during quiz, committed on submit
  pendingCombo: number;        // highest multiplier seen this quiz
  addXpEvent: (amount: number, label: string, multiplier: number) => void;
  dismissXpEvent: (id: string) => void;
  commitQuizXp: () => Promise<{ leveledUp: boolean; newLevel: typeof LEVELS[number] }>;
  resetPending: () => void;
  syncFromBackend: (data: { xp: number; level: number; quiz_count: number; best_combo: number }) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, studentData } = useStudent();

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(LEVELS[0]);
  const [quizCount, setQuizCount] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [xpEvents, setXpEvents] = useState<XPEvent[]>([]);
  const [pendingXp, setPendingXp] = useState(0);
  const [pendingCombo, setPendingCombo] = useState(1);

  // Sync from student data when it loads
  useEffect(() => {
    if (isLoggedIn && studentData.xp !== undefined) {
      const totalXp = studentData.xp ?? 0;
      setXp(totalXp);
      setLevel(xpToLevel(totalXp));
      setQuizCount(studentData.quiz_count ?? 0);
      setBestCombo(studentData.best_combo ?? 0);
    }
  }, [isLoggedIn, studentData]);

  const syncFromBackend = useCallback((data: { xp: number; level: number; quiz_count: number; best_combo: number }) => {
    setXp(data.xp);
    setLevel(xpToLevel(data.xp));
    setQuizCount(data.quiz_count);
    setBestCombo(data.best_combo);
  }, []);

  const addXpEvent = useCallback((amount: number, label: string, multiplier: number) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const earned = Math.round(amount * multiplier);
    setXpEvents(prev => [...prev, { id, amount: earned, label, multiplier }]);
    setPendingXp(prev => prev + earned);
    setPendingCombo(prev => Math.max(prev, multiplier));
    // Auto-dismiss after 1.8 s
    setTimeout(() => setXpEvents(prev => prev.filter(e => e.id !== id)), 1800);
  }, []);

  const dismissXpEvent = useCallback((id: string) => {
    setXpEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const commitQuizXp = useCallback(async () => {
    const prevLevel = xpToLevel(xp);
    const newTotalXp = xp + pendingXp;
    const newLevelData = xpToLevel(newTotalXp);
    const leveledUp = newLevelData.level > prevLevel.level;

    if (isLoggedIn && pendingXp > 0) {
      try {
        const res = await api.updateXp({ xp_earned: pendingXp, best_combo: Math.round(pendingCombo * 10) });
        if (res.success) {
          syncFromBackend({
            xp: res.xp,
            level: res.level,
            quiz_count: res.quiz_count,
            best_combo: res.best_combo,
          });
        }
      } catch {
        // Fallback: update locally
        setXp(newTotalXp);
        setLevel(newLevelData);
        setQuizCount(prev => prev + 1);
      }
    } else {
      setXp(newTotalXp);
      setLevel(newLevelData);
    }

    return { leveledUp, newLevel: newLevelData };
  }, [xp, pendingXp, pendingCombo, isLoggedIn, syncFromBackend]);

  const resetPending = useCallback(() => {
    setPendingXp(0);
    setPendingCombo(1);
  }, []);

  return (
    <GamificationContext.Provider value={{
      xp, level, quizCount, bestCombo,
      xpEvents, pendingXp, pendingCombo,
      addXpEvent, dismissXpEvent, commitQuizXp, resetPending, syncFromBackend,
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error('useGamification must be inside GamificationProvider');
  return ctx;
}
