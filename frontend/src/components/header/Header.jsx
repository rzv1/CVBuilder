import React from 'react';
import HeaderBrand from './HeaderBrand.jsx';
import HeaderCenter from './HeaderCenter.jsx';
import HeaderActions from './HeaderActions.jsx';

export default function Header() {
  return (
    <header className="relative flex items-center justify-between px-6 py-3 bg-slate-900/95 border-b border-slate-800 z-50 shrink-0">
      {/* Brand & Status */}
      <div className="flex items-center z-10">
        <HeaderBrand />
      </div>

      {/* Center - Mode Switcher, Dynamic Tailoring Variant Selector & Collaborators */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10">
        <HeaderCenter />
      </div>

      {/* Right Actions */}
      <div className="flex items-center z-10">
        <HeaderActions />
      </div>
    </header>
  );
}

