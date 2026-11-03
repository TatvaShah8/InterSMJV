// ============================================================================
// Shared UI Primitive Components (Icons, Pictograms, Bandhani Dividers)
// ============================================================================

import React from 'react';
import { UI_ICONS, SPORT_ART } from '../../data/tournamentData.js';

export function Icon({ name, className = "w-5 h-5", size }) {
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

export function SportPictogram({ id, className = "w-12 h-12" }) {
  const art = SPORT_ART[id] || '';
  return (
    <svg 
      className={`inline-block flex-shrink-0 ${className}`} 
      viewBox="0 0 64 64" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: art }}
    />
  );
}

export function BandhaniDivider() {
  return (
    <div className="w-full h-5 my-8 opacity-40 overflow-hidden relative" aria-hidden="true">
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `radial-gradient(circle at 8px 10px, rgba(255, 197, 61, 0.4) 2px, transparent 2.5px),
                            radial-gradient(circle at 24px 10px, rgba(255, 122, 26, 0.4) 2px, transparent 2.5px)`,
          backgroundSize: '32px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      />
    </div>
  );
}
