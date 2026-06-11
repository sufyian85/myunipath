import { AnimatePresence, motion } from 'framer-motion';

interface ComboDisplayProps {
  timeLeft: number;     // seconds remaining (e.g. 15)
  totalTime: number;    // max time per question
  streak: number;       // consecutive quick answers
  multiplier: number;   // current question multiplier
}

export function ComboDisplay({ timeLeft, totalTime, streak, multiplier }: ComboDisplayProps) {
  const pct = (timeLeft / totalTime) * 100;
  const isHot = timeLeft <= 8;
  const isWarm = timeLeft <= 15 && timeLeft > 8;

  const barColor = isHot
    ? 'linear-gradient(90deg, #f59e0b, #e34628)'
    : isWarm
    ? 'linear-gradient(90deg, #8b5cf6, #3b82f6)'
    : 'linear-gradient(90deg, #0F3361, #3b82f6)';

  return (
    <div className="flex items-center gap-3">
      {/* Timer bar */}
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: barColor }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
      </div>

      {/* Multiplier badge */}
      <AnimatePresence mode="wait">
        {multiplier > 1 && (
          <motion.div
            key={multiplier}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-lg"
            style={{
              background: isHot
                ? 'linear-gradient(135deg, #f59e0b, #e34628)'
                : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            }}
          >
            {multiplier}x
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streak badge */}
      <AnimatePresence>
        {streak >= 2 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-600 dark:text-amber-400"
          >
            🔥 {streak}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
