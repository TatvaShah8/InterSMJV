// ============================================================================
// INTER SMJV 2026 — Master Application Orchestrator & View Switcher
// Fully Compartmentalized Architecture with React Error Boundaries for Fault Isolation
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';

// Data & Utilities
import { NOTIFS, MATCHES, DEMO_PLAYER } from './data/tournamentData.js';
import { getUserSession } from './utils/cookie.js';
import { parseRoute, getRoutePath, getRouteTitle } from './utils/router.js';

// Common Compartmentalized Components
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import MobileNav from './components/common/MobileNav.jsx';
import ToastContainer from './components/common/ToastContainer.jsx';
import IdCardModal from './components/IdCardModal.jsx';

// Modular Page Views
import HomeView from './pages/HomeView.jsx';
import ScheduleView from './pages/ScheduleView.jsx';
import SportsView from './pages/SportsView.jsx';
import SportDetailView from './pages/SportDetailView.jsx';
import RulebookView from './pages/RulebookView.jsx';
import VenuesView from './pages/VenuesView.jsx';
import MealsView from './pages/MealsView.jsx';
import ExploreView from './pages/ExploreView.jsx';
import NotificationsView from './pages/NotificationsView.jsx';
import NotificationSettingsView from './pages/NotificationSettingsView.jsx';
import RegisterView from './pages/RegisterView.jsx';
import DashboardView from './pages/DashboardView.jsx';
import LoginView from './pages/LoginView.jsx';
import ContactView from './pages/ContactView.jsx';
import StyleGuideView from './pages/StyleGuideView.jsx';

export default function App() {
  // Navigation & Routing State (Synchronized with Browser Address Bar & History API)
  const initialRoute = useMemo(() => {
    if (typeof window !== 'undefined') {
      return parseRoute(window.location.pathname, window.location.hash);
    }
    return { view: 'home', sport: 'cricket' };
  }, []);

  const [activeView, setActiveView] = useState(initialRoute.view);
  const [selectedSport, setSelectedSport] = useState(initialRoute.sport || 'cricket');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);

  // Theme State (Dark Ground as default, Light mode supported)
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
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toast Notification System
  const [toasts, setToasts] = useState([]);
  const addToast = (title, message, iconName = 'bell', type = 'info') => {
    const id = Date.now() + Math.random().toString();
    const newToast = { id, title, message, iconName, type };
    setToasts(prev => [newToast, ...prev.slice(0, 3)]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5200);
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
          'Reminder Set! 🔔',
          `We will alert you 15 minutes before ${match ? match.a + ' vs ' + match.b : 'this match'}.`,
          'bell'
        );
      } else {
        addToast(
          'Reminder Removed',
          `Alert canceled for ${match ? match.a + ' vs ' + match.b : 'this match'}.`,
          'bell'
        );
      }
      return next;
    });
  };

  // Player Registration Profile (Restored from browser cookies or storage)
  const [player, setPlayer] = useState(() => {
    try {
      const sessionData = getUserSession();
      if (sessionData && sessionData.player && (sessionData.player.name || sessionData.player.email)) {
        return sessionData.player;
      }
      const stored = localStorage.getItem('smjv26.player');
      return stored ? JSON.parse(stored) : DEMO_PLAYER;
    } catch (e) {
      return DEMO_PLAYER;
    }
  });

  // Countdown Timer
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

  // Listen to Browser Back / Forward buttons & URL changes
  useEffect(() => {
    const handlePopState = () => {
      const route = parseRoute(window.location.pathname, window.location.hash);
      setActiveView(route.view);
      if (route.sport) setSelectedSport(route.sport);
      document.title = getRouteTitle(route.view, { sport: route.sport });
      setIsMobileMenuOpen(false);
      setIsNotifDropdownOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    // Initial page title sync
    const currentRoute = parseRoute(window.location.pathname, window.location.hash);
    document.title = getRouteTitle(currentRoute.view, { sport: currentRoute.sport });

    // Canonicalize URL if opened via hash or /pages/... prefix
    const canonicalPath = getRoutePath(currentRoute.view, { sport: currentRoute.sport });
    if (window.location.pathname !== canonicalPath && !window.location.hash) {
      window.history.replaceState(
        { view: currentRoute.view, sport: currentRoute.sport },
        document.title,
        canonicalPath
      );
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Navigation Handler with Browser Address Bar & History Synchronization
  const navigateTo = (view, extra = {}, replace = false) => {
    setActiveView(view);
    const targetSport = extra.sport || (view === 'sport' ? selectedSport : 'cricket');
    if (extra.sport) setSelectedSport(extra.sport);
    setIsMobileMenuOpen(false);
    setIsNotifDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update browser URL and document title
    if (typeof window !== 'undefined') {
      const targetPath = getRoutePath(view, { ...extra, sport: targetSport });
      const targetTitle = getRouteTitle(view, { ...extra, sport: targetSport });
      document.title = targetTitle;

      try {
        if (window.location.pathname !== targetPath) {
          if (replace) {
            window.history.replaceState({ view, sport: targetSport }, targetTitle, targetPath);
          } else {
            window.history.pushState({ view, sport: targetSport }, targetTitle, targetPath);
          }
        }
      } catch (err) {
        console.warn('History API state update failed:', err);
      }
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#070B1E] text-[#F7F4EE]' : 'bg-[#F3F4F9] text-[#0A0F2C]'} font-sans selection:bg-saffron selection:text-white transition-colors duration-200 pb-20 md:pb-0`}>
      
      {/* Compartmentalized Header */}
      <ErrorBoundary name="Header Navigation">
        <Header
          activeView={activeView}
          theme={theme}
          toggleTheme={toggleTheme}
          unreadCount={unreadCount}
          readNotifs={readNotifs}
          setReadNotifs={setReadNotifs}
          markAllRead={markAllRead}
          navigateTo={navigateTo}
          isNotifDropdownOpen={isNotifDropdownOpen}
          setIsNotifDropdownOpen={setIsNotifDropdownOpen}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          player={player}
          onOpenIdCard={() => setIsIdCardOpen(true)}
        />
      </ErrorBoundary>

      {/* Toast Alert System */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Main View Container with Per-Page Compartmentalization */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* 1. Home View */}
        {activeView === 'home' && (
          <ErrorBoundary name="Home Portal" onNavigateHome={() => navigateTo('home')}>
            <HomeView 
              navigateTo={navigateTo} 
              timeLeft={timeLeft} 
              reminders={reminders} 
              toggleReminder={toggleReminder} 
            />
          </ErrorBoundary>
        )}

        {/* 2. Schedule View */}
        {activeView === 'schedule' && (
          <ErrorBoundary name="Match Schedule" onNavigateHome={() => navigateTo('home')}>
            <ScheduleView 
              reminders={reminders} 
              toggleReminder={toggleReminder} 
              navigateTo={navigateTo} 
            />
          </ErrorBoundary>
        )}

        {/* 3. Sports Catalog View */}
        {activeView === 'sports' && (
          <ErrorBoundary name="Sports Catalog" onNavigateHome={() => navigateTo('home')}>
            <SportsView navigateTo={navigateTo} />
          </ErrorBoundary>
        )}

        {/* 4. Sport Detail View */}
        {activeView === 'sport' && (
          <ErrorBoundary name="Sport Details" onNavigateHome={() => navigateTo('sports')}>
            <SportDetailView 
              sportId={selectedSport} 
              navigateTo={navigateTo} 
              reminders={reminders} 
              toggleReminder={toggleReminder} 
            />
          </ErrorBoundary>
        )}

        {/* 5. Rulebook View */}
        {activeView === 'rulebook' && (
          <ErrorBoundary name="Rule Book" onNavigateHome={() => navigateTo('home')}>
            <RulebookView />
          </ErrorBoundary>
        )}

        {/* 6. Venues & Campus Grounds View */}
        {activeView === 'venues' && (
          <ErrorBoundary name="Venues & Stay" onNavigateHome={() => navigateTo('home')}>
            <VenuesView />
          </ErrorBoundary>
        )}

        {/* 7. Mess & Meals Timetable View */}
        {activeView === 'meals' && (
          <ErrorBoundary name="Meals Timetable" onNavigateHome={() => navigateTo('home')}>
            <MealsView />
          </ErrorBoundary>
        )}

        {/* 8. Explore Vadodara View */}
        {activeView === 'explore' && (
          <ErrorBoundary name="Explore Vadodara" onNavigateHome={() => navigateTo('home')}>
            <ExploreView />
          </ErrorBoundary>
        )}

        {/* 9. Notifications Bulletin View */}
        {activeView === 'notifications' && (
          <ErrorBoundary name="Notification Center" onNavigateHome={() => navigateTo('home')}>
            <NotificationsView 
              readNotifs={readNotifs} 
              setReadNotifs={setReadNotifs} 
              markAllRead={markAllRead} 
              navigateTo={navigateTo} 
            />
          </ErrorBoundary>
        )}

        {/* 10. Notification Settings View */}
        {activeView === 'notif-settings' && (
          <ErrorBoundary name="Notification Preferences" onNavigateHome={() => navigateTo('notifications')}>
            <NotificationSettingsView 
              addToast={addToast} 
              navigateTo={navigateTo} 
            />
          </ErrorBoundary>
        )}

        {/* 11. Player Registration & Verification View */}
        {activeView === 'register' && (
          <ErrorBoundary name="Player Registration" onNavigateHome={() => navigateTo('home')}>
            <RegisterView 
              setPlayer={setPlayer} 
              navigateTo={navigateTo} 
              addToast={addToast} 
              onOpenIdCard={() => setIsIdCardOpen(true)}
            />
          </ErrorBoundary>
        )}

        {/* 12. Player Dashboard View */}
        {activeView === 'dashboard' && (
          <ErrorBoundary name="Player Dashboard" onNavigateHome={() => navigateTo('home')}>
            <DashboardView 
              player={player} 
              navigateTo={navigateTo} 
              reminders={reminders} 
              toggleReminder={toggleReminder} 
              onOpenIdCard={() => setIsIdCardOpen(true)}
            />
          </ErrorBoundary>
        )}

        {/* 13. Login View */}
        {activeView === 'login' && (
          <ErrorBoundary name="Player Login" onNavigateHome={() => navigateTo('home')}>
            <LoginView 
              navigateTo={navigateTo} 
              addToast={addToast} 
              setPlayer={setPlayer}
              onOpenIdCard={() => setIsIdCardOpen(true)}
            />
          </ErrorBoundary>
        )}

        {/* 14. Contact & Emergency View */}
        {activeView === 'contact' && (
          <ErrorBoundary name="Contact & Emergency" onNavigateHome={() => navigateTo('home')}>
            <ContactView addToast={addToast} />
          </ErrorBoundary>
        )}

        {/* 15. Style Guide & Design System View */}
        {activeView === 'styleguide' && (
          <ErrorBoundary name="Design System" onNavigateHome={() => navigateTo('home')}>
            <StyleGuideView />
          </ErrorBoundary>
        )}

      </main>

      {/* Compartmentalized Footer */}
      <ErrorBoundary name="Footer">
        <Footer navigateTo={navigateTo} />
      </ErrorBoundary>

      {/* Mobile App Bar */}
      <MobileNav 
        activeView={activeView} 
        navigateTo={navigateTo} 
        unreadCount={unreadCount} 
      />

      {/* Interactive Official Digital Accreditation ID Card Modal */}
      <IdCardModal
        isOpen={isIdCardOpen}
        onClose={() => setIsIdCardOpen(false)}
        player={player}
      />

    </div>
  );
}
