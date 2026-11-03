// ============================================================================
// INTER SMJV 2026 — HomeView
// ============================================================================

import React, { useState } from 'react';
import { Icon, SportPictogram, BandhaniDivider } from '../components/common/UIComponents.jsx';
import { FEST, DAYS, HOSTELS, VENUES, SPORTS, MATCHES, PLACES } from '../data/tournamentData.js';

export default function HomeView({ navigateTo, timeLeft, reminders, toggleReminder }) {
  return (
    <div className="space-y-12">
      
      {/* HERO SECTION (Kinetic Paris 2024 Energy + Night Stadium Floodlights) */}
      <section className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-br from-[#0A0F2C] via-[#070B1E] to-[#121A46] p-6 sm:p-10 lg:p-14 shadow-2xl">
        {/* Background Image with Scrim */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-luminosity filter saturate-150"
          style={{ backgroundImage: `url('assets/stock/hero.jpg')` }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#070B1E] via-[#070B1E]/70 to-transparent" />
        
        {/* Subtle Decorative Gujarati Rangoli Geometry Pattern */}
        <div className="absolute right-0 top-0 w-96 h-96 opacity-10 pointer-events-none rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-orange-500 to-transparent blur-2xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-vermilion/40 bg-vermilion/10 text-vermilion text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-vermilion animate-ping" />
              <span>LIVE NOW · DAY 3 OF 5 · VADODARA</span>
            </div>

            {/* Kinetic Typography Title */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.85] text-white">
              <span className="block">INTER</span>
              <span className="block bg-gradient-to-r from-marigold via-amber-300 to-saffron bg-clip-text text-transparent">
                SMJV
              </span>
              <span className="block text-white/40 font-light">2026</span>
            </h1>

            {/* Subtitle with Gujarati Cultural Typography */}
            <div className="space-y-1 max-w-xl">
              <p className="font-gu text-marigold text-lg sm:text-xl font-semibold tracking-wide">
                આંતર હોસ્ટેલ ખેલ મહોત્સવ
              </p>
              <p className="text-sm sm:text-base text-ink-sub leading-relaxed">
                Ten sports. Eight hostels. Five days in Vadodara — cricket under floodlights, kho-kho in the dust, and dandiya once the whistle goes.
              </p>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigateTo('register')}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm tracking-wider uppercase text-black bg-gradient-to-r from-marigold to-saffron hover:from-amber-300 hover:to-orange-500 shadow-xl shadow-amber-500/25 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Register Player Card</span>
                <Icon name="arrow" className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigateTo('schedule')}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm tracking-wider uppercase text-white border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 backdrop-blur-md flex items-center gap-2 transition-all"
              >
                <Icon name="calendar" className="w-4 h-4 text-marigold" />
                <span>Full Timetable</span>
              </button>
            </div>

            {/* Dates & Location */}
            <div className="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase text-ink-muted pt-2">
              <span className="text-white">14–18 Dec 2026</span>
              <span className="text-saffron">•</span>
              <span>SMJV Hostel Campus, Karelibaug</span>
            </div>
          </div>

          {/* Live Countdown Box (Glass Card) */}
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <div className="w-full sm:w-auto p-5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-2xl shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold tracking-widest uppercase text-marigold">
                <span>Final Whistle Countdown</span>
                <span className="text-white/60">18 Dec · 7:00 PM</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.mins, label: 'Mins' },
                  { value: timeLeft.secs, label: 'Secs' },
                ].map((u, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white/5 border-t-2 border-saffron">
                    <span className="font-display text-2xl sm:text-3xl text-white block leading-none">
                      {u.value}
                    </span>
                    <span className="text-[9px] font-bold tracking-widest uppercase text-ink-muted mt-1 block">
                      {u.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MATCH STATUS TICKER (Live Sport Broadcast Feel) */}
      <div className="p-3.5 rounded-2xl border border-white/10 bg-[#0A0F28]/80 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-vermilion/20 text-vermilion border border-vermilion/30 flex items-center gap-1.5 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-vermilion animate-ping" /> Next Up
          </span>
          <p className="text-xs text-white truncate">
            Football Semi-Final · <strong className="text-marigold">Tapi vs Mahi</strong> · 3:00 PM · Main Ground
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-2 md:pt-0">
          <div className="text-xs text-ink-sub">
            <span className="text-ink-muted">Latest Result:</span> Cricket SF1 · <strong>Mahi 156/5</strong> beat Tapi 149/7
          </div>
          <button 
            onClick={() => navigateTo('schedule')} 
            className="text-xs font-bold text-saffron hover:underline flex-shrink-0"
          >
            Live Timetable →
          </button>
        </div>
      </div>

      {/* MARQUEE RUNNER */}
      <div className="rounded-xl overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-black py-2.5 font-display text-base tracking-widest uppercase shadow-md select-none">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="mx-6 flex items-center gap-6">
              <span>10 SPORTS</span>
              <span>◆</span>
              <span>8 HOSTELS</span>
              <span>◆</span>
              <span>5 DAYS</span>
              <span>◆</span>
              <span>1 TROPHY</span>
              <span>◆</span>
              <span>VADODARA 2026</span>
              <span>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 10 SPORTS SHOWCASE GRID                                             */}
      {/* ==================================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-saffron flex items-center gap-2">
              <span className="font-gu text-marigold">રમતો</span>
              <span>•</span>
              <span>The Contested Disciplines</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-white mt-1">
              Ten Ways To Win Your Hostel A Trophy
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted max-w-xl mt-1">
              Every sport features a round-robin group stage advancing into intense knockout semi-finals and finals.
            </p>
          </div>
          <button
            onClick={() => navigateTo('sports')}
            className="text-xs font-bold tracking-wider uppercase text-marigold hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>All Sport Formats</span>
            <span>→</span>
          </button>
        </div>

        {/* 10 Sports Grid (Glassmorphism Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {SPORTS.map((sport, idx) => (
            <div
              key={sport.id}
              onClick={() => navigateTo('sport', { sport: sport.id })}
              className="group p-4 rounded-2xl border border-white/10 hover:border-marigold/50 bg-[#0E1433]/60 hover:bg-[#131B44]/80 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Background Glow on Hover */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-saffron/10 group-hover:bg-saffron/20 blur-xl transition-all pointer-events-none" />

              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-ink-muted tracking-widest font-mono">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="text-saffron group-hover:text-marigold group-hover:scale-110 transition-transform">
                  <SportPictogram id={sport.id} className="w-10 h-10" />
                </div>
              </div>

              <div className="mt-6 space-y-1">
                <h3 className="font-display text-lg tracking-wide uppercase text-white group-hover:text-marigold transition-colors">
                  {sport.name}
                </h3>
                <p className="text-[11px] text-ink-muted font-medium line-clamp-1">
                  {sport.venue}
                </p>
                <div className="flex items-center justify-between pt-2 text-[10px] text-amber-400/80 font-bold tracking-wider uppercase">
                  <span>{sport.format.split('·')[0]}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BandhaniDivider />

      {/* ==================================================================== */}
      {/* TODAY ON DAY 3 PREVIEW & MEAL OF THE HOUR                            */}
      {/* ==================================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Day 3 Matches */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-saffron block">
                <span className="font-gu text-marigold">આજનો કાર્યક્રમ</span> · Day 3 Timetable
              </span>
              <h3 className="font-display text-2xl uppercase tracking-tight text-white mt-0.5">
                On Court & Pitch Today
              </h3>
            </div>
            <button 
              onClick={() => navigateTo('schedule')} 
              className="text-xs font-bold text-marigold hover:underline"
            >
              View All 32 Matches →
            </button>
          </div>

          <div className="space-y-2.5">
            {MATCHES.filter(m => m.day === 'd3').slice(0, 4).map(m => (
              <div 
                key={m.id}
                className={`p-4 rounded-2xl border transition-all ${
                  m.status === 'live' 
                    ? 'border-vermilion/50 bg-vermilion/10 shadow-lg' 
                    : 'border-white/10 bg-[#0E1433]/60 hover:bg-white/5'
                } backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-center font-mono w-14 py-1 rounded-lg bg-black/30 border border-white/10">
                    <span className="text-xs font-bold text-white block">{m.time}</span>
                    <span className="text-[9px] uppercase tracking-wider text-ink-muted">IST</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        {SPORTS.find(s => s.id === m.sport)?.name}
                      </span>
                      <span className="text-white/40">•</span>
                      <span className="text-xs text-ink-muted">{VENUES.find(v => v.id === m.venue)?.name}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      {m.a} <span className="text-saffron font-light px-1">vs</span> {m.b}
                    </h4>
                    {m.score && (
                      <p className="text-xs text-amber-300 font-mono font-medium mt-0.5">Score: {m.score}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {m.status === 'live' ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-vermilion text-white flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" /> Live Now
                    </span>
                  ) : m.status === 'done' ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-ink-muted">
                      Completed
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      Upcoming
                    </span>
                  )}

                  <button
                    onClick={() => toggleReminder(m.id)}
                    className={`p-2 rounded-xl border transition-all ${
                      reminders.includes(m.id)
                        ? 'border-marigold bg-marigold text-black shadow-md'
                        : 'border-white/10 text-ink-muted hover:text-white hover:bg-white/10'
                    }`}
                    title={reminders.includes(m.id) ? "Reminder Active" : "Remind Me"}
                  >
                    <Icon name="bell" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Today at a Glance & Meal Info Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl border border-white/15 bg-[#0E1433]/70 backdrop-blur-xl shadow-xl space-y-5">
            <h3 className="font-display text-xl uppercase tracking-wider text-white">Festival At A Glance</h3>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="font-display text-2xl text-marigold block leading-none">32</span>
                <span className="text-[10px] uppercase tracking-wider text-ink-muted mt-1 block">Matches Total</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="font-display text-2xl text-saffron block leading-none">08</span>
                <span className="text-[10px] uppercase tracking-wider text-ink-muted mt-1 block">Hostel Teams</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="font-display text-2xl text-vermilion block leading-none">02</span>
                <span className="text-[10px] uppercase tracking-wider text-ink-muted mt-1 block">Live Right Now</span>
              </div>
            </div>

            {/* Current Meal Callout */}
            <div className="p-4 rounded-xl border border-amber-400/20 bg-amber-400/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-marigold uppercase tracking-wider">
                <Icon name="food" className="w-4 h-4" />
                <span>Next Mess Hall Meal</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Lunch · 1:00 PM – 2:30 PM</h4>
                <p className="text-xs text-ink-sub mt-0.5">Authentic Gujarati Thali, Undhiyu, Methi Thepla & Chaas</p>
              </div>
              <button
                onClick={() => navigateTo('meals')}
                className="text-[11px] font-bold text-saffron hover:underline flex items-center gap-1 pt-1"
              >
                <span>View 5-Day Menu</span>
                <span>→</span>
              </button>
            </div>

            <p className="text-[11px] text-ink-muted">
              Official venue changes and timings are pushed instantly to the notification center.
            </p>
          </div>
        </div>

      </section>

      {/* ==================================================================== */}
      {/* CULTURAL LAYER: GARBA & DANDIYA AFTER DARK                          */}
      {/* ==================================================================== */}
      <section className="rounded-3xl border border-white/15 bg-gradient-to-r from-[#170E33] via-[#0E1433] to-[#261320] p-6 sm:p-10 shadow-2xl overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-marigold border border-amber-400/30">
              <span className="font-gu">સાંસ્કૃતિક ઉત્સવ</span> · The Cultural Layer
            </div>
            
            <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              Dandiya After Dark: When The Whistle Goes
            </h2>
            
            <p className="text-sm sm:text-base text-ink-sub leading-relaxed">
              Every night after the last cricket ball is bowled and the court lights dim, the Main Ground transforms into a massive Garba circle. Live dhol, rhythmic clapping, dandiya sticks, and a 90-minute live performance by the student hostel band.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigateTo('explore')}
                className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-marigold hover:bg-amber-300 transition-all flex items-center gap-2"
              >
                <span>Explore Vadodara Sights</span>
                <span>→</span>
              </button>
              <span className="text-xs font-semibold text-ink-muted">
                Free entry for all 8 SMJV hostel branches
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
              <img 
                src="assets/stock/garba.jpg" 
                alt="Traditional Garba Dancers in Vadodara" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* REGISTRATION CALL TO ACTION BANNER                                  */}
      {/* ==================================================================== */}
      <section className="rounded-3xl p-8 sm:p-12 text-black bg-gradient-to-r from-marigold via-amber-400 to-saffron shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold tracking-widest uppercase text-amber-900 block">
            Official Entries Close 30 November
          </span>
          <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-tight leading-none text-black">
            Put Your Hostel On The Leaderboard
          </h2>
          <p className="text-sm font-medium text-amber-950 max-w-lg">
            Register once with your student GR number, select your sports, and generate your live digital player card instantly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => navigateTo('register')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-display text-lg tracking-wider uppercase text-white bg-black hover:bg-neutral-900 shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            Register Now
          </button>
          <button
            onClick={() => navigateTo('rulebook')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-xs tracking-wider uppercase text-black border border-black/30 hover:bg-black/10 transition-colors"
          >
            Read Rule Book
          </button>
        </div>
      </section>

    </div>
  );
}
