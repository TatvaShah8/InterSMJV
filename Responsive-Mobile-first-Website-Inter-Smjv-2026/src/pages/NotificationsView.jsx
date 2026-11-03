// ============================================================================
// INTER SMJV 2026 — NotificationsView
// ============================================================================

import React, { useState, useMemo } from 'react';
import { Icon, SportPictogram, BandhaniDivider } from '../components/common/UIComponents.jsx';
import { NOTIFS, NOTIF_ICONS, NOTIF_LABELS } from '../data/tournamentData.js';

export default function NotificationsView({ readNotifs, setReadNotifs, markAllRead, navigateTo }) {
  const [filter, setFilter] = useState('all');

  const filteredNotifs = useMemo(() => {
    return NOTIFS.filter(n => {
      if (filter === 'unread') return !readNotifs.includes(n.id) && n.unread;
      if (filter !== 'all') return n.type === filter;
      return true;
    });
  }, [filter, readNotifs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-saffron block">
            Live Feed
          </span>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted max-w-xl mt-1">
            Real-time fixture adjustments, meal announcements, weather alerts, and match reminders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('notif-settings')}
            className="px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5"
          >
            <Icon name="spark" className="w-4 h-4 text-marigold" /> Settings
          </button>
          <button
            onClick={markAllRead}
            className="px-3.5 py-2 rounded-xl bg-saffron text-black text-xs font-bold uppercase tracking-wider shadow-md hover:bg-amber-400"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'all', label: 'All Updates' },
          { id: 'unread', label: 'Unread' },
          { id: 'match', label: 'Matches' },
          { id: 'meal', label: 'Meals' },
          { id: 'schedule', label: 'Schedule' },
          { id: 'venue', label: 'Venues' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              filter === tab.id
                ? 'bg-marigold text-black font-bold shadow-md'
                : 'border border-white/10 bg-white/5 text-ink-muted hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-white/15 bg-white/5 text-xs text-ink-muted">
            No notifications in this category.
          </div>
        ) : (
          filteredNotifs.map(n => {
            const isUnread = !readNotifs.includes(n.id) && n.unread;
            return (
              <div
                key={n.id}
                onClick={() => {
                  if (isUnread) setReadNotifs(prev => [...prev, n.id]);
                  if (n.view) navigateTo(n.view);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isUnread
                    ? 'border-saffron/40 bg-saffron/10 shadow-lg'
                    : 'border-white/10 bg-[#0E1433]/70 hover:bg-white/5'
                } backdrop-blur-xl flex items-start gap-4`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isUnread ? 'bg-saffron text-black shadow-md' : 'bg-white/10 text-marigold'
                }`}>
                  <Icon name={NOTIF_ICONS[n.type] || 'info'} className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-marigold font-mono">
                      {NOTIF_LABELS[n.type] || 'Notice'} · {n.time}
                    </span>
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-vermilion" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">{n.title}</h3>
                  <p className="text-xs text-ink-sub leading-relaxed">{n.body}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
