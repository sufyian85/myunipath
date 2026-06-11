import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Cpu, BarChart2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudent } from '../context/StudentContext';
import { useGamification } from '../context/GamificationContext';
import { XPBar } from '../components/gamification/XPBar';
import { Footer } from '../components/Footer';

const CHARACTERS = [
  { emoji: '💻', name: 'Code Architect',  color: '#3b82f6', id: 'software-engineering',   delay: 0 },
  { emoji: '🎨', name: 'Pixel Maestro',   color: '#a855f7', id: 'graphics-multimedia',     delay: 0.08 },
  { emoji: '🛡️', name: 'Cyber Sentinel',  color: '#ef4444', id: 'cybersecurity',            delay: 0.16 },
  { emoji: '🤖', name: 'AI Pioneer',      color: '#06b6d4', id: 'artificial-intelligence',  delay: 0.24 },
  { emoji: '📊', name: 'Data Oracle',     color: '#f59e0b', id: 'business-analytics',       delay: 0.32 },
  { emoji: '🌐', name: 'Network Titan',   color: '#10b981', id: 'systems-networking',       delay: 0.40 },
];

function StarField() {
  const stars = Array.from({ length: 55 }, (_, i) => ({
    id: i,
    x: (i * 17.3) % 100,
    y: (i * 23.7) % 100,
    size: (i % 3) + 1,
    delay: (i * 0.4) % 4,
    dur: 2 + (i % 3),
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: s.x + '%', top: s.y + '%', width: s.size, height: s.size }}
          animate={{ opacity: [0.1, 0.8, 0.1] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
        />
      ))}
    </div>
  );
}

function CharCard({ char, index }: { char: typeof CHARACTERS[0]; index: number }) {
  const yAmt = index % 2 === 0 ? -8 : 8;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4 + char.delay, type: 'spring', stiffness: 200, damping: 20 }}
    >
      <motion.div
        animate={{ y: [0, yAmt, 0] }}
        transition={{ duration: 3 + index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
        className="rounded-2xl p-4 text-center cursor-default"
        style={{
          background: char.color + '15',
          border: '1.5px solid ' + char.color + '40',
          backdropFilter: 'blur(12px)',
          minWidth: 88,
        }}
        whileHover={{ scale: 1.1, background: char.color + '25' }}
      >
        <div className="text-3xl mb-2">{char.emoji}</div>
        <div className="text-xs font-bold text-white/80 leading-tight">{char.name}</div>
        <div className="mt-1.5 h-0.5 w-full rounded-full opacity-50" style={{ background: char.color }} />
      </motion.div>
    </motion.div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-1 text-white/50">{icon}</div>
      <p className="text-xl font-black text-white">{value}</p>
      <p className="text-xs text-white/40 font-medium">{label}</p>
    </div>
  );
}

export function WelcomePage() {
  const navigate = useNavigate();
  const { isLoggedIn, studentData, logout } = useStudent();
  const { xp, level, quizCount } = useGamification();

  const handleStart = () => {
    if (isLoggedIn) navigate('/quiz');
    else navigate('/login', { state: { redirectTo: '/quiz' } });
  };

  return (
    <div className="quiz-arena-bg min-h-screen flex flex-col text-white relative overflow-hidden">
      <StarField />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', filter: 'blur(100px)', transform: 'translateY(-50%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', filter: 'blur(80px)', transform: 'translateY(50%)' }} />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', filter: 'blur(80px)', transform: 'translateY(-50%)' }} />
      </div>

      {/* HEADER */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img src="/myunipath-emblem.svg" alt="MyUniPath" className="w-8 h-8 object-contain drop-shadow brightness-0 invert" />
          <span className="font-extrabold text-xl tracking-tight"
            style={{ background: 'linear-gradient(90deg, #3b82f6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MyUniPath
          </span>
          {/* Institutional affiliation — inline header branding */}
          <div className="hidden md:flex items-center gap-2 ml-2 pl-3 border-l border-white/10">
            <img src="/cci-logo.png" alt="CCI" className="h-6 object-contain opacity-60 hover:opacity-90 transition-opacity brightness-0 invert" />
            <div className="w-px h-4 bg-white/15" />
            <img src="/uniten-logo.png" alt="UNITEN" className="h-6 object-contain opacity-60 hover:opacity-90 transition-opacity brightness-0 invert" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-white/50 hidden sm:block">
                Welcome, <span className="font-bold text-white/80">{studentData.name}</span>
              </span>
              <button onClick={logout}
                className="text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg border border-white/15 hover:border-white/30 text-white/60 hover:text-white transition-all">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/login')}
              className="text-sm font-semibold px-4 py-2 rounded-xl border border-white/15 hover:border-white/30 text-white/70 hover:text-white transition-all">
              Login
            </button>
          )}
          <button onClick={() => navigate('/admin')}
            className="text-xs font-medium px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 text-white/40 hover:text-white/70 transition-all">
            Admin
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
          style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.4)', color: '#93c5fd' }}
        >
          <Zap className="w-4 h-4" />
          UNITEN CCI · Character Discovery Quiz
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 leading-tight max-w-3xl"
        >
          Discover Your{' '}
          <span className="neon-text"
            style={{ background: 'linear-gradient(90deg, #3b82f6, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Tech Character
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-white/55 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
        >
          Answer 12 scenario-based questions and reveal the ICT program at UNITEN
          that matches your unique personality, strengths, and ambitions.
        </motion.p>

        {/* Player card when logged in */}
        <AnimatePresence>
          {isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.3 }}
              className="mb-8 rounded-2xl px-6 py-4 border flex items-center gap-4"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="text-3xl">{level.emoji}</div>
              <div className="text-left min-w-[160px]">
                <p className="text-xs text-white/40 font-medium">Your Level</p>
                <p className="text-white font-bold text-sm">
                  {level.name} · {quizCount} {quizCount === 1 ? 'quiz' : 'quizzes'}
                </p>
                <XPBar xp={xp} compact />
              </div>
              {studentData.quizCompleted && studentData.persona && (
                <button
                  onClick={() => navigate('/results', { state: { persona: studentData.persona } })}
                  className="text-xs font-bold px-3 py-2 rounded-xl border border-white/15 hover:border-white/30 text-white/60 hover:text-white transition-all ml-2"
                >
                  Last Result
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, type: 'spring', stiffness: 200 }}
          className="mb-14"
        >
          <motion.button
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStart}
            className="relative group px-10 py-5 rounded-2xl font-extrabold text-xl text-white shadow-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', boxShadow: '0 0 50px rgba(124,58,237,0.5), 0 16px 40px rgba(59,130,246,0.3)' }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <span className="relative z-10 flex items-center gap-3">
              {isLoggedIn && studentData.quizCompleted ? 'Retake the Quiz' : 'Find My Character'}
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                <ArrowRight className="w-6 h-6" />
              </motion.span>
            </span>
          </motion.button>
          <p className="text-white/30 text-sm mt-3">~3 minutes · 12 questions · 6 possible characters</p>
        </motion.div>

        {/* 6 character preview cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-6">
            Which character will you unlock?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {CHARACTERS.map((char, i) => (
              <CharCard key={char.id} char={char} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl border px-8 py-5 flex items-center gap-8 flex-wrap justify-center"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <StatCard icon={<Zap className="w-4 h-4" />} value="12" label="Questions" />
          <div className="w-px h-8 bg-white/10" />
          <StatCard icon={<Cpu className="w-4 h-4" />} value="6" label="Characters" />
          <div className="w-px h-8 bg-white/10" />
          <StatCard icon={<BarChart2 className="w-4 h-4" />} value="XP" label="Earn Points" />
          <div className="w-px h-8 bg-white/10" />
          <StatCard icon={<Globe className="w-4 h-4" />} value="CCI" label="UNITEN" />
        </motion.div>

        {/* Browse links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}
          className="flex gap-6 mt-8"
        >
          <button onClick={() => navigate('/programs')}
            className="text-sm text-white/40 hover:text-white/70 underline underline-offset-4 transition-colors font-medium">
            Browse Programs
          </button>
          <button onClick={() => navigate('/compare')}
            className="text-sm text-white/40 hover:text-white/70 underline underline-offset-4 transition-colors font-medium">
            Compare Programs
          </button>
          <button onClick={() => navigate('/about')}
            className="text-sm text-white/40 hover:text-white/70 underline underline-offset-4 transition-colors font-medium">
            About
          </button>
        </motion.div>
      </main>

      <div className="relative z-10">
        <Footer variant="dark" />
      </div>
    </div>
  );
}
