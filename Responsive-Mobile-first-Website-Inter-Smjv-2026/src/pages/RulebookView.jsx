// ============================================================================
// INTER SMJV 2026 — RulebookView
// ============================================================================

import React, { useState, useMemo } from 'react';
import { Icon, SportPictogram, BandhaniDivider } from '../components/common/UIComponents.jsx';
import { RULES, SPORTS, SPORT_RULES } from '../data/tournamentData.js';

export default function RulebookView() {
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  // Tab labels
  const tabs = [
    { id: 'general', label: 'General Regulations' },
    { id: 'conduct', label: 'Code of Conduct' },
    ...SPORTS.map(s => ({ id: s.id, label: s.name }))
  ];

  // Filtering rules by search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const results = [];

    // Search in general and conduct
    RULES.forEach(r => {
      r.sections.forEach(sec => {
        sec.items.forEach(item => {
          if (item.toLowerCase().includes(q) || sec.title.toLowerCase().includes(q)) {
            results.push({ category: r.name, title: sec.title, rule: item });
          }
        });
      });
    });

    // Search in sports rules
    Object.keys(SPORT_RULES).forEach(sportKey => {
      const sportName = SPORTS.find(s => s.id === sportKey)?.name || sportKey;
      SPORT_RULES[sportKey].forEach(rule => {
        if (rule.toLowerCase().includes(q)) {
          results.push({ category: sportName, title: 'Playing Conditions', rule });
        }
      });
    });

    return results;
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-saffron block">
            <span className="font-gu text-marigold">નિયમાવલી</span> · Official Regulations
          </span>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            Tournament Rule Book
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted max-w-xl mt-1">
            Rules governing player eligibility, equipment standards, conduct, and specific conditions for all ten sports.
          </p>
        </div>

        {/* Print / Save as PDF Button */}
        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Icon name="printer" className="w-4 h-4 text-marigold" />
          <span>Save / Print PDF</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Icon name="search" className="absolute left-4 top-3.5 w-4 h-4 text-ink-muted" />
        <input
          type="text"
          placeholder="Search rule book (e.g. 'super over', 'substitutions', 'walkover', 'kitchen')..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-[#0E1433]/80 border border-white/15 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-marigold backdrop-blur-xl"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-3 text-xs text-ink-muted hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* SEARCH RESULTS VIEW */}
      {searchResults ? (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-marigold">
            Found {searchResults.length} matching rules for "{searchQuery}"
          </h3>
          {searchResults.length === 0 ? (
            <p className="text-xs text-ink-muted py-6">No matching rules found. Try another term.</p>
          ) : (
            searchResults.map((res, i) => (
              <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
                <span className="text-[10px] font-bold uppercase text-saffron block">
                  {res.category} · {res.title}
                </span>
                <p className="text-xs text-white leading-relaxed">{res.rule}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        /* TABBED CATEGORY VIEW */
        <div className="space-y-6">
          {/* Tabs Rail */}
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-white/10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-saffron text-black shadow-md'
                    : 'text-ink-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl shadow-xl space-y-6">
            
            {/* General Rules Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl uppercase tracking-wider text-white">General Championship Rules</h2>
                {RULES[0].sections.map((sec, i) => (
                  <div key={i} className="space-y-2 border-b border-white/10 pb-4 last:border-b-0">
                    <h3 className="font-bold text-sm text-marigold uppercase tracking-wider">{sec.title}</h3>
                    <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-ink-sub">
                      {sec.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Code of Conduct Tab */}
            {activeTab === 'conduct' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl uppercase tracking-wider text-white">Student Code of Conduct & Fair Play</h2>
                {RULES[1].sections.map((sec, i) => (
                  <div key={i} className="space-y-2 border-b border-white/10 pb-4 last:border-b-0">
                    <h3 className="font-bold text-sm text-marigold uppercase tracking-wider">{sec.title}</h3>
                    <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-ink-sub">
                      {sec.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Individual Sport Rules Tabs */}
            {activeTab !== 'general' && activeTab !== 'conduct' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                      {SPORTS.find(s => s.id === activeTab)?.name} Regulations
                    </h2>
                    <p className="text-xs text-amber-300 font-bold uppercase mt-0.5">
                      {SPORTS.find(s => s.id === activeTab)?.format}
                    </p>
                  </div>
                  <SportPictogram id={activeTab} className="w-12 h-12 text-marigold" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">Official Playing Rules</h3>
                  <ol className="space-y-3">
                    {(SPORT_RULES[activeTab] || []).map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-ink-sub">
                        <span className="w-5 h-5 rounded-md bg-saffron/20 text-saffron flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
