import { AnimatePresence, motion } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';

export function XPPopup() {
  const { xpEvents } = useGamification();

  return (
    <div className="fixed top-20 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {xpEvents.map(event => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10, scale: 0.7 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full shadow-xl border border-white/10 backdrop-blur-sm font-bold text-white text-sm"
            style={{
              background: event.multiplier >= 2
                ? 'linear-gradient(135deg, #f59e0b, #e34628)'
                : event.multiplier >= 1.5
                ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
                : 'linear-gradient(135deg, #0F3361, #1a5ea8)',
            }}
          >
            <span>⚡</span>
            <span>+{event.amount} XP</span>
            {event.multiplier > 1 && (
              <span className="text-xs opacity-90 font-medium">
                {event.multiplier}x
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
