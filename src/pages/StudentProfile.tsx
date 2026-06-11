import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Mail, FileText, Award, ArrowRight, Edit, LogOut, Zap, Star } from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { useGamification } from '../context/GamificationContext';
import { XPBar } from '../components/gamification/XPBar';
import { PERSONA_DATA } from '../lib/data';
import { ThemeToggle } from '../components/theme/ThemeToggle';
import { motion } from 'framer-motion';

const PERSONA_ASSETS: Record<string, string> = {
  // Legacy slugs
  creator:  '/mascot-creator.png',
  guardian: '/mascot-guardian.png',
  analyst:  '/mascot-analyst.png',
  solver:   '/mascot-solver.png',
  // Current programme-based slugs
  'software-engineering':    '/mascot-solver.png',
  'graphics-multimedia':     '/mascot-creator.png',
  'cybersecurity':           '/mascot-guardian.png',
  'artificial-intelligence': '/mascot-solver.png',
  'business-analytics':      '/mascot-analyst.png',
  'systems-networking':      '/mascot-guardian.png',
};

export function StudentProfile() {
  const navigate = useNavigate();
  const { studentData, logout } = useStudent();
  const { xp, level, quizCount, bestCombo } = useGamification();

  const hasPersona = studentData.persona && studentData.quizCompleted;
  const personaInfo = hasPersona && studentData.persona ? PERSONA_DATA[studentData.persona] : null;
  const assetUrl = hasPersona && studentData.persona ? PERSONA_ASSETS[studentData.persona] : null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col selection:bg-primary/20">
      {/* UNITEN Brand Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(15,51,97,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(227,70,40,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <img
              src="/myunipath-emblem.svg"
              alt="MyUniPath"
              className="w-8 h-8 object-contain drop-shadow-sm"
            />
            <span className="text-xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #0F3361, #e34628)' }}>
              MyUniPath
            </span>
          </button>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => navigate('/profile/edit')}
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary font-medium border border-transparent hover:border-border"
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Edit Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="text-destructive hover:text-destructive/80 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-destructive/10 font-bold tracking-wide uppercase border border-transparent hover:border-destructive/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 relative z-10 w-full">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden mb-6"
        >
          {/* Cover Banner */}
          <div className="h-40 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0F3361 0%, #e34628 100%)' }}>
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
          </div>

          {/* Profile Content */}
          <div className="px-8 pb-8 relative z-10">
            {/* Avatar */}
            <div className="relative -mt-20 mb-6 flex items-end justify-between">
              <div className="w-36 h-36 bg-card rounded-full flex items-center justify-center text-6xl shadow-xl border-4 border-card relative z-10 overflow-hidden">
                {hasPersona && personaInfo && assetUrl ? (
                  <img src={assetUrl} alt={personaInfo.name} className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500" />
                ) : (
                  <User className="w-20 h-20 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Name & Info */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-foreground mb-3">{studentData.name || 'Student Name'}</h1>
              {hasPersona && personaInfo && (
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full font-semibold shadow-sm">
                  <Award className="w-4 h-4" />
                  <span className="text-sm tracking-wide">{personaInfo.name}</span>
                </div>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Age */}
              <div className="bg-secondary/50 border border-border rounded-2xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center shadow-sm border border-border">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Age</p>
                    <p className="text-foreground font-bold">{studentData.age || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-secondary/50 border border-border rounded-2xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center shadow-sm border border-border">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Email</p>
                    <p className="text-foreground font-bold truncate">{studentData.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* SPM Result */}
              <div className="bg-secondary/50 border border-border rounded-2xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center shadow-sm border border-border">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Transcripts</p>
                    {studentData.transcriptPath ? (
                      <a 
                        href={`http://localhost:8000/storage/${studentData.transcriptPath}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors cursor-pointer"
                      >
                        View Transcript
                      </a>
                    ) : (
                      <p className="text-foreground font-bold">Not uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Gamification Stats Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-3xl shadow-xl border border-border overflow-hidden mb-6"
        >
          {/* Header */}
          <div className="px-8 py-4 border-b border-border flex items-center gap-2 bg-card">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-foreground text-sm">Your Progress</h3>
          </div>

          <div className="bg-card px-8 py-6">
            {/* XP Bar */}
            <div className="mb-6">
              <XPBar xp={xp} />
            </div>

            {/* Stat grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-secondary/50 border border-border rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">{level.emoji}</div>
                <p className="text-lg font-extrabold text-foreground">{level.name}</p>
                <p className="text-xs text-muted-foreground">Level {level.level}</p>
              </div>
              <div className="bg-secondary/50 border border-border rounded-2xl p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center rounded-full bg-primary/10">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <p className="text-lg font-extrabold text-foreground">{quizCount}</p>
                <p className="text-xs text-muted-foreground">Quizzes Taken</p>
              </div>
              <div className="bg-secondary/50 border border-border rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">🔥</div>
                <p className="text-lg font-extrabold text-foreground">{bestCombo > 0 ? `${bestCombo / 10}x` : '—'}</p>
                <p className="text-xs text-muted-foreground">Best Combo</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Persona Card (if available) */}
        {hasPersona && personaInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-gradient-to-br ${personaInfo.gradientClass} rounded-3xl shadow-xl p-10 mb-6 text-white relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
            <div className="relative text-center z-10 flex flex-col items-center">
              <div className="inline-block bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/20">
                <span className="text-xs font-bold uppercase tracking-widest text-white/90">Your Tech Persona</span>
              </div>
              <img
                src={assetUrl!}
                alt={personaInfo.name}
                className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-2xl shadow-2xl border-4 border-white/20 mb-4"
              />
              <h2 className="text-3xl md:text-4xl font-extrabold filter drop-shadow-sm">{personaInfo.name}</h2>
            </div>
          </motion.div>
        )}

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {/* Quiz Card */}
          <div className="bg-card text-card-foreground border border-border rounded-3xl shadow-lg p-8 flex flex-col hover:border-primary/50 transition-colors">
            <div className="text-center flex-1 flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-3">
                {hasPersona ? 'Retake Identity Engine' : 'Start Assessment'}
              </h3>
              <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
                {hasPersona
                  ? 'Want to discover a different persona? Take the assessment again!'
                  : 'Discover your tech persona and find the best ICT program for you'}
              </p>
              <button
                onClick={() => navigate('/quiz')}
                className="mt-auto w-full bg-primary text-primary-foreground font-semibold px-6 py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>{hasPersona ? 'Retake Quiz' : 'Start Quiz'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Programs Card */}
          <div className="bg-card text-card-foreground border border-border rounded-3xl shadow-lg p-8 flex flex-col hover:border-blue-500/50 transition-colors">
            <div className="text-center flex-1 flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-3">
                {hasPersona ? 'View Recommendations' : 'Browse Programs'}
              </h3>
              <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
                {hasPersona
                  ? 'Check out your highly personalized curriculum recommendations'
                  : 'Explore all cutting-edge ICT programs available at UNITEN'}
              </p>
              <button
                onClick={() => navigate(hasPersona ? `/results/${studentData.persona}` : '/programs')}
                className="mt-auto w-full bg-secondary text-secondary-foreground font-semibold px-6 py-4 rounded-xl shadow-sm border border-border hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
              >
                <span>{hasPersona ? 'View Results' : 'Browse Programs'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 py-6 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} MyUniPath &middot; CCI, UNITEN
        </p>
      </footer>
    </div>
  );
}
