import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { api } from '../../lib/api';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../../components/theme/ThemeToggle';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useStudent();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.loginStudent({ email, password });
      if (res.success && res.student) {
        login(res.student);
        // Priority 1: explicit redirect target (e.g. user clicked "Start Assessment" then logged in)
        if (redirectTo) {
          navigate(redirectTo, { replace: true });
        } else if (res.student.quiz_completed) {
          navigate('/profile');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
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
            {/* Institutional logos — right header (HCI: affiliation branding) */}
            <div className="hidden sm:flex items-center gap-3">
              <img src="/cci-logo.png" alt="CCI" className="h-7 object-contain opacity-80 hover:opacity-100 transition-opacity" />
              <div className="w-px h-5 bg-border" />
              <img src="/uniten-logo.png" alt="UNITEN" className="h-7 object-contain opacity-80 hover:opacity-100 transition-opacity" />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="w-full max-w-md"
        >
          {/* Logo Context */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">Welcome Back</h1>
            <p className="text-muted-foreground">Please login to continue</p>
          </div>

          {/* Login Form */}
          <div className="bg-card text-card-foreground rounded-3xl shadow-xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Login</h2>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border-l-4 border-destructive text-destructive text-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm mb-2 text-foreground font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-border bg-background text-foreground rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
                    placeholder="your.email@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm mb-2 text-foreground font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-border bg-background text-foreground rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-semibold py-3 rounded-xl transition-all shadow-md mt-2 text-white cursor-pointer ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                style={{ background: '#e34628' }}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Create Account */}
            <button
              onClick={() => navigate('/register', { state: redirectTo ? { redirectTo } : undefined })}
              className="w-full bg-card text-foreground font-medium py-3 rounded-xl border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all"
            >
              Create Account
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
