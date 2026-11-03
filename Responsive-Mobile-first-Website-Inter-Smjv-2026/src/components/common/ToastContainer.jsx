// ============================================================================
// Toast Container Component
// ============================================================================

import React from 'react';
import { Icon } from './UIComponents.jsx';

export default function ToastContainer({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto p-4 rounded-2xl border border-white/20 bg-[#0E1433]/95 backdrop-blur-2xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-bottom-4 fade-in duration-300"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-black flex items-center justify-center flex-shrink-0 shadow-md">
            <Icon name={toast.iconName || 'bell'} className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white leading-tight uppercase tracking-wider">{toast.title}</h4>
            <p className="text-xs text-ink-sub mt-0.5 leading-snug">{toast.message}</p>
          </div>
          <button 
            onClick={() => removeToast(toast.id)} 
            className="text-ink-muted hover:text-white p-1 cursor-pointer"
            aria-label="Dismiss alert"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
