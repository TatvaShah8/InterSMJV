/* INTER SMJV 2026 — interaction layer */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return ESC[c]; }); }

  var storage = null;
  try { storage = window.localStorage; storage.getItem('smjv26.probe'); } catch (err) { storage = null; }

  var store = {
    get: function (key, fallback) {
      if (!storage) return fallback;
      try {
        var raw = storage.getItem('smjv26.' + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      if (!storage) return;
      try { storage.setItem('smjv26.' + key, JSON.stringify(value)); } catch (e) { /* memory only */ }
    }
  };

  var state = {
    view: 'home',
    sport: 'cricket',
    schedule: { sport: 'all', day: 'all', venue: 'all', team: '', mode: 'list' },
    mealDay: 'd3',
    notifFilter: 'all',
    ruleTab: 'general',
    ruleQuery: '',
    read: new Set(store.get('read', [])),
    reminders: new Set(store.get('reminders', [])),
    settings: store.get('settings', { match: true, meal: true, schedule: true, venue: true, general: false }),
    player: store.get('player', null),
    photo: ''
  };

  var dayIndex = function (id) { return DAYS.findIndex(function (d) { return d.id === id; }); };
  var dayById = function (id) { return DAYS.find(function (d) { return d.id === id; }); };
  var venueById = function (id) { return VENUES.find(function (v) { return v.id === id; }); };
  var sportById = function (id) { return SPORTS.find(function (s) { return s.id === id; }); };
  var sportName = function (id) { var s = sportById(id); return s ? s.name : id; };

  function sortedMatches() {
    return MATCHES.slice().sort(function (a, b) {
      var d = dayIndex(a.day) - dayIndex(b.day);
      return d !== 0 ? d : a.time.localeCompare(b.time);
    });
  }
  function unreadCount() {
    return NOTIFS.filter(function (n) { return n.unread && !state.read.has(n.id); }).length;
  }
  function reduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ------------------------------------------------------------------ theme */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = $('#themeBtn');
    if (btn) {
      btn.innerHTML = '<svg class="od-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        (theme === 'dark'
          ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>'
          : '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>') + '</svg>';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    store.set('theme', theme);
  }

  /* ----------------------------------------------------------------- toasts */
  function toast(title, message, iconName) {
    var region = $('#toasts');
    if (!region) return;
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<span class="toast-icon">' + icon(iconName || 'bell') + '</span>' +
      '<div class="toast-body"><b></b><span></span></div>' +
      '<button class="toast-close" type="button" aria-label="Dismiss notification">' + icon('close') + '</button>';
    t.querySelector('b').textContent = title;
    var msg = t.querySelector('.toast-body span');
    if (msg) msg.textContent = message;
    region.appendChild(t);
    var remove = function () {
      if (t.classList.contains('is-leaving')) return;
      t.classList.add('is-leaving');
      window.setTimeout(function () { t.remove(); }, 240);
    };
    t.querySelector('.toast-close').addEventListener('click', remove);
    window.setTimeout(remove, 5600);
  }

  /* ------------------------------------------------------------------ views */
  var TITLES = {
    home: 'Home', login: 'Sign in', register: 'Registration', dashboard: 'Dashboard',
    rulebook: 'Rule book', schedule: 'Match schedule', sports: 'Sports', sport: 'Sport',
    venues: 'Venue & stay', meals: 'Meals', explore: 'Explore Vadodara',
    notifications: 'Notifications', 'notif-settings': 'Notification settings',
    contact: 'Contact & FAQ', styleguide: 'Style guide'
  };
  var NAV_ALIAS = { sport: 'sports', 'notif-settings': 'notifications' };

  var sections = [];

  function go(name, opts) {
    opts = opts || {};
    if (name === 'sport' && opts.sport) state.sport = opts.sport;
    if (name === 'schedule' && opts.sport) state.schedule.sport = opts.sport;
    if (name === 'rulebook' && opts.ruleTab) { state.ruleTab = opts.ruleTab; state.ruleQuery = ''; }
    state.view = name;

    sections.forEach(function (s) { s.hidden = s.dataset.view !== name; });

    var navKey = NAV_ALIAS[name] || name;
    $$('[data-nav]').forEach(function (b) {
      if (b.dataset.nav === navKey) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });

    var renderers = {
      home: renderHome,
      schedule: renderSchedule,
      sports: renderSportsPage,
      sport: renderSportPageDetail,
      rulebook: renderRulebook,
      notifications: renderNotifications,
      'notif-settings': renderSettings,
      meals: renderMeals,
      explore: renderExplore,
      venues: renderVenues,
      contact: renderContact,
      styleguide: renderStyleGuide,
      dashboard: renderDashboard,
      register: renderRegister,
      login: resetLogin
    };
    if (renderers[name]) renderers[name]();

    closeMenu();
    closeNotifPopover();
    try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch (err) { window.scrollTo(0, 0); }
    document.title = (TITLES[name] ? TITLES[name] + ' · ' : '') + 'INTER SMJV 2026';

    var heading = $('.view:not([hidden]) h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      try { heading.focus({ preventScroll: true }); } catch (e) { heading.focus(); }
    }
  }

  /* ------------------------------------------------------------------- home */
  function sportTile(s, i) {
    return '<button class="sport-tile" data-go="sport" data-sport="' + s.id + '" aria-label="' + esc(s.name) + ': ' + esc(s.format) + '">' +
      '<span class="sport-tile-top"><span class="idx">' + String(i + 1).padStart(2, '0') + '</span>' + sportArt(s.id) + '</span>' +
      '<span class="sport-tile-foot"><span class="sport-name">' + esc(s.name) + '</span>' +
      '<span class="sport-meta"><span>' + esc(s.venue) + '</span>' + icon('arrow') + '</span></span>' +
      '</button>';
  }

  function renderHome() {
    var grid = $('#home-sports');
    if (grid) grid.innerHTML = SPORTS.map(sportTile).join('');

    var next = $('#home-next');
    if (next) {
      var live = sortedMatches().filter(function (m) { return m.day === 'd3' && m.status !== 'done'; }).slice(0, 3);
      next.innerHTML = live.map(function (m) { return schedRow(m); }).join('');
    }

    var places = $('#home-places');
    if (places) {
      places.innerHTML = PLACES.slice(0, 3).map(function (p) {
        return '<button class="home-place" data-go="explore">' +
          '<img src="' + p.img + '" alt="' + esc(p.alt) + '" width="74" height="56" loading="lazy">' +
          '<span><b>' + esc(p.name) + '</b><span>' + esc(p.cat) + ' · ' + esc(p.dist) + ' from the gate</span></span>' +
          icon('arrowUpRight') + '</button>';
      }).join('');
    }

    var partners = $('#partner-grid');
    if (partners) {
      partners.innerHTML = PARTNERS.map(function (p) {
        return '<div class="partner"><span>' + esc(p.cat) + '</span><b>' + esc(p.name) + '</b></div>';
      }).join('');
    }

    reveal('#home-sports .sport-tile');
  }

  /* --------------------------------------------------------------- schedule */
  function statusBadge(m) {
    if (m.status === 'live') return '<span class="badge badge-live">Live</span>';
    if (m.status === 'done') return '<span class="badge badge-done">Completed</span>';
    return '<span class="badge badge-upcoming">Upcoming</span>';
  }

  function schedRow(m) {
    var s = sportById(m.sport);
    var v = venueById(m.venue);
    var d = dayById(m.day);
    var on = state.reminders.has(m.id);
    var scoreLine = m.score
      ? '<div class="sched-score">' + esc(m.score) + (m.note ? ' · ' + esc(m.note) : '') + '</div>'
      : (m.note ? '<div class="sched-score">' + esc(m.note) + '</div>' : '');
    return '<article class="sched-row' + (m.status === 'live' ? ' is-live' : '') + '">' +
      '<div class="sched-time"><b>' + esc(m.time) + '</b><span>' + d.short + ' ' + d.date.split(' ')[0] + '</span></div>' +
      '<div class="sched-main">' +
        '<div class="sched-teams">' + esc(m.a) + ' <span class="vs">vs</span> ' + esc(m.b) + '</div>' +
        '<div class="sched-sub"><span>' + esc(s ? s.name : m.sport) + '</span><span>' + esc(v ? v.name : m.venue) + '</span><span>' + esc(m.stage) + '</span></div>' +
        scoreLine +
      '</div>' +
      '<div class="sched-status">' + statusBadge(m) + '</div>' +
      '<button class="sched-remind" type="button" data-remind="' + m.id + '" aria-pressed="' + on + '" ' +
        'aria-label="' + (on ? 'Remove reminder for ' : 'Set a reminder for ') + esc(m.a) + ' versus ' + esc(m.b) + '" title="' + (on ? 'Reminder set' : 'Remind me') + '">' +
        icon('bell') + '</button>' +
      '</article>';
  }

  function buildScheduleFilters() {
    var sportSel = $('#sch-sport');
    var venueSel = $('#sch-venue');
    if (sportSel && !sportSel.dataset.ready) {
      sportSel.innerHTML = '<option value="all">All sports</option>' +
        SPORTS.map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + '</option>'; }).join('');
      sportSel.dataset.ready = '1';
    }
    if (venueSel && !venueSel.dataset.ready) {
      venueSel.innerHTML = '<option value="all">All venues</option>' +
        VENUES.map(function (v) { return '<option value="' + v.id + '">' + esc(v.name) + '</option>'; }).join('');
      venueSel.dataset.ready = '1';
    }
    var days = $('#sch-days');
    if (days) {
      days.innerHTML = '<button class="chip" type="button" data-day="all" aria-pressed="' + (state.schedule.day === 'all') + '">All days</button>' +
        DAYS.map(function (d) {
          return '<button class="chip" type="button" data-day="' + d.id + '" aria-pressed="' + (state.schedule.day === d.id) + '">' + d.short + ' ' + d.date.split(' ')[0] + '</button>';
        }).join('');
    }
    var modeBtns = $$('[data-sch-mode]');
    modeBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.schMode === state.schedule.mode)); });
    if (sportSel) sportSel.value = state.schedule.sport;
    if (venueSel) venueSel.value = state.schedule.venue;
    var team = $('#sch-team');
    if (team && team.value !== state.schedule.team) team.value = state.schedule.team;
  }

  function filteredMatches() {
    var f = state.schedule;
    var q = f.team.trim().toLowerCase();
    return sortedMatches().filter(function (m) {
      if (f.sport !== 'all' && m.sport !== f.sport) return false;
      if (f.day !== 'all' && m.day !== f.day) return false;
      if (f.venue !== 'all' && m.venue !== f.venue) return false;
      if (q && (m.a.toLowerCase().indexOf(q) === -1 && m.b.toLowerCase().indexOf(q) === -1)) return false;
      return true;
    });
  }

  function renderSchedule() {
    buildScheduleFilters();
    renderScheduleResults();
  }

  function renderScheduleResults() {
    var list = filteredMatches();
    var out = $('#sch-results');
    var count = $('#sch-count');
    if (count) {
      count.textContent = list.length === 0
        ? 'No matches match these filters'
        : 'Showing ' + list.length + ' of ' + MATCHES.length + ' matches';
    }
    if (!out) return;

    if (!list.length) {
      out.innerHTML = '<div class="empty">' + icon('search') +
        '<b>No matches for that combination</b>' +
        '<span>Try another day or clear the team search. The full draw has ' + MATCHES.length + ' matches across five days.</span>' +
        '<button class="btn btn-ghost btn-sm" id="sch-empty-reset">Reset filters</button></div>';
      return;
    }

    if (state.schedule.mode === 'calendar') {
      var days = state.schedule.day === 'all' ? DAYS : DAYS.filter(function (d) { return d.id === state.schedule.day; });
      out.innerHTML = '<div class="calendar">' + days.map(function (d) {
        var items = list.filter(function (m) { return m.day === d.id; });
        return '<div class="cal-day"><div class="cal-day-head"><b>' + d.short + ' ' + d.n + '</b><span>' + esc(d.date) + '</span></div>' +
          (items.length
            ? items.map(function (m) {
                return '<button class="cal-slot' + (m.status === 'live' ? ' is-live' : '') + '" type="button" data-cal-day="' + d.id + '" aria-label="Show all ' + esc(d.short) + ' matches">' +
                  '<b>' + esc(m.time) + ' · ' + esc(sportName(m.sport)) + '</b>' +
                  '<span>' + esc(m.a) + ' vs ' + esc(m.b) + ' · ' + esc((venueById(m.venue) || {}).name || m.venue) + '</span></button>';
              }).join('')
            : '<p class="xs muted">No matches</p>') +
          '</div>';
      }).join('') + '</div>';
      return;
    }

    out.innerHTML = '<div class="sched-list">' + list.map(schedRow).join('') + '</div>';
  }

  /* ---------------------------------------------------------------- results */
  function renderSportsPage() {
    var grid = $('#sports-grid');
    if (grid) grid.innerHTML = SPORTS.map(sportTile).join('');
    reveal('#sports-grid .sport-tile');
  }

  function renderSportPageDetail() {
    var s = sportById(state.sport) || SPORTS[0];
    var fixtures = sortedMatches().filter(function (m) { return m.sport === s.id; });
    var upcoming = fixtures.filter(function (m) { return m.status !== 'done'; });
    var results = fixtures.filter(function (m) { return m.status === 'done'; }).reverse();
    var host = $('#sport-page');
    if (!host) return;

    host.innerHTML =
      '<div style="padding-top:24px;">' +
        '<button class="btn btn-quiet btn-sm" data-go="sports">&larr; All sports</button>' +
      '</div>' +
      '<div class="sport-hero">' +
        '<div class="sport-hero-art">' + sportArt(s.id) + '</div>' +
        '<div class="sport-hero-copy">' +
          '<p class="eyebrow">Sport · ' + esc(s.players) + ' per side</p>' +
          '<h1>' + esc(s.name) + '</h1>' +
          '<p class="lead">' + esc(s.desc) + '</p>' +
          '<div class="cluster" style="margin-top:16px;">' +
            '<span class="chip">' + esc(s.format) + '</span>' +
            '<span class="chip">' + esc(s.venue) + '</span>' +
            '<span class="chip">' + fixtures.length + ' matches</span>' +
          '</div>' +
          '<div class="cluster" style="margin-top:16px;">' +
            '<button class="btn btn-primary btn-sm" data-go="schedule" data-sport="' + s.id + '">See the timetable</button>' +
            '<button class="btn btn-ghost btn-sm" data-go="rulebook" data-rule-tab="' + s.id + '">' + esc(s.name) + ' rules</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="split-even" style="margin-top:40px;">' +
        '<div><p class="card-title" style="margin-bottom:12px;">Fixtures</p>' +
          (upcoming.length
            ? '<div class="sched-list">' + upcoming.map(schedRow).join('') + '</div>'
            : '<div class="empty"><b>No fixtures left</b><span>Every match in this sport has been played.</span></div>') +
        '</div>' +
        '<div><p class="card-title" style="margin-bottom:12px;">Results</p>' +
          (results.length
            ? '<div class="sched-list">' + results.map(schedRow).join('') + '</div>'
            : '<div class="empty">' + icon('trophy') + '<b>No results yet</b><span>The first result lands here the moment the umpire signs the sheet.</span></div>') +
        '</div>' +
      '</div>' +
      '<div class="card" style="margin-top:24px;">' +
        '<p class="card-title">Playing conditions</p>' +
        '<ul class="tick-list" style="margin-top:10px;">' + (SPORT_RULES[s.id] || []).map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>' +
        '<button class="btn btn-ghost btn-sm" style="margin-top:16px;" data-go="rulebook" data-rule-tab="' + s.id + '">Full ' + esc(s.name) + ' rules</button>' +
      '</div>';

    reveal('.sport-hero');
  }

  /* ---------------------------------------------------------- notifications */
  function notifIcon(n) {
    var name = NOTIF_ICONS[n.type] || 'info';
    return icon(name);
  }

  function notifPopRow(n) {
    var unread = n.unread && !state.read.has(n.id);
    return '<button class="notif-item' + (unread ? ' unread' : '') + '" type="button" data-read="' + n.id + '" data-goto="' + n.view + '">' +
      '<span class="notif-icon">' + notifIcon(n) + '</span>' +
      '<span class="notif-body"><b>' + esc(n.title) + '</b><span class="notif-text">' + esc(n.body) + '</span>' +
      '<span class="notif-meta"><span>' + esc(NOTIF_LABELS[n.type] || 'Update') + '</span><span>' + esc(n.time) + '</span></span></span>' +
      '</button>';
  }

  function renderBell() {
    var count = unreadCount();
    var badge = $('#bellBadge');
    if (badge) {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    }
    var list = $('#notifPopList');
    if (list) list.innerHTML = NOTIFS.slice(0, 5).map(notifPopRow).join('');
  }

  function renderNotifications() {
    var tabs = $('#notif-tabs');
    var filters = [
      { id: 'all', label: 'All' },
      { id: 'unread', label: 'Unread' },
      { id: 'match', label: 'Matches' },
      { id: 'meal', label: 'Meals' },
      { id: 'updates', label: 'Updates' }
    ];
    if (tabs) {
      tabs.innerHTML = filters.map(function (f) {
        return '<button class="chip" type="button" data-notif-filter="' + f.id + '" aria-pressed="' + (state.notifFilter === f.id) + '">' + f.label + '</button>';
      }).join('');
    }

    var list = NOTIFS.filter(function (n) {
      var unread = n.unread && !state.read.has(n.id);
      if (state.notifFilter === 'unread') return unread;
      if (state.notifFilter === 'match') return n.type === 'match';
      if (state.notifFilter === 'meal') return n.type === 'meal';
      if (state.notifFilter === 'updates') return n.type === 'schedule' || n.type === 'venue' || n.type === 'general';
      return true;
    });

    var host = $('#notif-list');
    if (host) {
      host.innerHTML = list.length ? list.map(function (n) {
        var unread = n.unread && !state.read.has(n.id);
        return '<article class="notif-full-item' + (unread ? ' unread' : '') + '">' +
          '<span class="notif-icon">' + notifIcon(n) + '</span>' +
          '<div class="notif-body"><b>' + esc(n.title) + '</b><p>' + esc(n.body) + '</p>' +
            '<div class="notif-meta"><span>' + esc(NOTIF_LABELS[n.type] || 'Update') + '</span><span>' + esc(n.time) + '</span></div></div>' +
          '<button class="btn btn-quiet btn-sm" type="button" data-read="' + n.id + '" data-goto="' + n.view + '">Open</button>' +
          '</article>';
      }).join('') : '<div class="empty">' + icon('checkCircle') +
        '<b>Nothing here right now</b><span>' +
        (state.notifFilter === 'unread' ? 'You have read every announcement.' : 'New announcements from the control room appear here.') +
        '</span><button class="btn btn-ghost btn-sm" data-notif-filter="all">Show all notifications</button></div>';
    }

    var sub = $('#notif-sub');
    if (sub) {
      var c = unreadCount();
      sub.textContent = (c ? c + ' unread announcements. ' : 'You are up to date. ') +
        'Match alerts arrive 15 minutes before your game.';
    }
    renderBell();
  }

  function markAllRead() {
    NOTIFS.forEach(function (n) { state.read.add(n.id); });
    store.set('read', Array.from(state.read));
    renderNotifications();
    toast('All caught up', 'Every notification is marked as read.', 'checkCircle');
  }

  /* --------------------------------------------------------------- settings */
  function renderSettings() {
    $$('#settings-list .switch').forEach(function (sw) {
      var key = sw.dataset.setting;
      var on = !!state.settings[key];
      sw.setAttribute('aria-checked', String(on));
      var st = sw.querySelector('.switch-state');
      if (st) st.textContent = on ? 'On' : 'Off';
    });
  }

  /* ------------------------------------------------------------------ meals */
  function renderMeals() {
    var rail = $('#meal-days');
    if (rail) {
      rail.innerHTML = DAYS.map(function (d) {
        return '<button class="chip" type="button" data-meal-day="' + d.id + '" aria-pressed="' + (state.mealDay === d.id) + '">' + d.short + ' ' + d.date.split(' ')[0] + '</button>';
      }).join('');
    }
    var day = MEALS.find(function (m) { return m.day === state.mealDay; }) || MEALS[2];
    var cards = $('#meal-cards');
    if (!cards) return;
    var meals = [
      { key: 'breakfast', label: 'Breakfast', icon: 'sun' },
      { key: 'lunch', label: 'Lunch', icon: 'food' },
      { key: 'dinner', label: 'Dinner', icon: 'moon' }
    ];
    cards.innerHTML = meals.map(function (m) {
      var data = day[m.key];
      return '<article class="meal-card">' +
        '<div class="meal-head"><div class="cluster" style="gap:8px;">' + icon(m.icon) +
          '<h3>' + m.label + '</h3></div><span class="meal-time">' + esc(data.time) + '</span></div>' +
        '<ul class="menu-list">' + data.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>' +
        '<div class="diet-row">' + data.tags.map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + '</div>' +
        '</article>';
    }).join('');
  }

  /* ---------------------------------------------------------------- explore */
  function renderExplore() {
    var grid = $('#explore-grid');
    if (!grid) return;
    grid.innerHTML = PLACES.map(function (p) {
      return '<article class="place-card">' +
        '<img src="' + p.img + '" alt="' + esc(p.alt) + '" width="' + p.w + '" height="' + p.h + '" loading="lazy">' +
        '<div class="place-body">' +
          '<div class="place-top"><b>' + esc(p.name) + '</b><span class="place-dist">' + esc(p.dist) + '</span></div>' +
          '<p>' + esc(p.text) + '</p>' +
          '<div class="place-tags"><span>' + esc(p.cat) + '</span><span>From the hostel gate</span></div>' +
        '</div></article>';
    }).join('');
    reveal('.place-card');
  }

  /* ----------------------------------------------------------------- venues */
  function renderVenues() {
    var list = $('#venue-list');
    if (list) {
      list.innerHTML = VENUES.map(function (v) {
        return '<div class="venue-row"><span class="venue-ico">' + icon(v.icon) + '</span>' +
          '<span><b>' + esc(v.name) + '</b><br><span>' + esc(v.detail) + '</span></span>' +
          '<button class="btn btn-quiet btn-sm" data-go="schedule">Matches</button></div>';
      }).join('');
    }
  }

  /* ---------------------------------------------------------------- contact */
  function renderContact() {
    var list = $('#contact-list');
    if (list) {
      list.innerHTML = CONTACTS.map(function (c) {
        return '<div class="contact-card"><b>' + esc(c.role) + ' · ' + esc(c.name) + '</b>' +
          '<a href="tel:' + esc(c.phone.replace(/\s/g, '')) + '">' + esc(c.phone) + '</a>' +
          '<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></div>';
      }).join('');
    }
    var faq = $('#faq-list');
    if (faq) {
      faq.innerHTML = FAQ.map(function (f) {
        return '<details class="faq"><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>';
      }).join('');
    }
  }

  /* ------------------------------------------------------------ style guide */
  function renderStyleGuide() {
    var icons = $('#sg-icons');
    if (icons) {
      icons.innerHTML = SPORTS.map(function (s) {
        return '<div class="icon-cell">' + sportArt(s.id) + '<span>' + esc(s.name) + '</span></div>';
      }).join('');
    }
    var ui = $('#sg-ui-icons');
    if (ui) {
      var names = ['bell', 'clock', 'pin', 'calendar', 'users', 'search', 'trophy', 'food', 'phone', 'map', 'bed', 'download', 'printer', 'checkCircle', 'alert', 'flag', 'ticket', 'wifi', 'spark', 'lock'];
      ui.innerHTML = names.map(function (n) {
        return '<div class="icon-cell">' + icon(n) + '<span>' + n + '</span></div>';
      }).join('');
    }
  }

  /* ------------------------------------------------------------- dashboard */
  function playerData() {
    return state.player || DEMO_PLAYER;
  }

  function renderDashboard() {
    var p = playerData();
    var first = (p.name || 'Player').split(' ')[0];
    var fn = $('#dashFirstName');
    if (fn) fn.textContent = first;

    var initials = (p.name || 'P').split(' ').map(function (n) { return n.charAt(0); }).join('').slice(0, 2).toUpperCase();

    var profile = $('#dash-profile');
    if (profile) {
      profile.innerHTML = '<div class="profile-card">' +
        '<div class="dot-field" aria-hidden="true"></div>' +
        '<div class="profile-top">' +
          '<span class="profile-avatar">' + esc(initials) + '</span>' +
          '<span class="profile-name"><b>' + esc(p.name) + '</b><span>' + esc(p.gr) + ' · ' + esc(p.hostel) + ' Hostel</span></span>' +
        '</div>' +
        '<div class="profile-stats">' +
          '<div class="pstat"><b>' + (p.sports ? p.sports.length : 0) + '</b><span>Sports</span></div>' +
          '<div class="pstat"><b>6</b><span>Matches</span></div>' +
          '<div class="pstat"><b>' + esc(p.room || 'B-214') + '</b><span>Room</span></div>' +
        '</div>' +
        '<div class="cluster">' + (p.sports || []).map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('') +
          '<button class="btn btn-quiet btn-sm" data-go="register">Edit entry</button></div>' +
        '</div>';
    }

    var mine = sortedMatches().filter(function (m) {
      return (m.a === p.hostel || m.b === p.hostel) && m.status !== 'done';
    }).slice(0, 4);
    var mm = $('#dash-matches');
    if (mm) {
      mm.innerHTML = mine.length ? mine.map(schedRow).join('')
        : '<div class="empty"><b>No upcoming matches</b><span>Your next fixture appears here once the draw is published.</span></div>';
    }

    var today = sortedMatches().filter(function (m) { return m.day === 'd3'; }).slice(0, 4);
    var dt = $('#dash-today');
    if (dt) dt.innerHTML = today.map(schedRow).join('');

    var meal = MEALS.find(function (m) { return m.day === 'd3'; });
    var dm = $('#dash-meal');
    if (dm && meal) {
      dm.innerHTML = '<div><span>Breakfast</span><b>' + esc(meal.breakfast.time) + '</b></div>' +
        '<div><span>Lunch</span><b>' + esc(meal.lunch.time) + '</b></div>' +
        '<div><span>Dinner</span><b>' + esc(meal.dinner.time) + '</b></div>';
    }

    var feed = $('#dash-notifs');
    if (feed) {
      feed.innerHTML = NOTIFS.slice(0, 3).map(function (n) {
        return '<div class="notif-item" style="pointer-events:none; padding-left:0; padding-right:0;">' +
          '<span class="notif-icon">' + notifIcon(n) + '</span>' +
          '<span class="notif-body"><b style="font-size:.84rem;">' + esc(n.title) + '</b><span class="notif-text">' + esc(n.body) + '</span>' +
          '<span class="notif-meta"><span>' + esc(n.time) + '</span></span></span></div>';
      }).join('');
    }
    var unread = $('#dash-unread');
    if (unread) {
      var c = unreadCount();
      unread.textContent = c ? c + ' new' : 'All read';
    }

    var quick = $('#dash-quick');
    if (quick) {
      var links = [
        { view: 'venues', icon: 'bed', label: 'Room & stay', sub: 'Block ' + (p.room || 'B-214') },
        { view: 'meals', icon: 'food', label: 'Meal menu', sub: 'Today’s thali' },
        { view: 'rulebook', icon: 'ruler', label: 'Rule book', sub: 'All ten sports' },
        { view: 'contact', icon: 'phone', label: 'Help & contacts', sub: '24-hour helpline' }
      ];
      quick.innerHTML = links.map(function (l) {
        return '<button class="quick-link" data-go="' + l.view + '">' + icon(l.icon) +
          '<b>' + l.label + '</b><span>' + l.sub + '</span></button>';
      }).join('');
    }
  }

  /* ------------------------------------------------------------- rule book */
  function ruleTabs() {
    var tabs = [{ id: 'general', name: 'General' }, { id: 'conduct', name: 'Code of conduct' }]
      .concat(SPORTS.map(function (s) { return { id: s.id, name: s.name }; }));
    var host = $('#rule-tabs');
    if (host) {
      host.innerHTML = tabs.map(function (t) {
        var sel = state.ruleTab === t.id;
        return '<button class="rule-tab" type="button" role="tab" aria-controls="rule-content" aria-selected="' + sel + '" data-rule-tab="' + t.id + '">' + esc(t.name) + '</button>';
      }).join('');
    }
  }

  function ruleSections() {
    if (state.ruleTab === 'general' || state.ruleTab === 'conduct') {
      var group = RULES.find(function (r) { return r.id === state.ruleTab; });
      return group ? group.sections : [];
    }
    var s = sportById(state.ruleTab);
    if (!s) return [];
    return [{
      title: s.name + ' — playing conditions',
      meta: s.format + ' · ' + s.venue,
      items: SPORT_RULES[s.id] || []
    }];
  }

  function renderRulebook() {
    ruleTabs();
    renderRuleContent();
    var search = $('#ruleSearch');
    if (search) search.value = state.ruleQuery;
  }

  function renderRuleContent() {
    var q = state.ruleQuery.trim().toLowerCase();
    var sections = ruleSections().map(function (sec) {
      var items = sec.items.filter(function (it) { return !q || it.toLowerCase().indexOf(q) !== -1 || sec.title.toLowerCase().indexOf(q) !== -1; });
      return { title: sec.title, meta: sec.meta, items: items, keep: items.length > 0 };
    }).filter(function (s) { return s.keep; });

    var host = $('#rule-content');
    var empty = $('#rule-empty');
    if (!host) return;

    if (!sections.length) {
      host.innerHTML = '';
      host.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }
    host.hidden = false;
    if (empty) empty.hidden = true;
    host.innerHTML = sections.map(function (s) {
      return '<div class="rule-section"><h3>' + esc(s.title) + '</h3>' +
        (s.meta ? '<p class="xs muted">' + esc(s.meta) + '</p>' : '') +
        '<ol>' + s.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ol></div>';
    }).join('');
  }

  /* ------------------------------------------------------------- register */
  function renderRegister() {
    var body = $('#reg-body');
    var success = $('#reg-success');
    if (success && !success.hidden) {
      success.hidden = true;
      success.innerHTML = '';
      if (body) body.hidden = false;
    }
    var sportsHost = $('#reg-sports');
    if (sportsHost && !sportsHost.dataset.ready) {
      sportsHost.innerHTML = SPORTS.map(function (s) {
        return '<label class="chip"><input type="checkbox" class="sr-only" name="sports" value="' + s.id + '">' + esc(s.name) + '</label>';
      }).join('');
      sportsHost.dataset.ready = '1';
    }
    var shirt = $('#reg-tshirt');
    if (shirt && !shirt.dataset.ready) {
      shirt.innerHTML = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(function (size) {
        return '<label class="chip"><input type="radio" class="sr-only" name="tshirt" value="' + size + '">' + size + '</label>';
      }).join('');
      shirt.dataset.ready = '1';
    }
    syncPreview();
  }

  function selectedSports() {
    return $$('#reg-sports input:checked').map(function (i) { return sportName(i.value); });
  }

  function syncPreview() {
    var name = $('#reg-name');
    var gr = $('#reg-gr');
    var pn = $('#previewName');
    var pg = $('#previewGr');
    var ps = $('#previewSports');
    if (pn) pn.textContent = name && name.value.trim() ? name.value.trim() : 'Your name';
    if (pg) pg.textContent = gr && gr.value.trim() ? gr.value.trim().toUpperCase() : 'SMJV26-0000';
    if (ps) {
      var list = selectedSports();
      ps.textContent = list.length ? list.slice(0, 2).join(', ') + (list.length > 2 ? ' +' + (list.length - 2) : '') : 'Not selected';
    }
    var preview = $('#previewPhoto');
    if (preview && state.photo) {
      preview.innerHTML = '<img src="' + state.photo + '" alt="Your uploaded photo">';
    }
  }

  function fieldValue(id) {
    var el = $('#' + id);
    return el ? el.value : '';
  }

  function setError(key, message) {
    var err = $('#reg-' + key + '-err');
    var input = $('#reg-' + key);
    if (err) {
      err.hidden = false;
      var span = err.querySelector('span');
      if (span) span.textContent = message;
    }
    if (input) input.setAttribute('aria-invalid', 'true');
  }

  function clearError(key) {
    var err = $('#reg-' + key + '-err');
    var input = $('#reg-' + key);
    if (err) err.hidden = true;
    if (input) input.removeAttribute('aria-invalid');
  }

  var VALIDATORS = {
    gr: function () {
      var v = fieldValue('reg-gr').trim();
      if (!v) return 'Enter your GR number.';
      if (!/^[A-Za-z]{2,8}\d{1,5}(-\d{2,6})?$/.test(v)) return 'Use the full GR number, for example SMJV26-0142.';
      return '';
    },
    name: function () {
      var v = fieldValue('reg-name').trim();
      if (!v) return 'Enter your full name as on your hostel ID.';
      if (v.length < 3) return 'Name looks too short — use at least three characters.';
      if (!/^[A-Za-z][A-Za-z .'-]*$/.test(v)) return 'Use letters, spaces, hyphens or apostrophes only.';
      return '';
    },
    phone: function () {
      var v = fieldValue('reg-phone');
      var digits = v.replace(/\D/g, '');
      if (!digits) return 'Enter a phone number we can reach you on.';
      if (digits.length < 10) return 'Enter a 10-digit mobile number.';
      if (digits.length > 12) return 'That number is too long — use 10 digits.';
      return '';
    },
    email: function () {
      var v = fieldValue('reg-email').trim();
      if (!v) return 'Enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a complete email, for example you@college.edu.';
      return '';
    },
    password: function () {
      var v = fieldValue('reg-password');
      if (!v) return 'Choose a password.';
      if (v.length < 8) return 'Use at least 8 characters.';
      return '';
    },
    confirm: function () {
      if (!fieldValue('reg-confirm')) return 'Re-enter your password.';
      if (fieldValue('reg-confirm') !== fieldValue('reg-password')) return 'Passwords do not match.';
      return '';
    }
  };

  function validateField(key) {
    if (key === 'sports') {
      var count = $$('#reg-sports input:checked').length;
      var errS = $('#reg-sports-err');
      if (!count) { if (errS) errS.hidden = false; return false; }
      if (errS) errS.hidden = true;
      return true;
    }
    if (key === 'tshirt') {
      var picked = $$('#reg-tshirt input:checked').length;
      var errT = $('#reg-tshirt-err');
      if (!picked) { if (errT) errT.hidden = false; return false; }
      if (errT) errT.hidden = true;
      return true;
    }
    if (key === 'terms') {
      var terms = $('#reg-terms');
      var errTe = $('#reg-terms-err');
      var ok = !!(terms && terms.checked);
      if (errTe) errTe.hidden = ok;
      return ok;
    }
    var msg = VALIDATORS[key] ? VALIDATORS[key]() : '';
    if (msg) { setError(key, msg); return false; }
    clearError(key);
    return true;
  }

  function validateAll() {
    var keys = ['gr', 'name', 'phone', 'email', 'password', 'confirm', 'sports', 'tshirt', 'terms'];
    var labels = { gr: 'GR number', name: 'Full name', phone: 'Phone number', email: 'Email', password: 'Password', confirm: 'Confirm password', sports: 'Sports', tshirt: 'T-shirt size', terms: 'Rule book acceptance' };
    var bad = keys.filter(function (k) { return !validateField(k); });
    var summary = $('#regSummary');
    var list = $('#regSummaryList');
    if (bad.length && summary && list) {
      summary.hidden = false;
      list.innerHTML = bad.map(function (k) {
        return '<li><button type="button" class="link-btn" data-focus="reg-' + k + '">' + labels[k] + '</button></li>';
      }).join('');
      summary.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'center' });
    } else if (summary) {
      summary.hidden = true;
    }
    return bad;
  }

  function submitRegistration(e) {
    e.preventDefault();
    var bad = validateAll();
    if (bad.length) {
      var first = $('#reg-' + bad[0]);
      if (first && !(first.matches && first.matches('input, select, textarea, button'))) {
        var inner = first.querySelector('input, select, textarea, button');
        if (inner) first = inner;
      }
      if (first && first.focus) first.focus();
      return;
    }
    var btn = $('#regSubmit');
    if (btn) { btn.disabled = true; btn.textContent = 'Creating player ID…'; }
    window.setTimeout(function () {
      if (btn) { btn.disabled = false; btn.textContent = 'Create player ID'; }
      var sports = selectedSports();
      var player = {
        name: fieldValue('reg-name').trim(),
        gr: fieldValue('reg-gr').trim().toUpperCase(),
        hostel: (ROOMS[fieldValue('reg-gr').trim().toUpperCase()] || {}).hostel || 'Narmada',
        room: (ROOMS[fieldValue('reg-gr').trim().toUpperCase()] || {}).room || 'B-214',
        sports: sports,
        photo: state.photo
      };
      state.player = player;
      store.set('player', player);
      showSuccess(player);
    }, 850);
  }

  function showSuccess(player) {
    var body = $('#reg-body');
    var success = $('#reg-success');
    if (!body || !success) return;
    body.hidden = true;
    success.hidden = false;
    success.innerHTML = '<div class="success success-id">' +
      '<div class="id-card">' +
        '<div class="id-card-top"><span>INTER SMJV 2026</span><span>Player</span></div>' +
        '<div class="id-card-body">' +
          '<div class="id-card-name">' +
            '<div class="id-photo">' + (player.photo ? '<img src="' + player.photo + '" alt="Player photo">' : icon('user')) + '</div>' +
            '<div><b>' + esc(player.name) + '</b><span>' + esc(player.hostel) + ' Hostel</span></div>' +
          '</div>' +
          '<div class="id-fields">' +
            '<div class="id-field"><span>GR number</span><b>' + esc(player.gr) + '</b></div>' +
            '<div class="id-field"><span>Room</span><b>' + esc(player.room) + '</b></div>' +
            '<div class="id-field"><span>Sports</span><b>' + esc(player.sports.join(', ')) + '</b></div>' +
            '<div class="id-field"><span>Valid</span><b>14–18 Dec 2026</b></div>' +
          '</div>' +
          '<div class="id-barcode" aria-hidden="true">' +
            '<i style="height:34px"></i><i style="height:22px;width:4px"></i><i style="height:38px"></i><i style="height:18px;width:3px"></i><i style="height:30px"></i><i style="height:38px;width:4px"></i><i style="height:24px"></i><i style="height:36px"></i><i style="height:16px;width:3px"></i><i style="height:32px"></i><i style="height:38px;width:4px"></i><i style="height:20px"></i><i style="height:34px"></i><i style="height:28px;width:3px"></i><i style="height:38px"></i>' +
          '</div>' +
        '</div>' +
        '<div class="id-card-foot"><span>SMJV Hostel Branch</span><span>Vadodara</span></div>' +
      '</div>' +
      '<div class="success-copy">' +
        '<span class="success-mark">' + icon('check') + '</span>' +
        '<h2>You are in, ' + esc(player.name.split(' ')[0]) + '</h2>' +
        '<p class="lead">Your player card is ready. Show it at the kit desk to collect your jersey, and at every venue for entry.</p>' +
        '<ul class="tick-list">' +
          '<li>Collect your kit from the hostel reception, 8 AM – 8 PM</li>' +
          '<li>Check your first fixture on the schedule</li>' +
          '<li>15-minute match alerts are on by default</li>' +
        '</ul>' +
        '<div class="success-actions">' +
          '<button class="btn btn-primary" data-go="dashboard">Open dashboard</button>' +
          '<button class="btn btn-ghost" data-go="schedule">See my fixtures</button>' +
          '<button class="btn btn-quiet" id="registerAnother" type="button">Register another player</button>' +
        '</div>' +
        '<p class="xs muted">A confirmation has been sent to your email. Keep this card — it is your pass to the mess hall and all venues.</p>' +
      '</div>' +
    '</div>';
    window.scrollTo(0, 0);
    toast('Player ID created', 'Collect your kit at the hostel reception.', 'checkCircle');
  }

  function resetRegistration() {
    var body = $('#reg-body');
    var success = $('#reg-success');
    if (body) body.hidden = false;
    if (success) { success.hidden = true; success.innerHTML = ''; }
    state.photo = '';
    var form = $('#regForm');
    if (form) form.reset();
    $$('#regForm .err').forEach(function (e) { e.hidden = true; });
    $$('#regForm [aria-invalid]').forEach(function (i) { i.removeAttribute('aria-invalid'); });
    var summary = $('#regSummary');
    if (summary) summary.hidden = true;
    var preview = $('#previewPhoto');
    if (preview) preview.innerHTML = icon('user');
    syncPreview();
    window.scrollTo(0, 0);
  }

  /* ------------------------------------------------------------------ login */
  function resetLogin() {
    var form = $('#loginForm');
    if (!form) return;
    var grErr = $('#login-gr-err');
    var passErr = $('#login-pass-err');
    if (grErr) grErr.hidden = true;
    if (passErr) passErr.hidden = true;
  }

  function submitLogin(e) {
    e.preventDefault();
    var gr = $('#login-gr');
    var pass = $('#login-pass');
    var ok = true;
    if (!gr.value.trim()) { $('#login-gr-err').hidden = false; gr.setAttribute('aria-invalid', 'true'); ok = false; }
    else { $('#login-gr-err').hidden = true; gr.removeAttribute('aria-invalid'); }
    if (pass.value.length < 4) { $('#login-pass-err').hidden = false; pass.setAttribute('aria-invalid', 'true'); ok = false; }
    else { $('#login-pass-err').hidden = true; pass.removeAttribute('aria-invalid'); }
    if (!ok) { (gr.value.trim() ? pass : gr).focus(); return; }

    var key = gr.value.trim().toUpperCase();
    var room = ROOMS[key];
    if (room) {
      state.player = { name: room.name, gr: key, hostel: room.hostel, room: room.room, sports: ['Cricket'], photo: '' };
      store.set('player', state.player);
    }
    toast('Signed in', 'Welcome back, ' + (playerData().name.split(' ')[0]) + '. Day 3 is under way.', 'checkCircle');
    go('dashboard');
  }

  /* ------------------------------------------------------------------- init */
  function bind() {
    document.addEventListener('click', function (e) {
      var target = e.target.closest ? e.target.closest('button, a, summary') : null;
      if (!target) return;

      var goEl = target.closest('[data-go]');
      if (goEl) {
        e.preventDefault();
        go(goEl.dataset.go, { sport: goEl.dataset.sport, ruleTab: goEl.dataset.ruleTab });
        return;
      }

      var remind = target.closest('[data-remind]');
      if (remind) { toggleReminder(remind.dataset.remind); return; }

      var read = target.closest('[data-read]');
      if (read) {
        state.read.add(read.dataset.read);
        store.set('read', Array.from(state.read));
        var dest = read.dataset.goto;
        renderBell();
        if (dest) go(dest);
        return;
      }

      var day = target.closest('[data-day]');
      if (day) { state.schedule.day = day.dataset.day; buildScheduleFilters(); renderScheduleResults(); return; }

      var cal = target.closest('[data-cal-day]');
      if (cal) { state.schedule.day = cal.dataset.calDay; state.schedule.mode = 'list'; buildScheduleFilters(); renderScheduleResults(); return; }

      var mode = target.closest('[data-sch-mode]');
      if (mode) {
        state.schedule.mode = mode.dataset.schMode;
        $$('[data-sch-mode]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.schMode === state.schedule.mode)); });
        renderScheduleResults();
        return;
      }

      var mealDay = target.closest('[data-meal-day]');
      if (mealDay) { state.mealDay = mealDay.dataset.mealDay; renderMeals(); return; }

      var filter = target.closest('[data-notif-filter]');
      if (filter) { state.notifFilter = filter.dataset.notifFilter; renderNotifications(); return; }

      var ruleTab = target.closest('[data-rule-tab]');
      if (ruleTab) { state.ruleTab = ruleTab.dataset.ruleTab; state.ruleQuery = ''; renderRulebook(); return; }

      var focusEl = target.closest('[data-focus]');
      if (focusEl) {
        var f = $('#' + focusEl.dataset.focus);
        if (f && !(f.matches && f.matches('input, select, textarea, button'))) {
          var inner = f.querySelector('input, select, textarea, button');
          if (inner) f = inner;
        }
        if (f) {
          f.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'center' });
          try { f.focus({ preventScroll: true }); } catch (e2) { f.focus(); }
        }
        return;
      }

      var sw = target.closest('.switch');
      if (sw && sw.dataset.setting) {
        var k = sw.dataset.setting;
        state.settings[k] = !state.settings[k];
        sw.setAttribute('aria-checked', String(state.settings[k]));
        var st = sw.querySelector('.switch-state');
        if (st) st.textContent = state.settings[k] ? 'On' : 'Off';
        return;
      }

      if (target.id === 'sch-empty-reset') {
        state.schedule = { sport: 'all', day: 'all', venue: 'all', team: '', mode: state.schedule.mode };
        buildScheduleFilters();
        renderScheduleResults();
        return;
      }
      if (target.id === 'registerAnother') { resetRegistration(); return; }
      if (target.id === 'ruleClear') { state.ruleQuery = ''; $('#ruleSearch').value = ''; renderRuleContent(); $('#ruleSearch').focus(); return; }
      if (target.id === 'volunteerBtn') { toast('Interest noted', 'The hospitality desk will message you about volunteer slots.', 'users'); return; }
    });

    var themeBtn = $('#themeBtn');
    if (themeBtn) themeBtn.addEventListener('click', function () {
      applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    var bell = $('#bellBtn');
    if (bell) bell.addEventListener('click', function (e) {
      e.stopPropagation();
      var pop = $('#notifPopover');
      var open = pop.hidden;
      pop.hidden = !open;
      bell.setAttribute('aria-expanded', String(open));
      if (open) renderBell();
    });

    document.addEventListener('click', function (e) {
      var pop = $('#notifPopover');
      if (!pop || pop.hidden) return;
      if (pop.contains(e.target) || (e.target.closest && e.target.closest('#bellBtn'))) return;
      pop.hidden = true;
      $('#bellBtn').setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var pop = $('#notifPopover');
        if (pop && !pop.hidden) { pop.hidden = true; $('#bellBtn').setAttribute('aria-expanded', 'false'); $('#bellBtn').focus(); }
      }
    });

    var markAll = $('#bellMarkAll');
    if (markAll) markAll.addEventListener('click', markAllRead);
    var markAll2 = $('#markAllBtn');
    if (markAll2) markAll2.addEventListener('click', markAllRead);

    var save = $('#saveSettings');
    if (save) save.addEventListener('click', function () {
      store.set('settings', state.settings);
      toast('Preferences saved', 'Your alert settings are updated on this device.', 'checkCircle');
    });

    var schSport = $('#sch-sport');
    if (schSport) schSport.addEventListener('change', function () { state.schedule.sport = schSport.value; renderScheduleResults(); });
    var schVenue = $('#sch-venue');
    if (schVenue) schVenue.addEventListener('change', function () { state.schedule.venue = schVenue.value; renderScheduleResults(); });
    var schTeam = $('#sch-team');
    if (schTeam) schTeam.addEventListener('input', function () { state.schedule.team = schTeam.value; renderScheduleResults(); });
    var schReset = $('#sch-reset');
    if (schReset) schReset.addEventListener('click', function () {
      state.schedule = { sport: 'all', day: 'all', venue: 'all', team: '', mode: state.schedule.mode };
      buildScheduleFilters();
      renderScheduleResults();
    });

    var ruleSearch = $('#ruleSearch');
    if (ruleSearch) ruleSearch.addEventListener('input', function () {
      state.ruleQuery = ruleSearch.value;
      renderRuleContent();
    });

    var rulePrint = $('#rulePrint');
    if (rulePrint) rulePrint.addEventListener('click', function () {
      document.body.dataset.print = 'rules';
      window.print();
    });
    window.addEventListener('afterprint', function () {
      document.body.removeAttribute('data-print');
    });

    var menuBtn = $('#menuBtn');
    var menu = $('#menuDialog');
    if (menuBtn && menu) menuBtn.addEventListener('click', function () {
      if (typeof menu.showModal === 'function') menu.showModal(); else menu.setAttribute('open', '');
    });
    var menuClose = $('#menuClose');
    if (menuClose && menu) menuClose.addEventListener('click', function () { menu.close(); });

    var reg = $('#regForm');
    if (reg) {
      reg.addEventListener('submit', submitRegistration);
      ['gr', 'name', 'phone', 'email', 'password', 'confirm'].forEach(function (key) {
        var input = $('#reg-' + key);
        if (!input) return;
        input.addEventListener('blur', function () { if (input.value.trim() !== '' || input.getAttribute('aria-invalid') === 'true') validateField(key); });
        input.addEventListener('input', function () {
          if (input.getAttribute('aria-invalid') === 'true') {
            if (VALIDATORS[key] && !VALIDATORS[key]()) clearError(key);
          }
          if (key === 'name' || key === 'gr') syncPreview();
        });
      });
      ['gr', 'name'].forEach(function (key) {
        var input = $('#reg-' + key);
        if (input) input.addEventListener('input', syncPreview);
      });
      var sportsHost = $('#reg-sports');
      if (sportsHost) sportsHost.addEventListener('change', function () {
        $('#reg-sports-err').hidden = true;
        syncPreview();
      });
      var shirt = $('#reg-tshirt');
      if (shirt) shirt.addEventListener('change', function () { $('#reg-tshirt-err').hidden = true; });
      var terms = $('#reg-terms');
      if (terms) terms.addEventListener('change', function () { $('#reg-terms-err').hidden = terms.checked; });

      var photo = $('#reg-photo');
      if (photo) photo.addEventListener('change', function () {
        var file = photo.files && photo.files[0];
        var err = $('#reg-photo-err');
        state.photo = '';
        if (!file) return;
        if (!/^image\/(png|jpeg)$/.test(file.type)) {
          err.hidden = false; err.querySelector('span').textContent = 'Choose a JPG or PNG image.';
          photo.value = '';
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          err.hidden = false; err.querySelector('span').textContent = 'That file is over 2 MB — pick a smaller photo.';
          photo.value = '';
          return;
        }
        err.hidden = true;
        var reader = new FileReader();
        reader.onload = function () {
          state.photo = String(reader.result);
          syncPreview();
          var prev = $('#photoPreview');
          if (prev) prev.innerHTML = '<img src="' + state.photo + '" alt="Preview of your uploaded photo">';
        };
        reader.onerror = function () {
          err.hidden = false;
          err.querySelector('span').textContent = 'That photo could not be read — try another file.';
        };
        reader.readAsDataURL(file);
      });
    }

    var login = $('#loginForm');
    if (login) login.addEventListener('submit', submitLogin);

    var forgot = $('#forgotBtn');
    if (forgot) forgot.addEventListener('click', function () {
      var d = $('#forgotDialog');
      if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    });
    var forgotCancel = $('#forgotCancel');
    if (forgotCancel) forgotCancel.addEventListener('click', function () { $('#forgotDialog').close(); });
    var forgotForm = $('#forgotForm');
    if (forgotForm) forgotForm.addEventListener('submit', function (e) {
      e.preventDefault();
      $('#forgotDialog').close();
      toast('Reset link requested', 'Collect it at the hostel reception with your ID card.', 'lock');
    });

    var roomForm = $('#roomForm');
    if (roomForm) roomForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('#room-gr');
      var err = $('#room-err');
      var key = input.value.trim().toUpperCase();
      var out = $('#room-result');
      if (!key) {
        err.hidden = false; err.querySelector('span').textContent = 'Enter your GR number to look up a room.';
        out.innerHTML = '';
        input.focus();
        return;
      }
      err.hidden = true;
      var room = ROOMS[key];
      if (!room) {
        out.innerHTML = '<div class="empty" style="padding:20px;">' + icon('bed') +
          '<b>No room assigned yet</b><span>Registration ‘' + esc(key) + '’ is not on the room list. Check-in opens 12 December — the hospitality desk can assign a bed.</span></div>';
        return;
      }
      out.innerHTML = '<div class="room-result">' +
        '<p class="card-title">Your bed</p>' +
        '<b style="font-family:var(--font-display); font-size:1.6rem; display:block; margin-top:4px;">Block ' + esc(room.block.replace('Block ', '')) + ' · ' + esc(room.room) + '</b>' +
        '<span class="small muted">' + esc(room.bed) + ' · ' + esc(room.hostel) + ' Hostel</span>' +
        '<div class="cluster" style="margin-top:10px;"><span class="chip">' + esc(room.name) + '</span><span class="chip">Check-in from 12 Dec</span></div></div>';
    });
  }

  /* -------------------------------------------------------------- utilities */
  function toggleReminder(id) {
    var on = state.reminders.has(id);
    if (on) state.reminders.delete(id); else state.reminders.add(id);
    store.set('reminders', Array.from(state.reminders));
    var nowOn = state.reminders.has(id);
    $$('[data-remind="' + id + '"]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(nowOn));
      b.setAttribute('title', nowOn ? 'Reminder set' : 'Remind me');
    });
    var m = MATCHES.find(function (x) { return x.id === id; });
    if (nowOn) toast('Reminder set', 'We will alert you 15 minutes before ' + (m ? m.a + ' vs ' + m.b : 'this match') + '.', 'bell');
    else toast('Reminder removed', 'You will not be alerted for this match.', 'bell');
  }

  var revealObserver = null;
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px' });
  }
  function reveal(selector) {
    if (reduceMotion() || !revealObserver) return;
    $$(selector).forEach(function (el, i) {
      if (el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i * 35, 210) + 'ms';
      revealObserver.observe(el);
    });
  }

  function startCountdown() {
    var target = new Date(FEST.countdownTo).getTime();
    var festivalNow = new Date('2026-12-16T14:00:00+05:30').getTime();
    var budget = target - festivalNow;
    var loadAt = Date.now();
    var days = $('#cd-days'), hours = $('#cd-hours'), mins = $('#cd-mins'), secs = $('#cd-secs');
    function tick() {
      var diff = budget - (Date.now() - loadAt);
      if (diff < 0) diff = 0;
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      if (days) days.textContent = String(d).padStart(2, '0');
      if (hours) hours.textContent = String(h).padStart(2, '0');
      if (mins) mins.textContent = String(m).padStart(2, '0');
      if (secs) secs.textContent = String(s).padStart(2, '0');
    }
    tick();
    window.setInterval(tick, 1000);
  }

  function closeMenu() {
    var menu = $('#menuDialog');
    if (menu && menu.open) menu.close();
  }

  function closeNotifPopover() {
    var pop = $('#notifPopover');
    var bell = $('#bellBtn');
    if (pop && !pop.hidden) pop.hidden = true;
    if (bell) bell.setAttribute('aria-expanded', 'false');
  }

  function init() {
    sections = $$('.view');
    applyTheme(store.get('theme', 'dark'));
    bind();
    renderRegister();
    renderRulebook();
    renderContact();
    renderVenues();
    renderStyleGuide();
    renderDashboard();
    renderBell();
    startCountdown();
    go('home');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
