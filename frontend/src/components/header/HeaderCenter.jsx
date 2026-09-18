import React from 'react';
import { 
  GitCommit, 
  Users, 
  Layers,
  User,
  Terminal
} from 'lucide-react';
import { Button } from '@/frontend/components/ui/button';
import { Badge } from '@/frontend/components/ui/badge';

export default function HeaderCenter({
  isDevMode,
  handleNormalMode,
  handleDevMode,
  activeVariant,
  handleVariantChange,
  variants,
  commitTag,
  commitHash,
  collaborators,
  onOpenDiffModal
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Discrete Mode Switcher Segmented Control */}
      <div 
        className={`flex items-center bg-slate-950/80 border rounded-full p-0.5 gap-0.5 transition-all duration-200 ${
          isDevMode ? 'border-purple-500/50 shadow-md shadow-purple-500/20' : 'border-slate-800'
        }`}
        title="Comută între Normal View și Dev View"
      >
        <button 
          type="button"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
            !isDevMode 
              ? 'bg-slate-800 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          onClick={handleNormalMode}
        >
          <User className="size-3.5" />
          <span>Normal</span>
        </button>
        <button 
          type="button"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
            isDevMode 
              ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/40 text-purple-200 shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          onClick={handleDevMode}
        >
          <Terminal className={`size-3.5 ${isDevMode ? 'text-purple-400' : 'text-slate-400'}`} />
          <span>Dev Mode</span>
          {isDevMode && (
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Dynamic Tailoring Selector */}
      <div 
        className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-lg" 
        title="Dynamic Tailoring: Filter CV entries by active profile"
      >
        <Layers className="size-3.5 text-blue-400" />
        <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Profile:</label>
        <select 
          className="bg-transparent text-xs font-semibold text-blue-400 outline-none cursor-pointer border-none pr-1"
          value={activeVariant}
          onChange={handleVariantChange}
        >
          {variants.map(v => (
            <option key={v.id} value={v.id} className="bg-slate-900 text-slate-100">{v.label}</option>
          ))}
        </select>
      </div>

      {/* Real-time Collaborators stack */}
      <div className="flex items-center gap-2 pl-1" title="Live Collaboration Room">
        <div className="flex items-center -space-x-2">
          {collaborators.map(collab => (
            <img 
              key={collab.id} 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${collab.name.split(' ')[0]}`}
              alt={collab.name}
              className="h-7 w-7 rounded-full border-2 border-slate-900 object-cover"
              title={`${collab.name} - ${collab.status}`}
            />
          ))}
        </div>
        <Badge variant="purple" className="text-[10px] py-0 px-1.5 gap-1 font-semibold">
          <Users className="size-2.5" /> 2 Online
        </Badge>
      </div>
    </div>
  );
}
