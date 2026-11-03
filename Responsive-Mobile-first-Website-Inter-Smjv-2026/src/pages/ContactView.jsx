// ============================================================================
// INTER SMJV 2026 — ContactView
// ============================================================================

import React, { useState } from 'react';
import { Icon, SportPictogram, BandhaniDivider } from '../components/common/UIComponents.jsx';
import { FAQ, CONTACTS, PARTNERS } from '../data/tournamentData.js';

export default function ContactView({ addToast }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold tracking-widest uppercase text-saffron block">
          <span className="font-gu text-marigold">સંપર્ક</span> · Help & Organizers
        </span>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
          Who To Call, What To Ask
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted max-w-xl mt-1">
          The 24-hour tournament control room is situated at the Main Ground pavilion, staffed throughout the fest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Organizing Committee Directory */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="font-display text-2xl uppercase tracking-wider text-white">
            Organizing Committee Directory
          </h2>

          <div className="space-y-3">
            {CONTACTS.map((c, i) => (
              <div key={i} className="p-4 rounded-2xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-saffron block">{c.role}</span>
                  <h4 className="font-bold text-sm text-white">{c.name}</h4>
                  <span className="text-xs text-ink-muted block">{c.email}</span>
                </div>
                <a
                  href={`tel:${c.phone}`}
                  className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono font-bold text-marigold"
                >
                  {c.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: FAQ Accordion */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="font-display text-2xl uppercase tracking-wider text-white">
            Frequently Asked Questions
          </h2>

          <div className="space-y-2.5">
            {FAQ.map((item, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-3 hover:text-marigold transition-colors"
                >
                  <span>{item.q}</span>
                  <span className="text-saffron font-display text-lg">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-ink-sub leading-relaxed border-t border-white/5 pt-2">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
