// ============================================================================
// INTER SMJV 2026 — MealsView
// ============================================================================

import React, { useState } from 'react';
import { Icon, SportPictogram, BandhaniDivider } from '../components/common/UIComponents.jsx';
import { MEALS, DAYS } from '../data/tournamentData.js';

export default function MealsView() {
  const [selectedDay, setSelectedDay] = useState('d3');
  const dayMeal = MEALS.find(m => m.day === selectedDay) || MEALS[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-saffron block">
            <span className="font-gu text-marigold">ભોજન વ્યવસ્થા</span> · Mess Hall Menu
          </span>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            Five Days of Authentic Gujarati Feasting
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted max-w-xl mt-1">
            Mess timings: Breakfast 7:30–9:00 AM · Lunch 1:00–2:30 PM · Dinner 7:30–9:00 PM. Carry your player card to the counter.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-marigold border border-amber-400/30">
          Jain & Swaminarayan On Request
        </span>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {DAYS.map(d => (
          <button
            key={d.id}
            onClick={() => setSelectedDay(d.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedDay === d.id
                ? 'bg-saffron text-black shadow-lg font-bold'
                : 'border border-white/10 bg-white/5 text-ink-muted hover:text-white'
            }`}
          >
            Day {d.n} · {d.date}
          </button>
        ))}
      </div>

      {/* 3 Meals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Breakfast', time: dayMeal.breakfast.time, data: dayMeal.breakfast },
          { label: 'Lunch (Main Thali)', time: dayMeal.lunch.time, data: dayMeal.lunch },
          { label: 'Dinner & Live Counter', time: dayMeal.dinner.time, data: dayMeal.dinner },
        ].map((meal, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-saffron block">Meal #{idx + 1}</span>
                  <h3 className="font-display text-2xl uppercase tracking-wider text-white mt-0.5">{meal.label}</h3>
                </div>
                <span className="font-mono text-xs font-bold text-marigold px-2.5 py-1 rounded-lg bg-black/30 border border-white/10">
                  {meal.time}
                </span>
              </div>

              {/* Items List */}
              <ul className="space-y-2">
                {meal.data.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-ink-sub">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
              {meal.data.tags.map((t, i) => (
                <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-ink-muted">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Thali Feature Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/15 bg-gradient-to-r from-[#0E1433] to-[#1A1F48] backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 space-y-2">
          <span className="text-xs font-bold tracking-widest uppercase text-marigold block">Hostel Tradition</span>
          <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white">
            Unlimited Thali Service with Evening Live Counters
          </h3>
          <p className="text-xs sm:text-sm text-ink-sub leading-relaxed">
            All players receive fresh hot meals served directly in the hostel dining hall. Special festival desserts include Shrikhand on Day 3 and Basundi on Day 5.
          </p>
        </div>
        <div className="lg:col-span-4 rounded-2xl overflow-hidden border border-white/20 shadow-xl">
          <img src="assets/stock/thali.jpg" alt="Gujarati Thali" className="w-full h-44 object-cover" />
        </div>
      </div>

    </div>
  );
}
