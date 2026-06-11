import { motion } from 'framer-motion';
import { xpToNextLevel } from '../../context/GamificationContext';

interface XPBarProps {
  xp: number;
  compact?: boolean;
}

export function XPBar({ xp, compact = false }: XPBarProps) {
  const { current, next, progress } = xpToNextLevel(xp);

  return (
    <div className={compact ? 'flex items-center gap-3' : 'w-full'}>
      {/* Level badge */}
      <div
        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-sm"
        style={{ background: current.color }}
      >
        <span>{current.emoji}</span>
        {!compact && <span>Lv.{current.level}</span>}
        <span>{current.name}</span>
      </div>

      {!compact && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground font-medium mb-1.5">
            <span>{xp} XP</span>
            {next ? <span>{next.minXp} XP · {next.name}</span> : <span>Max Level!</span>}
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${current.color}, ${next?.color ?? current.color})` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="text-right text-xs text-muted-foreground mt-1">
            {progress}% to {next ? next.name : 'Max'}
          </div>
        </div>
      )}

      {compact && (
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: current.color }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{xp} XP</span>
        </div>
      )}
    </div>
  );
}
