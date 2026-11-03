// ============================================================================
// INTER SMJV 2026 — ExploreView
// ============================================================================

import React, { useState } from 'react';
import { Icon, SportPictogram, BandhaniDivider } from '../components/common/UIComponents.jsx';
import { PLACES } from '../data/tournamentData.js';

export default function ExploreView() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold tracking-widest uppercase text-saffron block">
          <span className="font-gu text-marigold">વડોદરા દર્શન</span> · City Guide
        </span>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
          Explore The Cultural Capital of Gujarat
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted max-w-xl mt-1">
          Rest day or evening leisure? Explore iconic palaces, gardens, and temples within quick reach from the Karelibaug hostel gate.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLACES.map(place => (
          <div
            key={place.id}
            className="rounded-3xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col justify-between group hover:border-marigold/40 transition-all"
          >
            <div>
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={place.img} 
                  alt={place.alt} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-marigold backdrop-blur-md border border-white/10">
                  {place.dist} from hostel
                </span>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-saffron text-black font-mono">
                  {place.cat}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-display text-xl uppercase tracking-wide text-white group-hover:text-marigold transition-colors">
                  {place.name}
                </h3>
                <p className="text-xs text-ink-sub leading-relaxed">
                  {place.text}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(place.name + ' Vadodara')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-white text-center block transition-colors"
              >
                Get Directions →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
