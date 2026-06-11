/**
 * MyUniPath – CCI UNITEN
 * Recommendation Engine v2 — 6-program scoring
 * Each quiz answer contributes points to specific programs.
 * The program with the highest score becomes the student's character.
 */

import type { ProgramId, QuestionOption } from './data';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ProgramScores = Record<ProgramId, number>;

export interface RecommendationResult {
  persona: string;
  programs: { id: string; rank: number }[];
}

// ─── Legacy compat (used by CRUD admin panel) ─────────────────────────────────
export interface QuizScores {
  logicScore: number;
  creativeScore: number;
  personaCounts: Record<string, number>;
}

/* ─── CRUD Rule Shape (matches PersonaRulesCRUD.tsx) ─── */
interface PersonaRule {
  id: string;
  persona: string;
  displayName: string;
  icon: string;
  description: string;
  traits: string[];
  gradientClass: string;
  programIds: string[];
  logicWeight: number;
  creativeWeight: number;
  isActive: boolean;
  updatedAt: string;
}

const STORAGE_KEY = 'myunipath_persona_rules';
const VERSION_KEY = 'myunipath_persona_rules_version';
const RULES_VERSION = 2;

export function getActivePersonaRules(): PersonaRule[] | null {
  try {
    const storedVersion = parseInt(localStorage.getItem(VERSION_KEY) ?? '0', 10);
    if (storedVersion < RULES_VERSION) return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const rules: PersonaRule[] = JSON.parse(stored);
      return rules.filter(r => r.isActive);
    }
  } catch { /* noop */ }
  return null;
}

// ─── Core scoring ─────────────────────────────────────────────────────────────

const PROGRAM_IDS: ProgramId[] = [
  'software-engineering',
  'graphics-multimedia',
  'cybersecurity',
  'artificial-intelligence',
  'business-analytics',
  'systems-networking',
];

/** Returns a zeroed-out score map for all 6 programs */
export function initScores(): ProgramScores {
  return Object.fromEntries(PROGRAM_IDS.map(id => [id, 0])) as ProgramScores;
}

/**
 * Calculate per-program scores from answered options.
 * Each option has a `scores` map that awards points to 1–2 programs.
 */
export function calculateProgramScores(answers: QuestionOption[]): ProgramScores {
  const totals = initScores();
  for (const answer of answers) {
    if (answer.scores) {
      for (const [programId, pts] of Object.entries(answer.scores)) {
        if (programId in totals) {
          totals[programId as ProgramId] += pts ?? 0;
        }
      }
    }
  }
  return totals;
}

/**
 * Get the winning program ID from a score map.
 * In case of a tie, picks the one that appeared earlier in PROGRAM_IDS
 * (which reflects rough priority order).
 */
export function getTopProgram(scores: ProgramScores): ProgramId {
  let best: ProgramId = PROGRAM_IDS[0];
  let bestScore = -1;
  for (const id of PROGRAM_IDS) {
    if (scores[id] > bestScore) {
      bestScore = scores[id];
      best = id;
    }
  }
  return best;
}

/**
 * Get ranked list of all programs for the result page radar data.
 */
export function getRankedPrograms(scores: ProgramScores): { id: ProgramId; score: number; rank: number }[] {
  return PROGRAM_IDS
    .map(id => ({ id, score: scores[id] }))
    .sort((a, b) => b.score - a.score)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));
}

/**
 * Build a recommendation result (used for quiz submit + navigation).
 */
export function getRecommendations(
  persona: string,
  _logicScore?: number,
  _creativeScore?: number,
): RecommendationResult {
  // With the new system, persona IS the primary program ID
  const primaryId = persona as ProgramId;

  // Secondary program depends on the character mapping
  const SECONDARY: Partial<Record<ProgramId, ProgramId>> = {
    'software-engineering':  'artificial-intelligence',
    'graphics-multimedia':   'software-engineering',
    'cybersecurity':         'systems-networking',
    'artificial-intelligence': 'business-analytics',
    'business-analytics':    'artificial-intelligence',
    'systems-networking':    'cybersecurity',
  };

  const secondaryId = SECONDARY[primaryId] ?? 'software-engineering';

  return {
    persona,
    programs: [
      { id: primaryId, rank: 1 },
      { id: secondaryId, rank: 2 },
    ],
  };
}

// ─── Legacy functions (kept for backward compat with admin panel / backend) ───

export function calculateScores(answers: { logic?: number; creative?: number }[]): QuizScores {
  let logicScore = 0;
  let creativeScore = 0;
  for (const a of answers) {
    logicScore += a.logic ?? 0;
    creativeScore += a.creative ?? 0;
  }
  return { logicScore, creativeScore, personaCounts: {} };
}

export function getPersonaFromScores(
  _logicScore: number,
  _creativeScore: number,
  personaCounts: Record<string, number>,
): string {
  const entries = Object.entries(personaCounts);
  if (entries.length === 0) return 'software-engineering';
  return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
}
