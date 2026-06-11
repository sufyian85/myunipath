import { motion, AnimatePresence } from 'framer-motion';
import { LEVELS } from '../../context/GamificationContext';

type LevelInfo = typeof LEVELS[number];

interface Props {
  show: boolean;
  newLevel: LevelInfo;
  xpEarned: number;
  onClose: () => void;
}

export function LevelUpModal({ show, newLevel, xpEarned, onClose }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            onClick={e => e.stopPropagation()}
            className="relative max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl text-center"
            style={{ background: 'linear-gradient(135deg, #0F3361 0%, #e34628 100%)' }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }}
            />

            <div className="relative z-10 p-10">
              {/* Star burst */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="text-6xl mb-4 inline-block"
              >
                ✨
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-sm font-bold uppercase tracking-widest mb-2"
              >
                Level Up!
              </motion.div>

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                className="text-7xl mb-4"
              >
                {newLevel.emoji}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-extrabold text-white mb-1 tracking-tight"
              >
                {newLevel.name}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/70 text-sm mb-8"
              >
                Level {newLevel.level} unlocked · +{xpEarned} XP earned
              </motion.p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="px-8 py-3 bg-white text-gray-900 font-bold rounded-xl shadow-lg"
              >
                Awesome! 🎉
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
