// ============================================================================
// INTER SMJV 2026 — Design System Inspired by Glassmorphism
// Primary: #1856FF | Secondary: #3A344E | Success: #07CA6B | Warning: #E89558 | Danger: #EA2143
// Typography: Plus Jakarta Sans (Primary/Display) | JetBrains Mono (Mono)
// ============================================================================

const { useState, useEffect, useMemo } = React;

// ----------------------------------------------------------------------------
// SVG Icon System
// ----------------------------------------------------------------------------
function Icon({ name, className = "w-5 h-5", size }) {
  const iconMarkup = UI_ICONS[name] || UI_ICONS.info;
  return (
    <svg 
      className={`inline-block flex-shrink-0 ${className}`} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={size ? { width: size, height: size } : undefined}
      dangerouslySetInnerHTML={{ __html: iconMarkup }}
    />
  );
}

// ----------------------------------------------------------------------------
// Clean Line-Art Sport Pictogram
// ----------------------------------------------------------------------------
function SportPictogram({ id, className = "w-10 h-10" }) {
  const art = SPORT_ART[id] || '';
  return (
    <svg 
      className={`inline-block flex-shrink-0 ${className}`} 
      viewBox="0 0 64 64" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: art }}
    />
  );
}

// ----------------------------------------------------------------------------
// Subtle Glass Divider
// ----------------------------------------------------------------------------
function GlassDivider() {
  return (
    <div className="w-full h-px my-8 bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden="true" />
  );
}

// ----------------------------------------------------------------------------
// Main Application Component
// ----------------------------------------------------------------------------
function App() {
  // Navigation & View State
  const [activeView, setActiveView] = useState('home');
  const [selectedSport, setSelectedSport] = useState('cricket');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  // Theme State
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('smjv26.theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('smjv26.theme', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Toast Notification Stack
  const [toasts, setToasts] = useState([]);
  const addToast = (title, message, iconName = 'bell', type = 'info') => {
    const id = Date.now() + Math.random().toString();
    const newToast = { id, title, message, iconName, type };
    setToasts(prev => [newToast, ...prev.slice(0, 3)]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4800);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Notification State
  const [readNotifs, setReadNotifs] = useState(() => {
    try {
      const stored = localStorage.getItem('smjv26.readNotifs');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const unreadCount = useMemo(() => {
    return NOTIFS.filter(n => n.unread && !readNotifs.includes(n.id)).length;
  }, [readNotifs]);

  const markAllRead = () => {
    const allIds = NOTIFS.map(n => n.id);
    setReadNotifs(allIds);
    try {
      localStorage.setItem('smjv26.readNotifs', JSON.stringify(allIds));
    } catch (e) {}
    addToast('All Caught Up', 'All notifications marked as read', 'checkCircle');
  };

  // Match Reminders State
  const [reminders, setReminders] = useState(() => {
    try {
      const stored = localStorage.getItem('smjv26.reminders');
      return stored ? JSON.parse(stored) : ['m16'];
    } catch (e) {
      return ['m16'];
    }
  });

  const toggleReminder = (matchId) => {
    setReminders(prev => {
      const match = MATCHES.find(m => m.id === matchId);
      const exists = prev.includes(matchId);
      const next = exists ? prev.filter(id => id !== matchId) : [...prev, matchId];
      try {
        localStorage.setItem('smjv26.reminders', JSON.stringify(next));
      } catch (e) {}

      if (!exists) {
        addToast(
          'Reminder Set',
          `15-minute alert active for ${match ? match.a + ' vs ' + match.b : 'match'}.`,
          'bell'
        );
      } else {
        addToast(
          'Reminder Cancelled',
          `Notification removed for ${match ? match.a + ' vs ' + match.b : 'match'}.`,
          'bell'
        );
      }
      return next;
    });
  };

  // Player Profile
  const [player, setPlayer] = useState(() => {
    try {
      const stored = localStorage.getItem('smjv26.player');
      return stored ? JSON.parse(stored) : DEMO_PLAYER;
    } catch (e) {
      return DEMO_PLAYER;
    }
  });

  // Countdown Timer to 18 Dec 2026, 7:00 PM IST
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', mins: '00', secs: '00' });
  useEffect(() => {
    const target = new Date('2026-12-18T19:00:00+05:30').getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        mins: String(m).padStart(2, '0'),
        secs: String(s).padStart(2, '0')
      });
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const navigateTo = (view, extra = {}) => {
    setActiveView(view);
    if (extra.sport) setSelectedSport(extra.sport);
    setIsMobileMenuOpen(false);
    setIsNotifDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0A0E23] text-[#F5F7FF]' : 'bg-[#F4F6FB] text-[#141414]'} font-sans pb-20 md:pb-0 transition-colors duration-200`}>
      
      {/* ==================================================================== */}
      {/* HEADER / NAVIGATION BAR (Glassmorphism Frosted Panel)                */}
      {/* ==================================================================== */}
      <header className={`sticky top-0 z-50 backdrop-blur-2xl ${theme === 'dark' ? 'bg-[#0A0E23]/80 border-white/10' : 'bg-white/80 border-gray-200'} border-b shadow-lg transition-all`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3.5">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigateTo('home')}>
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-white/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <img src="inter_smjv_2026_vadodara_logo.svg" alt="Tournament Crest" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold tracking-tight text-xl sm:text-2xl leading-none text-white group-hover:text-[#1856FF] transition-colors">
                  INTER SMJV
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-md bg-[#1856FF]/20 text-[#1856FF] border border-[#1856FF]/30 font-mono">
                  2026
                </span>
              </div>
              <p className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
                Vadodara · <span className="font-gu text-[#1856FF] font-semibold">આંતર હોસ્ટેલ</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 font-semibold text-xs tracking-wider uppercase">
            {[
              { id: 'home', label: 'Home' },
              { id: 'schedule', label: 'Schedule' },
              { id: 'sports', label: 'Sports' },
              { id: 'venues', label: 'Venues' },
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
                  className={`px-3.5 py-2 rounded-xl transition-all ${
                    isActive 
                      ? 'text-white font-bold bg-[#1856FF] shadow-md shadow-[#1856FF]/25' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Utility Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Notification Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className="relative p-2.5 rounded-xl border border-white/10 hover:border-[#1856FF]/50 bg-white/5 hover:bg-white/10 text-white transition-all"
                title="Notifications"
                aria-label="View notifications"
              >
                <Icon name="bell" className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EA2143] text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono shadow-md animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-white/15 bg-[#101533]/95 backdrop-blur-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm tracking-wide uppercase text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EA2143]/20 text-[#EA2143] border border-[#EA2143]/30 font-mono">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead} 
                        className="text-xs text-[#1856FF] hover:underline font-semibold"
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
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          !readNotifs.includes(n.id) && n.unread
                            ? 'bg-[#1856FF]/10 border-[#1856FF]/30 hover:bg-[#1856FF]/15'
                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#1856FF]/20 text-[#1856FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon name={NOTIF_ICONS[n.type] || 'info'} className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white leading-tight">{n.title}</p>
                            <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">{n.body}</p>
                            <span className="text-[10px] text-[#1856FF] font-mono mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                    <button 
                      onClick={() => navigateTo('notif-settings')}
                      className="text-zinc-400 hover:text-white flex items-center gap-1 font-semibold"
                    >
                      <Icon name="spark" className="w-3.5 h-3.5 text-[#1856FF]" /> Settings
                    </button>
                    <button 
                      onClick={() => navigateTo('notifications')}
                      className="text-[#1856FF] hover:underline font-bold"
                    >
                      View All Updates →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-white/10 hover:border-[#1856FF]/50 bg-white/5 hover:bg-white/10 text-white transition-all"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle visual theme"
            >
              <Icon name={theme === 'dark' ? "sun" : "moon"} className="w-5 h-5 text-zinc-300" />
            </button>

            {/* Primary Action Button (Brand #1856FF) */}
            <button
              onClick={() => navigateTo('register')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider btn-primary-glass"
            >
              <span>Register</span>
              <Icon name="arrow" className="w-3.5 h-3.5" />
            </button>

            {/* Player Avatar */}
            <button
              onClick={() => navigateTo('dashboard')}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1856FF] to-[#0A2680] border border-white/20 text-white font-bold text-xs tracking-wider flex items-center justify-center hover:ring-2 hover:ring-[#1856FF] transition-all"
              title="Player Dashboard"
            >
              AM
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-white/10 bg-white/5 text-white"
              aria-label="Toggle navigation menu"
            >
              <Icon name={isMobileMenuOpen ? "close" : "menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#101533]/98 backdrop-blur-2xl p-4 space-y-2 animate-in slide-in-from-top-3">
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
                onClick={() => navigateTo(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors ${
                  activeView === item.id ? 'bg-[#1856FF] text-white shadow-md' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                <span>→</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ==================================================================== */}
      {/* TOAST SYSTEM (Subtle Glass Layered Alerts)                           */}
      {/* ==================================================================== */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto p-4 rounded-2xl border border-white/20 bg-[#101533]/95 backdrop-blur-2xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-bottom-3 fade-in duration-200"
          >
            <div className="w-8 h-8 rounded-xl bg-[#1856FF] text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Icon name={toast.iconName} className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white tracking-wide uppercase">{toast.title}</h4>
              <p className="text-xs text-zinc-300 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="text-zinc-400 hover:text-white p-1"
            >
              <Icon name="close" className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* VIEW ROUTER                                                          */}
      {/* ==================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'home' && (
          <HomeView 
            navigateTo={navigateTo} 
            timeLeft={timeLeft} 
            reminders={reminders} 
            toggleReminder={toggleReminder} 
          />
        )}

        {activeView === 'schedule' && (
          <ScheduleView 
            reminders={reminders} 
            toggleReminder={toggleReminder} 
            navigateTo={navigateTo} 
          />
        )}

        {activeView === 'sports' && (
          <SportsView navigateTo={navigateTo} />
        )}

        {activeView === 'sport' && (
          <SportDetailView 
            sportId={selectedSport} 
            navigateTo={navigateTo} 
            reminders={reminders} 
            toggleReminder={toggleReminder} 
          />
        )}

        {activeView === 'rulebook' && (
          <RulebookView />
        )}

        {activeView === 'venues' && (
          <VenuesView />
        )}

        {activeView === 'meals' && (
          <MealsView />
        )}

        {activeView === 'explore' && (
          <ExploreView />
        )}

        {activeView === 'notifications' && (
          <NotificationsView 
            readNotifs={readNotifs} 
            setReadNotifs={setReadNotifs} 
            markAllRead={markAllRead} 
            navigateTo={navigateTo} 
          />
        )}

        {activeView === 'notif-settings' && (
          <NotificationSettingsView 
            addToast={addToast} 
            navigateTo={navigateTo} 
          />
        )}

        {activeView === 'register' && (
          <RegisterView 
            setPlayer={setPlayer} 
            navigateTo={navigateTo} 
            addToast={addToast} 
          />
        )}

        {activeView === 'dashboard' && (
          <DashboardView 
            player={player} 
            navigateTo={navigateTo} 
            reminders={reminders} 
            toggleReminder={toggleReminder} 
          />
        )}

        {activeView === 'login' && (
          <LoginView 
            navigateTo={navigateTo} 
            addToast={addToast} 
          />
        )}

        {activeView === 'contact' && (
          <ContactView 
            addToast={addToast} 
          />
        )}

        {activeView === 'styleguide' && (
          <StyleGuideView />
        )}
      </main>

      {/* ==================================================================== */}
      {/* FOOTER                                                               */}
      {/* ==================================================================== */}
      <footer className="border-t border-white/10 bg-[#060817] mt-16 pt-12 pb-24 md:pb-12 text-zinc-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white p-1 shadow-md border border-white/30">
                <img src="inter_smjv_2026_vadodara_logo.svg" alt="Tournament Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-extrabold tracking-tight text-xl text-white">INTER SMJV 2026</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Ten sports. Eight hostels. Five days in Vadodara. The flagship inter-hostel athletic festival of Shri Mahavira Jaina Vidyalaya.
            </p>
            <p className="font-gu text-[#1856FF] text-sm font-semibold">
              ખેલો ગુજરાત, જીતો દિલ — ૧૪ થી ૧૮ ડિસેમ્બર ૨૦૨૬
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white tracking-wider uppercase mb-3 text-xs">Festival Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigateTo('schedule')} className="hover:text-white transition-colors">Match Schedule</button></li>
              <li><button onClick={() => navigateTo('sports')} className="hover:text-white transition-colors">10 Sports & Fixtures</button></li>
              <li><button onClick={() => navigateTo('rulebook')} className="hover:text-white transition-colors">Official Rule Book & PDF</button></li>
              <li><button onClick={() => navigateTo('venues')} className="hover:text-white transition-colors">Ground Map & Room Lookup</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white tracking-wider uppercase mb-3 text-xs">Student Portal</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigateTo('register')} className="hover:text-white transition-colors">Digital Player Registration</button></li>
              <li><button onClick={() => navigateTo('dashboard')} className="hover:text-white transition-colors">Player Dashboard</button></li>
              <li><button onClick={() => navigateTo('meals')} className="hover:text-white transition-colors">Gujarati Mess Menu</button></li>
              <li><button onClick={() => navigateTo('explore')} className="hover:text-white transition-colors">Explore Vadodara Landmarks</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white tracking-wider uppercase mb-3 text-xs">Emergency & Control Desk</h4>
            <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-1.5">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#1856FF] block font-mono">24-Hour Helpline</span>
              <a href="tel:+919825040120" className="text-sm font-bold text-white hover:text-[#1856FF] block font-mono">
                +91 98250 40120
              </a>
              <p className="text-[11px] text-zinc-400">Medical room beside Main Ground Pavilion, Karelibaug.</p>
            </div>
            <button 
              onClick={() => navigateTo('styleguide')} 
              className="mt-3 text-[11px] text-[#1856FF] hover:underline flex items-center gap-1 font-semibold"
            >
              <Icon name="spark" className="w-3.5 h-3.5 text-[#1856FF]" /> Design System Inspired by Glassmorphism
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-400 text-[11px]">
          <p>© 2026 INTER SMJV · SMJV Hostel Branch, Vadodara.</p>
          <p className="flex items-center gap-2">
            <span>Primary: #1856FF</span>
            <span>•</span>
            <span>Plus Jakarta Sans</span>
            <span>•</span>
            <span>Frosted Glassmorphism</span>
          </p>
        </div>
      </footer>

      {/* ==================================================================== */}
      {/* MOBILE BOTTOM NAVIGATION DOCK                                        */}
      {/* ==================================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-[#0A0E23]/90 border-t border-white/15 px-3 py-2 flex items-center justify-around shadow-2xl">
        {[
          { id: 'home', label: 'Home', icon: 'flag' },
          { id: 'schedule', label: 'Schedule', icon: 'calendar' },
          { id: 'sports', label: 'Sports', icon: 'trophy' },
          { id: 'notifications', label: 'Alerts', icon: 'bell', badge: unreadCount },
          { id: 'dashboard', label: 'Profile', icon: 'user' },
        ].map(item => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-[#1856FF] font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon name={item.icon} className="w-5 h-5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#EA2143] text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-wider uppercase leading-none font-semibold">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-[#1856FF] rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

    </div>
  );
}

// ----------------------------------------------------------------------------
// VIEW 1: HOME VIEW
// ----------------------------------------------------------------------------
function HomeView({ navigateTo, timeLeft, reminders, toggleReminder }) {
  return (
    <div className="space-y-12">
      
      {/* HERO SECTION: Liquid Glassmorphic Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-br from-[#0F1738] via-[#0A0E23] to-[#121B45] p-6 sm:p-10 lg:p-14 shadow-2xl">
        {/* Background Image Scrim */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-25 mix-blend-luminosity filter contrast-125"
          style={{ backgroundImage: `url('assets/stock/hero.jpg')` }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0A0E23] via-[#0A0E23]/60 to-transparent" />
        
        {/* Luminous Glow Orbs */}
        <div className="absolute right-0 top-0 w-96 h-96 opacity-20 pointer-events-none rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1856FF] via-[#3A344E] to-transparent blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#EA2143]/40 bg-[#EA2143]/10 text-[#EA2143] text-xs font-bold uppercase tracking-wider backdrop-blur-md font-mono">
              <span className="w-2 h-2 rounded-full bg-[#EA2143] animate-ping" />
              <span>LIVE · DAY 3 OF 5 · VADODARA</span>
            </div>

            {/* High-Contrast Bold Headline */}
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.9] text-white">
              <span className="block">INTER</span>
              <span className="block text-[#1856FF]">
                SMJV
              </span>
              <span className="block text-white/30 font-light">2026</span>
            </h1>

            {/* Subtitle */}
            <div className="space-y-1 max-w-xl">
              <p className="font-gu text-[#1856FF] text-lg sm:text-xl font-bold tracking-wide">
                આંતર હોસ્ટેલ ખેલ મહોત્સવ
              </p>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Ten sports. Eight hostels. Five days in Vadodara — floodlit cricket, tactical kho-kho, volleyball, and Garba under the pavilion lights.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigateTo('register')}
                className="px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider btn-primary-glass flex items-center gap-2"
              >
                <span>Register Player Card</span>
                <Icon name="arrow" className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigateTo('schedule')}
                className="px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 backdrop-blur-md flex items-center gap-2 transition-all"
              >
                <Icon name="calendar" className="w-4 h-4 text-[#1856FF]" />
                <span>Full Timetable</span>
              </button>
            </div>

            {/* Dates & Location */}
            <div className="flex items-center gap-3 text-xs font-semibold tracking-wider uppercase text-zinc-400 pt-2 font-mono">
              <span className="text-white font-bold">14–18 Dec 2026</span>
              <span className="text-[#1856FF]">•</span>
              <span>SMJV Hostel Campus, Vadodara</span>
            </div>
          </div>

          {/* Countdown Glass Box */}
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <div className="w-full sm:w-auto p-5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-2xl shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase text-[#1856FF] font-mono">
                <span>Final Whistle Countdown</span>
                <span className="text-zinc-400">18 Dec · 7 PM</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.mins, label: 'Mins' },
                  { value: timeLeft.secs, label: 'Secs' },
                ].map((u, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white block leading-none">
                      {u.value}
                    </span>
                    <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-400 mt-1 block">
                      {u.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MATCH STATUS TICKER */}
      <div className="p-3.5 rounded-2xl border border-white/10 bg-[#101533]/80 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#EA2143]/20 text-[#EA2143] border border-[#EA2143]/30 flex items-center gap-1.5 flex-shrink-0 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA2143] animate-ping" /> Next Up
          </span>
          <p className="text-xs text-white truncate">
            Football Semi-Final · <strong className="text-[#1856FF]">Tapi vs Mahi</strong> · 3:00 PM · Main Ground
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-2 md:pt-0">
          <div className="text-xs text-zinc-300">
            <span className="text-zinc-400">Latest Result:</span> Cricket SF1 · <strong>Mahi 156/5</strong> beat Tapi 149/7
          </div>
          <button 
            onClick={() => navigateTo('schedule')} 
            className="text-xs font-bold text-[#1856FF] hover:underline flex-shrink-0"
          >
            Live Timetable →
          </button>
        </div>
      </div>

      {/* MARQUEE RUNNER */}
      <div className="rounded-xl overflow-hidden bg-[#1856FF] text-white py-2.5 font-display font-bold text-sm tracking-widest uppercase shadow-md select-none">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="mx-6 flex items-center gap-6">
              <span>10 SPORTS</span>
              <span>•</span>
              <span>8 HOSTELS</span>
              <span>•</span>
              <span>5 DAYS</span>
              <span>•</span>
              <span>1 TROPHY</span>
              <span>•</span>
              <span>VADODARA 2026</span>
              <span>•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 10 SPORTS SHOWCASE                                                  */}
      {/* ==================================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-[#1856FF] flex items-center gap-2">
              <span className="font-gu">રમતો</span>
              <span>•</span>
              <span>The Contested Disciplines</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-white mt-1">
              Ten Championship Sports
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
              Round-robin group stages leading into knockout semi-finals and finals. Click any sport to inspect playing conditions.
            </p>
          </div>
          <button
            onClick={() => navigateTo('sports')}
            className="text-xs font-bold tracking-wider uppercase text-[#1856FF] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>All Formats</span>
            <span>→</span>
          </button>
        </div>

        {/* 10 Sports Grid (Liquid Glass Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {SPORTS.map((sport, idx) => (
            <div
              key={sport.id}
              onClick={() => navigateTo('sport', { sport: sport.id })}
              className="liquid-glass-card p-4 rounded-2xl cursor-pointer relative overflow-hidden group space-y-4"
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-zinc-400 tracking-wider font-mono">
                  #{String(idx + 1).padStart(2, '0')}
                </span>
                <div className="text-[#1856FF] group-hover:scale-110 transition-transform">
                  <SportPictogram id={sport.id} className="w-10 h-10" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-bold text-base tracking-wide uppercase text-white group-hover:text-[#1856FF] transition-colors">
                  {sport.name}
                </h3>
                <p className="text-[11px] text-zinc-400 line-clamp-1">
                  {sport.venue}
                </p>
                <div className="flex items-center justify-between pt-2 text-[10px] text-[#1856FF] font-bold tracking-wider uppercase font-mono">
                  <span>{sport.format.split('·')[0]}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <GlassDivider />

      {/* ==================================================================== */}
      {/* DAY 3 TIMETABLE PREVIEW & FESTIVAL AT A GLANCE                      */}
      {/* ==================================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Day 3 Matches */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#1856FF] block font-mono">
                <span className="font-gu">આજનો કાર્યક્રમ</span> · Day 3 Timetable
              </span>
              <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-white mt-0.5">
                On Court & Pitch Today
              </h3>
            </div>
            <button 
              onClick={() => navigateTo('schedule')} 
              className="text-xs font-bold text-[#1856FF] hover:underline"
            >
              All 32 Fixtures →
            </button>
          </div>

          <div className="space-y-2.5">
            {MATCHES.filter(m => m.day === 'd3').slice(0, 4).map(m => (
              <div 
                key={m.id}
                className={`p-4 rounded-2xl border transition-all ${
                  m.status === 'live' 
                    ? 'border-[#EA2143]/50 bg-[#EA2143]/10 shadow-lg' 
                    : 'border-white/10 bg-[#101533]/70 hover:border-[#1856FF]/40'
                } backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-center font-mono w-14 py-1.5 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-xs font-bold text-white block">{m.time}</span>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400">IST</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1856FF]">
                        {SPORTS.find(s => s.id === m.sport)?.name}
                      </span>
                      <span className="text-white/30">•</span>
                      <span className="text-xs text-zinc-400">{VENUES.find(v => v.id === m.venue)?.name}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      {m.a} <span className="text-zinc-400 font-light px-1">vs</span> {m.b}
                    </h4>
                    {m.score && (
                      <p className="text-xs text-[#07CA6B] font-mono font-medium mt-0.5">Result: {m.score}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {m.status === 'live' ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EA2143] text-white flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> Live
                    </span>
                  ) : m.status === 'done' ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300 font-mono">
                      Completed
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1856FF]/20 text-[#1856FF] border border-[#1856FF]/30 font-mono">
                      Scheduled
                    </span>
                  )}

                  <button
                    onClick={() => toggleReminder(m.id)}
                    className={`p-2 rounded-xl border transition-all ${
                      reminders.includes(m.id)
                        ? 'border-[#1856FF] bg-[#1856FF] text-white shadow-md'
                        : 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
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

        {/* Right: Festival At A Glance */}
        <div className="lg:col-span-4 space-y-4">
          <div className="liquid-glass-card p-6 rounded-3xl space-y-5">
            <h3 className="font-display font-bold text-lg uppercase tracking-wider text-white">Championship Status</h3>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="font-mono text-2xl font-bold text-[#1856FF] block leading-none">32</span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 mt-1 block">Matches Total</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="font-mono text-2xl font-bold text-white block leading-none">08</span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 mt-1 block">Hostels</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="font-mono text-2xl font-bold text-[#EA2143] block leading-none">02</span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 mt-1 block">Live Now</span>
              </div>
            </div>

            {/* Next Meal Callout */}
            <div className="p-4 rounded-xl border border-[#1856FF]/20 bg-[#1856FF]/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1856FF] uppercase tracking-wider">
                <Icon name="food" className="w-4 h-4" />
                <span>Next Mess Hall Meal</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Lunch · 1:00 PM – 2:30 PM</h4>
                <p className="text-xs text-zinc-300 mt-0.5">Authentic Gujarati Thali, Undhiyu, Methi Thepla & Chaas</p>
              </div>
              <button
                onClick={() => navigateTo('meals')}
                className="text-[11px] font-bold text-[#1856FF] hover:underline flex items-center gap-1 pt-1"
              >
                <span>View 5-Day Menu</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* ==================================================================== */}
      {/* CULTURAL LAYER: DANDIYA AFTER DARK                                  */}
      {/* ==================================================================== */}
      <section className="liquid-glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1856FF]/15 text-[#1856FF] border border-[#1856FF]/30 font-mono">
              <span className="font-gu">સાંસ્કૃતિક ઉત્સવ</span> · The Cultural Layer
            </div>
            
            <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white leading-tight">
              Dandiya After Dark: When The Whistle Goes
            </h2>
            
            <p className="text-sm text-zinc-300 leading-relaxed">
              Every night after the last cricket ball is bowled and the court lights dim, the Main Ground transforms into a massive Garba circle. Live dhol, rhythmic clapping, dandiya sticks, and a 90-minute live performance by the student hostel band.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigateTo('explore')}
                className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider btn-primary-glass flex items-center gap-2"
              >
                <span>Explore Vadodara Landmarks</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl group">
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
      {/* CTA BANNER (Primary #1856FF Focus)                                  */}
      {/* ==================================================================== */}
      <section className="rounded-3xl p-8 sm:p-12 text-white bg-gradient-to-r from-[#1856FF] via-[#0E44E6] to-[#0A2680] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold tracking-widest uppercase text-white/70 block font-mono">
            Registration Deadline · 30 November
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl uppercase tracking-tight leading-none text-white">
            Put Your Hostel On The Leaderboard
          </h2>
          <p className="text-sm text-white/80 max-w-lg">
            Register once with your student GR number, select your sports, and generate your live digital player card instantly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => navigateTo('register')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-[#141414] bg-white hover:bg-gray-100 shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            Register Now
          </button>
          <button
            onClick={() => navigateTo('rulebook')}
            className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-xs tracking-wider uppercase text-white border border-white/30 hover:bg-white/10 transition-colors"
          >
            Read Rule Book
          </button>
        </div>
      </section>

    </div>
  );
}

// ----------------------------------------------------------------------------
// VIEW 2: SCHEDULE VIEW (List & Calendar with Interactive Filters)
// ----------------------------------------------------------------------------
function ScheduleView({ reminders, toggleReminder, navigateTo }) {
  const [sportFilter, setSportFilter] = useState('all');
  const [dayFilter, setDayFilter] = useState('all');
  const [venueFilter, setVenueFilter] = useState('all');
  const [teamSearch, setTeamSearch] = useState('');
  const [viewMode, setViewMode] = useState('list');

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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-[#1856FF] block font-mono">
            <span className="font-gu">સમયપત્રક</span> · Match Timetable
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            Championship Schedule
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
            All times in Indian Standard Time (IST). Filter by sport, day, venue, or hostel team.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="p-1 rounded-xl bg-white/5 border border-white/10 flex items-center self-start sm:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              viewMode === 'list' ? 'bg-[#1856FF] text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              viewMode === 'calendar' ? 'bg-[#1856FF] text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Calendar Grid
          </button>
        </div>
      </div>

      {/* Filter Toolbar (Liquid Glass Card) */}
      <div className="liquid-glass-card p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">Sport</label>
          <select
            value={sportFilter}
            onChange={e => setSportFilter(e.target.value)}
            className="w-full bg-[#0A0E23] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1856FF]"
          >
            <option value="all">All 10 Sports</option>
            {SPORTS.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">Venue</label>
          <select
            value={venueFilter}
            onChange={e => setVenueFilter(e.target.value)}
            className="w-full bg-[#0A0E23] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1856FF]"
          >
            <option value="all">All Ground Venues</option>
            {VENUES.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">Hostel Search</label>
          <input
            type="text"
            placeholder="e.g. Narmada, Tapi..."
            value={teamSearch}
            onChange={e => setTeamSearch(e.target.value)}
            className="w-full bg-[#0A0E23] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1856FF] placeholder:text-zinc-500"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setSportFilter('all');
              setDayFilter('all');
              setVenueFilter('all');
              setTeamSearch('');
            }}
            className="w-full py-2 px-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors"
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
              ? 'bg-[#1856FF] text-white shadow-md'
              : 'border border-white/10 bg-white/5 text-zinc-400 hover:text-white'
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
                ? 'bg-[#1856FF] text-white shadow-md'
                : 'border border-white/10 bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            Day {d.n} · {d.date}
          </button>
        ))}
      </div>

      {/* Matches List */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredMatches.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-white/15 bg-white/5 space-y-2">
              <Icon name="search" className="w-8 h-8 text-[#1856FF] mx-auto" />
              <h3 className="font-bold text-white uppercase text-sm">No Matches Found</h3>
              <p className="text-xs text-zinc-400">Try adjusting your filters or search term.</p>
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
                      ? 'border-[#EA2143]/50 bg-[#EA2143]/10 shadow-lg'
                      : 'border-white/10 bg-[#101533]/70 hover:border-[#1856FF]/40'
                  } backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 p-2 rounded-xl bg-black/40 border border-white/10 text-center flex-shrink-0">
                      <span className="font-mono text-sm font-bold text-white block leading-none">{m.time}</span>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 mt-1 block">
                        {DAYS.find(d => d.id === m.day)?.short}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1856FF] uppercase tracking-wider">
                          {sportObj?.name}
                        </span>
                        <span className="text-white/30">•</span>
                        <span className="text-xs text-zinc-400">{venueObj?.name}</span>
                        <span className="text-white/30">•</span>
                        <span className="text-[10px] font-bold text-zinc-300 uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono">
                          {m.stage}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-lg sm:text-xl text-white tracking-wide uppercase mt-1">
                        {m.a} <span className="text-zinc-400 font-light text-sm px-1">vs</span> {m.b}
                      </h3>

                      {m.score && (
                        <p className="text-xs font-mono font-bold text-[#07CA6B] mt-0.5">
                          Score: {m.score} {m.note && <span className="text-zinc-400 font-sans font-normal">({m.note})</span>}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    {m.status === 'live' ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EA2143] text-white flex items-center gap-1.5 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> Live
                      </span>
                    ) : m.status === 'done' ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300 font-mono">
                        Final Score
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1856FF]/20 text-[#1856FF] border border-[#1856FF]/30 font-mono">
                        Scheduled
                      </span>
                    )}

                    <button
                      onClick={() => toggleReminder(m.id)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isReminded
                          ? 'border-[#1856FF] bg-[#1856FF] text-white shadow-md'
                          : 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                      }`}
                      title={isReminded ? "Reminder Active" : "Remind Me"}
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

      {/* Calendar Grid View */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DAYS.map(day => {
            const dayMatches = filteredMatches.filter(m => m.day === day.id);
            return (
              <div 
                key={day.id}
                className="liquid-glass-card p-4 rounded-2xl space-y-3"
              >
                <div className="border-b border-white/10 pb-2 flex items-baseline justify-between">
                  <h3 className="font-display font-bold text-lg uppercase text-white">{day.short}</h3>
                  <span className="text-xs text-[#1856FF] font-mono font-bold">{day.date}</span>
                </div>

                <div className="space-y-2">
                  {dayMatches.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic py-4 text-center">No fixtures</p>
                  ) : (
                    dayMatches.map(m => (
                      <div
                        key={m.id}
                        className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                          m.status === 'live' ? 'border-[#EA2143]/50 bg-[#EA2143]/10' : 'border-white/5 bg-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono font-bold">
                          <span>{m.time} IST</span>
                          <span className="text-[#1856FF] uppercase">{m.sport}</span>
                        </div>
                        <p className="font-bold text-white text-[11px] truncate">
                          {m.a} vs {m.b}
                        </p>
                        <span className="text-[10px] text-zinc-400 block truncate">{m.stage}</span>
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

// ----------------------------------------------------------------------------
// VIEW 3: SPORTS SHOWCASE
// ----------------------------------------------------------------------------
function SportsView({ navigateTo }) {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold tracking-widest uppercase text-[#1856FF] block font-mono">
          <span className="font-gu">રમતો</span> · Tournament Disciplines
        </span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
          Ten Sports, One Trophy
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
          Each sport maintains dedicated rules, tournament formats, and venue assignments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SPORTS.map((sport, idx) => (
          <div
            key={sport.id}
            onClick={() => navigateTo('sport', { sport: sport.id })}
            className="liquid-glass-card p-6 rounded-3xl cursor-pointer space-y-4 group"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs font-bold text-[#1856FF] px-2.5 py-1 rounded-lg bg-[#1856FF]/10 border border-[#1856FF]/20">
                DISCIPLINE #{String(idx + 1).padStart(2, '0')}
              </span>
              <div className="text-[#1856FF] group-hover:scale-110 transition-transform">
                <SportPictogram id={sport.id} className="w-10 h-10" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="font-display font-bold text-2xl uppercase tracking-wide text-white group-hover:text-[#1856FF] transition-colors">
                {sport.name}
              </h2>
              <p className="text-xs text-[#1856FF] font-semibold uppercase tracking-wider font-mono">
                {sport.format}
              </p>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {sport.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span>Ground: <strong className="text-white">{sport.venue}</strong></span>
              <span className="font-bold text-[#1856FF] group-hover:translate-x-1 transition-transform">Inspect →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// VIEW 4: SPORT DETAIL
// ----------------------------------------------------------------------------
function SportDetailView({ sportId, navigateTo, reminders, toggleReminder }) {
  const sport = SPORTS.find(s => s.id === sportId) || SPORTS[0];
  const sportMatches = MATCHES.filter(m => m.sport === sport.id);
  const rulesList = SPORT_RULES[sport.id] || [];

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigateTo('sports')}
        className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5"
      >
        <span>← Back to All Sports</span>
      </button>

      {/* Sport Hero Showcase */}
      <div className="liquid-glass-card p-8 sm:p-12 rounded-3xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1856FF]/15 text-[#1856FF] border border-[#1856FF]/30 font-mono">
              Playing Conditions
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-white leading-none">
              {sport.name}
            </h1>
            <p className="text-sm font-semibold text-[#1856FF] font-mono">{sport.format}</p>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">{sport.desc}</p>
            
            <div className="flex flex-wrap gap-4 pt-2 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white">
                <span className="text-zinc-400 block text-[10px] uppercase font-mono">Venue Ground</span>
                <strong>{sport.venue}</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white">
                <span className="text-zinc-400 block text-[10px] uppercase font-mono">Squad Format</span>
                <strong>{sport.players} Players</strong>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="w-32 h-32 rounded-3xl bg-white/5 border border-white/20 p-5 flex items-center justify-center text-[#1856FF] shadow-2xl">
              <SportPictogram id={sport.id} className="w-20 h-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Fixtures for this sport */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-2xl uppercase tracking-wide text-white">
          {sport.name} Fixtures
        </h2>
        
        {sportMatches.length === 0 ? (
          <p className="text-xs text-zinc-400">No fixtures currently listed.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sportMatches.map(m => (
              <div 
                key={m.id}
                className="liquid-glass-card p-4 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#1856FF] font-mono">
                    {DAYS.find(d => d.id === m.day)?.short} · {m.time} IST · {m.stage}
                  </span>
                  <h4 className="font-display font-bold text-lg text-white mt-0.5">{m.a} vs {m.b}</h4>
                  {m.score && <p className="text-xs font-mono text-[#07CA6B] mt-0.5">Score: {m.score}</p>}
                </div>
                <button
                  onClick={() => toggleReminder(m.id)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    reminders.includes(m.id)
                      ? 'border-[#1856FF] bg-[#1856FF] text-white'
                      : 'border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Icon name="bell" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sport Specific Rules */}
      <div className="liquid-glass-card p-6 rounded-3xl space-y-4">
        <h3 className="font-display font-bold text-xl uppercase tracking-wider text-white">
          Playing Rules from Official Rule Book
        </h3>
        <ul className="space-y-2.5">
          {rulesList.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
              <span className="w-5 h-5 rounded-md bg-[#1856FF]/20 text-[#1856FF] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 font-mono">
                {idx + 1}
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

// ----------------------------------------------------------------------------
// VIEW 5: OFFICIAL RULE BOOK
// ----------------------------------------------------------------------------
function RulebookView() {
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'general', label: 'General Rules' },
    { id: 'conduct', label: 'Code of Conduct' },
    ...SPORTS.map(s => ({ id: s.id, label: s.name }))
  ];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const results = [];

    RULES.forEach(r => {
      r.sections.forEach(sec => {
        sec.items.forEach(item => {
          if (item.toLowerCase().includes(q) || sec.title.toLowerCase().includes(q)) {
            results.push({ category: r.name, title: sec.title, rule: item });
          }
        });
      });
    });

    Object.keys(SPORT_RULES).forEach(sportKey => {
      const sportName = SPORTS.find(s => s.id === sportKey)?.name || sportKey;
      SPORT_RULES[sportKey].forEach(rule => {
        if (rule.toLowerCase().includes(q)) {
          results.push({ category: sportName, title: 'Playing Conditions', rule });
        }
      });
    });

    return results;
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-[#1856FF] block font-mono">
            <span className="font-gu">નિયમાવલી</span> · Official Regulations
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            Tournament Rule Book
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
            Official regulations incorporated from the Inter SMJV tournament PDF document.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Icon name="printer" className="w-4 h-4 text-[#1856FF]" />
          <span>Save / Print PDF</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Icon name="search" className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search rule book (e.g. 'super over', 'substitutions', 'walkover', 'kitchen')..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-[#101533] border border-white/15 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#1856FF] backdrop-blur-xl"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-3 text-xs text-zinc-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Search Results */}
      {searchResults ? (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1856FF] font-mono">
            Found {searchResults.length} matching rules for "{searchQuery}"
          </h3>
          {searchResults.length === 0 ? (
            <p className="text-xs text-zinc-400 py-6">No matching rules found. Try another term.</p>
          ) : (
            searchResults.map((res, i) => (
              <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#1856FF] block font-mono">
                  {res.category} · {res.title}
                </span>
                <p className="text-xs text-white leading-relaxed">{res.rule}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Tabs Rail */
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-white/10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#1856FF] text-white shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="liquid-glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-white">General Regulations</h2>
                {RULES[0].sections.map((sec, i) => (
                  <div key={i} className="space-y-2 border-b border-white/10 pb-4 last:border-b-0">
                    <h3 className="font-bold text-sm text-[#1856FF] uppercase tracking-wider">{sec.title}</h3>
                    <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-zinc-300">
                      {sec.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'conduct' && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-white">Code of Conduct & Fair Play</h2>
                {RULES[1].sections.map((sec, i) => (
                  <div key={i} className="space-y-2 border-b border-white/10 pb-4 last:border-b-0">
                    <h3 className="font-bold text-sm text-[#1856FF] uppercase tracking-wider">{sec.title}</h3>
                    <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-zinc-300">
                      {sec.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeTab !== 'general' && activeTab !== 'conduct' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-white">
                      {SPORTS.find(s => s.id === activeTab)?.name} Regulations
                    </h2>
                    <p className="text-xs text-[#1856FF] font-bold uppercase mt-0.5 font-mono">
                      {SPORTS.find(s => s.id === activeTab)?.format}
                    </p>
                  </div>
                  <SportPictogram id={activeTab} className="w-12 h-12 text-[#1856FF]" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Specific Conditions</h3>
                  <ol className="space-y-3">
                    {(SPORT_RULES[activeTab] || []).map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                        <span className="w-5 h-5 rounded-md bg-[#1856FF]/20 text-[#1856FF] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 font-mono">
                          {idx + 1}
                        </span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

// ----------------------------------------------------------------------------
// VIEW 6: VENUES & STAY
// ----------------------------------------------------------------------------
function VenuesView() {
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
        <span className="text-xs font-bold tracking-widest uppercase text-[#1856FF] block font-mono">
          <span className="font-gu">સ્થળ અને રહેવાની વ્યવસ્થા</span> · Ground & Hostel
        </span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
          Campus Grounds & Accommodation
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
          SMJV Hostel Campus at Karelibaug, Vadodara.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Grounds Schematic */}
        <div className="lg:col-span-7 space-y-6">
          <div className="liquid-glass-card p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Icon name="pin" className="w-4 h-4 text-[#EA2143]" />
                <span>Campus Ground Schematic</span>
              </div>
              <a 
                href="https://maps.google.com/?q=SMJV+Hostel+Vadodara" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#1856FF] hover:underline"
              >
                Google Maps →
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {VENUES.map(v => (
                <div key={v.id} className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#1856FF]/20 text-[#1856FF] flex items-center justify-center">
                      <Icon name={v.icon || 'flag'} className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="font-bold text-xs text-white">{v.name}</h4>
                  </div>
                  <p className="text-[11px] text-zinc-400">{v.detail}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 text-xs text-zinc-400">
              Address: <strong className="text-white">SMJV Hostel Branch, Karelibaug, Vadodara 390018</strong>
            </div>
          </div>

          <div className="liquid-glass-card p-6 rounded-3xl space-y-3">
            <h3 className="font-display font-bold text-xl uppercase tracking-wider text-white">Hostel Check-in Guidelines</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-300">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <strong className="text-white block mb-0.5">Check-in Desk</strong>
                <span>Block A Lobby · from 12 Dec, 9 AM</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <strong className="text-white block mb-0.5">Twin Sharing</strong>
                <span>Blocks A to D · Bedding provided</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <strong className="text-white block mb-0.5">Quiet Hours</strong>
                <span>11:00 PM to 6:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Room Lookup */}
        <div className="lg:col-span-5 space-y-6">
          <div className="liquid-glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1856FF] uppercase tracking-wider font-mono">
              <Icon name="bed" className="w-4 h-4" />
              <span>Room & Bed Assignment Lookup</span>
            </div>
            
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enter your student GR number (e.g. <code>SMJV26-0142</code>) to view assigned hostel block and bed.
            </p>

            <form onSubmit={handleLookup} className="space-y-3">
              <input
                type="text"
                placeholder="Enter GR No. (e.g. SMJV26-0142)"
                value={grSearch}
                onChange={e => setGrSearch(e.target.value)}
                className="w-full bg-[#0A0E23] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#1856FF]"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider btn-primary-glass"
              >
                Lookup Assignment
              </button>
            </form>

            {hasSearched && (
              <div className="pt-2">
                {roomResult ? (
                  <div className="p-4 rounded-2xl border border-[#07CA6B]/30 bg-[#07CA6B]/10 space-y-2">
                    <span className="text-[10px] font-bold text-[#07CA6B] uppercase tracking-widest block font-mono">
                      Confirmed Room Assignment
                    </span>
                    <h4 className="font-display font-bold text-2xl text-white">
                      {roomResult.block} · Room {roomResult.room}
                    </h4>
                    <p className="text-xs text-zinc-300">
                      {roomResult.bed} · Hostel Team: <strong>{roomResult.hostel}</strong>
                    </p>
                    <p className="text-[11px] text-zinc-400">Resident: {roomResult.name}</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border border-[#EA2143]/30 bg-[#EA2143]/10 text-xs text-zinc-300">
                    <p className="font-bold text-white">No assignment found for this GR number.</p>
                    <p className="text-zinc-400 mt-1">Please verify with the Block A reception desk upon arrival.</p>
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

// ----------------------------------------------------------------------------
// VIEW 7: MEALS TIMETABLE
// ----------------------------------------------------------------------------
function MealsView() {
  const [selectedDay, setSelectedDay] = useState('d3');
  const dayMeal = MEALS.find(m => m.day === selectedDay) || MEALS[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-[#1856FF] block font-mono">
            <span className="font-gu">ભોજન વ્યવસ્થા</span> · Mess Hall Menu
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            Five-Day Gujarati Dining Plan
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
            Breakfast 7:30–9:00 AM · Lunch 1:00–2:30 PM · Dinner 7:30–9:00 PM. Carry your player card to counter.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#07CA6B]/15 text-[#07CA6B] border border-[#07CA6B]/30 font-mono">
          Jain & Swaminarayan On Request
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {DAYS.map(d => (
          <button
            key={d.id}
            onClick={() => setSelectedDay(d.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedDay === d.id
                ? 'bg-[#1856FF] text-white shadow-lg'
                : 'border border-white/10 bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            Day {d.n} · {d.date}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Breakfast', time: dayMeal.breakfast.time, data: dayMeal.breakfast },
          { label: 'Lunch (Main Thali)', time: dayMeal.lunch.time, data: dayMeal.lunch },
          { label: 'Dinner & Live Counter', time: dayMeal.dinner.time, data: dayMeal.dinner },
        ].map((meal, idx) => (
          <div
            key={idx}
            className="liquid-glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#1856FF] block font-mono">Meal #{idx + 1}</span>
                  <h3 className="font-display font-bold text-xl uppercase tracking-wider text-white mt-0.5">{meal.label}</h3>
                </div>
                <span className="font-mono text-xs font-bold text-[#1856FF] px-2.5 py-1 rounded-lg bg-black/30 border border-white/10">
                  {meal.time}
                </span>
              </div>

              <ul className="space-y-2">
                {meal.data.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1856FF]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
              {meal.data.tags.map((t, i) => (
                <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 font-mono">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// VIEW 8: EXPLORE VADODARA
// ----------------------------------------------------------------------------
function ExploreView() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold tracking-widest uppercase text-[#1856FF] block font-mono">
          <span className="font-gu">વડોદરા દર્શન</span> · City Guide
        </span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
          Explore Vadodara
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
          Key landmarks and day trips situated in close proximity to the hostel campus.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLACES.map(place => (
          <div
            key={place.id}
            className="liquid-glass-card rounded-3xl overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={place.img} 
                  alt={place.alt} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-md border border-white/10 font-mono">
                  {place.dist}
                </span>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1856FF] text-white font-mono">
                  {place.cat}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-display font-bold text-xl uppercase tracking-wide text-white group-hover:text-[#1856FF] transition-colors">
                  {place.name}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {place.text}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(place.name + ' Vadodara')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-white text-center block transition-colors"
              >
                Directions →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// VIEW 9: NOTIFICATIONS CENTER
// ----------------------------------------------------------------------------
function NotificationsView({ readNotifs, setReadNotifs, markAllRead, navigateTo }) {
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
          <span className="text-xs font-bold tracking-widest uppercase text-[#1856FF] block font-mono">Live Updates</span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
            Official announcements, schedule changes, and tournament alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('notif-settings')}
            className="px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5"
          >
            <Icon name="spark" className="w-4 h-4 text-[#1856FF]" /> Settings
          </button>
          <button
            onClick={markAllRead}
            className="px-3.5 py-2 rounded-xl btn-primary-glass text-xs font-bold uppercase tracking-wider"
          >
            Mark All Read
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'all', label: 'All' },
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
                ? 'bg-[#1856FF] text-white shadow-md'
                : 'border border-white/10 bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-white/15 bg-white/5 text-xs text-zinc-400">
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
                    ? 'border-[#1856FF]/40 bg-[#1856FF]/10 shadow-lg'
                    : 'border-white/10 bg-[#101533]/70 hover:bg-white/5'
                } backdrop-blur-xl flex items-start gap-4`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isUnread ? 'bg-[#1856FF] text-white shadow-md' : 'bg-white/10 text-[#1856FF]'
                }`}>
                  <Icon name={NOTIF_ICONS[n.type] || 'info'} className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#1856FF] font-mono">
                      {NOTIF_LABELS[n.type] || 'Notice'} · {n.time}
                    </span>
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-[#EA2143]" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">{n.title}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">{n.body}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// VIEW 10: NOTIFICATION SETTINGS
// ----------------------------------------------------------------------------
function NotificationSettingsView({ addToast, navigateTo }) {
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
      addToast('Preferences Updated', 'Setting saved.', 'check');
      return next;
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-bold tracking-widest uppercase text-[#1856FF] block font-mono">Settings</span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-white mt-1">
          Notification Preferences
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Select which events trigger live push alerts on this device.
        </p>
      </div>

      <div className="liquid-glass-card p-6 rounded-3xl space-y-4">
        {[
          { key: 'matchAlerts', title: '15-Minute Pre-Match Reminders', desc: 'Alerts before your bookmarked matches start' },
          { key: 'mealAlerts', title: 'Mess Hall Meal Bell', desc: 'Reminders when breakfast, lunch, and dinner open' },
          { key: 'scheduleUpdates', title: 'Schedule Adjustments', desc: 'Weather delays and timing changes' },
          { key: 'venueRelocations', title: 'Pitch & Ground Moves', desc: 'Notifications if a match changes location' },
          { key: 'generalNotices', title: 'General & Cultural Night Announcements', desc: 'Garba auditions and hostel notices' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
            <div>
              <h4 className="font-bold text-sm text-white">{item.title}</h4>
              <p className="text-xs text-zinc-400">{item.desc}</p>
            </div>
            <button
              onClick={() => toggleSetting(item.key)}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 relative flex items-center ${
                settings[item.key] ? 'bg-[#1856FF]' : 'bg-white/20'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
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
          className="px-6 py-2.5 rounded-xl btn-primary-glass font-bold text-xs uppercase tracking-wider"
        >
          Return to Notifications
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// VIEW 11: PLAYER REGISTRATION
// ----------------------------------------------------------------------------
function RegisterView({ setPlayer, navigateTo, addToast }) {
  const [formData, setFormData] = useState({
    gr: 'SMJV26-0142',
    name: 'Aarav Mehta',
    phone: '98250 40142',
    email: 'aarav.mehta@smjv.edu',
    hostel: 'Narmada',
    tshirt: 'L',
    sports: ['Cricket', 'Volleyball'],
    acceptedTerms: true,
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const toggleSport = (sportName) => {
    setFormData(prev => {
      const exists = prev.sports.includes(sportName);
      const sports = exists 
        ? prev.sports.filter(s => s !== sportName) 
        : [...prev.sports, sportName];
      return { ...prev, sports };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.sports.length === 0) {
      alert('Please choose at least one sport.');
      return;
    }
    const newPlayer = {
      name: formData.name,
      gr: formData.gr,
      hostel: formData.hostel,
      sports: formData.sports,
      room: 'B-214',
      year: 'TY B.Com'
    };
    setPlayer(newPlayer);
    try {
      localStorage.setItem('smjv26.player', JSON.stringify(newPlayer));
    } catch (e) {}
    setIsSuccess(true);
    addToast('Player Registered', 'Digital accreditation card ready.', 'checkCircle');
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold tracking-widest uppercase text-[#1856FF] block font-mono">
          <span className="font-gu">નોંધણી</span> · Official Entry
        </span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
          Player Registration
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
          Register with your hostel credentials to obtain your official player pass.
        </p>
      </div>

      {isSuccess ? (
        <div className="liquid-glass-card p-8 rounded-3xl space-y-6 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#07CA6B] text-black flex items-center justify-center mx-auto shadow-xl">
            <Icon name="checkCircle" className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display font-bold text-3xl uppercase tracking-wide text-white">
              Player Entry Confirmed
            </h2>
            <p className="text-xs text-zinc-300">
              Accreditation pass for <strong>{formData.name}</strong> ({formData.gr}) is active.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <DigitalCardPreview data={formData} />
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2"
            >
              <Icon name="printer" className="w-4 h-4 text-[#1856FF]" /> Print Pass
            </button>
            <button
              onClick={() => navigateTo('dashboard')}
              className="px-6 py-2.5 rounded-xl btn-primary-glass font-bold text-xs uppercase tracking-wider"
            >
              Go to Dashboard →
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            
            {/* Step 1 */}
            <div className="liquid-glass-card p-6 rounded-3xl space-y-4">
              <h3 className="font-display font-bold text-lg uppercase tracking-wider text-[#1856FF] flex items-center gap-2">
                <span>01</span> <span>Student Information</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                    GR / Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.gr}
                    onChange={e => setFormData({ ...formData, gr: e.target.value })}
                    className="w-full bg-[#0A0E23] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#1856FF]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0A0E23] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#1856FF]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                    Hostel Branch *
                  </label>
                  <select
                    value={formData.hostel}
                    onChange={e => setFormData({ ...formData, hostel: e.target.value })}
                    className="w-full bg-[#0A0E23] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#1856FF]"
                  >
                    {HOSTELS.map(h => (
                      <option key={h} value={h}>{h} Hostel</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#0A0E23] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#1856FF]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="liquid-glass-card p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-lg uppercase tracking-wider text-[#1856FF] flex items-center gap-2">
                  <span>02</span> <span>Disciplines & Kit Size</span>
                </h3>
                <span className="text-[10px] text-zinc-400 font-mono">{formData.sports.length} chosen</span>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
                  Select sports:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SPORTS.map(s => {
                    const isSelected = formData.sports.includes(s.name);
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => toggleSport(s.name)}
                        className={`p-2.5 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#1856FF] text-white border-[#1856FF] shadow-md'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{s.name}</span>
                        {isSelected && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
                  T-Shirt Size *
                </label>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => setFormData({ ...formData, tshirt: size })}
                      className={`w-11 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                        formData.tshirt === size
                          ? 'bg-[#1856FF] text-white border-[#1856FF]'
                          : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="liquid-glass-card p-6 rounded-3xl space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.acceptedTerms}
                  onChange={e => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                  className="mt-0.5 rounded text-[#1856FF] focus:ring-[#1856FF]"
                />
                <span className="text-xs text-zinc-300 leading-snug">
                  I agree to tournament regulations and confirm bonafide SMJV hostel residency.
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider btn-primary-glass"
              >
                Create Digital Accreditation Pass
              </button>
            </div>

          </form>

          {/* Live Preview Column */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            <div className="text-xs font-bold tracking-widest uppercase text-[#1856FF] flex items-center gap-1.5 font-mono">
              <Icon name="spark" className="w-4 h-4" />
              <span>Live Accreditation Pass</span>
            </div>
            
            <DigitalCardPreview data={formData} />
          </div>

        </div>
      )}

    </div>
  );
}

// ----------------------------------------------------------------------------
// DIGITAL ID ACCREDITATION CARD
// ----------------------------------------------------------------------------
function DigitalCardPreview({ data }) {
  return (
    <div className="w-full max-w-sm rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-b from-[#141B44] via-[#0E1433] to-[#0A0E23] shadow-2xl relative text-white">
      {/* Top Banner */}
      <div className="p-4 bg-[#1856FF] text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white p-0.5 shadow-sm">
            <img src="inter_smjv_2026_vadodara_logo.svg" alt="Tournament Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-extrabold tracking-tight text-base">INTER SMJV 2026</span>
        </div>
        <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-black/40 text-white font-mono">
          PLAYER
        </span>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1856FF] border-2 border-white/30 flex items-center justify-center font-display font-bold text-xl text-white shadow-lg flex-shrink-0">
            {data.name.split(' ').map(n => n[0]).join('') || 'AM'}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#1856FF] font-mono block">
              {data.hostel || 'Narmada'} Hostel
            </span>
            <h3 className="font-display font-bold text-xl uppercase tracking-wide text-white truncate">
              {data.name || 'Your Name'}
            </h3>
            <span className="text-xs text-zinc-400 font-mono font-bold block mt-0.5">
              GR: {data.gr || 'SMJV26-0000'}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-400 block font-mono">
            Accredited Disciplines:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {data.sports && data.sports.length > 0 ? (
              data.sports.map((s, i) => (
                <span key={i} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-white">
                  {s}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-zinc-400 italic">No sport selected</span>
            )}
          </div>
        </div>

        {/* Barcode */}
        <div className="pt-2 border-t border-white/10 space-y-1">
          <div className="h-8 flex items-center justify-between opacity-80 px-2 bg-white/5 rounded-lg py-1">
            {[...Array(32)].map((_, i) => (
              <span 
                key={i} 
                className="bg-white inline-block h-full" 
                style={{ width: (i % 3 === 0 ? '3px' : i % 2 === 0 ? '1px' : '2px') }} 
              />
            ))}
          </div>
          <div className="flex justify-between items-center text-[8px] font-mono tracking-widest text-zinc-400 uppercase">
            <span>OFFICIAL PASS · VADODARA 2026</span>
            <span>SECURE NFC/ID</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// VIEW 12: DASHBOARD
// ----------------------------------------------------------------------------
function DashboardView({ player, navigateTo, reminders, toggleReminder }) {
  const myMatches = MATCHES.filter(m => player.sports.some(s => s.toLowerCase() === m.sport));

  return (
    <div className="space-y-8">
      <div className="liquid-glass-card p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-[#1856FF] block font-mono">
            <span className="font-gu">તમારું ડેશબોર્ડ</span> · Student Portal
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-white mt-1">
            Welcome, {player.name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
            Day 3 of 5 · <strong>{player.hostel} Hostel</strong> · GR: {player.gr}
          </p>
        </div>

        <button
          onClick={() => navigateTo('register')}
          className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-white"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-2xl uppercase tracking-wide text-white">
                My Scheduled Matches
              </h2>
              <button onClick={() => navigateTo('schedule')} className="text-xs font-bold text-[#1856FF] hover:underline">
                Full Schedule →
              </button>
            </div>

            {myMatches.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6">No matches scheduled for your selected sports.</p>
            ) : (
              <div className="space-y-3">
                {myMatches.map(m => (
                  <div
                    key={m.id}
                    className="liquid-glass-card p-4 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#1856FF] font-mono">
                        {DAYS.find(d => d.id === m.day)?.short} · {m.time} IST · {m.stage}
                      </span>
                      <h4 className="font-display font-bold text-lg text-white mt-0.5">{m.a} vs {m.b}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Venue: {VENUES.find(v => v.id === m.venue)?.name}</p>
                    </div>

                    <button
                      onClick={() => toggleReminder(m.id)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        reminders.includes(m.id) ? 'bg-[#1856FF] text-white border-[#1856FF]' : 'border-white/10 text-zinc-400'
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

        <div className="lg:col-span-4 space-y-6">
          <div className="liquid-glass-card p-6 rounded-3xl space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-[#1856FF] block font-mono">Accommodation</span>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-xs font-bold text-white block">Block B · Room B-214</span>
              <span className="text-xs text-zinc-400 block font-mono">Bed #2 · Twin Sharing</span>
            </div>
            <button
              onClick={() => navigateTo('venues')}
              className="text-xs font-bold text-[#1856FF] hover:underline block pt-1"
            >
              Ground Map & Helpline →
            </button>
          </div>

          <div className="liquid-glass-card p-6 rounded-3xl space-y-2">
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-400 block mb-2 font-mono">Shortcuts</span>
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

// ----------------------------------------------------------------------------
// VIEW 13: LOGIN
// ----------------------------------------------------------------------------
function LoginView({ navigateTo, addToast }) {
  const [gr, setGr] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!gr.trim()) {
      alert('Please enter your GR Number or Email');
      return;
    }
    addToast('Signed In', 'Welcome back to player portal!', 'checkCircle');
    navigateTo('dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="liquid-glass-card p-8 rounded-3xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold tracking-widest uppercase text-[#1856FF] block font-mono">Player Portal</span>
          <h1 className="font-display font-extrabold text-3xl uppercase tracking-wider text-white">Sign In</h1>
          <p className="text-xs text-zinc-400">Use your registered GR number or email.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
              GR Number or Email *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SMJV26-0142"
              value={gr}
              onChange={e => setGr(e.target.value)}
              className="w-full bg-[#0A0E23] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#1856FF]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full bg-[#0A0E23] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#1856FF]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider btn-primary-glass"
          >
            Access Dashboard
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400 pt-2 border-t border-white/10">
          <span>New student player? </span>
          <button onClick={() => navigateTo('register')} className="text-[#1856FF] font-bold hover:underline">
            Register Player Card
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// VIEW 14: CONTACT & FAQ
// ----------------------------------------------------------------------------
function ContactView({ addToast }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold tracking-widest uppercase text-[#1856FF] block font-mono">
          <span className="font-gu">સંપર્ક</span> · Contact & FAQ
        </span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
          Festival Help & Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
          24-hour tournament desk situated beside the Main Ground pavilion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-6 space-y-4">
          <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-white">
            Organizing Committee Directory
          </h2>

          <div className="space-y-3">
            {CONTACTS.map((c, i) => (
              <div key={i} className="liquid-glass-card p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#1856FF] block font-mono">{c.role}</span>
                  <h4 className="font-bold text-sm text-white">{c.name}</h4>
                  <span className="text-xs text-zinc-400 block">{c.email}</span>
                </div>
                <a
                  href={`tel:${c.phone}`}
                  className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono font-bold text-[#1856FF]"
                >
                  {c.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-white">
            Frequently Asked Questions
          </h2>

          <div className="space-y-2.5">
            {FAQ.map((item, idx) => (
              <div 
                key={idx}
                className="liquid-glass-card rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-3 hover:text-[#1856FF] transition-colors"
                >
                  <span>{item.q}</span>
                  <span className="text-[#1856FF] font-display text-lg">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-zinc-300 leading-relaxed border-t border-white/5 pt-2">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// VIEW 15: STYLE GUIDE (Glassmorphism Foundations)
// ----------------------------------------------------------------------------
function StyleGuideView() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold tracking-widest uppercase text-[#1856FF] block font-mono">Foundations</span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white mt-1">
          Design System Inspired by Glassmorphism
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
          Frosted glass effect with translucent layers, subtle blur, and luminous borders for depth and modern elegance.
        </p>
      </div>

      {/* Official Color Tokens */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-xl uppercase tracking-wide text-white">Official Color Tokens</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { name: 'Primary', hex: '#1856FF', role: 'CTA & Accent' },
            { name: 'Secondary', hex: '#3A344E', role: 'Secondary Accents' },
            { name: 'Success', hex: '#07CA6B', role: 'Completed / Safe' },
            { name: 'Warning', hex: '#E89558', role: 'Upcoming Alerts' },
            { name: 'Danger', hex: '#EA2143', role: 'Live / Urgent' },
            { name: 'Surface', hex: '#FFFFFF', role: 'Cards & Panels' },
            { name: 'Text', hex: '#141414', role: 'High Contrast Copy' },
          ].map((c, i) => (
            <div key={i} className="liquid-glass-card rounded-2xl overflow-hidden">
              <div className="h-16" style={{ backgroundColor: c.hex }} />
              <div className="p-3 text-xs space-y-0.5">
                <strong className="text-white block">{c.name}</strong>
                <span className="text-[10px] text-zinc-400 font-mono block">{c.hex}</span>
                <span className="text-[9px] text-[#1856FF] block font-semibold">{c.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Tokens */}
      <div className="liquid-glass-card p-6 rounded-3xl space-y-4">
        <h3 className="font-display font-bold text-xl uppercase tracking-wide text-white">Typography Scale</h3>
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Primary & Display · Plus Jakarta Sans</span>
            <p className="font-display font-extrabold text-3xl sm:text-4xl uppercase text-white mt-0.5">INTER SMJV 2026</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Data & Monospace · JetBrains Mono</span>
            <p className="font-mono text-sm text-[#1856FF] font-bold mt-0.5">GR: SMJV26-0142 · 14–18 DEC 2026 · 10:30 IST</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Cultural Script · Noto Sans Gujarati</span>
            <p className="font-gu text-xl text-white font-bold mt-0.5">આંતર હોસ્ટેલ ખેલ મહોત્સવ, વડોદરા</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// MOUNT ROOT
// ----------------------------------------------------------------------------
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
