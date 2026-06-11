import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Zap, RefreshCw, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudent } from '../context/StudentContext';
import { useGamification, xpToNextLevel } from '../context/GamificationContext';
import { CHARACTER_DATA, PROGRAM_DATA } from '../lib/data';
import type { ProgramId } from '../lib/data';
import { ConfettiEffect } from '../components/gamification/ConfettiEffect';
import { LevelUpModal } from '../components/gamification/LevelUpModal';
import { Footer } from '../components/Footer';

type Phase = 'scanning' | 'revealing' | 'done';

const SCAN_LABELS = [
  'Analysing personality matrix...',
  'Mapping skill signatures...',
  'Calibrating program alignment...',
  'Calculating character match...',
  'Reveal imminent...',
];

const FALLBACK_ID: ProgramId = 'software-engineering';

function resolveCharacter(persona: string) {
  return CHARACTER_DATA[persona as ProgramId] ?? CHARACTER_DATA[FALLBACK_ID];
}

function ScanningScreen({ onDone }: { onDone: () => void }) {
  const [labelIdx, setLabelIdx] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const totalMs = 2600;
    const steps = SCAN_LABELS.length;
    const stepMs = totalMs / steps;
    const labelTimer = setInterval(() => {
      setLabelIdx(i => {
        const next = i + 1;
        if (next >= steps) { clearInterval(labelTimer); return i; }
        return next;
      });
    }, stepMs);
    const start = Date.now();
    const barTimer = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / totalMs) * 100, 100);
      setBarWidth(pct);
      if (pct >= 100) clearInterval(barTimer);
    }, 30);
    const doneTimer = setTimeout(onDone, totalMs + 200);
    return () => {
      clearInterval(labelTimer);
      clearInterval(barTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className="quiz-arena-bg min-h-screen flex items-center justify-center">
      <div className="text-center px-8 max-w-md w-full">
        <div className="relative inline-flex items-center justify-center mb-8" style={{ width: 120, height: 120 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{ borderTopColor: '#3b82f6', borderRightColor: '#a855f7' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute rounded-full border-4 border-transparent"
            style={{ inset: 12, borderBottomColor: '#06b6d4', borderLeftColor: '#ec4899' }}
          />
          <span className="text-4xl">&#128302;</span>
        </div>
        <motion.h2
          key={labelIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-white mb-6"
        >
          {SCAN_LABELS[labelIdx]}
        </motion.h2>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-4">
          <motion.div
            className="h-full rounded-full"
            style={{ width: `${barWidth}%`, background: 'linear-gradient(90deg, #3b82f6, #a855f7, #ec4899)' }}
          />
        </div>
        <p className="text-white/40 text-sm">{Math.round(barWidth)}%</p>
        <div className="flex justify-center gap-1.5 mt-6">
          {[0,1,2,3,4].map(i => (
            <motion.div key={i} className="w-2 h-2 rounded-full bg-blue-500"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface CharCardProps {
  char: ReturnType<typeof resolveCharacter>;
  xpEarned: number;
  streak: number;
  xpCountDisplayed: number;
  xpTotal: number;
  xpProgress: number;
  level: { emoji: string; name: string; level: number };
  didLevelUp: boolean;
}

function CharacterCard({ char, xpEarned, streak, xpCountDisplayed, xpTotal, xpProgress, level, didLevelUp }: CharCardProps) {
  const navigate = useNavigate();
  const programCards = char.programs.map(id => PROGRAM_DATA[id]).filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col"
      style={{ background: '#080c14' }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: `radial-gradient(circle, ${char.color} 0%, transparent 70%)`, filter: 'blur(100px)', transform: 'translateY(-40%)' }} />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${char.colorAlt} 0%, transparent 70%)`, filter: 'blur(80px)', transform: 'translateY(40%)' }} />
      </div>

      <header className="relative z-20 flex items-center justify-between px-6 py-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <img src="/myunipath-emblem.svg" alt="MyUniPath" className="w-7 h-7 object-contain"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <span className="font-extrabold tracking-tight"
            style={{ background: 'linear-gradient(90deg, #3b82f6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MyUniPath
          </span>
        </button>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/quiz', { replace: true })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Retake
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/profile')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm transition-all"
          >
            <User className="w-4 h-4" /> Profile
          </motion.button>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 pb-16 pt-4">

        <motion.div
          className="char-reveal rounded-3xl overflow-hidden mb-8 relative shadow-2xl"
          style={{ background: char.gradient, boxShadow: `0 0 80px ${char.color}40` }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
          />
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)' }}>
                &#10024; Your Tech Character
              </div>
              {xpEarned > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: '#fde047' }}>
                  <Zap className="w-3 h-3" /> +{xpCountDisplayed} XP
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="flex-shrink-0 text-center"
              >
                <div className="text-8xl md:text-9xl inline-flex items-center justify-center rounded-3xl"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    width: 160, height: 160,
                    boxShadow: `0 0 40px ${char.color}60`,
                  }}>
                  {char.emoji}
                </div>
              </motion.div>

              <div className="flex-1 text-center md:text-left text-white">
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="text-sm font-bold uppercase tracking-widest text-white/70 mb-2">
                  {char.title}
                </motion.p>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight drop-shadow-lg">
                  {char.name}
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="text-white/80 text-base md:text-lg leading-relaxed mb-5 max-w-xl">
                  {char.description}
                </motion.p>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {char.traits.map((trait, i) => (
                    <motion.span key={trait}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.65 + i * 0.08, type: 'spring', stiffness: 300 }}
                      className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                      style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.25)' }}>
                      {trait}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="mt-8 rounded-2xl p-4 text-center"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <p className="text-white/60 text-xs uppercase font-bold tracking-widest mb-1">Your Superpower</p>
              <p className="text-white font-bold text-base">&#9889; {char.superpower}</p>
            </motion.div>
          </div>
        </motion.div>

        {xpEarned > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl p-5 mb-8 border"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-white/50 text-xs font-semibold">XP Earned</p>
                  <p className="text-white font-black text-xl">+{xpEarned}</p>
                </div>
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xl">&#128293;</span>
                  <div>
                    <p className="text-white/50 text-xs font-semibold">Best Streak</p>
                    <p className="text-white font-black text-xl">{streak}x</p>
                  </div>
                </div>
              )}
              {didLevelUp && (
                <div className="flex items-center gap-2">
                  <span className="text-xl">&#11014;&#65039;</span>
                  <div>
                    <p className="text-white/50 text-xs font-semibold">Leveled Up!</p>
                    <p className="text-white font-black text-xl">{level.name}</p>
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-[140px]">
                <div className="flex justify-between text-xs text-white/40 mb-1.5">
                  <span>{xpTotal} XP total</span>
                  <span>{level.emoji} {level.name}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                    style={{ background: 'linear-gradient(90deg, #3b82f6, #a855f7)' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-2xl p-6 mb-8 border"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
          <h3 className="text-white font-bold text-lg mb-4">&#127919; Career Paths Unlocked</h3>
          <div className="grid grid-cols-2 gap-3">
            {char.careerRoles.map((role, i) => (
              <motion.div key={role}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.07 }}
                className="flex items-center gap-2.5 rounded-xl px-4 py-3"
                style={{ background: `${char.color}18`, border: `1px solid ${char.color}30` }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: char.color }} />
                <span className="text-white/85 text-sm font-medium">{role}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
          className="mb-8">
          <h3 className="text-white font-bold text-lg mb-4">&#128218; Your Matched Programs at UNITEN CCI</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programCards.map((prog, i) => (
              <motion.div key={prog.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="rounded-2xl p-5 border cursor-pointer transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: i === 0 ? char.color + '60' : 'rgba(255,255,255,0.08)' }}
                onClick={() => navigate(`/program/${prog.id}`)}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{prog.icon}</span>
                  <div className="flex-1">
                    {i === 0 && (
                      <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 inline-block"
                        style={{ background: char.color + '30', color: char.color }}>
                        Best Match
                      </span>
                    )}
                    <h4 className="text-white font-bold text-base">{prog.name}</h4>
                    <p className="text-white/55 text-sm mt-1 leading-snug">{(prog as any).shortDesc || (prog as any).description || ""}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-3">
          <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/programs')}
            className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-white shadow-xl"
            style={{ background: char.gradient, boxShadow: `0 8px 32px ${char.color}40` }}>
            Explore All Programs <ArrowRight className="w-5 h-5" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/quiz', { replace: true })}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-white/70 border border-white/15 hover:border-white/30 hover:text-white transition-all">
            <RefreshCw className="w-4 h-4" /> Retake Quiz
          </motion.button>
        </motion.div>
      </main>
      <Footer variant="dark" />
    </motion.div>
  );
}

export function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { persona: paramPersona } = useParams();
  const { studentData } = useStudent();
  const { xp, level } = useGamification();

  const state = location.state as {
    persona?: string;
    xpEarned?: number;
    leveledUp?: boolean;
    newLevel?: typeof level;
    streak?: number;
  } | undefined;

  const persona = state?.persona || paramPersona || studentData?.persona || FALLBACK_ID;
  const xpEarned = state?.xpEarned ?? 0;
  const didLevelUp = state?.leveledUp ?? false;
  const newLevelData = state?.newLevel ?? level;
  const quizStreak = state?.streak ?? 0;

  const char = useMemo(() => resolveCharacter(persona), [persona]);

  const [phase, setPhase] = useState<Phase>('scanning');
  const cameFromQuiz = !!state?.persona;
  useEffect(() => {
    if (!cameFromQuiz) setPhase('revealing');
  }, [cameFromQuiz]);

  const [showConfetti, setShowConfetti] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (phase === 'revealing') {
      const t1 = setTimeout(() => setShowConfetti(true), 300);
      const t2 = setTimeout(() => setShowConfetti(false), 5000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [phase]);

  const [xpCountDisplayed, setXpCountDisplayed] = useState(0);

  useEffect(() => {
    if (phase !== 'revealing' || xpEarned <= 0) {
      setXpCountDisplayed(xpEarned);
      if (didLevelUp && newLevelData && phase === 'revealing') {
        setTimeout(() => setShowLevelUp(true), 1200);
      }
      return;
    }
    let current = 0;
    const step = Math.max(1, Math.ceil(xpEarned / 50));
    const interval = setInterval(() => {
      current = Math.min(current + step, xpEarned);
      setXpCountDisplayed(current);
      if (current >= xpEarned) {
        clearInterval(interval);
        if (didLevelUp && newLevelData) setTimeout(() => setShowLevelUp(true), 600);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [phase, xpEarned, didLevelUp, newLevelData]);

  const { progress: xpProgress } = xpToNextLevel(xp);

  if (phase === 'scanning') return <ScanningScreen onDone={() => setPhase('revealing')} />;

  return (
    <>
      <ConfettiEffect active={showConfetti} particleCount={180} />
      <LevelUpModal show={showLevelUp} newLevel={newLevelData} xpEarned={xpEarned} onClose={() => setShowLevelUp(false)} />
      <AnimatePresence>
        {phase === 'revealing' && (
          <CharacterCard
            char={char}
            xpEarned={xpEarned}
            streak={quizStreak}
            xpCountDisplayed={xpCountDisplayed}
            xpTotal={xp}
            xpProgress={xpProgress}
            level={level}
            didLevelUp={didLevelUp}
          />
        )}
      </AnimatePresence>
    </>
  );
}
