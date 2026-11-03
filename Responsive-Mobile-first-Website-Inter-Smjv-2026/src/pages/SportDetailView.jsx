// ============================================================================
// INTER SMJV 2026 — SportDetailView
// ============================================================================

import React, { useState } from 'react';
import { Icon, SportPictogram, BandhaniDivider } from '../components/common/UIComponents.jsx';
import { SPORTS, SPORT_RULES, MATCHES, DAYS, VENUES } from '../data/tournamentData.js';

export default function SportDetailView({ sportId, navigateTo, reminders, toggleReminder }) {
  const sport = SPORTS.find(s => s.id === sportId) || SPORTS[0];
  const sportMatches = MATCHES.filter(m => m.sport === sport.id);
  const rulesList = SPORT_RULES[sport.id] || [];

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigateTo('sports')}
        className="text-xs font-bold text-ink-muted hover:text-white uppercase tracking-wider flex items-center gap-1.5"
      >
        <span>← Back to All Sports</span>
      </button>

      {/* Sport Hero Showcase */}
      <div className="p-8 sm:p-12 rounded-3xl border border-white/15 bg-gradient-to-br from-[#0A0F2C] via-[#0E1433] to-[#151D4A] shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-marigold/20 text-marigold border border-amber-400/30">
              Tournament Playing Conditions
            </span>
            <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-white leading-none">
              {sport.name}
            </h1>
            <p className="text-sm sm:text-base text-amber-300 font-semibold">{sport.format}</p>
            <p className="text-xs sm:text-sm text-ink-sub max-w-xl leading-relaxed">{sport.desc}</p>
            
            <div className="flex flex-wrap gap-4 pt-2 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white">
                <span className="text-ink-muted block text-[10px] uppercase">Venue Ground</span>
                <strong>{sport.venue}</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white">
                <span className="text-ink-muted block text-[10px] uppercase">Squad Size</span>
                <strong>{sport.players} Players</strong>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="w-36 h-36 rounded-3xl bg-white/5 border border-white/20 p-6 flex items-center justify-center text-marigold shadow-2xl">
              <SportPictogram id={sport.id} className="w-24 h-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Matches for this sport */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl uppercase tracking-wide text-white">
          {sport.name} Fixtures & Results
        </h2>
        
        {sportMatches.length === 0 ? (
          <p className="text-xs text-ink-muted">No fixtures currently posted for this sport.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sportMatches.map(m => (
              <div 
                key={m.id}
                className="p-4 rounded-2xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-300 font-mono">
                    {DAYS.find(d => d.id === m.day)?.short} · {m.time} IST · {m.stage}
                  </span>
                  <h4 className="font-display text-lg text-white mt-0.5">{m.a} vs {m.b}</h4>
                  {m.score && <p className="text-xs font-mono text-marigold mt-0.5">Result: {m.score}</p>}
                </div>
                <button
                  onClick={() => toggleReminder(m.id)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    reminders.includes(m.id)
                      ? 'border-marigold bg-marigold text-black'
                      : 'border-white/10 text-ink-muted hover:text-white'
                  }`}
                >
                  <Icon name="bell" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Specific Playing Rules */}
      <div className="p-6 rounded-3xl border border-white/10 bg-[#0E1433]/60 backdrop-blur-xl space-y-4">
        <h3 className="font-display text-xl uppercase tracking-wider text-white">
          Official Playing Conditions & Rules
        </h3>
        <ul className="space-y-2.5">
          {rulesList.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-ink-sub">
              <span className="w-5 h-5 rounded-md bg-saffron/20 text-saffron flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
