import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, X } from 'lucide-react';
import { PROGRAM_DATA } from '../lib/data';
import { ThemeToggle } from '../components/theme/ThemeToggle';
import { motion } from 'framer-motion';

const PROGRAM_IDS = Object.keys(PROGRAM_DATA);

export function ProgramComparison() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleProgram = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const programs = selected.map((id) => PROGRAM_DATA[id]).filter(Boolean);
  const attributes = [
    { key: 'summary', label: 'Summary' },
    { key: 'intakes', label: 'Intakes' },
    { key: 'campus', label: 'Campus' },
    { key: 'duration', label: 'Duration' },
    { key: 'feeMalaysian', label: 'Fee (Malaysian)' },
    { key: 'feeInternational', label: 'Fee (International)' },
    { key: 'careerProspects', label: 'Career Prospects' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col selection:bg-primary/20">
      {/* Background blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Program Comparison</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 relative z-10 w-full">
        <div className="mb-8 bg-card border border-border p-6 rounded-3xl shadow-lg">
          <p className="text-muted-foreground mb-4 font-medium">
            Select 2–4 programs to compare side by side
          </p>
          <div className="flex flex-wrap gap-3">
            {PROGRAM_IDS.map((id) => {
              const p = PROGRAM_DATA[id];
              const isSelected = selected.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggleProgram(id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all font-medium ${isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-sm scale-[1.02]'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-secondary'
                    }`}
                >
                  <span className="text-lg">{p.icon}</span>
                  <span className="text-sm">{p.name}</span>
                  {isSelected && <CheckCircle className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>

        {programs.length >= 2 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl shadow-xl overflow-x-auto"
          >
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  <th className="text-left py-6 px-6 text-muted-foreground font-semibold uppercase tracking-wider text-xs w-48">Attribute</th>
                  {programs.map((p) => (
                    <th key={p.id} className="text-left py-6 px-6 relative">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-3xl block mb-2 filter drop-shadow-sm">{p.icon}</span>
                          <span className="font-bold text-foreground block text-lg">{p.name}</span>
                        </div>
                        <button
                          onClick={() => toggleProgram(p.id)}
                          className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors absolute top-4 right-4"
                          title="Remove from comparison"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attributes.map(({ key, label }) => (
                  <tr key={key} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors align-top">
                    <td className="py-5 px-6 text-muted-foreground font-semibold text-sm">{label}</td>
                    {programs.map((p) => {
                      const val = (p as any)[key];
                      if (Array.isArray(val)) {
                        return (
                          <td key={p.id} className="py-5 px-6 text-foreground text-sm leading-relaxed font-medium">
                            <ul className="list-disc list-inside space-y-1">
                              {val.map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </td>
                        );
                      }
                      const display = typeof val === 'string' ? val : '—';
                      return (
                        <td key={p.id} className="py-5 px-6 text-foreground text-sm leading-relaxed font-medium">
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <div className="bg-card border border-border rounded-3xl shadow-sm p-16 text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl opacity-50">️</span>
            </div>
            <p className="text-muted-foreground text-lg font-medium">
              Select at least 2 programs above to see a detailed side-by-side comparison
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
