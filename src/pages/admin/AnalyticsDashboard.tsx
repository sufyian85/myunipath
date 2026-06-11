himport React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../components/Footer';
import {
  ArrowLeft, Users, TrendingUp, Lock, BarChart3, Settings2,
  School, Target, Zap, Award, CheckCircle2, BookOpen,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { api } from '../../lib/api';
import { PROGRAM_DATA } from '../../lib/data';
import { ThemeToggle } from '../../components/theme/ThemeToggle';
import { motion } from 'framer-motion';
import { PersonaRulesCRUD } from './PersonaRulesCRUD';
import { UserManagement } from './UserManagement';

const ADMIN_SESSION_KEY = 'myunipath_admin_session';

const PROGRAM_COLORS: Record<string, string> = {
  'software-engineering': '#2563eb',
  'graphics-multimedia': '#8b5cf6',
  'cybersecurity': '#ef4444',
  'artificial-intelligence': '#f59e0b',
  'business-analytics': '#10b981',
  'systems-networking': '#06b6d4',
};

const PERSONA_LABELS: Record<string, string> = {
  'software-engineering': 'Code Architect',
  'graphics-multimedia': 'Pixel Maestro',
  'cybersecurity': 'Cyber Sentinel',
  'artificial-intelligence': 'AI Pioneer',
  'business-analytics': 'Data Oracle',
  'systems-networking': 'Network Titan',
};

const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: 'hsl(var(--card))',
    borderColor: 'hsl(var(--border))',
    color: 'hsl(var(--foreground))',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  itemStyle: { color: 'hsl(var(--foreground))' },
};

interface AnalyticsData {
  totalParticipants: number;
  totalRegistered: number;
  quizCompletedCount: number;
  completionRate: number;
  personaCounts: Record<string, number>;
  programCounts: Record<string, number>;
  schoolCounts: Record<string, number>;
  qualificationCounts: Record<string, number>;
  ageCounts: Record<string, number>;
  avgXp: number;
  levelCounts: Record<string, number>;
  dailyRegistrations: Record<string, number>;
  dailyCompletions: Record<string, number>;
  completions: Array<{ id: number; persona: string; program_ids: string[]; created_at: string }>;
}

const EMPTY: AnalyticsData = {
  totalParticipants: 0, totalRegistered: 0, quizCompletedCount: 0,
  completionRate: 0, personaCounts: {}, programCounts: {}, schoolCounts: {},
  qualificationCounts: {}, ageCounts: {}, avgXp: 0, levelCounts: {},
  dailyRegistrations: {}, dailyCompletions: {}, completions: [],
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-MY', { month: 'short', day: 'numeric' });
}

function buildTrendData(regs: Record<string, number>, comps: Record<string, number>) {
  const keys = Array.from(new Set([...Object.keys(regs), ...Object.keys(comps)])).sort();
  return keys.map((k) => ({ date: formatDate(k), Registrations: regs[k] ?? 0, 'Quiz Completions': comps[k] ?? 0 }));
}

function EmptyChart({ label = 'No data yet.', height = 180 }: { label?: string; height?: number }) {
  return (
    <div className="flex items-center justify-center border-2 border-dashed border-border rounded-xl text-muted-foreground font-medium text-sm" style={{ height }}>
      {label}
    </div>
  );
}

function StatCard({ label, value, sub, icon, accent, delay = 0 }: {
  label: string; value: string | number; sub?: string;
  icon: React.ReactNode; accent: string; delay?: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-card border border-border rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 ${accent}`}>{icon}</div>
      <p className="text-xs text-muted-foreground font-semibold tracking-widest uppercase mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </motion.div>
  );
}

function ChartCard({ title, children, delay = 0, className = '' }: {
  title: string; children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }}
      className={`bg-card border border-border rounded-3xl shadow-lg p-6 ${className}`}>
      <h3 className="text-lg font-bold text-foreground mb-5">{title}</h3>
      {children}
    </motion.div>
  );
}

export function AnalyticsDashboard() {
  const navigate = useNavigate();

  const initialSession = (() => { try { return sessionStorage.getItem(ADMIN_SESSION_KEY) ?? ''; } catch { return ''; } })();
  const [authenticated, setAuthenticated] = useState<boolean>(!!initialSession);
  const [password, setPassword] = useState(initialSession);
  const [authError, setAuthError] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'rules'>('analytics');

  useEffect(() => {
    if (authenticated && password) {
      setLoading(true);
      api.getAnalytics(password)
        .then((data) => setAnalytics({ ...EMPTY, ...data }))
        .catch(() => setApiError(true))
        .finally(() => setLoading(false));
    }
  }, [authenticated, password]);

  const programChartData = useMemo(() =>
    Object.entries(analytics.programCounts)
      .filter(([id]) => !!PROGRAM_DATA[id])
      .map(([id, count]) => ({ name: PROGRAM_DATA[id]?.name ?? id, value: count, color: PROGRAM_COLORS[id] ?? '#6366f1' }))
      .sort((a, b) => b.value - a.value),
    [analytics.programCounts]);

  const personaChartData = useMemo(() =>
    Object.entries(analytics.personaCounts)
      .map(([key, value]) => ({ name: PERSONA_LABELS[key] ?? key, value, color: PROGRAM_COLORS[key] ?? '#6366f1' }))
      .sort((a, b) => b.value - a.value),
    [analytics.personaCounts]);

  const schoolChartData = useMemo(() =>
    Object.entries(analytics.schoolCounts)
      .map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10),
    [analytics.schoolCounts]);

  const qualificationData = useMemo(() =>
    Object.entries(analytics.qualificationCounts).map(([name, value]) => ({ name, value })),
    [analytics.qualificationCounts]);

  const ageData = useMemo(() =>
    Object.entries(analytics.ageCounts).map(([name, value]) => ({ name, value })),
    [analytics.ageCounts]);

  const trendData = useMemo(() => buildTrendData(analytics.dailyRegistrations, analytics.dailyCompletions),
    [analytics.dailyRegistrations, analytics.dailyCompletions]);

  const radarData = useMemo(() =>
    Object.entries(analytics.programCounts)
      .filter(([id]) => !!PROGRAM_DATA[id])
      .map(([id, count]) => ({ subject: PROGRAM_DATA[id]?.name?.split(' ')[0] ?? id, value: count })),
    [analytics.programCounts]);

  const levelData = useMemo(() =>
    Object.entries(analytics.levelCounts).sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => ({ name, value })),
    [analytics.levelCounts]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(false);
    try {
      await api.analyticsLogin(password);
      setAuthenticated(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, password);
    } catch {
      if (password === 'sufyian123') {
        setAuthenticated(true); setApiError(true);
        sessionStorage.setItem(ADMIN_SESSION_KEY, password);
      } else {
        setAuthError(true);
      }
    }
  };

  const handleLogout = () => { setAuthenticated(false); setPassword(''); sessionStorage.removeItem(ADMIN_SESSION_KEY); };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
            <p className="text-muted-foreground text-sm text-center">Authenticate to access the analytics dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password}
              onChange={(e) => { setPassword(e.target.value); setAuthError(false); }}
              placeholder="Enter Admin Password"
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground" />
            {authError && <p className="text-destructive text-sm font-medium">Incorrect password. Please try again.</p>}
            <button type="submit"
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all mt-2">
              Login to Dashboard
            </button>
          </form>
          <button onClick={() => navigate('/')}
            className="w-full mt-6 flex justify-center items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Application
          </button>
          <p className="text-xs text-muted-foreground/60 mt-8 text-center bg-secondary/30 p-2 rounded-lg border border-border/50">
            Demo password: &quot;sufyian123&quot; — requires Laravel backend.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-secondary rounded-lg transition-colors group">
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
            </button>
            <img src="/myunipath-emblem.svg" alt="MyUniPath" className="w-8 h-8 object-contain drop-shadow-sm" />
            <span className="text-xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #0F3361, #e34628)' }}>
              MyUniPath
            </span>
            <div className="hidden sm:block border-l border-border/50 pl-3 ml-1">
              <span className="text-foreground font-bold text-sm">Admin Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Institutional logos — right header */}
            <div className="hidden md:flex items-center gap-3 mr-2">
              <img src="/cci-logo.png" alt="CCI" className="h-7 object-contain opacity-75 hover:opacity-100 transition-opacity" />
              <div className="w-px h-5 bg-border" />
              <img src="/uniten-logo.png" alt="UNITEN" className="h-7 object-contain opacity-75 hover:opacity-100 transition-opacity" />
            </div>
            <ThemeToggle />
            <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive text-sm font-semibold transition-colors px-2">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 relative z-10 w-full">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 mb-8 p-1 bg-secondary/40 border border-border rounded-2xl w-fit">
          {([
            { key: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
            { key: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
            { key: 'rules', label: 'Persona Rules', icon: <Settings2 className="w-4 h-4" /> },
          ] as const).map(({ key, label, icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === key
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'}`}>
              {icon} {label}
            </button>
          ))}
        </div>

        {activeTab === 'rules' ? <PersonaRulesCRUD /> :
         activeTab === 'users' ? <UserManagement adminPassword={password} /> : (
          <>
            {loading && (
              <div className="mb-6 text-center">
                <div className="inline-block px-4 py-2 bg-secondary rounded-full border border-border animate-pulse text-foreground font-medium text-sm">
                  Loading analytics…
                </div>
              </div>
            )}
            {apiError && (
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                ⚠️ Backend unavailable — run <code>php artisan serve</code> to see live data.
              </div>
            )}

            {/* ── Overview KPIs ── */}
            <section className="mb-8">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Quiz Participants" value={analytics.totalParticipants.toLocaleString()} sub="Unique sessions completed"
                  icon={<Target className="w-6 h-6 text-primary" />} accent="bg-primary/10 border-primary/20" delay={0} />
                <StatCard label="Registered Students" value={analytics.totalRegistered.toLocaleString()} sub="Accounts created"
                  icon={<Users className="w-6 h-6 text-purple-500" />} accent="bg-purple-500/10 border-purple-500/20" delay={0.05} />
                <StatCard label="Completion Rate" value={`${analytics.completionRate}%`} sub="Registered → quiz done"
                  icon={<CheckCircle2 className="w-6 h-6 text-green-500" />} accent="bg-green-500/10 border-green-500/20" delay={0.1} />
                <StatCard label="Avg XP Earned" value={analytics.avgXp.toLocaleString()} sub="Per engaged student"
                  icon={<Zap className="w-6 h-6 text-amber-500" />} accent="bg-amber-500/10 border-amber-500/20" delay={0.15} />
              </div>
            </section>

            {/* ── Programme Interest ── */}
            <section className="mb-8">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Programme Interest</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Recommended Programme Breakdown" delay={0.2}>
                  {programChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={programChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                        <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }} />
                        <Tooltip {...CHART_TOOLTIP_STYLE} cursor={{ fill: 'hsl(var(--secondary))' }} />
                        <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Students">
                          {programChartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <EmptyChart />}
                </ChartCard>

                <ChartCard title="Programme Interest Radar" delay={0.25}>
                  {radarData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }} />
                        <PolarRadiusAxis stroke="hsl(var(--border))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} />
                        <Radar name="Students" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} />
                        <Tooltip {...CHART_TOOLTIP_STYLE} />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : <EmptyChart />}
                </ChartCard>
              </div>
            </section>

            {/* ── Persona Distribution ── */}
            <section className="mb-8">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Character Persona Distribution</h2>
              <ChartCard title="Which characters are students matching?" delay={0.3}>
                {personaChartData.length > 0 ? (
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <ResponsiveContainer width={220} height={220}>
                      <PieChart>
                        <Pie data={personaChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" strokeWidth={2} stroke="hsl(var(--card))">
                          {personaChartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip {...CHART_TOOLTIP_STYLE} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                      {personaChartData.map((p, i) => {
                        const total = personaChartData.reduce((acc, x) => acc + x.value, 0);
                        const pct = total > 0 ? ((p.value / total) * 100).toFixed(1) : '0';
                        return (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/50 transition-colors">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                              <span className="text-sm font-medium text-foreground">{p.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-foreground">{p.value}</span>
                              <span className="text-xs text-muted-foreground ml-1">({pct}%)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : <EmptyChart />}
              </ChartCard>
            </section>

            {/* ── School & Demographics ── */}
            <section className="mb-8">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">School &amp; Student Demographics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <ChartCard title="Top 10 Schools by Participation" delay={0.35}>
                  {schoolChartData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={schoolChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                          <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} allowDecimals={false} />
                          <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10, fill: 'hsl(var(--foreground))' }} />
                          <Tooltip {...CHART_TOOLTIP_STYLE} cursor={{ fill: 'hsl(var(--secondary))' }} />
                          <Bar dataKey="value" fill="#0F3361" radius={[0, 6, 6, 0]} name="Students" />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="mt-4 space-y-1">
                        {schoolChartData.slice(0, 5).map((s, i) => (
                          <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-secondary text-muted-foreground'}`}>{i + 1}</span>
                            <School className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="text-sm font-medium text-foreground flex-1 truncate">{s.name}</span>
                            <span className="text-sm font-bold text-foreground">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : <EmptyChart label="No school data yet. Collected at registration." />}
                </ChartCard>

                <div className="flex flex-col gap-6">
                  <ChartCard title="Age Distribution" delay={0.4}>
                    {ageData.some(d => d.value > 0) ? (
                      <ResponsiveContainer width="100%" height={150}>
                        <BarChart data={ageData} margin={{ left: -10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }} />
                          <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                          <Tooltip {...CHART_TOOLTIP_STYLE} />
                          <Bar dataKey="value" fill="#e34628" radius={[4, 4, 0, 0]} name="Students" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : <EmptyChart height={150} />}
                  </ChartCard>

                  <ChartCard title="Highest Qualification" delay={0.45}>
                    {qualificationData.length > 0 ? (
                      <div className="space-y-2">
                        {qualificationData.sort((a, b) => b.value - a.value).map((q, i) => {
                          const total = qualificationData.reduce((acc, x) => acc + x.value, 0);
                          const pct = total > 0 ? Math.round((q.value / total) * 100) : 0;
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <span className="text-sm text-foreground font-medium w-28 shrink-0 truncate">{q.name}</span>
                              <div className="flex-1 bg-secondary rounded-full h-2.5 overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0F3361, #e34628)' }} />
                              </div>
                              <span className="text-sm font-bold text-foreground w-8 text-right">{q.value}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : <EmptyChart height={120} />}
                  </ChartCard>
                </div>
              </div>
            </section>

            {/* ── Engagement Trend ── */}
            <section className="mb-8">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Engagement Trend (Last 30 Days)</h2>
              <ChartCard title="Daily Registrations &amp; Quiz Completions" delay={0.5}>
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={trendData} margin={{ left: -10, right: 10 }}>
                      <defs>
                        <linearGradient id="gradReg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0F3361" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0F3361" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradComp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e34628" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#e34628" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                      <Tooltip {...CHART_TOOLTIP_STYLE} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Area type="monotone" dataKey="Registrations" stroke="#0F3361" fill="url(#gradReg)" strokeWidth={2} dot={{ r: 3 }} />
                      <Area type="monotone" dataKey="Quiz Completions" stroke="#e34628" fill="url(#gradComp)" strokeWidth={2} dot={{ r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : <EmptyChart label="No trend data in the last 30 days." />}
              </ChartCard>
            </section>

            {/* ── Gamification ── */}
            <section className="mb-8">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Gamification Engagement</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Student Level Distribution" delay={0.55}>
                  {levelData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={levelData} margin={{ left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }} />
                        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                        <Tooltip {...CHART_TOOLTIP_STYLE} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Students">
                          {levelData.map((_, i) => (
                            <Cell key={i} fill={['#94a3b8', '#60a5fa', '#34d399', '#f59e0b', '#a78bfa'][i] ?? '#6366f1'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <EmptyChart />}
                </ChartCard>

                <ChartCard title="Engagement Summary" delay={0.6}>
                  <div className="space-y-3 pt-2">
                    {[
                      { icon: <Target className="w-5 h-5 text-primary" />, label: 'Quiz Participants', value: analytics.totalParticipants, bg: 'bg-primary/10' },
                      { icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, label: 'Quiz Completions (registered)', value: analytics.quizCompletedCount, bg: 'bg-green-500/10' },
                      { icon: <Zap className="w-5 h-5 text-amber-500" />, label: 'Average XP per student', value: analytics.avgXp, bg: 'bg-amber-500/10' },
                      { icon: <Award className="w-5 h-5 text-purple-500" />, label: 'Programmes tracked', value: Object.keys(PROGRAM_DATA).length, bg: 'bg-purple-500/10' },
                      { icon: <BookOpen className="w-5 h-5 text-blue-500" />, label: 'Schools represented', value: Object.keys(analytics.schoolCounts).length, bg: 'bg-blue-500/10' },
                      { icon: <TrendingUp className="w-5 h-5 text-rose-500" />, label: 'Conversion Rate', value: `${analytics.completionRate}%`, bg: 'bg-rose-500/10' },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${row.bg}`}>{row.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{row.label}</p>
                        </div>
                        <span className="text-lg font-black text-foreground tabular-nums">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              </div>
            </section>

          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
