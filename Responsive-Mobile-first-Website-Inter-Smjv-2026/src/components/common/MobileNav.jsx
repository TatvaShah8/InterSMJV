// ============================================================================
// Mobile Bottom Bar Navigation Component
// ============================================================================

import React from 'react';
import { Icon } from './UIComponents.jsx';

export default function MobileNav({ activeView, navigateTo, unreadCount }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-[#070B1E]/90 border-t border-white/10 px-3 py-2 flex items-center justify-around shadow-2xl">
      {[
        { id: 'home', label: 'Home', icon: 'flag' },
        { id: 'schedule', label: 'Matches', icon: 'calendar' },
        { id: 'sports', label: 'Sports', icon: 'trophy' },
        { id: 'notifications', label: 'Alerts', icon: 'bell', badge: unreadCount },
        { id: 'dashboard', label: 'Portal', icon: 'user' },
      ].map(item => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              isActive ? 'text-saffron font-bold' : 'text-ink-muted hover:text-white'
            }`}
          >
            <div className="relative">
              <Icon name={item.icon} className="w-5 h-5" />
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-vermilion text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-wider uppercase leading-none">{item.label}</span>
            {isActive && (
              <span className="absolute bottom-0 w-6 h-0.5 bg-saffron rounded-full animate-pulse" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
