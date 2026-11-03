// ============================================================================
// INTER SMJV 2026 — VenuesView
// ============================================================================

import React, { useState } from 'react';
import { Icon, SportPictogram, BandhaniDivider } from '../components/common/UIComponents.jsx';
import { VENUES, ROOMS, SPORTS, FEST } from '../data/tournamentData.js';

export default function VenuesView() {
  const [grSearch, setGrSearch] = useState('');
  const [roomResult, setRoomResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleLookup = (e) => {
    e.preventDefault();
    setHasSearched(true);
    const key = grSearch.trim().toUpperCase();
    if (ROOMS[key]) {
      setRoomResult(ROOMS[key]);
    } else {
      setRoomResult(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold tracking-widest uppercase text-saffron block">
          <span className="font-gu text-marigold">સ્થળ અને રહેવાની વ્યવસ્થા</span> · Ground & Hostel
        </span>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
          Find Your Pitch, Find Your Bed
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted max-w-xl mt-1">
          Everything is located inside the SMJV Hostel Campus at Karelibaug, Vadodara.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Campus Map Schematic */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-8 rounded-3xl border border-white/15 bg-gradient-to-br from-[#0E1433] to-[#0A0F28] backdrop-blur-xl relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-marigold uppercase tracking-wider">
                <Icon name="pin" className="w-4 h-4 text-vermilion" />
                <span>Campus Ground Schematic</span>
              </div>
              <a 
                href="https://maps.google.com/?q=SMJV+Hostel+Vadodara" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-saffron hover:underline"
              >
                Open in Google Maps →
              </a>
            </div>

            {/* Schematic Visual Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {VENUES.map(v => (
                <div key={v.id} className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-saffron/20 text-saffron flex items-center justify-center">
                      <Icon name={v.icon || 'flag'} className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="font-bold text-xs text-white">{v.name}</h4>
                  </div>
                  <p className="text-[11px] text-ink-muted leading-tight">{v.detail}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-ink-muted">
              <span>Main Campus: <strong>SMJV Hostel Branch, Karelibaug, Vadodara 390018</strong></span>
            </div>
          </div>

          {/* Stay Info Card */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl space-y-4">
            <h3 className="font-display text-xl uppercase tracking-wider text-white">Campus Hostel Accommodation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-ink-sub">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <strong className="text-white block mb-0.5">Check-in Desk</strong>
                <span>Block A Lobby · from 12 Dec, 9:00 AM</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <strong className="text-white block mb-0.5">Twin Sharing</strong>
                <span>Blocks A to D · Bedding provided</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <strong className="text-white block mb-0.5">Quiet Hours</strong>
                <span>11:00 PM to 6:00 AM daily</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Room Lookup Tool */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl border border-white/15 bg-[#0E1433]/80 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-marigold uppercase tracking-wider">
              <Icon name="bed" className="w-4 h-4 text-marigold" />
              <span>Room & Bed Assignment Lookup</span>
            </div>
            
            <p className="text-xs text-ink-muted leading-relaxed">
              Enter your student GR number (e.g. <code>SMJV26-0142</code>) to view assigned hostel block, room number, and bed slot.
            </p>

            <form onSubmit={handleLookup} className="space-y-3">
              <input
                type="text"
                placeholder="Enter GR No. (e.g. SMJV26-0142)"
                value={grSearch}
                onChange={e => setGrSearch(e.target.value)}
                className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-marigold"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-marigold to-saffron hover:from-amber-300 hover:to-orange-500 shadow-lg transition-transform active:scale-95"
              >
                Lookup My Room
              </button>
            </form>

            {hasSearched && (
              <div className="pt-2">
                {roomResult ? (
                  <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-2 animate-in fade-in">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                      Confirmed Assignment
                    </span>
                    <h4 className="font-display text-2xl text-white">
                      {roomResult.block} · Room {roomResult.room}
                    </h4>
                    <p className="text-xs text-ink-sub font-medium">
                      {roomResult.bed} · Hostel Team: <strong>{roomResult.hostel}</strong>
                    </p>
                    <p className="text-[11px] text-ink-muted">Registered to: {roomResult.name}</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border border-vermilion/30 bg-vermilion/10 text-xs text-ink-sub">
                    <p className="font-bold text-white">No room assignment found for this GR number.</p>
                    <p className="text-ink-muted mt-1">Please check with the hospitality desk in Block A lobby upon arrival.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
