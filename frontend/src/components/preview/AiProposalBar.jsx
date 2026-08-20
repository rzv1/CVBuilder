import React from 'react';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  Check,
  X,
  FileCode,
  Layers
} from '../Icons.jsx';
import { Button } from '@/frontend/components/ui/button';
import { Badge } from '@/frontend/components/ui/badge';
import { Input } from '@/frontend/components/ui/input';

export default function AiProposalBar({
  pendingProposal,
  proposalViewMode,
  setProposalViewMode,
  isCreatingProfile,
  setIsCreatingProfile,
  newProfileName,
  setNewProfileName,
  handleCreateProfileSubmit,
  onAcceptCurrent,
  onRejectProposal
}) {
  if (!pendingProposal) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border-b-2 border-purple-500 p-3.5 px-5 flex items-start justify-between gap-5 z-10 shadow-xl shadow-purple-950/20 flex-wrap">
      {/* Left Side: AI Explanation & Token Savings Indicator */}
      <div className="flex-1 min-w-[280px]">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <div className="bg-purple-600 p-1 rounded-md flex items-center justify-center shadow-sm">
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="text-sm font-extrabold text-slate-100">
            Propunere de Optimizare AI (JSON Patch RFC 6902)
          </span>
          <Badge variant="purple" className="text-[10px] font-bold gap-1 py-0.5">
            <FileCode className="size-3" /> ~85% TOKEN SAVINGS
          </Badge>
          {pendingProposal.stylePaths && pendingProposal.stylePaths.size > 0 && (
            <Badge className="bg-purple-950 text-purple-200 border border-purple-500 text-[10px] font-bold py-0.5">
              🎨 Stil Modificat ({pendingProposal.stylePaths.size})
            </Badge>
          )}
        </div>

        <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-2 px-3 rounded-lg border-l-4 border-purple-500 break-words">
          <strong className="text-purple-300">Explicație AI:</strong> {pendingProposal.explanation || "Am generat patch-uri JSON restrânse conform schemelor din content-schema.json."}
          {pendingProposal.stylePaths && pendingProposal.stylePaths.size > 0 && (
            <div className="mt-1 text-[11px] text-purple-300">
              <strong>Câmpuri de Stil Schimbate:</strong> {Array.from(pendingProposal.stylePaths).join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Stacked Controls (BEFORE/AFTER Toggle + Action Buttons) */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        {/* Top Right: Before / After Toggle Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Mod Diferențe:
          </span>
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setProposalViewMode('before')}
              className={`h-7 text-xs font-bold rounded px-3 transition-colors ${
                proposalViewMode === 'before'
                  ? 'bg-red-600 text-white hover:bg-red-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-transparent'
              }`}
            >
              BEFORE
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setProposalViewMode('after')}
              className={`h-7 text-xs font-bold rounded px-3 transition-colors ${
                proposalViewMode === 'after'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-transparent'
              }`}
            >
              AFTER
            </Button>
          </div>
        </div>

        {/* Bottom Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {isCreatingProfile ? (
            <form onSubmit={handleCreateProfileSubmit} className="flex items-center gap-1.5">
              <Input
                type="text"
                className="h-7 text-xs px-2.5 w-44 bg-slate-950 border-slate-700 text-slate-100"
                placeholder="Nume Profil Nou..."
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                autoFocus
              />
              <Button type="submit" size="xs" className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
                <Check className="size-3.5" /> Salvează
              </Button>
              <Button type="button" variant="outline" size="icon-xs" className="h-7 w-7 border-slate-700 text-slate-300 hover:text-white" onClick={() => setIsCreatingProfile(false)}>
                <X className="size-3.5" />
              </Button>
            </form>
          ) : (
            <>
              <Button
                type="button"
                size="xs"
                className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1.5 text-xs shadow-md shadow-emerald-900/30"
                onClick={() => onAcceptCurrent(pendingProposal)}
                title="Aplică patch-ul pe profilul curent"
              >
                <CheckCircle className="size-3.5" /> Acceptă pe Profil Curent
              </Button>

              <Button
                type="button"
                variant="outline"
                size="xs"
                className="h-7 bg-purple-950/80 border-purple-600/60 text-purple-200 hover:bg-purple-900 hover:text-white font-bold gap-1.5 text-xs"
                onClick={() => setIsCreatingProfile(true)}
                title="Aplică patch-ul și salvează ca un profil nou"
              >
                <Layers className="size-3.5 text-purple-300" /> Acceptă & Profil Nou
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="xs"
                className="h-7 bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 font-bold gap-1.5 text-xs"
                onClick={onRejectProposal}
                title="Anulează propunerea"
              >
                <XCircle className="size-3.5" /> Respinge
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
