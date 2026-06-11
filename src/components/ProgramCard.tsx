import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ProgramInfo } from '../lib/data';

const colorClasses: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  red: 'from-red-500 to-red-600',
  indigo: 'from-indigo-500 to-indigo-600',
  purple: 'from-purple-500 to-purple-600',
};

export function ProgramCard({ program }: { program: ProgramInfo }) {
  const navigate = useNavigate();
  const gradient = colorClasses[program.color] || colorClasses.blue;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-card text-card-foreground border border-border rounded-3xl shadow-lg overflow-hidden hover:shadow-xl hover:border-primary/50 transition-[box-shadow,border-color] group flex flex-col h-full cursor-pointer"
      onClick={() => navigate(`/program/${program.id}`)}
    >
      <div className={`bg-gradient-to-br ${gradient} p-6 text-white text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-4 relative overflow-hidden`}>
        {/* Subtle shimmer on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
        <motion.div
          className="text-5xl filter drop-shadow-md relative z-10"
          whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          {program.icon}
        </motion.div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold filter drop-shadow-sm">{program.name}</h3>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between gap-5">
        <p className="text-muted-foreground font-medium text-center sm:text-left leading-relaxed">{program.shortDesc}</p>

        {/* UNITEN Quick Facts */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="font-medium truncate">{program.intakes}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="font-medium truncate">{program.campus}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="font-medium truncate">{program.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="font-medium truncate">{program.feeMalaysian}</span>
          </div>
        </div>

        <div className="flex gap-2 w-full mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/program/${program.id}`);
            }}
            className="flex-1 bg-secondary text-secondary-foreground font-semibold px-4 py-2.5 rounded-xl hover:bg-secondary/80 border border-border transition-all flex items-center justify-center gap-1.5 text-sm"
          >
            <span>View Details</span>
          </button>
          <a
            href={program.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-white font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-sm shadow-sm hover:shadow-md hover:scale-[1.02] text-center"
            style={{ backgroundColor: '#e34628' }}
          >
            <span>Learn More</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
