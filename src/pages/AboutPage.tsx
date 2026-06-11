import React from 'react';
import { motion } from 'framer-motion';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* UNITEN Brand Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(15,51,97,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(227,70,40,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 md:py-24 z-10 w-full flex flex-col items-center">
        <motion.img 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          src="/myunipath-emblem.svg" 
          alt="MyUniPath Mascot" 
          className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg mb-6"
        />
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(90deg, #0F3361, #e34628)' }}
        >
          About MyUniPath
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full space-y-8"
        >
          <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-xl border border-border/50">
            <h2 className="text-2xl font-bold mb-4 text-[#0F3361] dark:text-blue-400">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              MyUniPath is an intelligent career guidance and rule-based assessment system developed specifically for prospective ICT students at Universiti Tenaga Nasional (UNITEN). We bridge the gap between academic choice and real-world career trajectory.
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-xl border border-border/50">
            <h2 className="text-2xl font-bold mb-4 text-[#0F3361] dark:text-blue-400">How It Works</h2>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              Through a highly personalized 8-question cognitive assessment, our engine analyzes your unique logic-driven skills, problem-solving habits, and core technology interests. It dynamically maps your strengths to one of four distinctive Tech Personas:
            </p>
            <ul className="space-y-4 mb-8 ml-2">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#e34628]"></span>
                <span className="font-semibold text-foreground text-lg">The Creator</span> 
                <span className="text-muted-foreground text-lg">(Software Engineering)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#e34628]"></span>
                <span className="font-semibold text-foreground text-lg">The Guardian</span> 
                <span className="text-muted-foreground text-lg">(Cybersecurity)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#e34628]"></span>
                <span className="font-semibold text-foreground text-lg">The Analyst</span> 
                <span className="text-muted-foreground text-lg">(Data Analytics)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#e34628]"></span>
                <span className="font-semibold text-foreground text-lg">The Problem Solver</span> 
                <span className="text-muted-foreground text-lg">(Systems & Logic)</span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Based on your calculated tech persona, MyUniPath provides custom, data-backed recommendations for UNITEN Computing degrees to accelerate your professional path from day one.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
