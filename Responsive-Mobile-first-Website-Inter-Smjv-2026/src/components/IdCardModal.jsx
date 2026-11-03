// ============================================================================
// INTER SMJV 2026 — Official Digital Accreditation ID Card Modal
// Displays complete student athlete credentials with real generated QR Code
// ============================================================================

import React from 'react';
import { QRCodeView } from '../utils/qrCode.jsx';

export default function IdCardModal({ isOpen, onClose, player }) {
  if (!isOpen || !player) return null;

  const fullName = [player.name, player.middlename, player.surname]
    .filter(Boolean)
    .join(' ') || player.name || 'Participant';

  const sportsList = Array.isArray(player.sports) ? player.sports : [];

  // Data string encoded in QR code
  const qrPayload = JSON.stringify({
    event: "INTER SMJV 2026",
    gr: player.grNo || player.gr || "SMJV26-0000",
    name: fullName,
    branch: player.branch || player.hostel || "Vadodara",
    role: player.role || "Sports Team",
    sports: sportsList,
    bg: player.bloodGroup || "O+",
    verified: true,
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md my-auto rounded-3xl overflow-hidden border border-amber-400/40 bg-gradient-to-b from-[#141B44] via-[#0E1433] to-[#070B1E] shadow-2xl text-white transform transition-all animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header / Holographic Band */}
        <div className="p-4 bg-gradient-to-r from-marigold via-amber-400 to-saffron text-black flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EFE5C9] p-1 shadow-sm border border-amber-300 flex items-center justify-center">
              <img src="inter_smjv_2026_vadodara_logo.svg" alt="SMJV Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display tracking-wider text-lg leading-none block">INTER SMJV 2026</span>
              <span className="text-[9px] font-semibold tracking-widest uppercase text-black/80 font-mono block">
                Vadodara · આંતર હોસ્ટેલ
              </span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-lg bg-black text-amber-300 font-mono border border-amber-300/30">
            {player.role ? player.role.toUpperCase() : 'OFFICIAL PASS'}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5">
          
          {/* Photo & Primary Bio */}
          <div className="flex items-start gap-4">
            {/* Student Photo */}
            <div className="w-22 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-950 border-2 border-amber-400/80 p-0.5 shadow-xl flex-shrink-0 overflow-hidden flex items-center justify-center relative group">
              {player.photo ? (
                <img 
                  src={player.photo} 
                  alt={fullName} 
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center font-display text-2xl text-white">
                  <span>
                    {(player.name?.[0] || 'A') + (player.surname?.[0] || 'M')}
                  </span>
                  <span className="text-[9px] text-amber-300 font-sans font-normal mt-0.5">Photo</span>
                </div>
              )}
            </div>

            {/* Core Info */}
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-saffron/20 text-saffron border border-saffron/30 font-mono">
                  {player.branch || player.hostel || 'Vadodara'} Branch
                </span>
                {player.bloodGroup && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                    🩸 {player.bloodGroup}
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl uppercase tracking-wide text-white leading-tight">
                {fullName}
              </h2>

              <div className="font-mono text-xs text-amber-300 font-bold flex items-center gap-1.5">
                <span>GR:</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded border border-white/15">
                  {player.grNo || player.gr || 'SMJV26-0142'}
                </span>
              </div>

              {player.age && (
                <p className="text-[11px] text-ink-muted">
                  Age: <strong className="text-white">{player.age} yrs</strong>
                  {player.gender && <span> · {player.gender}</span>}
                </p>
              )}
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-white/5 border border-white/10">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-ink-muted block font-mono">Mobile Number</span>
              <p className="font-mono text-white font-semibold text-xs truncate mt-0.5">
                {player.mobile || player.phone || '+91 98250 40142'}
              </p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-ink-muted block font-mono">Email Address</span>
              <p className="font-mono text-white font-semibold text-xs truncate mt-0.5" title={player.email}>
                {player.email || 'student@smjv.edu'}
              </p>
            </div>
            {player.college && (
              <div className="col-span-2 pt-1 border-t border-white/5">
                <span className="text-[9px] uppercase tracking-wider text-ink-muted block font-mono">Institution / Course</span>
                <p className="text-xs text-ink-sub truncate">
                  {player.college} {player.course ? `· ${player.course}` : ''} {player.year ? `(${player.year})` : ''}
                </p>
              </div>
            )}
          </div>

          {/* Sports or Role Activities */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              <span>{player.role === 'Sports Team' ? 'Sports Playing' : 'Accredited Category'}</span>
              {player.tshirtSize && (
                <span className="text-amber-300">Kit: {player.tshirtSize} (T) / {player.pantSize || '-'} (P)</span>
              )}
            </div>

            {sportsList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {sportsList.map((sport, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-bold uppercase px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/40 text-amber-200 flex items-center gap-1.5"
                  >
                    <span>⚡</span>
                    <span>{sport}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-amber-300 font-semibold bg-white/5 p-2 rounded-xl border border-white/5">
                {player.role === 'Cultural Team' ? '🎭 Cultural Team Participant' : '🎟️ Official Festival Visitor'}
              </p>
            )}
          </div>

          {/* Scannable Official QR Code & Barcode */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron block font-mono">
                Scan for Verification
              </span>
              <p className="text-[10px] text-ink-muted leading-tight">
                Accreditation pass certified by INTER SMJV Vadodara Organizing Committee.
              </p>
              <div className="pt-1 text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                <span>✓</span> Verified Student Athlete
              </div>
            </div>

            {/* Generated QR Code */}
            <div className="p-2 bg-white rounded-xl shadow-lg flex-shrink-0">
              <QRCodeView value={qrPayload} size={90} />
            </div>
          </div>

          {/* Barcode Strip */}
          <div className="pt-2 border-t border-white/10 space-y-1 text-center">
            <div className="h-7 flex items-center justify-between opacity-80 px-2 bg-white/5 rounded-lg py-1">
              {[...Array(38)].map((_, i) => (
                <span 
                  key={i} 
                  className="bg-white inline-block h-full" 
                  style={{ width: (i % 4 === 0 ? '3px' : i % 2 === 0 ? '1px' : '2px') }} 
                />
              ))}
            </div>
            <div className="flex justify-between items-center text-[8px] font-mono tracking-widest text-ink-muted uppercase">
              <span>SMJV-VADODARA-2026</span>
              <span>DIGITAL PASS #{player.grNo || player.gr || '0142'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-marigold to-saffron hover:from-amber-300 hover:to-orange-500 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <span>🖨️ Print / Save Pass</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-white border border-white/20 bg-white/5 hover:bg-white/10"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
