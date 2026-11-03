// ============================================================================
// INTER SMJV 2026 — NotificationSettingsView
// ============================================================================

import React, { useState } from 'react';
import { Icon, SportPictogram, BandhaniDivider } from '../components/common/UIComponents.jsx';
import { NOTIF_LABELS, NOTIF_ICONS } from '../data/tournamentData.js';

export default function NotificationSettingsView({ addToast, navigateTo }) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('smjv26.settings');
      return stored ? JSON.parse(stored) : {
        matchAlerts: true,
        mealAlerts: true,
        scheduleUpdates: true,
        venueRelocations: true,
        generalNotices: false
      };
    } catch (e) {
      return {
        matchAlerts: true,
        mealAlerts: true,
        scheduleUpdates: true,
        venueRelocations: true,
        generalNotices: false
      };
    }
  });

  const toggleSetting = (key) => {
    setSettings(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('smjv26.settings', JSON.stringify(next));
      } catch (e) {}
      addToast('Preferences Updated', 'Notification preference saved successfully.', 'check');
      return next;
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-bold tracking-widest uppercase text-saffron block">Preferences</span>
        <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-white mt-1">
          Notification Preferences
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          Control which alerts trigger in-app push banners on your device during the festival.
        </p>
      </div>

      <div className="p-6 rounded-3xl border border-white/10 bg-[#0E1433]/70 backdrop-blur-xl shadow-xl space-y-4">
        {[
          { key: 'matchAlerts', title: '15-Minute Pre-Match Reminders', desc: 'Alerts before your bookmarked matches start' },
          { key: 'mealAlerts', title: 'Mess Hall Meal Bell', desc: 'Reminders when breakfast, lunch, and dinner open' },
          { key: 'scheduleUpdates', title: 'Schedule Adjustments', desc: 'Weather delays and timing changes' },
          { key: 'venueRelocations', title: 'Pitch & Ground Moves', desc: 'Notifications if a match changes location' },
          { key: 'generalNotices', title: 'General & Cultural Night Announcements', desc: 'Garba auditions, score summaries, and guest notices' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
            <div>
              <h4 className="font-bold text-sm text-white">{item.title}</h4>
              <p className="text-xs text-ink-muted">{item.desc}</p>
            </div>
            <button
              onClick={() => toggleSetting(item.key)}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center ${
                settings[item.key] ? 'bg-saffron' : 'bg-white/20'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  settings[item.key] ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigateTo('notifications')}
          className="px-6 py-2.5 rounded-xl bg-marigold text-black font-bold text-xs uppercase tracking-wider"
        >
          Return to Notifications
        </button>
      </div>
    </div>
  );
}
