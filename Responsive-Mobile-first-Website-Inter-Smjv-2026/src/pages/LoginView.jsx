// ============================================================================
// INTER SMJV 2026 — LoginView
// ============================================================================

import React, { useState } from 'react';
import { saveUserSession } from '../utils/cookie.js';
import { Icon, SportPictogram, BandhaniDivider } from '../components/common/UIComponents.jsx';
import { ROOMS, DEMO_PLAYER } from '../data/tournamentData.js';

export default function LoginView({ navigateTo, addToast, setPlayer, onOpenIdCard }) {
  const [gr, setGr] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!gr.trim()) {
      alert('Please enter your GR Number or Email');
      return;
    }

    // Check if we have an existing registered profile
    let currentProfile = null;
    try {
      const stored = localStorage.getItem('smjv26.player');
      if (stored) currentProfile = JSON.parse(stored);
    } catch (err) {}

    const matchedRoom = ROOMS[gr.trim().toUpperCase()] || null;
    const userName = currentProfile?.name || matchedRoom?.name || 'Aarav Mehta';
    const userGr = gr.trim().toUpperCase();

    const loggedInUser = {
      ...(currentProfile || DEMO_PLAYER),
      name: userName,
      gr: userGr,
      grNo: userGr,
      email: gr.includes('@') ? gr.trim() : (currentProfile?.email || 'student@smjv.edu'),
      password: pass,
      branch: matchedRoom?.hostel || currentProfile?.branch || 'Vadodara (Host Branch)',
      hostel: matchedRoom?.hostel || currentProfile?.hostel || 'Narmada',
    };

    // Save login credentials to cookies and session storage
    saveUserSession(loggedInUser);
    if (setPlayer) setPlayer(loggedInUser);

    addToast('Signed In', `Welcome back, ${userName}! Credentials saved in cookies.`, 'checkCircle');
    navigateTo('dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="p-8 rounded-3xl border border-white/15 bg-[#0E1433]/80 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold tracking-widest uppercase text-saffron block">Player Access</span>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">Sign In</h1>
          <p className="text-xs text-ink-muted">Use the GR number or email registered with your hostel entry.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
              GR Number or Email *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SMJV26-0142"
              value={gr}
              onChange={e => setGr(e.target.value)}
              className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted block mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full bg-[#070B1E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-marigold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-marigold to-saffron hover:from-amber-300 hover:to-orange-500 shadow-md shadow-amber-500/20 transition-transform active:scale-95"
          >
            Access Player Portal
          </button>
        </form>

        <div className="text-center text-xs text-ink-muted pt-2 border-t border-white/10">
          <span>New student player? </span>
          <button onClick={() => navigateTo('register')} className="text-marigold font-bold hover:underline">
            Register Player ID
          </button>
        </div>
      </div>
    </div>
  );
}
