// ============================================================================
// Header Component with Frosted Glassmorphism, Theme Switcher, & ID Card Trigger
// ============================================================================

import React from 'react';
import { Icon } from './UIComponents.jsx';
import { NOTIFS, NOTIF_ICONS } from '../../data/tournamentData.js';

export default function Header({
  activeView,
  theme,
  toggleTheme,
  unreadCount,
  readNotifs,
  setReadNotifs,
  markAllRead,
  navigateTo,
  isNotifDropdownOpen,
  setIsNotifDropdownOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  player,
  onOpenIdCard
}) {
  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl ${theme === 'dark' ? 'bg-[#070B1E]/75 border-white/10' : 'bg-white/80 border-slate-200'} border-b shadow-lg transition-all`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigateTo('home')}>
          <div className="w-10 h-10 rounded-xl bg-[#EFE5C9] p-1 shadow-md border border-amber-300/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <img src="inter_smjv_2026_vadodara_logo.svg" alt="Tournament Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display tracking-wider text-xl sm:text-2xl leading-none text-white drop-shadow-sm group-hover:text-marigold transition-colors">
                INTER SMJV
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-saffron/20 text-saffron border border-saffron/30">
                2026
              </span>
            </div>
            <p className="text-[10px] font-medium tracking-widest text-ink-muted uppercase">
              Vadodara · <span className="font-gu text-marigold">આંતર હોસ્ટેલ</span>
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 font-semibold text-xs tracking-wider uppercase">
          {[
            { id: 'home', label: 'Home' },
            { id: 'schedule', label: 'Schedule' },
            { id: 'sports', label: 'Sports' },
            { id: 'venues', label: 'Venues & Stay' },
            { id: 'meals', label: 'Meals' },
            { id: 'explore', label: 'Explore' },
            { id: 'rulebook', label: 'Rule Book' },
            { id: 'contact', label: 'Contact' },
          ].map(item => {
            const isActive = activeView === item.id || (item.id === 'sports' && activeView === 'sport');
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`px-3 py-2 rounded-lg transition-all ${
                  isActive 
                    ? 'text-saffron font-bold bg-saffron/10 border border-saffron/30 shadow-sm' 
                    : 'text-ink-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="relative p-2.5 rounded-xl border border-white/10 hover:border-marigold/40 bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer"
              title="Notifications"
              aria-label="View notifications"
            >
              <Icon name="bell" className="w-5 h-5 text-marigold" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-vermilion text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover Dropdown */}
            {isNotifDropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-white/15 bg-[#0E1433]/95 backdrop-blur-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display tracking-wider uppercase text-base text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-vermilion/20 text-vermilion border border-vermilion/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead} 
                      className="text-xs text-marigold hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {NOTIFS.slice(0, 4).map(n => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        if (!readNotifs.includes(n.id)) {
                          setReadNotifs(prev => [...prev, n.id]);
                        }
                        navigateTo(n.view);
                        setIsNotifDropdownOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        !readNotifs.includes(n.id) && n.unread
                          ? 'bg-saffron/10 border-saffron/30 hover:bg-saffron/15'
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-marigold/20 text-marigold flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon name={NOTIF_ICONS[n.type] || 'info'} className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white leading-tight">{n.title}</p>
                          <p className="text-[11px] text-ink-muted line-clamp-2 mt-0.5">{n.body}</p>
                          <span className="text-[10px] text-amber-400/80 font-medium mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                  <button 
                    onClick={() => {
                      navigateTo('notif-settings');
                      setIsNotifDropdownOpen(false);
                    }}
                    className="text-ink-muted hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Icon name="spark" className="w-3.5 h-3.5 text-marigold" /> Settings
                  </button>
                  <button 
                    onClick={() => {
                      navigateTo('notifications');
                      setIsNotifDropdownOpen(false);
                    }}
                    className="text-saffron hover:underline font-bold cursor-pointer"
                  >
                    View All Updates →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-white/10 hover:border-marigold/40 bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle visual theme"
          >
            <Icon name={theme === 'dark' ? "sun" : "moon"} className="w-5 h-5 text-amber-300" />
          </button>

          {/* Register CTA (Desktop) */}
          <button
            onClick={() => navigateTo('register')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-marigold to-saffron hover:from-amber-400 hover:to-orange-500 shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>Register</span>
            <Icon name="arrow" className="w-3.5 h-3.5" />
          </button>

          {/* Player Avatar Button -> Click to view Official ID Card */}
          <button
            onClick={onOpenIdCard}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-950 border-2 border-amber-400/60 text-white font-bold text-xs tracking-wider flex items-center justify-center hover:ring-2 hover:ring-marigold transition-all overflow-hidden shadow-lg flex-shrink-0 cursor-pointer"
            title="Click to view Official Accreditation ID Card & QR Code"
          >
            {player && player.photo ? (
              <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <span>
                {(player?.name?.[0] || 'A') + (player?.surname?.[0] || player?.name?.split(' ')?.[1]?.[0] || 'M')}
              </span>
            )}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl border border-white/10 bg-white/5 text-white cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Icon name={isMobileMenuOpen ? "close" : "menu"} className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0E1433]/98 backdrop-blur-2xl p-4 space-y-2 animate-in slide-in-from-top-3">
          {[
            { id: 'home', label: 'Home' },
            { id: 'schedule', label: 'Match Schedule' },
            { id: 'sports', label: 'All 10 Sports' },
            { id: 'venues', label: 'Grounds & Room Lookup' },
            { id: 'meals', label: 'Mess Timetable & Menu' },
            { id: 'explore', label: 'Explore Vadodara' },
            { id: 'rulebook', label: 'Official Rule Book' },
            { id: 'notifications', label: 'Notification Center' },
            { id: 'dashboard', label: 'Player Dashboard' },
            { id: 'register', label: 'Player Registration' },
            { id: 'contact', label: 'Contact & FAQ' },
            { id: 'styleguide', label: 'Design System & Style Guide' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                navigateTo(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                activeView === item.id ? 'bg-saffron text-black font-bold' : 'text-ink-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              <span>→</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
