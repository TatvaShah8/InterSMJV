// ============================================================================
// INTER SMJV 2026 — DashboardView
// ============================================================================

import React from 'react';
import { Icon, SportPictogram, BandhaniDivider } from '../components/common/UIComponents.jsx';
import { MATCHES, DAYS, VENUES, DEMO_PLAYER } from '../data/tournamentData.js';

export default function DashboardView({ player, navigateTo, reminders, toggleReminder, onOpenIdCard }) {
  const sportsList = Array.isArray(player.sports) ? player.sports : [];
  const myMatches = MATCHES.filter(m => sportsList.some(s => s.toLowerCase() === m.sport));

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/15 bg-gradient-to-r from-[#0E1433] via-[#141B44] to-[#0A0F28] backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-saffron block">
            <span className="font-gu text-marigold">તમારું ડેશબોર્ડ</span> · Student Portal
          </span>
          <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-white mt-1">
            Welcome Back, {player.name ? player.name.split(' ')[0] : 'Participant'}
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Day 3 of 5 · Representing <strong>{player.branch || player.hostel || 'Vadodara'} Branch</strong> · GR: {player.grNo || player.gr || 'SMJV26-0142'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onOpenIdCard}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-marigold to-saffron text-black text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>🪪 View ID Card & QR</span>
          </button>
          <button
            onClick={() => navigateTo('register')}
            className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-white"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: My Matches & Today */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl uppercase tracking-wide text-white">
                My Scheduled Fixtures
              </h2>
              <button onClick={() => navigateTo('schedule')} className="text-xs font-bold text-marigold hover:underline">
                All Matches →
              </button>
            </div>

            {myMatches.length === 0 ? (
              <p className="text-xs text-ink-muted py-6">No matches scheduled for your selected sports.</p>
            ) : (
              <div className="space-y-3">
                {myMatches.map(m => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-amber-300 font-mono">
                        {DAYS.find(d => d.id === m.day)?.short} · {m.time} IST · {m.stage}
                      </span>
                      <h4 className="font-display text-lg text-white mt-0.5">{m.a} vs {m.b}</h4>
                      <p className="text-xs text-ink-muted mt-0.5">Venue: {VENUES.find(v => v.id === m.venue)?.name}</p>
                    </div>

                    <button
                      onClick={() => toggleReminder(m.id)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        reminders.includes(m.id) ? 'bg-marigold text-black border-marigold' : 'border-white/10 text-ink-muted'
                      }`}
                    >
                      <Icon name="bell" className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Shortcuts & Bed */}
        <div className="lg:col-span-4 space-y-6">
          {/* Hostel Room Card */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-marigold block">My Room Details</span>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-xs font-bold text-white block">Block B · Room B-214</span>
              <span className="text-xs text-ink-muted block">Bed #2 · Twin Sharing</span>
            </div>
            <button
              onClick={() => navigateTo('venues')}
              className="text-xs font-bold text-saffron hover:underline block pt-1"
            >
              Ground Map & Helpline →
            </button>
          </div>

          {/* Quick Nav Links */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl space-y-2">
            <span className="text-xs font-bold tracking-widest uppercase text-ink-muted block mb-2">Shortcuts</span>
            {[
              { id: 'meals', label: 'Today\'s Mess Hall Thali Menu' },
              { id: 'rulebook', label: 'Check Tournament Rules' },
              { id: 'notifications', label: 'View Latest Push Bulletins' },
              { id: 'explore', label: 'Sightseeing & Transport' },
            ].map(link => (
              <button
                key={link.id}
                onClick={() => navigateTo(link.id)}
                className="w-full text-left py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex justify-between items-center"
              >
                <span>{link.label}</span>
                <span>→</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
