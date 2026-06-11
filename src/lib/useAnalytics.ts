import { useCallback } from 'react';

const STORAGE_KEY = 'myunipath_analytics';

export interface QuizCompletion {
  persona: string;
  programIds: string[];
  timestamp: number;
}

export interface AnalyticsData {
  completions: QuizCompletion[];
}

function loadAnalytics(): AnalyticsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return { completions: [] };
}

function saveAnalytics(data: AnalyticsData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function useAnalytics() {
  const recordQuizCompletion = useCallback((payload: { persona: string; programIds: string[] }) => {
    const data = loadAnalytics();
    data.completions.push({
      ...payload,
      timestamp: Date.now(),
    });
    saveAnalytics(data);
  }, []);

  const getAnalytics = useCallback((): {
    totalParticipants: number;
    personaCounts: Record<string, number>;
    programCounts: Record<string, number>;
    completions: QuizCompletion[];
  } => {
    const data = loadAnalytics();
    const personaCounts: Record<string, number> = {};
    const programCounts: Record<string, number> = {};

    for (const c of data.completions) {
      personaCounts[c.persona] = (personaCounts[c.persona] || 0) + 1;
      for (const pid of c.programIds) {
        programCounts[pid] = (programCounts[pid] || 0) + 1;
      }
    }

    return {
      totalParticipants: data.completions.length,
      personaCounts,
      programCounts,
      completions: data.completions,
    };
  }, []);

  return { recordQuizCompletion, getAnalytics };
}
