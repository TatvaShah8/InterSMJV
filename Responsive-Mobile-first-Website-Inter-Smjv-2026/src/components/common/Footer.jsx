// ============================================================================
// Footer Component with Tournament Links, 24/7 Helpline, and Gujarati Branding
// ============================================================================

import React from 'react';
import { Icon } from './UIComponents.jsx';

export default function Footer({ navigateTo }) {
  return (
    <footer className="border-t border-white/10 bg-[#050817] mt-16 pt-12 pb-24 md:pb-12 text-ink-muted text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFE5C9] p-1 shadow-md border border-amber-300/40">
              <img src="inter_smjv_2026_vadodara_logo.svg" alt="Tournament Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-display tracking-wider text-xl text-white">INTER SMJV 2026</span>
          </div>
          <p className="text-ink-sub leading-relaxed">
            Ten sports. Eight hostels. Five days in Vadodara. The flagship inter-hostel athletic festival of Shri Mahavira Jaina Vidyalaya.
          </p>
          <p className="font-gu text-marigold text-sm font-semibold">
            ખેલો ગુજરાત, જીતો દિલ — ૧૪ થી ૧૮ ડિસેમ્બર ૨૦૨૬
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white tracking-wider uppercase mb-3 text-xs">Festival Links</h4>
          <ul className="space-y-2">
            <li><button onClick={() => navigateTo('schedule')} className="hover:text-white transition-colors cursor-pointer">Match Schedule</button></li>
            <li><button onClick={() => navigateTo('sports')} className="hover:text-white transition-colors cursor-pointer">10 Sports & Fixtures</button></li>
            <li><button onClick={() => navigateTo('rulebook')} className="hover:text-white transition-colors cursor-pointer">Official Rule Book & PDF</button></li>
            <li><button onClick={() => navigateTo('venues')} className="hover:text-white transition-colors cursor-pointer">Campus Ground & Room Lookup</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white tracking-wider uppercase mb-3 text-xs">Player & Stay</h4>
          <ul className="space-y-2">
            <li><button onClick={() => navigateTo('register')} className="hover:text-white transition-colors cursor-pointer">Digital Player Registration</button></li>
            <li><button onClick={() => navigateTo('dashboard')} className="hover:text-white transition-colors cursor-pointer">Personalized Dashboard</button></li>
            <li><button onClick={() => navigateTo('meals')} className="hover:text-white transition-colors cursor-pointer">5-Day Gujarati Mess Timetable</button></li>
            <li><button onClick={() => navigateTo('explore')} className="hover:text-white transition-colors cursor-pointer">Explore Vadodara Landmarks</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white tracking-wider uppercase mb-3 text-xs">Emergency & Control Room</h4>
          <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-1.5">
            <span className="text-[10px] font-bold tracking-widest uppercase text-saffron block">24-Hour Duty Desk</span>
            <a href="tel:+919825040120" className="text-sm font-bold text-white hover:text-marigold block">
              +91 98250 40120
            </a>
            <p className="text-[11px] text-ink-sub">Medical tent beside Main Ground Pavilion, Karelibaug, Vadodara.</p>
          </div>
          <button 
            onClick={() => navigateTo('styleguide')} 
            className="mt-3 text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Icon name="spark" className="w-3 h-3" /> View Design System & Style Guide
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-ink-muted text-[11px]">
        <p>© 2026 INTER SMJV · SMJV Hostel Branch, Vadodara. All rights reserved.</p>
        <p className="flex items-center gap-2">
          <span>Built with React & Tailwind CSS</span>
          <span>•</span>
          <span>WCAG AA Accessible</span>
        </p>
      </div>
    </footer>
  );
}
