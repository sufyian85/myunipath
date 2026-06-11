import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudent } from '../context/StudentContext';
import { useGamification } from '../context/GamificationContext';
import { QUIZ_QUESTIONS } from '../lib/data';
import type { QuestionOption } from '../lib/data';
import {
  calculateProgramScores,
  getTopProgram,
  getRecommendations,
  calculateScores,
  getPersonaFromScores,
} from '../lib/recommendationEngine';
import { api } from '../lib/api';
import { XPPopup } from '../components/gamification/XPPopup';

// ─── Answer Card Config ────────────────────────────────────────────────────────
const CARD_STYLES = [
  { letter: 'A', color: '#2563eb', border: 'rgba(37,99,235,0.6)',   bg: 'rgba(37,99,235,0.12)', glow: '0 0 30px rgba(37,99,235,0.5), 0 8px 24px rgba(37,99,235,0.3)' },
  { letter: 'B', color: '#ea580c', border: 'rgba(234,88,12,0.6)',  bg: 'rgba(234,88,12,0.12)', glow: '0 0 30px rgba(234,88,12,0.5), 0 8px 24px rgba(234,88,12,0.3)' },
  { letter: 'C', color: '#7c3aed', border: 'rgba(124,58,237,0.6)', bg: 'rgba(124,58,237,0.12)', glow: '0 0 30px rgba(124,58,237,0.5), 0 8px 24px rgba(124,58,237,0.3)' },
  { letter: 'D', color: '#16a34a', border: 'rgba(22,163,74,0.6)',  bg: 'rgba(22,163,74,0.12)', glow: '0 0 30px rgba(22,163,74,0.5), 0 8px 24px rgba(22,163,74,0.3)' },
];

// ─── Mascot per question ───────────────────────────────────────────────────────
const MASCOT_MSGS = [
  { emoji: '🤖', color: '#3b82f6', msg: "Let's find your perfect tech path!" },
  { emoji: '🤔', color: '#a855f7', msg: "Think carefully about your strengths." },
  { emoji: '💡', color: '#f59e0b', msg: "Trust your instincts on this one!" },
  { emoji: '🔥', color: '#ef4444', msg: "You're on fire! Keep the streak going!" },
  { emoji: '🎯', color: '#06b6d4', msg: "Halfway there! Stay focused!" },
  { emoji: '⚡', color: '#f59e0b', msg: "Almost done! You're doing amazing!" },
  { emoji: '🌟', color: '#10b981', msg: "Last few questions! Push through!" },
  { emoji: '🏆', color: '#f59e0b', msg: "Final question! Make it count!" },
  { emoji: '🚀', color: '#3b82f6', msg: "One more step to your character reveal!" },
  { emoji: '✨', color: '#a855f7', msg: "Your destiny awaits!" },
  { emoji: '💫', color: '#06b6d4', msg: "Almost time to reveal your character!" },
  { emoji: '🎮', color: '#ef4444', msg: "Last one! Who will you become?" },
];

// ─── Timer constants ───────────────────────────────────────────────────────────
const TIMER_SECONDS = 30;
const XP_PER_QUESTION = 10;
const XP_COMPLETION_BONUS = 100;
const TIMER_RADIUS = 38;
const TIMER_CIRC = 2 * Math.PI * TIMER_RADIUS; // ≈ 238.76

function getMultiplier(timeLeft: number): number {
  if (timeLeft >= 22) return 2;
  if (timeLeft >= 15) return 1.5;
  return 1;
}

function timerColor(timeLeft: number): string {
  if (timeLeft > 15) return '#22c55e';
  if (timeLeft > 8) return '#f59e0b';
  return '#ef4444';
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function CircularTimer({ timeLeft, total }: { timeLeft: number; total: number }) {
  const color = timerColor(timeLeft);
  const offset = TIMER_CIRC * (1 - timeLeft / total);
  const urgent = timeLeft <= 8;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
      <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx="48" cy="48" r={TIMER_RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        {/* Progress */}
        <circle
          cx="48" cy="48" r={TIMER_RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={TIMER_CIRC}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
        />
      </svg>
      <motion.div
        animate={urgent ? { scale: [1, 1.15, 1] } : { scale: 1 }}
        transition={urgent ? { duration: 1, repeat: Infinity } : {}}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="text-2xl font-black tabular-nums" style={{ color }}>
          {timeLeft}
        </span>
      </motion.div>
    </div>
  );
}

function DotProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 24 : 8,
            backgroundColor: i < current ? '#22c55e' : i === current ? '#3b82f6' : 'rgba(255,255,255,0.2)',
          }}
          transition={{ duration: 0.3 }}
          style={{ height: 8, borderRadius: 4 }}
        />
      ))}
    </div>
  );
}

function XPComboTag({ mult, xp }: { mult: number; xp: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mult}
        initial={{ opacity: 0, y: -8, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8 }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
        style={{
          background: mult >= 2
            ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
            : mult >= 1.5
            ? 'linear-gradient(135deg, #7c3aed, #3b82f6)'
            : 'rgba(255,255,255,0.1)',
          color: '#fff',
          boxShadow: mult >= 2 ? '0 0 16px rgba(245,158,11,0.5)' : 'none',
        }}
      >
        <Zap className="w-3 h-3" />
        +{Math.round(xp * mult)} XP
        {mult > 1 && <span className="opacity-80">{mult}x</span>}
      </motion.div>
    </AnimatePresence>
  );
}

function MascotCorner({ qIndex, streak }: { qIndex: number; streak: number }) {
  const mascot = MASCOT_MSGS[qIndex % MASCOT_MSGS.length];
  return (
    <motion.div
      key={qIndex}
      initial={{ opacity: 0, x: 40, scale: 0.85 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="fixed bottom-6 right-6 z-50 max-w-[200px]"
    >
      <div
        className="rounded-2xl px-4 py-3 shadow-2xl border backdrop-blur-md"
        style={{ background: 'rgba(8,12,20,0.9)', borderColor: mascot.color + '60' }}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-3xl text-center mb-2"
        >
          {mascot.emoji}
        </motion.div>
        <p className="text-white/90 text-xs leading-snug text-center">{mascot.msg}</p>
        {streak >= 2 && (
          <p className="text-center text-xs font-black mt-1.5" style={{ color: '#f59e0b' }}>
            🔥 {streak} streak!
          </p>
        )}
      </div>
    </motion.div>
  );
}

function MilestonePop({ show, text }: { show: boolean; text: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: -40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="fixed inset-0 z-[120] pointer-events-none flex items-center justify-center"
        >
          <div
            className="px-10 py-6 rounded-3xl text-white text-xl font-extrabold shadow-2xl border border-white/20"
            style={{ background: 'linear-gradient(135deg, #0F3361 0%, #7c3aed 50%, #e34628 100%)' }}
          >
            {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Normalise option from API or local format ────────────────────────────────
function normaliseOption(opt: Record<string, unknown>): QuestionOption {
  return {
    text: (opt.text as string) || '',
    emoji: (opt.emoji as string) || '❓',
    scores: (opt.scores as QuestionOption['scores']) || {},
    persona: (opt.persona as string) || '',
    icon: (opt.icon as string) || '',
    logic: (opt.logic as number) || 0,
    creative: (opt.creative as number) || 0,
  };
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function QuizPage() {
  const navigate = useNavigate();
  const { updateStudentData, isLoggedIn, isLoaded } = useStudent();
  const { addXpEvent, commitQuizXp, resetPending, pendingXp } = useGamification();

  const [questions, setQuestions] = useState<Array<{ id: number; question: string; options: QuestionOption[] }>>(
    QUIZ_QUESTIONS.map(q => ({
      ...q,
      options: q.options.map(o => normaliseOption(o as unknown as Record<string, unknown>)),
    }))
  );
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<QuestionOption[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [locked, setLocked] = useState(false); // locked after selection during auto-advance delay
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gamification
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [streak, setStreak] = useState(0);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneText, setMilestoneText] = useState('');
  const localXpRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isLoaded && !isLoggedIn) {
      navigate('/login', { replace: true, state: { redirectTo: '/quiz' } });
    }
  }, [isLoaded, isLoggedIn, navigate]);

  // ── Load questions (always use local data — no API dependency) ────────────
  useEffect(() => {
    resetPending();
    localXpRef.current = 0;
    setQuestions(
      QUIZ_QUESTIONS.map(q => ({
        ...q,
        options: q.options.map(o => normaliseOption(o as unknown as Record<string, unknown>)),
      }))
    );
    setQuestionsLoaded(true);
  }, [resetPending]);

  // ── Timer ──────────────────────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    if (questionsLoaded) startTimer();
    return stopTimer;
  }, [questionsLoaded, currentQ, startTimer, stopTimer]);

  // Auto-skip on timer expiry
  useEffect(() => {
    if (timeLeft === 0 && selectedIdx === null && questionsLoaded) {
      // Pick a random option to keep quiz flowing (or just skip with no XP)
      handleAdvance(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // ── Milestone ─────────────────────────────────────────────────────────────
  const triggerMilestone = useCallback((text: string) => {
    setMilestoneText(text);
    setShowMilestone(true);
    setTimeout(() => setShowMilestone(false), 1800);
  }, []);

  // ── Answer selection → auto-advance ───────────────────────────────────────
  const handleSelect = (idx: number) => {
    if (locked || submitting) return;
    setSelectedIdx(idx);
    setLocked(true);
    stopTimer();

    const option = questions[currentQ].options[idx];
    const mult = getMultiplier(timeLeft);
    const questionXp = Math.round(XP_PER_QUESTION * mult);
    const label = mult >= 2 ? '⚡ Speed Bonus!' : mult >= 1.5 ? '🔥 Quick!' : '✅ Answered';
    addXpEvent(XP_PER_QUESTION, label, mult);
    localXpRef.current += questionXp;

    const newStreak = mult >= 1.5 ? streak + 1 : 0;
    setStreak(newStreak);

    if (newStreak === 3) { triggerMilestone('🔥 3x Streak! +20 Bonus XP'); addXpEvent(20, '🔥 Streak Bonus!', 1); localXpRef.current += 20; }
    if (newStreak === 5) { triggerMilestone('⚡ 5x Streak! +50 Bonus XP'); addXpEvent(50, '⚡ Mega Streak!', 1); localXpRef.current += 50; }

    // Delay then advance
    setTimeout(() => {
      handleAdvance(option);
    }, 900);
  };

  // ── Advance to next question or submit ─────────────────────────────────────
  const handleAdvance = async (option: QuestionOption | null) => {
    const newSelectedOptions = option
      ? [...selectedOptions, option]
      : [...selectedOptions, { text: '', emoji: '⏭', scores: {}, persona: '', icon: '', logic: 0, creative: 0 }];

    setSelectedOptions(newSelectedOptions);

    const isLast = currentQ >= questions.length - 1;

    if (!isLast) {
      if (currentQ + 1 === Math.floor(questions.length / 2)) {
        triggerMilestone('🎯 Halfway There! Keep Going!');
      }
      setCurrentQ(q => q + 1);
      setSelectedIdx(null);
      setLocked(false);
    } else {
      // Final question — commit and navigate
      addXpEvent(XP_COMPLETION_BONUS, '🎓 Quiz Complete!', 1);
      localXpRef.current += XP_COMPLETION_BONUS;

      setSubmitting(true);
      setError(null);

      try {
        // Calculate program scores from collected options (frontend scoring is authoritative)
        const programScores = calculateProgramScores(newSelectedOptions);
        const persona = getTopProgram(programScores) as string;

        const { programs } = getRecommendations(persona);
        updateStudentData({ persona, quizCompleted: true });

        const { leveledUp, newLevel } = await commitQuizXp();

        try {
          const legacyAnswers = newSelectedOptions.map(o => ({
            logic: o.logic || 0,
            creative: o.creative || 0,
            persona: o.persona || '',
          }));
          const { logicScore, creativeScore } = calculateScores(legacyAnswers.map(a => ({ logic: a.logic, creative: a.creative })));
          await api.submitQuiz({
            persona,
            logic_score: logicScore,
            creative_score: creativeScore,
            answers: legacyAnswers,
            recommended_program_ids: programs.map(p => p.id),
          });
        } catch { /* non-critical */ }

        navigate('/results', {
          state: {
            persona,
            programIds: programs.map(p => p.id),
            programScores,
            xpEarned: localXpRef.current,
            leveledUp,
            newLevel,
            streak,
          },
        });
      } catch {
        setError('Something went wrong. Please try again.');
        setSubmitting(false);
        setLocked(false);
      }
    }
  };

  const handleBack = () => {
    if (submitting) return;
    if (currentQ > 0) {
      stopTimer();
      setCurrentQ(q => q - 1);
      setSelectedOptions(opts => opts.slice(0, -1));
      setSelectedIdx(null);
      setLocked(false);
    } else {
      navigate('/');
    }
  };

  const currentMult = getMultiplier(timeLeft);
  const mascot = MASCOT_MSGS[currentQ % MASCOT_MSGS.length];

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (!questionsLoaded) {
    return (
      <div className="quiz-arena-bg min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <div className="text-5xl mb-4">⚡</div>
          <p className="text-white/60 font-semibold text-lg tracking-wide">Loading Quiz Arena...</p>
        </motion.div>
      </div>
    );
  }

  // ── Submitting screen ──────────────────────────────────────────────────────
  if (submitting) {
    return (
      <div className="quiz-arena-bg min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-6 inline-block"
          >
            🔮
          </motion.div>
          <h2 className="text-2xl font-extrabold text-white mb-2 neon-text">Analysing Your Profile...</h2>
          <p className="text-white/50">Matching you to your tech character</p>
          <div className="mt-6 flex justify-center gap-1.5">
            {[0,1,2,3,4].map(i => (
              <motion.div key={i} className="w-2 h-2 rounded-full bg-blue-500"
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQ];
  if (!q) return null;

  return (
    <div className="quiz-arena-bg min-h-screen flex flex-col text-white select-none">
      <XPPopup />
      <MilestonePop show={showMilestone} text={milestoneText} />

      {/* ── TOP HEADER ──────────────────────────────────────────────────── */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4">
        {/* Back */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </motion.button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/myunipath-emblem.svg" alt="MyUniPath" className="w-7 h-7 object-contain drop-shadow" onError={e => { e.currentTarget.style.display='none'; }} />
          <span className="font-extrabold text-lg tracking-tight neon-text"
            style={{ background: 'linear-gradient(90deg, #3b82f6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MyUniPath
          </span>
        </div>

        {/* XP display */}
        <AnimatePresence>
          {pendingXp > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', boxShadow: '0 0 16px rgba(124,58,237,0.4)' }}
            >
              <Zap className="w-3 h-3" />
              {pendingXp} XP
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── PROGRESS DOTS ───────────────────────────────────────────────── */}
      <div className="relative z-20 flex justify-center pb-2">
        <DotProgress current={currentQ} total={questions.length} />
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-6 relative z-10 max-w-3xl mx-auto w-full">

        {/* ── QUESTION CARD ────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="w-full mb-6"
          >
            {/* Question number + timer row */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">
                  Question {currentQ + 1} of {questions.length}
                </div>
                <XPComboTag mult={currentMult} xp={XP_PER_QUESTION} />
              </div>
              <CircularTimer timeLeft={timeLeft} total={TIMER_SECONDS} />
            </div>

            {/* Question text */}
            <div
              className="rounded-2xl p-6 mb-6 border"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <p className="text-xl md:text-2xl font-bold text-white leading-relaxed text-center">
                {q.question}
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-4 rounded-xl text-sm font-medium border-l-4 border-red-500 bg-red-500/10 text-red-300">
                {error}
              </div>
            )}

            {/* ── ANSWER CARDS 2×2 ──────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              {q.options.slice(0, 4).map((option, idx) => {
                const style = CARD_STYLES[idx];
                const isSelected = selectedIdx === idx;
                const otherSelected = selectedIdx !== null && selectedIdx !== idx;

                return (
                  <motion.button
                    key={idx}
                    whileHover={!locked ? { y: -3, scale: 1.01 } : {}}
                    whileTap={!locked ? { scale: 0.97 } : {}}
                    onClick={() => handleSelect(idx)}
                    disabled={locked || submitting}
                    className="relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-200 cursor-pointer"
                    style={{
                      border: `2px solid ${isSelected ? style.color : 'rgba(255,255,255,0.08)'}`,
                      background: isSelected ? style.bg : 'rgba(255,255,255,0.03)',
                      boxShadow: isSelected ? style.glow : 'none',
                      opacity: otherSelected ? 0.45 : 1,
                      transform: isSelected ? 'scale(1.02)' : undefined,
                    }}
                  >
                    {/* Letter badge */}
                    <div
                      className="absolute top-3 left-3 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                      style={{
                        background: isSelected ? style.color : 'rgba(255,255,255,0.1)',
                        color: '#fff',
                      }}
                    >
                      {style.letter}
                    </div>

                    {/* Selected pulse ring */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        style={{ border: `2px solid ${style.color}`, borderRadius: 16 }}
                      />
                    )}

                    {/* Content */}
                    <div className="mt-5 flex flex-col gap-2">
                      {option.emoji && (
                        <span className="text-2xl">{option.emoji}</span>
                      )}
                      <p className="text-sm md:text-base font-semibold text-white/90 leading-snug">
                        {option.text}
                      </p>
                    </div>

                    {/* Selected checkmark */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute bottom-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: style.color }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Skip hint when locked */}
            <AnimatePresence>
              {locked && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 mt-4"
                >
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  <span className="text-white/40 text-xs">
                    {currentQ < questions.length - 1 ? 'Moving to next question...' : 'Calculating your character...'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Manual next (visible only when not auto-advancing, for accessibility) */}
            {!locked && selectedIdx === null && timeLeft <= 5 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => handleAdvance(null)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition-all text-sm"
              >
                Skip <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Streak display */}
        <AnimatePresence>
          {streak >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black"
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.2))', border: '1px solid rgba(245,158,11,0.4)' }}
            >
              🔥 {streak} answer streak! {streak >= 5 ? 'LEGENDARY!' : streak >= 3 ? 'ON FIRE!' : 'Keep it up!'}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── FLOATING MASCOT ──────────────────────────────────────────────── */}
      <AnimatePresence>
        <MascotCorner qIndex={currentQ} streak={streak} />
      </AnimatePresence>

      {/* ── AMBIENT GLOWS ────────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', filter: 'blur(80px)', transform: 'translateY(-50%)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', filter: 'blur(80px)', transform: 'translateY(50%)' }} />
      </div>
    </div>
  );
}