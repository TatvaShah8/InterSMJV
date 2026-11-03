// ============================================================================
// INTER SMJV 2026 — StyleGuideView
// ============================================================================

import React from 'react';
import { Icon, SportPictogram, BandhaniDivider } from '../components/common/UIComponents.jsx';
import { SPORTS, FEST } from '../data/tournamentData.js';

export default function StyleGuideView() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold tracking-widest uppercase text-saffron block">Design System</span>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
          INTER SMJV 2026 Style Guide
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted max-w-xl mt-1">
          Color palette tokens, typography scales, Olympic pictograms, and glassmorphism component specifications.
        </p>
      </div>

      {/* Swatches */}
      <div className="space-y-3">
        <h3 className="font-display text-xl uppercase tracking-wide text-white">Color Tokens</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { name: 'Midnight', hex: '#070B1E', role: 'Base Background' },
            { name: 'Surface', hex: '#0E1433', role: 'Glass Card Layer' },
            { name: 'Saffron', hex: '#FF7A1A', role: 'Primary Action' },
            { name: 'Marigold', hex: '#FFC53D', role: 'Festive Accent' },
            { name: 'Vermilion', hex: '#FF5A4E', role: 'Live Status' },
            { name: 'Paper Ink', hex: '#F7F4EE', role: 'Main Text' },
          ].map((c, i) => (
            <div key={i} className="rounded-2xl border border-white/10 overflow-hidden bg-white/5">
              <div className="h-16" style={{ backgroundColor: c.hex }} />
              <div className="p-3 text-xs space-y-0.5">
                <strong className="text-white block">{c.name}</strong>
                <span className="text-[10px] text-ink-muted font-mono block">{c.hex}</span>
                <span className="text-[9px] text-amber-300 block">{c.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Preview */}
      <div className="p-6 rounded-3xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl space-y-4">
        <h3 className="font-display text-xl uppercase tracking-wide text-white">Typography Hierarchy</h3>
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Display · Anton (Condensed)</span>
            <p className="font-display text-4xl sm:text-5xl uppercase text-white mt-0.5">INTER SMJV 2026</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Gujarati Calligraphy Accent · Noto Sans Gujarati</span>
            <p className="font-gu text-2xl text-marigold font-semibold mt-0.5">આંતર હોસ્ટેલ ખેલ મહોત્સવ, વડોદરા</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Body & Interface · Archivo</span>
            <p className="text-sm text-ink-sub max-w-xl mt-0.5">
              Clean, neutral, highly legible sans-serif optimized for phone displays, dense timetable scores, and rule documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
