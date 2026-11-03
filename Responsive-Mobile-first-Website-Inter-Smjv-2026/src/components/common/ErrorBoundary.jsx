// ============================================================================
// React Error Boundary Component (Compartmentalization & Fault Isolation)
// Prevents any single page or component crash from breaking the whole portal
// ============================================================================

import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`[Fault Isolation] Component "${this.props.name || 'Unknown'}" crashed:`, error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 sm:p-8 rounded-3xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-xl space-y-4 text-left my-4 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center text-xl flex-shrink-0">
              ⚠️
            </div>
            <div>
              <h3 className="font-display text-lg uppercase tracking-wide text-white">
                {this.props.name || 'Component'} Section Unavailable
              </h3>
              <p className="text-xs text-rose-300">
                Compartmentalization Active: This specific component encountered an issue, but the rest of the website is functioning normally.
              </p>
            </div>
          </div>

          {this.state.error && (
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-zinc-400 overflow-x-auto max-h-24">
              {this.state.error.toString()}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-marigold to-saffron text-black font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              🔄 Reload Section
            </button>
            {this.props.onNavigateHome && (
              <button
                onClick={this.props.onNavigateHome}
                className="px-4 py-2 rounded-xl border border-white/20 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/5"
              >
                Go to Home
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
