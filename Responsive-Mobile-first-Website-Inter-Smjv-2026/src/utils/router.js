// ============================================================================
// INTER SMJV 2026 — Browser URL Routing & History Sync Utility
// Supports clean URLs (/schedule, /rulebook, /contact, /sports/cricket)
// as well as /pages/:page aliases and hash fallbacks.
// ============================================================================

const ROUTE_ALIASES = {
  '': 'home',
  'home': 'home',
  'schedule': 'schedule',
  'matches': 'schedule',
  'sports': 'sports',
  'sport': 'sports',
  'rulebook': 'rulebook',
  'rules': 'rulebook',
  'rule-book': 'rulebook',
  'venues': 'venues',
  'venue': 'venues',
  'grounds': 'venues',
  'stay': 'venues',
  'meals': 'meals',
  'mess': 'meals',
  'food': 'meals',
  'explore': 'explore',
  'vadodara': 'explore',
  'notifications': 'notifications',
  'notifs': 'notifications',
  'alerts': 'notifications',
  'notif-settings': 'notif-settings',
  'register': 'register',
  'registration': 'register',
  'dashboard': 'dashboard',
  'profile': 'dashboard',
  'login': 'login',
  'signin': 'login',
  'contact': 'contact',
  'contact-us': 'contact',
  'emergency': 'contact',
  'help': 'contact',
  'styleguide': 'styleguide',
  'design-system': 'styleguide'
};

const VIEW_TITLES = {
  home: 'INTER SMJV 2026 — Vadodara Inter-Hostel Athletic Festival',
  schedule: 'Match Schedule & Fixtures · INTER SMJV 2026',
  sports: 'All 10 Sports Catalog · INTER SMJV 2026',
  sport: 'Sport Details & Match Lineups · INTER SMJV 2026',
  rulebook: 'Official Rule Book & Guidelines · INTER SMJV 2026',
  venues: 'Campus Grounds & Room Lookup · INTER SMJV 2026',
  meals: '5-Day Gujarati Mess Timetable · INTER SMJV 2026',
  explore: 'Explore Vadodara Landmarks · INTER SMJV 2026',
  notifications: 'Notification Center & Live Feed · INTER SMJV 2026',
  'notif-settings': 'Notification Preferences · INTER SMJV 2026',
  register: 'Official Player Registration & ID Card · INTER SMJV 2026',
  dashboard: 'Player Dashboard & Digital ID · INTER SMJV 2026',
  login: 'Player Sign In · INTER SMJV 2026',
  contact: 'Contact & 24/7 Helpline · INTER SMJV 2026',
  styleguide: 'Design System & UI Components · INTER SMJV 2026'
};

/**
 * Parses current location pathname or hash into { view, sport }
 */
export function parseRoute(pathname = '', hash = '') {
  let raw = '';

  // 1. Check hash first if present (e.g. #/schedule or #rulebook)
  if (hash && hash.startsWith('#')) {
    raw = hash.replace(/^#\/?/, '').trim();
  }

  // 2. Otherwise use pathname
  if (!raw && pathname) {
    raw = pathname.trim();
  }

  // Normalize: remove query strings, decode URI, strip leading/trailing slashes
  raw = raw.split('?')[0].split('#')[0];
  raw = decodeURIComponent(raw).replace(/^\/+|\/+$/g, '').toLowerCase();

  // Strip 'pages/' prefix if typed (e.g. /pages/schedule or /pages/contact)
  if (raw.startsWith('pages/')) {
    raw = raw.slice('pages/'.length).trim();
  } else if (raw === 'pages') {
    return { view: 'home', sport: 'cricket' };
  }

  if (!raw || raw === 'index.html' || raw === 'home') {
    return { view: 'home', sport: 'cricket' };
  }

  // Check sport detail: sports/cricket or sport/cricket
  if (raw.startsWith('sports/') || raw.startsWith('sport/')) {
    const parts = raw.split('/');
    const sportId = parts[1] || 'cricket';
    return { view: 'sport', sport: sportId };
  }

  // Check known route alias
  if (ROUTE_ALIASES[raw]) {
    return { view: ROUTE_ALIASES[raw], sport: 'cricket' };
  }

  // If subsegment like notifications/settings
  if (raw === 'notifications/settings') {
    return { view: 'notif-settings', sport: 'cricket' };
  }

  // Default fallback
  return { view: 'home', sport: 'cricket' };
}

/**
 * Returns canonical browser URL path for a view
 */
export function getRoutePath(view, extra = {}) {
  if (view === 'sport') {
    const sportId = extra.sport || 'cricket';
    return `/sports/${sportId}`;
  }
  if (!view || view === 'home') {
    return '/';
  }
  return `/${view}`;
}

/**
 * Returns document title for a given view
 */
export function getRouteTitle(view, extra = {}) {
  if (view === 'sport' && extra.sport) {
    const capital = extra.sport.charAt(0).toUpperCase() + extra.sport.slice(1);
    return `${capital} · Match Lineup & Rules · INTER SMJV 2026`;
  }
  return VIEW_TITLES[view] || VIEW_TITLES.home;
}
