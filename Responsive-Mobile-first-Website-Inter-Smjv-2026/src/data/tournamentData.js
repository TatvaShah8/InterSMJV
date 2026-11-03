/* INTER SMJV 2026 — content model and icon set */

export const UI_ICONS = {
  bell: '<path d="M6 9a6 6 0 1 1 12 0c0 4 1.6 5.6 2 6.4H4c.4-.8 2-2.4 2-6.4Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  pin: '<path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.4 6-5.4s6 2.1 6 5.4"/><path d="M16 5.4a3.2 3.2 0 0 1 0 6.2M17.5 14.9c2.4.6 3.9 2.4 3.9 5.1"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  check: '<path d="M4 12.5 9.5 18 20 6.5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12.2l2.6 2.6L16 9.6"/>',
  alert: '<path d="M12 3 2.6 20h18.8L12 3Z"/><path d="M12 9v5M12 17.4v.2"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
  printer: '<path d="M7 8V3h10v5M7 18H4V9h16v9h-3"/><rect x="7" y="14" width="10" height="7"/>',
  food: '<path d="M6 3v7a2.5 2.5 0 0 0 5 0V3M8.5 10v11M17 3c-1.6 1.4-2.4 3.4-2.4 5.6 0 1.7.8 2.9 2.4 3.2V21"/>',
  trophy: '<path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3"/><path d="M12 13v4M8.5 21h7M10 21v-2h4v2"/>',
  map: '<path d="M9 4 3 6.5V21l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4Z"/><path d="M9 4v14.5M15 6.5V21"/>',
  bed: '<path d="M3 20V8M3 15h18v5M3 12h8v3M11 12h7a3 3 0 0 1 3 3"/><circle cx="7" cy="10" r="1.6"/>',
  phone: '<path d="M6 3h3l2 5-2.2 1.6a12 12 0 0 0 6 6L16.4 13l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 6.2 2 2 0 0 1 6 3Z"/>',
  lock: '<rect x="4.5" y="10" width="15" height="10.5" rx="1.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5S20 17 20 21"/>',
  camera: '<path d="M3 8h4l1.5-2h7L17 8h4v11H3Z"/><circle cx="12" cy="13.5" r="3.4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.6v.2"/>',
  flag: '<path d="M5 21V3M5 4h12l-2.5 4.5L17 13H5"/>',
  whislte: '<circle cx="10" cy="14" r="6"/><path d="M16 12h6M10 8V5"/>',
  ticket: '<path d="M3 8h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4V8Z"/><path d="M14 8v12"/>',
  spark: '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z"/>',
  wifi: '<path d="M4 9a13 13 0 0 1 16 0M7 12.5a8.5 8.5 0 0 1 10 0M9.8 16.2a4 4 0 0 1 4.4 0"/><circle cx="12" cy="19.4" r="1"/>',
  ruler: '<path d="M3 8h18v8H3Z"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-1.6 5.6"/><path d="M20 5v6h-6"/>'
};

export function icon(name, cls) {
  const body = UI_ICONS[name] || UI_ICONS.info;
  return '<svg class="od-icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + body + '</svg>';
}

export const SPORT_ART = {
  cricket: '<path d="M20 47 39 21l6 4-19 26z"/><path d="M39 21l4-5 5 3-3 5"/><path d="M25 43l6 4"/><circle cx="48" cy="47" r="5"/><path d="M45 43.5c2 1.6 3 4 2.6 6.6"/>',
  football: '<circle cx="32" cy="32" r="21"/><path d="M32 22l9 6.5-3.4 10h-11L23 28.5z"/><path d="M32 22v-11M41 28.5l10-3M37.6 38.5l6 9M26.4 38.5l-6 9M23 28.5l-10-3"/>',
  volleyball: '<circle cx="32" cy="32" r="21"/><path d="M14 22c9 2 20 8 25 19M32 11c-3 9-3 22 3 33M50 24c-9 1-21 6-28 16"/>',
  pickleball: '<rect x="12" y="9" width="24" height="30" rx="9" transform="rotate(-20 24 24)"/><path d="M30 39l8 12"/><circle cx="47" cy="46" r="4.5"/><path d="M44 43a6 6 0 0 1 5 0"/>',
  khokho: '<circle cx="18" cy="24" r="4"/><circle cx="43" cy="33" r="4"/><path d="M22 27c4 2 8 3 12 3" stroke-dasharray="3 5"/><path d="M48 26l4 7-9 1"/><path d="M13 31c-2 5-1 10 2 14M46 40c2 4 1 8-3 11"/>',
  throwball: '<circle cx="32" cy="33" r="12"/><path d="M20 24c-5 3-7 8-6 14M44 24c5 3 7 8 6 14" stroke-dasharray="4 5"/><path d="M16 15l4 4M48 15l-4 4"/>',
  tug: '<path d="M6 40c8-8 14 4 21-3s13 3 21-4"/><circle cx="31" cy="33" r="5"/><path d="M9 34l-4 6M9 34l-5 2M55 27l5 5M55 27l4-3"/>',
  badminton: '<path d="M32 10c6 0 10 4 10 9 0 6-6 10-10 15-4-5-10-9-10-15 0-5 4-9 10-9Z"/><path d="M22 19h20M26 14.5 32 34M38 14.5 32 34"/><circle cx="32" cy="42" r="6"/>',
  tt: '<path d="M34 14a12 12 0 1 0 0 24 12 12 0 0 0 0-24Z"/><path d="M32 38l-6 14"/><circle cx="48" cy="19" r="5"/><path d="M8 46h48"/>',
  chess: '<path d="M22 52h24l-2-9H24l-2 9Z"/><path d="M26 43c-2-6 2-10 6-13-1-4 3-7 6-6l-2 4 6 3-3 4 4 4-4 2c3 2 4 4 5 8"/>',
  carrom: '<rect x="14" y="14" width="36" height="36" rx="4"/><circle cx="32" cy="32" r="5"/><circle cx="18" cy="18" r="2.5"/><circle cx="46" cy="18" r="2.5"/><circle cx="18" cy="46" r="2.5"/><circle cx="46" cy="46" r="2.5"/><circle cx="32" cy="32" r="11" stroke-dasharray="2 3"/>'
};

export function sportArt(id) {
  return '<svg class="sport-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (SPORT_ART[id] || '') + '</svg>';
}

export const FEST = {
  name: 'INTER SMJV 2026',
  gu: 'આંતર હોસ્ટેલ ખેલ મહોત્સવ',
  dates: '14–18 December 2026',
  place: 'SMJV Hostel Branch, Vadodara',
  countdownTo: '2026-12-18T19:00:00+05:30',
  countdownLabel: 'Countdown to the final whistle',
  day: 'Day 3 of 5'
};

export const DAYS = [
  { id: 'd1', short: 'Mon', date: '14 Dec', long: 'Monday, 14 December', n: 1 },
  { id: 'd2', short: 'Tue', date: '15 Dec', long: 'Tuesday, 15 December', n: 2 },
  { id: 'd3', short: 'Wed', date: '16 Dec', long: 'Wednesday, 16 December', n: 3 },
  { id: 'd4', short: 'Thu', date: '17 Dec', long: 'Thursday, 17 December', n: 4 },
  { id: 'd5', short: 'Fri', date: '18 Dec', long: 'Friday, 18 December', n: 5 }
];

export const HOSTELS = ['Narmada', 'Tapi', 'Mahi', 'Sabarmati', 'Vishwamitri', 'Aji', 'Damanganga', 'Shetrunji'];

export const SMJV_BRANCHES = [
  'Vadodara (Host Branch)',
  'Ahmedabad',
  'Mumbai',
  'Bhavnagar',
  'Surat',
  'Pune',
  'Rajkot',
  'Anand'
];

export const VENUES = [
  { id: 'main', name: 'Main Ground', detail: 'Cricket, football, tug of war', icon: 'flag' },
  { id: 'court1', name: 'Court 1', detail: 'Kho-Kho, throwball', icon: 'users' },
  { id: 'court2', name: 'Court 2', detail: 'Volleyball, throwball', icon: 'users' },
  { id: 'court3', name: 'Court 3', detail: 'Pickleball', icon: 'whislte' },
  { id: 'indoor', name: 'Indoor Hall', detail: 'Badminton, table tennis', icon: 'spark' },
  { id: 'chess', name: 'Chess Room', detail: 'Chess, quiet zone', icon: 'ruler' }
];

export const SPORTS = [
  { id: 'cricket', name: 'Cricket', format: '8-a-side · T8 knockout', venue: 'Main Ground', players: '11', desc: 'Hard tennis ball cricket under lights. Six overs a side, one powerplay, and a super over if the scores are level.', blurb: 'Six-over nights on the main ground' },
  { id: 'football', name: 'Football', format: '7-a-side · 20 min halves', venue: 'Main Ground', players: '9', desc: 'Small-sided football with rolling substitutions. Group stage into semi-finals, played on grass at dusk.', blurb: 'Seven a side, under the floodlights' },
  { id: 'volleyball', name: 'Volleyball', format: 'Best of 3 sets · 15 points', venue: 'Court 2', players: '8', desc: 'Six on court, best of three sets to fifteen. Let serves are live and every match has a duty referee from the opposing hostel.', blurb: 'Three sets, no free points' },
  { id: 'pickleball', name: 'Pickleball', format: 'Doubles · one game to 11', venue: 'Court 3', players: '4', desc: 'Mixed doubles on two courts, single game to eleven, win by two. New to the fest this year and already oversubscribed.', blurb: 'The newest sport on the roster' },
  { id: 'khokho', name: 'Kho-Kho', format: '9 players · 7-minute chase', venue: 'Court 1', players: '12', desc: 'Two innings of chasing and dodging. Seven minutes per turn, three defenders, and a lot of noise from the gallery.', blurb: 'Seven minutes of pure chase' },
  { id: 'throwball', name: 'Throw Ball', format: '6-a-side · best of 3', venue: 'Court 1', players: '8', desc: 'Two-handed throws across the net, no dribbling, no walking. Three sets to fifteen, with a two-point cushion to win.', blurb: 'Catch it clean, throw it hard' },
  { id: 'tug', name: 'Tug of War', format: '8 pullers · best of 3', venue: 'Main Ground', players: '10', desc: 'Eight on the rope, two reserves, best of three pulls. Feet stay outside the lane markers and the anchor can wrap once.', blurb: 'Eight hands, one rope' },
  { id: 'badminton', name: 'Badminton', format: 'Team tie · 5 rubbers', venue: 'Indoor Hall', players: '7', desc: 'Three singles and two doubles per tie. First to three rubbers wins; the fifth is played out for the points table.', blurb: 'Five rubbers per team tie' },
  { id: 'tt', name: 'Table Tennis', format: 'Team tie · best of 5', venue: 'Indoor Hall', players: '5', desc: 'Singles and doubles rubbers to eleven points. Two tables running in parallel through the group stage.', blurb: 'Eleven points, no mercy' },
  { id: 'chess', name: 'Chess', format: 'Rapid · 10 + 5', venue: 'Chess Room', players: '4', desc: 'Four-board team matches at ten minutes plus five seconds a move. Touch-move applies and phones stay outside the room.', blurb: 'Four boards, ten minutes each' },
  { id: 'carrom', name: 'Carrom', format: 'Singles & Doubles · 29 points', venue: 'Indoor Hall', players: '2–4', desc: 'Classic carrom board tournament. Queen with cover, standard ICF rules.', blurb: 'Strikes, pockets, and queen cover' }
];

export const MATCHES = [
  { id: 'm01', sport: 'cricket', day: 'd1', time: '08:30', venue: 'main', a: 'Narmada', b: 'Mahi', status: 'done', stage: 'Group A', score: '148/6 — 132/9', note: 'Narmada won by 16 runs' },
  { id: 'm02', sport: 'badminton', day: 'd1', time: '09:00', venue: 'indoor', a: 'Sabarmati', b: 'Tapi', status: 'done', stage: 'Team tie', score: '3 – 1', note: 'Sabarmati won the tie' },
  { id: 'm03', sport: 'chess', day: 'd1', time: '10:00', venue: 'chess', a: 'Vishwamitri', b: 'Aji', status: 'done', stage: 'Round 1', score: '2.5 – 1.5', note: 'Vishwamitri took board four' },
  { id: 'm04', sport: 'volleyball', day: 'd1', time: '11:30', venue: 'court2', a: 'Mahi', b: 'Damanganga', status: 'done', stage: 'Group B', score: '2 – 1', note: 'Mahi came back from a set down' },
  { id: 'm05', sport: 'football', day: 'd1', time: '15:00', venue: 'main', a: 'Narmada', b: 'Shetrunji', status: 'done', stage: 'Group A', score: '2 – 0', note: 'Both goals in the second half' },
  { id: 'm06', sport: 'tt', day: 'd1', time: '16:30', venue: 'indoor', a: 'Aji', b: 'Sabarmati', status: 'done', stage: 'Group A', score: '3 – 2', note: 'Decided on the last rubber' },

  { id: 'm07', sport: 'khokho', day: 'd2', time: '08:30', venue: 'court1', a: 'Tapi', b: 'Narmada', status: 'done', stage: 'Group A', score: '18 – 14', note: 'Tapi chased down 14 in the second turn' },
  { id: 'm08', sport: 'pickleball', day: 'd2', time: '09:00', venue: 'court3', a: 'Aji', b: 'Mahi', status: 'done', stage: 'Group B', score: '11–8, 11–6', note: 'Aji through in straight games' },
  { id: 'm09', sport: 'throwball', day: 'd2', time: '10:30', venue: 'court1', a: 'Damanganga', b: 'Vishwamitri', status: 'done', stage: 'Group A', score: '2 – 0', note: 'Damanganga unbeaten in the group' },
  { id: 'm10', sport: 'tug', day: 'd2', time: '12:00', venue: 'main', a: 'Shetrunji', b: 'Tapi', status: 'done', stage: 'Quarter-final', score: '2 – 1', note: 'Shetrunji held the third pull' },
  { id: 'm11', sport: 'cricket', day: 'd2', time: '15:00', venue: 'main', a: 'Sabarmati', b: 'Damanganga', status: 'done', stage: 'Group B', score: '121/7 — 118/8', note: 'Sabarmati won by 3 runs' },
  { id: 'm12', sport: 'badminton', day: 'd2', time: '16:00', venue: 'indoor', a: 'Narmada', b: 'Vishwamitri', status: 'done', stage: 'Team tie', score: '4 – 1', note: 'Narmada top of the group' },

  { id: 'm13', sport: 'chess', day: 'd3', time: '08:00', venue: 'chess', a: 'Narmada', b: 'Sabarmati', status: 'done', stage: 'Semi-final 1', score: '3 – 1', note: 'Narmada into the final' },
  { id: 'm14', sport: 'cricket', day: 'd3', time: '08:30', venue: 'main', a: 'Mahi', b: 'Tapi', status: 'done', stage: 'Semi-final 1', score: '156/5 — 149/7', note: 'Mahi won by 7 runs' },
  { id: 'm15', sport: 'tt', day: 'd3', time: '09:30', venue: 'indoor', a: 'Narmada', b: 'Damanganga', status: 'done', stage: 'Semi-final 2', score: '3 – 2', note: 'Fifth rubber went to deuce' },
  { id: 'm16', sport: 'volleyball', day: 'd3', time: '10:30', venue: 'court2', a: 'Narmada', b: 'Vishwamitri', status: 'live', stage: 'Semi-final 1', score: '25–22, 21–25, 18–16', note: 'Third set · Narmada leading' },
  { id: 'm17', sport: 'pickleball', day: 'd3', time: '11:00', venue: 'court3', a: 'Tapi', b: 'Shetrunji', status: 'done', stage: 'Semi-final 2', score: '11–9, 11–7', note: 'Tapi into the final' },
  { id: 'm18', sport: 'khokho', day: 'd3', time: '12:30', venue: 'court1', a: 'Mahi', b: 'Aji', status: 'live', stage: 'Semi-final 2', score: '9 – 6', note: 'Second turn · Aji chasing' },
  { id: 'm19', sport: 'football', day: 'd3', time: '15:00', venue: 'main', a: 'Tapi', b: 'Mahi', status: 'upcoming', stage: 'Semi-final 2', note: 'Winner meets Narmada in the final' },
  { id: 'm20', sport: 'throwball', day: 'd3', time: '16:00', venue: 'court1', a: 'Narmada', b: 'Aji', status: 'upcoming', stage: 'Semi-final 1' },
  { id: 'm21', sport: 'tug', day: 'd3', time: '17:00', venue: 'main', a: 'Narmada', b: 'Damanganga', status: 'upcoming', stage: 'Semi-final 2' },
  { id: 'm22', sport: 'badminton', day: 'd3', time: '18:30', venue: 'indoor', a: 'Tapi', b: 'Damanganga', status: 'upcoming', stage: 'Semi-final 2' },

  { id: 'm23', sport: 'cricket', day: 'd4', time: '08:30', venue: 'main', a: 'Narmada', b: 'Mahi', status: 'upcoming', stage: 'Final' },
  { id: 'm24', sport: 'tt', day: 'd4', time: '10:00', venue: 'indoor', a: 'Sabarmati', b: 'Narmada', status: 'upcoming', stage: 'Final' },
  { id: 'm25', sport: 'volleyball', day: 'd4', time: '11:30', venue: 'court2', a: 'Narmada', b: 'Winner SF2', status: 'upcoming', stage: 'Final' },
  { id: 'm26', sport: 'football', day: 'd4', time: '15:00', venue: 'main', a: 'Narmada', b: 'Winner SF2', status: 'upcoming', stage: 'Final' },
  { id: 'm27', sport: 'khokho', day: 'd4', time: '17:00', venue: 'court1', a: 'Tapi', b: 'Winner SF2', status: 'upcoming', stage: 'Final' },

  { id: 'm28', sport: 'pickleball', day: 'd5', time: '09:00', venue: 'court3', a: 'Aji', b: 'Tapi', status: 'upcoming', stage: 'Final' },
  { id: 'm29', sport: 'throwball', day: 'd5', time: '10:00', venue: 'court1', a: 'Damanganga', b: 'Winner SF1', status: 'upcoming', stage: 'Final' },
  { id: 'm30', sport: 'tug', day: 'd5', time: '11:30', venue: 'main', a: 'Shetrunji', b: 'Winner SF2', status: 'upcoming', stage: 'Final' },
  { id: 'm31', sport: 'badminton', day: 'd5', time: '14:00', venue: 'indoor', a: 'Narmada', b: 'Winner SF2', status: 'upcoming', stage: 'Final' },
  { id: 'm32', sport: 'chess', day: 'd5', time: '16:00', venue: 'chess', a: 'Narmada', b: 'Winner SF2', status: 'upcoming', stage: 'Final' }
];

export const MEALS = [
  { day: 'd1', breakfast: { time: '07:30 – 09:00', items: ['Thepla with chundo', 'Sev tameta', 'Boiled eggs', 'Banana', 'Masala chai'], tags: ['Veg', 'Jain on request'] },
    lunch: { time: '13:00 – 14:30', items: ['Gujarati dal', 'Bhaat (rice)', 'Rotli', 'Undhiyu', 'Kachumber', 'Chaas'], tags: ['Veg'] },
    dinner: { time: '19:30 – 21:00', items: ['Paneer tikka masala', 'Jeera rice', 'Rotli', 'Dal fry', 'Gulab jamun'], tags: ['Veg'] } },
  { day: 'd2', breakfast: { time: '07:30 – 09:00', items: ['Fafda and jalebi', 'Khaman', 'Sprouts', 'Tea and coffee'], tags: ['Veg'] },
    lunch: { time: '13:00 – 14:30', items: ['Dal baati churma', 'Rice', 'Rotli', 'Aloo shaak', 'Salad'], tags: ['Veg'] },
    dinner: { time: '19:30 – 21:00', items: ['Punjabi kadhi', 'Jeera rice', 'Rotli', 'Papad', 'Fruit bowl'], tags: ['Veg'] } },
  { day: 'd3', breakfast: { time: '07:30 – 09:00', items: ['Poha with sev', 'Idli and sambar', 'Egg bhurji', 'Chai'], tags: ['Veg', 'Egg'] },
    lunch: { time: '13:00 – 14:30', items: ['Gujarati thali', 'Dal', 'Bhaat', 'Rotli', 'Methi thepla', 'Chaas', 'Shrikhand'], tags: ['Veg'] },
    dinner: { time: '19:30 – 21:00', items: ['Chinese bhel counter', 'Veg fried rice', 'Manchurian', 'Soup'], tags: ['Veg'] } },
  { day: 'd4', breakfast: { time: '07:30 – 09:00', items: ['Methi paratha', 'Curd', 'Omelette', 'Fruit', 'Chai'], tags: ['Veg', 'Egg'] },
    lunch: { time: '13:00 – 14:30', items: ['Rice', 'Dal tadka', 'Rotli', 'Bhindi masala', 'Salad'], tags: ['Veg'] },
    dinner: { time: '19:30 – 21:00', items: ['Pav bhaji', 'Bhel', 'Masala chaas', 'Ice cream'], tags: ['Veg'] } },
  { day: 'd5', breakfast: { time: '07:30 – 09:00', items: ['Upma', 'Dokla', 'Banana', 'Chai'], tags: ['Veg'] },
    lunch: { time: '13:00 – 14:30', items: ['Special festival thali', 'Purvaiya', 'Dal', 'Bhaat', 'Rotli', 'Basundi'], tags: ['Veg'] },
    dinner: { time: '19:30 – 21:00', items: ['Closing dinner buffet', 'Live chaat counter', 'Kulfi'], tags: ['Veg'] } }
];

export const PLACES = [
  { id: 'laxmi', name: 'Laxmi Vilas Palace', dist: '4.2 km', cat: 'Heritage', img: 'assets/photos/laxmi-vilas.jpg', w: 1400, h: 934, alt: 'Laxmi Vilas Palace in Vadodara, seen from the lawns', text: 'The Gaekwad residence, four times the size of Buckingham Palace, with the Maharaja Fatehsinh Museum next door.' },
  { id: 'sayaji', name: 'Sayaji Baug', dist: '3.1 km', cat: 'Park', img: 'assets/photos/sayaji-baug.jpg', w: 1024, h: 685, alt: 'The band stand at Sayaji Baug in Vadodara', text: '113 acres of garden with a zoo, planetarium, toy train and the floral clock. A full half-day if you let it be.' },
  { id: 'eme', name: 'EME Temple', dist: '5.6 km', cat: 'Temple', img: 'assets/photos/eme-temple.jpg', w: 950, h: 1100, alt: 'The aluminium geodesic dome of the EME Temple, Vadodara', text: 'An aluminium geodesic shrine run by the Indian Army, carrying symbols of five faiths. Photo ID needed at the gate.' },
  { id: 'pavagadh', name: 'Champaner-Pavagadh', dist: '47 km', cat: 'Day trip', img: 'assets/stock/pavagadh.jpg', w: 1400, h: 934, alt: 'Aerial view of the Pavagadh hills and fort in Gujarat', text: 'A UNESCO World Heritage site: a hilltop temple, a medieval fort and mosques in the ravines below.' },
  { id: 'kirti', name: 'Kirti Mandir', dist: '2.4 km', cat: 'Heritage', img: 'assets/photos/kirti-mandir.jpg', w: 1600, h: 1067, alt: 'Kirti Mandir memorial in Vadodara', text: 'The Gaekwad memorial hall on the Vishwamitri, a short walk from the old city centre.' },
  { id: 'museum', name: 'Baroda Museum', dist: '3.3 km', cat: 'Museum', img: 'assets/photos/baroda-museum.jpg', w: 1000, h: 668, alt: 'The Indo-Saracenic facade of the Baroda Museum and Picture Gallery', text: 'Turner and Constable originals, Akota bronzes and an Egyptian mummy, inside a Indo-Saracenic landmark.' },
  { id: 'sou', name: 'Statue of Unity', dist: '90 km', cat: 'Day trip', img: 'assets/stock/statue-of-unity.jpg', w: 1400, h: 1115, alt: 'The Statue of Unity at dusk in Kevadia, Gujarat', text: 'The world\'s tallest statue at Kevadia. Leave by 6 AM, book the viewing gallery online, be back for dinner.' }
];

export const NOTIFS = [
  { id: 'n1', type: 'match', title: 'Your match starts in 15 minutes', body: 'Volleyball semi-final vs Vishwamitri · Court 2 · report to the duty desk.', time: '10:15 AM', unread: true, view: 'schedule' },
  { id: 'n2', type: 'meal', title: 'Lunch is served at 1:00 PM', body: 'Gujarati thali at the mess hall. Carry your player ID card.', time: '12:45 PM', unread: true, view: 'meals' },
  { id: 'n3', type: 'schedule', title: 'Schedule updated', body: 'Volleyball semi-final moved 30 minutes later to 10:30 AM.', time: '09:40 AM', unread: true, view: 'schedule' },
  { id: 'n4', type: 'venue', title: 'Venue changed', body: 'Tug of War semi-final now on the Main Ground, not Court 1.', time: '09:10 AM', unread: false, view: 'venues' },
  { id: 'n5', type: 'general', title: 'Cricket semi-final result', body: 'Mahi beat Tapi by 7 runs and meet Narmada in tomorrow\'s final.', time: '08:05 AM', unread: false, view: 'sports' },
  { id: 'n6', type: 'general', title: 'Water station added near Court 3', body: 'A second refill point is open behind the pickleball courts.', time: 'Yesterday', unread: false, view: 'venues' },
  { id: 'n7', type: 'general', title: 'Cultural night auditions', body: 'Sign up at the mess hall noticeboard before 6 PM on Day 4.', time: 'Yesterday', unread: false, view: 'home' },
  { id: 'n8', type: 'venue', title: 'Room inspection on Day 4', body: 'Wardens will inspect hostel blocks between 11 AM and 1 PM.', time: '14 Dec', unread: false, view: 'venues' }
];

export const NOTIF_LABELS = { match: 'Match alert', meal: 'Meal', schedule: 'Schedule', venue: 'Venue', general: 'Update' };
export const NOTIF_ICONS = { match: 'clock', meal: 'food', schedule: 'refresh', venue: 'pin', general: 'info' };

export const RULES = [
  { id: 'general', name: 'General', icon: 'info', sections: [
    { title: 'Eligibility', items: [
      'Open to every bonafide resident student of the eight SMJV hostel branches in Vadodara.',
      'Carry your hostel photo ID card and your digital player card at every venue at all times.',
      'A player may represent one hostel only and may enter any number of sports.',
      'Alumni, day scholars and external students are not eligible to compete; they may volunteer.',
      'Players must be currently enrolled and their hostel registration must be active for the academic year 2026–27.'
    ]},
    { title: 'Registration and team sheets', items: [
      'Individual registrations close at 6:00 PM on 30 November 2026 via the festival website.',
      'Team sheets (sport-specific squad lists) must be submitted to the sports secretary by 6:00 PM on 30 November 2026.',
      'Changes to a team sheet are allowed until 24 hours before that team\'s first match in a given sport.',
      'On-the-spot individual entries are accepted on Day 1 (14 December) until 9:00 AM, subject to draw size and availability.',
      'Late team entries are not accepted; individual sports with draws already fixed will not be reopened.'
    ]},
    { title: 'Kit and conduct on the field', items: [
      'Studs and moulded boots are permitted on the Main Ground only. Non-marking rubber-soled shoes are mandatory inside the Indoor Hall and the Chess Room.',
      'All jewellery must be removed or fully taped before play; referees may inspect before a match starts.',
      'Team captains must report to the duty desk 15 minutes before the scheduled start of their match.',
      'Each team must nominate a captain and a vice-captain on their team sheet; only the captain may formally address an official.',
      'Players found replacing a registered teammate with an unregistered substitute will result in forfeiture of that match for the team.'
    ]},
    { title: 'Walkovers and delays', items: [
      'A team not fielding the minimum number of players within 10 minutes of the official call is awarded a walkover loss.',
      'Weather delays, pitch or court issues, and other force-majeure events are decided exclusively by the sports secretary.',
      'The official schedule page on this website and the notification centre are the only authoritative channels for schedule changes.',
      'Abandoned matches are rescheduled at the sports secretary\'s discretion; no result carries over from an abandoned match unless explicitly stated.',
      'Power or equipment failure during an indoor sport is treated as a stoppage; play resumes from the exact score at the stoppage.'
    ]},
    { title: 'Scoring and points table', items: [
      'All group-stage sports award 2 points for a win, 1 for a draw (where applicable) and 0 for a loss.',
      'A walkover win is recorded as a win by the maximum margin for the sport.',
      'In the event of equal points after the group stage, the tie-breaker order is: (1) head-to-head result, (2) net run rate or point difference, (3) coin toss by the sports secretary.',
      'Semi-finals and finals are knock-out; no second chances. All knockout results are final.',
      'The overall hostel championship trophy is awarded to the hostel with the highest aggregate of points across all ten sports.'
    ]},
    { title: 'Protests and appeals', items: [
      'A formal protest must be submitted in writing to the sports secretary within 1 hour of the disputed event.',
      'The protest must specify the exact rule alleged to have been violated; general dissatisfaction is not a ground for protest.',
      'The sports secretary\'s decision on a protest is final; the festival convenor may review only on grounds of procedural error.',
      'Frivolous or repeated protests may result in a penalty of 1 championship point deducted from the protesting hostel.',
      'No protest is accepted about a referee\'s judgment call (e.g., fair vs. foul, in vs. out) — only rule misapplication.'
    ]}
  ]},
  { id: 'conduct', name: 'Code of Conduct', icon: 'flag', sections: [
    { title: 'Respect and sportsmanship', items: [
      'Verbal abuse, threatening behaviour or physical contact with any player, official, volunteer or spectator results in immediate suspension from that match.',
      'Only the team captain may formally address an official, and only between points, overs or natural stoppages — never during play.',
      'Opposing hostel chants and crowd participation are warmly welcomed; personal remarks targeting individual players are not.',
      'A player suspended from one match may not participate in any other match on the same day.',
      'Repeated unsporting conduct across matches may result in expulsion from the entire festival.'
    ]},
    { title: 'Fair play', items: [
      'Deliberate time-wasting, falsifying a score sheet or any other attempt to gain an unfair advantage results in a team-level penalty of forfeiture of that match.',
      'Any player fielded under another player\'s registration disqualifies that team from the sport permanently.',
      'Captains are responsible for ensuring every member of their squad has a valid player ID; ignorance of a squad member\'s ineligibility is not a defence.',
      'Score sheets must be signed by both captains at the end of each match; a signature confirms acceptance of the result.'
    ]},
    { title: 'Substances and equipment', items: [
      'Alcohol, tobacco products and any banned substance are strictly prohibited in all hostel premises and all playing venues throughout the festival.',
      'A positive rapid test or a credible possession report ends that player\'s participation immediately and is referred to the hostel disciplinary committee.',
      'Performance-enhancing substances as defined by WADA are banned regardless of whether testing is conducted.',
      'Any equipment found to be non-standard (e.g., doctored ball, weighted rope, illegal bat) results in forfeiture of the ongoing match.'
    ]},
    { title: 'Social media and media', items: [
      'Players and spectators may photograph and video-record matches for personal use; commercial or broadcast use requires prior written permission from the convenor.',
      'Posting hostile, defamatory or obscene content about participants, officials or the festival on social media may result in suspension.',
      'The official festival social media accounts are the only authorised channels for results and announcements; screenshots of unofficial chats are not considered official communication.'
    ]},
    { title: 'Reporting an incident', items: [
      'Any participant may report an incident to the duty desk (beside the Main Ground pavilion, staffed 7 AM–9 PM) or call the 24-hour helpline on +91 98250 40120.',
      'Written complaints must be submitted to the festival convenor by 9:00 PM on the day of the incident.',
      'Disciplinary hearings are held the same evening at 9:00 PM; decisions are issued within 24 hours.',
      'The identity of a complainant is kept confidential from the respondent party wherever possible.',
      'Retaliatory conduct against a complainant is treated as a separate and serious disciplinary offence.'
    ]}
  ] }
];

export const SPORT_RULES = {
  cricket: [
    'Each innings is limited to 6 overs. The batting team nominates 8 players; all must bat.',
    'Hard tennis ball. A delivery that passes above the batsman\'s shoulder on the full is called a no-ball.',
    'Maximum 2 overs per bowler. Front-foot no-balls result in a free hit on the next delivery.',
    'One powerplay covers overs 1–2: maximum 2 fielders outside the 30-yard circle. Normal fielding thereafter.',
    'A tied knockout match is decided by a Super Over; if the Super Over is also tied, the team that hit more boundaries across both innings wins.',
    'Caught behind appeals require the batsman to walk if the wicket-keeper confirms the edge; no DRS.',
    'Weather-shortened innings: Duckworth-Lewis-Stern method applies for matches reduced to 4 or more overs; fewer than 4 overs means no result.',
    'Only captains may consult the on-field umpire; players who approach the umpire unsolicited receive a formal warning.',
    'All fielding restrictions (helmets behind the wicket, etc.) follow BCCI domestic T20 playing conditions where not explicitly overridden above.'
  ],
  football: [
    'Two halves of 20 minutes with a 5-minute interval. The clock stops for injuries and substitutions in the final 2 minutes of each half.',
    'Seven players per side on the pitch; squads of up to 12 are permitted with rolling substitutions.',
    'Slide tackles from behind are a straight red card; slide tackles from the side are a yellow. No offside rule in the group stage.',
    'Offside rule applies from the semi-finals onwards under standard FIFA Laws of the Game.',
    'Goalkeepers may hold the ball for a maximum of 6 seconds before releasing; back-passes played deliberately with the foot may not be handled.',
    'Knockout matches tied at full time go directly to a penalty shoot-out: 3 kicks each, then sudden death if still level.',
    'A player who receives 2 yellow cards across the tournament is suspended for the next match; a red card means immediate one-match suspension.',
    'Shin guards are mandatory for all outfield players; failure to wear them means the player cannot take the field.'
  ],
  volleyball: [
    'Best of 3 sets. Sets 1–2 are played to 15 points; Set 3 (if needed) is played to 15 points. All sets must be won by 2 clear points, with a cap at 21.',
    'Six players on court. Rotation must follow service order strictly; the libero may replace any back-row player freely.',
    'A team is entitled to 2 time-outs of 30 seconds per set.',
    'Let serves are live — a serve that clips the net and lands in the correct court remains in play.',
    'The ball may be played off the antennae on a receive but must clear the net between the antennae on the way over.',
    'A player may touch the ball twice in succession only when the first touch is a block.',
    'The duty referee is nominated from the opposing hostel; both teams must provide a qualified line judge.',
    'Substitutions: each team may make up to 6 player substitutions per set; the libero does not count toward this limit.'
  ],
  pickleball: [
    'Doubles only. A single game to 11 points, win by 2. Match is best of 1 game in the group stage; best of 3 in the semi-finals and final.',
    'The serve must be underhand, contact below the waist, and directed diagonally to the opposite service box.',
    'The two-bounce rule: the return of serve must bounce once, and the serve must bounce once before either team may volley.',
    'The non-volley zone (kitchen) extends 7 feet from the net on each side. A player may not volley the ball while standing in the kitchen or touching the kitchen line.',
    'A foot fault on the serve (not behind the baseline, or stepping on/over the centre or sideline) results in a side-out or point loss.',
    'Only the serving team may score; a rally won by the receiving team results in a side-out (service change) but no point.',
    'If the ball touches any permanent object (net post, fence, etc.) it is dead and replayed as a let only if neither team caused it.',
    'Players who interfere with the opponent\'s shot (reaching over the net) lose the point regardless of where the ball bounced.'
  ],
  khokho: [
    'Nine chasers sit in a row alternating direction. Three defenders enter the field at one time in a fixed order.',
    'Each innings consists of two turns of 7 minutes each for both chasing and defending teams.',
    'A "kho" must be given from behind the seated chaser, calling "kho" audibly; a silent touch or a kho given from the front is a foul.',
    'An active chaser may only move in one direction; changing direction without giving a kho is a foul.',
    'A defender is out when touched by the active chaser or when they exit the boundary. All three defenders must be out for the turn to end early.',
    'The pole-dive rule: a chaser who dives around the pole must not touch the ground on the opposite side before the kho is given.',
    'If a defender intentionally delays entering the court, the referee may award points to the chasing team after a warning.',
    'The team that tags more defenders across both innings (adjusted for time remaining if an innings ends early) wins the match.'
  ],
  throwball: [
    'Six players per side on court. Best of 3 sets to 15 points, win by 2, cap at 21.',
    'The serve must be thrown from behind the end-line; the server may not step on or over the line during the serve.',
    'Two-handed throws only. Catching the ball with the body, arms, or against the chest is a foul.',
    'A player may not walk or run with the ball; once caught, the player must throw within 3 seconds.',
    'The ball may not be bounced off the court at any time during play.',
    'Net violations: if any part of the ball or the player\'s body crosses the net plane, it is a foul.',
    'Teams switch ends between sets. In a deciding set, teams switch ends when the first team reaches 8 points.',
    'Substitutions are made when the ball is dead; each team may make up to 4 substitutions per set.'
  ],
  tug: [
    'Eight active pullers and two reserves on each team. The same eight must start; substitutions are only allowed for injury.',
    'Best of 3 pulls. A pull is won when the centre mark of the rope crosses 4 metres from the starting position toward the winning team\'s side.',
    'Feet must remain outside the lane boundary markers (chalk lines, 60 cm from the rope). Any foot on or over the line is a foul; first foul is a warning, second forfeits the pull.',
    'The anchor (last puller) may wrap the rope around the body once only. Wrapping around the forearm, leg or waist (beyond one wrap) is a foul.',
    'No player may sit, kneel or lie on the ground at any point during a pull.',
    'The starting position is called by the referee; both teams must be stationary and facing their respective ends before the whistle.',
    'A pull that lasts more than 5 minutes without a result is declared a tie and replayed. A second tie in a match is decided by a coin toss.',
    'Rosin, chalk or grip aids applied to the hands or gloves are permitted; grip aids applied to the rope itself are not.'
  ],
  badminton: [
    'Each team tie consists of 5 rubbers: 3 singles and 2 doubles. The first team to win 3 rubbers wins the tie.',
    'All rubbers are best of 3 games to 15 points, win by 2, cap at 17.',
    'Shuttles are supplied by the tournament committee; a player may request a shuttle change only for an obviously damaged shuttle, at the umpire\'s discretion.',
    'A shuttle landing on the line is "in". Judgement of the line umpire (from the opposing hostel) is final on line calls.',
    'Service rules follow BWF Laws: the shuttle must be struck below the server\'s last rib, and the racket head must point downward at contact.',
    'The fifth rubber (if reached) is always played out to a result; it cannot be conceded for tie-winning purposes.',
    'Players who receive 2 conduct warnings in a tie are defaulted from the current rubber; a third warning means default from the tie.',
    'Rest between rubbers is 90 seconds; between games within a rubber is 60 seconds. Extended rests require medical certification.'
  ],
  tt: [
    'Each team tie consists of 5 rubbers: 4 singles and 1 doubles. The order of rubbers is fixed before the tie begins.',
    'Rubbers are best of 5 games to 11 points, win by 2.',
    'Service alternates every 2 points; in a deciding game, service changes when either player first reaches 5.',
    'The racket must have a different-coloured rubber on each side (ITTF standard: red and black).',
    'A service is illegal if the ball is not thrown at least 16 cm vertically, or if the hand is below table level at contact.',
    'Two tables run simultaneously during the group stage to manage time; in knockouts, one table is used per tie.',
    'An edge ball (touching the edge of the table top) is valid; a ball touching the side of the table is not in play.',
    'A let serve (ball clips the net and lands in the correct half) is replayed with no change in score or service order.'
  ],
  chess: [
    'Four-board team match. Each player plays one game; the team score is the sum of individual board results.',
    'Time control: 10 minutes per player with a 5-second increment per move (FIDE rapid rules).',
    'Touch-move applies: once a piece is touched with the intention of moving it, it must be moved if a legal move exists.',
    'If a player touches an opponent\'s piece with the intention of capturing, they must capture it if a legal capture exists.',
    'Phones and electronic devices must be left outside the playing room or placed face-down in a bag. A phone audible during play forfeits that board.',
    'Draws can be offered only immediately after making a move; an offer made at any other time is invalid.',
    'Board scores: 1 point for a win, 0.5 for a draw, 0 for a loss. Team match score is the sum across all 4 boards.',
    'In case of a tied team match (2–2), the team whose highest-ranked board won their game advances; if still tied, the team score from a designated board 4 tiebreak game determines the winner.'
  ]
};

export const FAQ = [
  { q: 'Who can take part?', a: 'Any resident student of the eight SMJV hostel branches in Vadodara. Alumni and day scholars can join the volunteers team but cannot play.' },
  { q: 'How do I register a team?', a: 'Register individually first and pick your sports. Your hostel sports secretary then submits the team sheet before 6 PM on 30 November.' },
  { q: 'Can I play more than one sport?', a: 'Yes. Check the timetable before selecting — the schedule flags clashes across your chosen sports on the registration success screen.' },
  { q: 'Where do I collect my kit?', a: 'The kit desk is at the hostel reception, open 8 AM to 8 PM from 12 December. Bring your player ID card.' },
  { q: 'What if it rains?', a: 'Outdoor matches are paused and rescheduled the same evening. The schedule page and notifications carry the official update — nothing else does.' },
  { q: 'Are meals included?', a: 'Yes, all registered players get breakfast, lunch and dinner at the mess hall for all five days. Carry your ID card to the counter.' },
  { q: 'Is there a dress code for the cultural night?', a: 'Traditional or smart casual. Dandiya sticks are provided at the ground; please do not bring your own.' },
  { q: 'Who do I contact in an emergency?', a: 'Call the 24-hour helpline on +91 98250 40120. The medical room is beside the Main Ground pavilion.' }
];

export const CONTACTS = [
  { role: 'Festival convenor', name: 'Dr. Mehul Trivedi', phone: '+91 98250 40121', email: 'convenor@intersmjv2026.in' },
  { role: 'Sports secretary', name: 'Riya Patel', phone: '+91 98250 40122', email: 'sports@intersmjv2026.in' },
  { role: 'Cultural secretary', name: 'Aman Sheikh', phone: '+91 98250 40123', email: 'culture@intersmjv2026.in' },
  { role: 'Hospitality and stay', name: 'Nidhi Desai', phone: '+91 98250 40124', email: 'stay@intersmjv2026.in' },
  { role: '24-hour helpline', name: 'Control room', phone: '+91 98250 40120', email: 'help@intersmjv2026.in' }
];

export const PARTNERS = [
  { cat: 'Title partner', name: 'Your brand here' },
  { cat: 'Kit partner', name: 'Your brand here' },
  { cat: 'Hospitality', name: 'Your brand here' },
  { cat: 'Travel', name: 'Your brand here' },
  { cat: 'Beverage', name: 'Your brand here' },
  { cat: 'Media', name: 'Your brand here' }
];

export const ROOMS = {
  'SMJV26-0142': { name: 'Aarav Mehta', block: 'Block B', room: 'B-214', bed: 'Bed 2', hostel: 'Narmada' },
  'SMJV26-0208': { name: 'Ishita Rao', block: 'Block D', room: 'D-108', bed: 'Bed 1', hostel: 'Tapi' },
  'SMJV26-0331': { name: 'Kabir Solanki', block: 'Block A', room: 'A-302', bed: 'Bed 3', hostel: 'Mahi' }
};

export const DEMO_PLAYER = {
  name: 'Aarav Mehta',
  gr: 'SMJV26-0142',
  hostel: 'Narmada',
  sports: ['Cricket', 'Volleyball'],
  room: 'B-214',
  year: 'TY B.Com'
};
