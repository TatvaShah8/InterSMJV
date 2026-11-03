// ============================================================================
// Robust Date of Birth Picker with Dual Mode:
// 1. Day / Month / Year Dropdown Selectors (Fastest on mobile & desktop)
// 2. Interactive Calendar Picker with explicit Open Calendar button
// 3. Direct Keyboard Typing (DD/MM/YYYY)
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';

const MONTHS = [
  { value: '01', name: 'January (01)' },
  { value: '02', name: 'February (02)' },
  { value: '03', name: 'March (03)' },
  { value: '04', name: 'April (04)' },
  { value: '05', name: 'May (05)' },
  { value: '06', name: 'June (06)' },
  { value: '07', name: 'July (07)' },
  { value: '08', name: 'August (08)' },
  { value: '09', name: 'September (09)' },
  { value: '10', name: 'October (10)' },
  { value: '11', name: 'November (11)' },
  { value: '12', name: 'December (12)' },
];

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

// Years from 2012 down to 1980
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 33 }, (_, i) => String(CURRENT_YEAR - 14 - i));

export default function DateOfBirthPicker({ value, onChange, calculatedAge }) {
  // Mode: 'dropdown' | 'calendar' | 'text'
  const [mode, setMode] = useState('dropdown');
  const calendarInputRef = useRef(null);

  // Parse YYYY-MM-DD
  const parts = value ? value.split('-') : ['', '', ''];
  const selYear = parts[0] || '';
  const selMonth = parts[1] || '';
  const selDay = parts[2] || '';

  // Manual text input state
  const [textInput, setTextInput] = useState(() => {
    if (value && parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return '';
  });

  // Sync text input if value changes externally
  useEffect(() => {
    if (value && value.includes('-')) {
      const [y, m, d] = value.split('-');
      setTextInput(`${d}/${m}/${y}`);
    }
  }, [value]);

  // Handle Dropdown Updates
  const updateFromDropdown = (type, val) => {
    let y = selYear || '2004';
    let m = selMonth || '01';
    let d = selDay || '01';

    if (type === 'year') y = val;
    if (type === 'month') m = val;
    if (type === 'day') d = val;

    // Adjust for months with fewer days (e.g. Feb)
    const maxDaysInMonth = new Date(parseInt(y, 10), parseInt(m, 10), 0).getDate();
    if (parseInt(d, 10) > maxDaysInMonth) {
      d = String(maxDaysInMonth).padStart(2, '0');
    }

    const isoDate = `${y}-${m}-${d}`;
    onChange(isoDate);
  };

  // Handle Manual Text Typing (DD/MM/YYYY or DD-MM-YYYY)
  const handleTextChange = (e) => {
    const raw = e.target.value;
    setTextInput(raw);

    const match = raw.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
    if (match) {
      const d = match[1].padStart(2, '0');
      const m = match[2].padStart(2, '0');
      const y = match[3];

      const numD = parseInt(d, 10);
      const numM = parseInt(m, 10);
      const numY = parseInt(y, 10);

      if (numM >= 1 && numM <= 12 && numD >= 1 && numD <= 31 && numY >= 1960 && numY <= CURRENT_YEAR) {
        const iso = `${y}-${m}-${d}`;
        onChange(iso);
      }
    }
  };

  // Open the native browser calendar popup
  const handleOpenCalendar = () => {
    if (calendarInputRef.current) {
      try {
        if (calendarInputRef.current.showPicker) {
          calendarInputRef.current.showPicker();
        } else {
          calendarInputRef.current.focus();
        }
      } catch (err) {
        calendarInputRef.current.focus();
      }
    }
  };

  // Format readable display
  const getReadableDate = () => {
    if (!value || !value.includes('-')) return null;
    const [y, m, d] = value.split('-');
    const monthObj = MONTHS.find(mo => mo.value === m);
    return `${d} ${monthObj ? monthObj.name.split(' ')[0] : m} ${y}`;
  };

  return (
    <div className="space-y-3">
      {/* Label and Mode Switcher Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block">
          Date of Birth *
        </label>

        {/* Input Mode Switch Tabs */}
        <div className="inline-flex rounded-xl bg-white/5 p-1 border border-white/10 text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setMode('dropdown')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mode === 'dropdown'
                ? 'bg-saffron text-black font-extrabold shadow-sm'
                : 'text-ink-muted hover:text-white'
            }`}
          >
            ⚡ Select Day / Month / Year
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('calendar');
              setTimeout(handleOpenCalendar, 100);
            }}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              mode === 'calendar'
                ? 'bg-saffron text-black font-extrabold shadow-sm'
                : 'text-ink-muted hover:text-white'
            }`}
          >
            <span>📅</span> Calendar View
          </button>
          <button
            type="button"
            onClick={() => setMode('text')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mode === 'text'
                ? 'bg-saffron text-black font-extrabold shadow-sm'
                : 'text-ink-muted hover:text-white'
            }`}
          >
            ✍️ Type Date
          </button>
        </div>
      </div>

      {/* MODE 1: DAY / MONTH / YEAR DROPDOWNS (Default & Most Reliable) */}
      {mode === 'dropdown' && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {/* Day */}
            <div>
              <span className="text-[9px] uppercase tracking-wider text-ink-muted block mb-1 font-mono">Day</span>
              <select
                value={selDay || ''}
                onChange={e => updateFromDropdown('day', e.target.value)}
                className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:border-marigold font-mono"
              >
                <option value="">DD</option>
                {DAYS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div>
              <span className="text-[9px] uppercase tracking-wider text-ink-muted block mb-1 font-mono">Month</span>
              <select
                value={selMonth || ''}
                onChange={e => updateFromDropdown('month', e.target.value)}
                className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:border-marigold"
              >
                <option value="">Month</option>
                {MONTHS.map(m => (
                  <option key={m.value} value={m.value}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <span className="text-[9px] uppercase tracking-wider text-ink-muted block mb-1 font-mono">Year</span>
              <select
                value={selYear || ''}
                onChange={e => updateFromDropdown('year', e.target.value)}
                className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:border-marigold font-mono font-semibold"
              >
                <option value="">YYYY</option>
                {YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-ink-muted">
              Select your birth date from the 3 dropdowns above, or
            </span>
            <button
              type="button"
              onClick={handleOpenCalendar}
              className="text-[11px] text-marigold hover:underline font-bold flex items-center gap-1"
            >
              <span>📅</span> Open Calendar Picker
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: INTERACTIVE CALENDAR WITH EXPLICIT CLICKABLE BUTTON */}
      {mode === 'calendar' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                ref={calendarInputRef}
                type="date"
                required
                value={value}
                onChange={e => onChange(e.target.value)}
                onClick={handleOpenCalendar}
                className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold font-mono cursor-pointer"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <button
              type="button"
              onClick={handleOpenCalendar}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-marigold to-saffron text-black text-xs font-bold uppercase tracking-wider shadow-md hover:bg-amber-300 transition-all flex items-center gap-1.5 flex-shrink-0"
              title="Click to pop open graphical calendar"
            >
              <span>📅</span>
              <span className="hidden sm:inline">Pick Date</span>
            </button>
          </div>
          <p className="text-[10px] text-ink-muted">
            Click the input or the gold <strong>Pick Date</strong> button to open the calendar dialog.
          </p>
        </div>
      )}

      {/* MODE 3: DIRECT KEYBOARD WRITING (DD/MM/YYYY) */}
      {mode === 'text' && (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              placeholder="DD/MM/YYYY (e.g. 15/08/2003)"
              value={textInput}
              onChange={handleTextChange}
              className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold font-mono"
            />
          </div>
          <p className="text-[10px] text-ink-muted">
            Type directly in Day/Month/Year format (e.g. <strong>15/08/2003</strong>). It will parse automatically.
          </p>
        </div>
      )}

      {/* Hidden input to ensure native calendar is always mountable for showPicker() */}
      <input
        ref={calendarInputRef}
        type="date"
        tabIndex={-1}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="sr-only"
        style={{ colorScheme: 'dark' }}
        aria-hidden="true"
      />

      {/* Real-time Confirmation Badge */}
      {value && value.includes('-') && (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
          <span className="flex items-center gap-1.5 font-medium">
            <span>✓</span> Date Selected: <strong className="text-white">{getReadableDate()}</strong>
          </span>
          {calculatedAge && (
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-black">
              Age: {calculatedAge} yrs
            </span>
          )}
        </div>
      )}
    </div>
  );
}
