// ============================================================================
// INTER SMJV 2026 — SportsView
// ============================================================================

import React from 'react';
import { Icon, SportPictogram, BandhaniDivider } from '../components/common/UIComponents.jsx';
import { SPORTS, MATCHES, DAYS, VENUES } from '../data/tournamentData.js';

export default function SportsView({ navigateTo }) {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold tracking-widest uppercase text-saffron block">
          <span className="font-gu text-marigold">રમતો</span> · Tournament Disciplines
        </span>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
          Ten Sports, One Championship Cup
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted max-w-xl mt-1">
          Each sport maintains dedicated tournament format, venue assignments, and playing regulations. Select any discipline to inspect fixtures and rules.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SPORTS.map((sport, idx) => (
          <div
            key={sport.id}
            onClick={() => navigateTo('sport', { sport: sport.id })}
            className="group p-6 rounded-3xl border border-white/10 hover:border-marigold/50 bg-[#0E1433]/70 hover:bg-[#131B44]/90 backdrop-blur-xl shadow-xl hover:-translate-y-1.5 transition-all cursor-pointer relative overflow-hidden space-y-4"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs font-bold text-saffron px-2.5 py-1 rounded-lg bg-saffron/10 border border-saffron/20">
                DISCIPLINE #{String(idx + 1).padStart(2, '0')}
              </span>
              <div className="text-marigold group-hover:scale-110 transition-transform">
                <SportPictogram id={sport.id} className="w-12 h-12" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="font-display text-2xl uppercase tracking-wide text-white group-hover:text-marigold transition-colors">
                {sport.name}
              </h2>
              <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                {sport.format}
              </p>
              <p className="text-xs text-ink-sub leading-relaxed">
                {sport.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-ink-muted">
              <span>Venue: <strong className="text-white">{sport.venue}</strong></span>
              <span className="font-bold text-saffron group-hover:translate-x-1 transition-transform">View Details →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
