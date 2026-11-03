// ============================================================================
// INTER SMJV 2026 — ScheduleView
// ============================================================================

import React, { useState, useMemo } from 'react';
import { Icon, SportPictogram, BandhaniDivider } from '../components/common/UIComponents.jsx';
import { DAYS, VENUES, SPORTS, MATCHES } from '../data/tournamentData.js';

export default function ScheduleView({ reminders, toggleReminder, navigateTo }) {
  const [sportFilter, setSportFilter] = useState('all');
  const [dayFilter, setDayFilter] = useState('all');
  const [venueFilter, setVenueFilter] = useState('all');
  const [teamSearch, setTeamSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  // Filter logic
  const filteredMatches = useMemo(() => {
    return MATCHES.filter(m => {
      if (sportFilter !== 'all' && m.sport !== sportFilter) return false;
      if (dayFilter !== 'all' && m.day !== dayFilter) return false;
      if (venueFilter !== 'all' && m.venue !== venueFilter) return false;
      if (teamSearch.trim() !== '') {
        const query = teamSearch.toLowerCase();
        const matchHostels = (m.a + ' ' + m.b).toLowerCase();
        if (!matchHostels.includes(query)) return false;
      }
      return true;
    });
  }, [sportFilter, dayFilter, venueFilter, teamSearch]);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-saffron block">
            <span className="font-gu text-marigold">સમયપત્રક</span> · Match Timetable
          </span>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            Five Days, 32 Championship Matches
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted max-w-xl mt-1">
            All times in Indian Standard Time (IST). Filter by sport, day, venue, or hostel team.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="p-1 rounded-xl bg-white/5 border border-white/10 flex items-center self-start sm:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              viewMode === 'list' ? 'bg-saffron text-black shadow-md' : 'text-ink-muted hover:text-white'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              viewMode === 'calendar' ? 'bg-saffron text-black shadow-md' : 'text-ink-muted hover:text-white'
            }`}
          >
            Calendar Grid
          </button>
        </div>
      </div>

      {/* Filter Toolbar (Glass Panel) */}
      <div className="p-4 rounded-2xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Sport Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">Sport</label>
          <select
            value={sportFilter}
            onChange={e => setSportFilter(e.target.value)}
            className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-marigold"
          >
            <option value="all">All 10 Sports</option>
            {SPORTS.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Venue Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">Venue</label>
          <select
            value={venueFilter}
            onChange={e => setVenueFilter(e.target.value)}
            className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-marigold"
          >
            <option value="all">All Ground Venues</option>
            {VENUES.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Team Search */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">Hostel Team Search</label>
          <input
            type="text"
            placeholder="e.g. Narmada, Tapi, Mahi..."
            value={teamSearch}
            onChange={e => setTeamSearch(e.target.value)}
            className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-marigold placeholder:text-white/30"
          />
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setSportFilter('all');
              setDayFilter('all');
              setVenueFilter('all');
              setTeamSearch('');
            }}
            className="w-full py-2 px-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-ink-sub transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => setDayFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
            dayFilter === 'all'
              ? 'bg-marigold text-black shadow-md'
              : 'border border-white/10 bg-white/5 text-ink-muted hover:text-white'
          }`}
        >
          All 5 Days
        </button>
        {DAYS.map(d => (
          <button
            key={d.id}
            onClick={() => setDayFilter(d.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              dayFilter === d.id
                ? 'bg-marigold text-black shadow-md'
                : 'border border-white/10 bg-white/5 text-ink-muted hover:text-white'
            }`}
          >
            Day {d.n} · {d.date}
          </button>
        ))}
      </div>

      {/* Results Count & Badges Legend */}
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span>Showing <strong>{filteredMatches.length}</strong> matches</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-vermilion" /> Live</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-400" /> Upcoming</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-500" /> Done</span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* LIST VIEW                                                           */}
      {/* ==================================================================== */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredMatches.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-white/15 bg-white/5 space-y-3">
              <Icon name="search" className="w-8 h-8 text-saffron mx-auto" />
              <h3 className="font-display text-xl text-white uppercase">No Matches Found</h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                No fixtures matched your selected filters. Try choosing a different sport or clearing the team search.
              </p>
            </div>
          ) : (
            filteredMatches.map(m => {
              const sportObj = SPORTS.find(s => s.id === m.sport);
              const venueObj = VENUES.find(v => v.id === m.venue);
              const isReminded = reminders.includes(m.id);

              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    m.status === 'live'
                      ? 'border-vermilion/50 bg-vermilion/10 shadow-lg'
                      : 'border-white/10 bg-[#0E1433]/70 hover:bg-[#131B44]/80'
                  } backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-4">
                    {/* Time & Day Column */}
                    <div className="w-16 p-2 rounded-xl bg-black/40 border border-white/10 text-center flex-shrink-0">
                      <span className="font-mono text-sm font-bold text-white block leading-none">{m.time}</span>
                      <span className="text-[10px] uppercase font-bold text-ink-muted mt-1 block">
                        {DAYS.find(d => d.id === m.day)?.short}
                      </span>
                    </div>

                    {/* Match Details */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-marigold uppercase tracking-wider">
                          {sportObj?.name}
                        </span>
                        <span className="text-white/30">•</span>
                        <span className="text-xs text-ink-muted">{venueObj?.name}</span>
                        <span className="text-white/30">•</span>
                        <span className="text-[10px] font-bold text-indigo-300 uppercase px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-400/20">
                          {m.stage}
                        </span>
                      </div>

                      <h3 className="font-display text-lg sm:text-xl text-white tracking-wide uppercase mt-1">
                        {m.a} <span className="text-saffron font-light text-sm px-1">vs</span> {m.b}
                      </h3>

                      {m.score && (
                        <p className="text-xs font-mono font-bold text-amber-300 mt-0.5">
                          Result: {m.score} {m.note && <span className="text-ink-muted font-sans font-normal">({m.note})</span>}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3 self-end md:self-auto">
                    {m.status === 'live' ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-vermilion text-white flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" /> Live In Progress
                      </span>
                    ) : m.status === 'done' ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-ink-muted">
                        Final Score
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                        Scheduled
                      </span>
                    )}

                    <button
                      onClick={() => toggleReminder(m.id)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isReminded
                          ? 'border-marigold bg-marigold text-black shadow-md'
                          : 'border-white/10 text-ink-muted hover:text-white hover:bg-white/10'
                      }`}
                      title={isReminded ? "Alert active 15m prior" : "Remind me before match"}
                    >
                      <Icon name="bell" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* CALENDAR GRID VIEW                                                   */}
      {/* ==================================================================== */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DAYS.map(day => {
            const dayMatches = filteredMatches.filter(m => m.day === day.id);
            return (
              <div 
                key={day.id}
                className="p-4 rounded-2xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl space-y-3"
              >
                <div className="border-b border-white/10 pb-2 flex items-baseline justify-between">
                  <h3 className="font-display text-lg uppercase text-white">{day.short}</h3>
                  <span className="text-xs text-marigold font-bold">{day.date}</span>
                </div>

                <div className="space-y-2">
                  {dayMatches.length === 0 ? (
                    <p className="text-xs text-ink-muted italic py-4 text-center">No fixtures scheduled</p>
                  ) : (
                    dayMatches.map(m => (
                      <div
                        key={m.id}
                        className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                          m.status === 'live' ? 'border-vermilion/50 bg-vermilion/10' : 'border-white/5 bg-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px] text-ink-muted font-mono font-bold">
                          <span>{m.time} IST</span>
                          <span className="text-amber-300 uppercase">{m.sport}</span>
                        </div>
                        <p className="font-bold text-white text-[11px] leading-tight truncate">
                          {m.a} vs {m.b}
                        </p>
                        <span className="text-[10px] text-ink-muted block truncate">{m.stage}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
