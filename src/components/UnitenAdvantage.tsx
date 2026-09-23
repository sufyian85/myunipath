/**
 * UnitenAdvantage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Your UNITEN Advantage" section — shown after the character badge on the
 * ResultPage. Maps the student's character to personalised UNITEN proof cards.
 *
 * Accepts `personaId` (ProgramId) and the character `color` for theming.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import {
  UNITEN_ADVANTAGE,
  CATEGORY_META,
  type ProofCard,
} from '../lib/unitenAdvantage';
import type { ProgramId } from '../lib/data';

// ─── Props ────────────────────────────────────────────────────────────────────

interface UnitenAdvantageProps {
  personaId: ProgramId;
  /** Primary hex colour from CHARACTER_DATA — used for accent elements */
  color: string;
  /** Animation delay base (seconds) — lets the parent stagger reveals */
  delayBase?: number;
}

// ─── Proof Card ───────────────────────────────────────────────────────────────

function ProofCardItem({
  card,
  charColor,
  index,
  delayBase,
}: {
  card: ProofCard;
  charColor: string;
  index: number;
  delayBase: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[card.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delayBase + index * 0.07, duration: 0.4 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderColor: card.highlight ? charColor + '50' : 'rgba(255,255,255,0.08)',
      }}
    >
      {/* Header row */}
      <button
        className="w-full text-left p-5 flex items-start gap-4 hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
      >
        {/* Icon */}
        <div
          className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl"
          style={{ background: meta.bg }}
        >
          {card.icon}
        </div>

        {/* Title + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {/* Highlight badge */}
            {card.highlight && (
              <span
                className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: charColor + '25', color: charColor }}
              >
                {card.highlight}
              </span>
            )}
            {/* Category badge */}
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: meta.bg, color: meta.color }}
            >
              {meta.label}
            </span>
          </div>
          <h4 className="text-white font-bold text-sm leading-snug">{card.title}</h4>
        </div>

        {/* Expand toggle */}
        <div className="flex-shrink-0 text-white/30 mt-0.5">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              {/* Why it matters */}
              <div className="pt-3">
                <p className="text-white/70 text-sm leading-relaxed">{card.why}</p>
              </div>

              {/* Where / source row */}
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-0 rounded-xl px-3 py-2.5"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-white/35 text-[10px] font-bold uppercase tracking-wider mb-0.5">Where</p>
                  <p className="text-white/70 text-xs leading-snug">{card.where}</p>
                </div>
                <div className="flex-1 min-w-0 rounded-xl px-3 py-2.5"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-white/35 text-[10px] font-bold uppercase tracking-wider mb-0.5">Source</p>
                  <p className="text-white/70 text-xs leading-snug">{card.source}</p>
                </div>
              </div>

              {/* Last verified */}
              <p className="text-white/25 text-[10px]">
                Last verified: {card.lastVerified} &nbsp;·&nbsp; Availability may vary by cohort
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function UnitenAdvantage({ personaId, color, delayBase = 0 }: UnitenAdvantageProps) {
  const advantage = UNITEN_ADVANTAGE[personaId];
  if (!advantage) return null;

  const [showAll, setShowAll] = useState(false);

  // Show 4 cards by default; "See all" reveals the rest
  const INITIAL_COUNT = 4;
  const visibleCards = showAll ? advantage.proofCards : advantage.proofCards.slice(0, INITIAL_COUNT);
  const hasMore = advantage.proofCards.length > INITIAL_COUNT;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delayBase, duration: 0.5 }}
      className="rounded-3xl overflow-hidden mb-8"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${color}30`,
        boxShadow: `0 0 40px ${color}10`,
      }}
    >
      {/* Section header */}
      <div
        className="px-6 py-5 border-b"
        style={{ borderColor: `${color}20`, background: `${color}08` }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base font-black"
            style={{ background: color + '25', color }}
          >
            🏛️
          </div>
          <span
            className="text-xs font-black uppercase tracking-widest"
            style={{ color }}
          >
            Your UNITEN Advantage
          </span>
        </div>

        {/* Opener + intro */}
        <p className="text-white font-bold text-lg leading-snug mb-1">
          {advantage.opener}
        </p>
        <p className="text-white/55 text-sm leading-relaxed">
          {advantage.intro}
        </p>
      </div>

      {/* Proof cards */}
      <div className="p-5 space-y-3">
        {visibleCards.map((card, i) => (
          <ProofCardItem
            key={card.title}
            card={card}
            charColor={color}
            index={i}
            delayBase={delayBase + 0.1}
          />
        ))}

        {/* Show more / less */}
        {hasMore && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAll(v => !v)}
            className="w-full py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2"
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {showAll ? (
              <><ChevronUp className="w-4 h-4" /> Show fewer</>
            ) : (
              <><ChevronDown className="w-4 h-4" /> See all {advantage.proofCards.length} opportunities</>
            )}
          </motion.button>
        )}
      </div>

      {/* CTA footer */}
      <div
        className="px-5 pb-5 pt-1 flex flex-wrap gap-3"
      >
        <a
          href={advantage.cta.primary.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[180px] flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-white text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{ background: color, boxShadow: `0 6px 24px ${color}40` }}
        >
          {advantage.cta.primary.label}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <a
          href={advantage.cta.secondary.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all hover:border-white/30 hover:text-white"
          style={{
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          {advantage.cta.secondary.label}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Disclaimer */}
      <p className="px-5 pb-4 text-white/20 text-[10px] leading-relaxed">
        Information is based on publicly available CCI programme details and industry certification reviews as of{' '}
        {advantage.proofCards[0]?.lastVerified ?? 'September 2026'}.
        Programme content, certifications, and scholarship availability are subject to change. Confirm details with
        UNITEN CCI before making enrolment decisions.
      </p>
    </motion.section>
  );
}
