import React from 'react';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  Check,
  X,
  Layers
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/src/components/ui/tabs';

import { SimpleMarkdown } from '../ui/simple-markdown.jsx';

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
    <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border-b-2 border-purple-500 p-3.5 px-5 flex flex-col gap-2 z-10 shadow-xl shadow-purple-950/20">
      {/* Top Header: Title, Style Badge, and Before/After Toggle */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-purple-600 p-1 rounded-md flex items-center justify-center shadow-sm">
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="text-sm font-extrabold text-slate-100">
            Propunere de Optimizare
          </span>
          {pendingProposal.stylePaths && pendingProposal.stylePaths.size > 0 && (
            <Badge variant="outline" className="bg-purple-950/80 text-purple-300 border-purple-500/60 text-[10px] font-bold py-0.5">
              Stil Modificat ({pendingProposal.stylePaths.size})
            </Badge>
          )}
        </div>

        {/* Before / After Toggle Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Mod Diferențe:
          </span>
          <Tabs
            value={proposalViewMode}
            onValueChange={(details) => setProposalViewMode(details.value)}
            className="w-auto"
          >
            <TabsList className="h-7.5 bg-slate-950 border border-slate-800 p-0.5 rounded-lg flex items-center gap-1">
              <TabsTrigger
                value="before"
                className={`h-6 text-xs font-bold rounded px-3 transition-colors ${
                  proposalViewMode === 'before'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                BEFORE
              </TabsTrigger>
              <TabsTrigger
                value="after"
                className={`h-6 text-xs font-bold rounded px-3 transition-colors ${
                  proposalViewMode === 'after'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                AFTER
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* AI Explanation / Reasoning Box */}
      <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-2.5 px-3.5 rounded-lg border-l-4 border-purple-500 break-words shadow-inner">
        <div className="flex items-center gap-1.5 mb-1.5 text-purple-300 font-bold">
          <Sparkles className="size-3.5" />
          <span>AI reasoning:</span>
        </div>
        <SimpleMarkdown content={pendingProposal.explanation || "Generated restricted JSON patches according to content-schema.json."} />
        {pendingProposal.stylePaths && pendingProposal.stylePaths.size > 0 && (
          <div className="mt-2 pt-1.5 border-t border-slate-800/80 text-[11px] text-purple-300 flex items-center gap-1.5 flex-wrap">
            <strong className="font-semibold">Style fields changed:</strong>
            <span className="text-slate-400 font-mono text-[10px]">{Array.from(pendingProposal.stylePaths).join(', ')}</span>
          </div>
        )}
      </div>

      {/* Action Buttons: Positioned directly under the AI explanation, aligned to the right */}
      <div className="flex items-center justify-end gap-2 mt-0.5 flex-wrap">
        {isCreatingProfile ? (
          <form onSubmit={handleCreateProfileSubmit} className="flex items-center gap-1.5">
            <Input
              type="text"
              size="sm"
              className="h-7 text-xs px-2.5 w-48 bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500"
              placeholder="Nume Profil Nou..."
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              autoFocus
            />
            <Button
              type="submit"
              size="xs"
              className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs border-0 shadow-md shadow-emerald-900/30"
            >
              <Check className="size-3.5" /> Salvează
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              className="h-7 w-7 border-slate-700 text-slate-300 hover:text-white"
              onClick={() => setIsCreatingProfile(false)}
              title="Anulează"
            >
              <X className="size-3.5" />
            </Button>
          </form>
        ) : (
          <>
            <Button
              type="button"
              size="xs"
              className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1.5 text-xs shadow-md shadow-emerald-900/30 border-0"
              onClick={() => onAcceptCurrent(pendingProposal)}
              title="Aplică patch-ul pe profilul curent"
            >
              <CheckCircle className="size-3.5" /> Acceptă pe Profil Curent
            </Button>

            <Button
              type="button"
              variant="outline"
              size="xs"
              className="h-7 bg-purple-950/80 border-purple-600/60 text-purple-200 hover:bg-purple-900 hover:text-white font-bold gap-1.5 text-xs shadow-md shadow-purple-950/30"
              onClick={() => setIsCreatingProfile(true)}
              title="Aplică patch-ul și salvează ca un profil nou"
            >
              <Layers className="size-3.5 text-purple-300" /> Acceptă & Profil Nou
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="xs"
              className="h-7 bg-red-950/60 border border-red-500/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 font-bold gap-1.5 text-xs"
              onClick={onRejectProposal}
              title="Anulează propunerea"
            >
              <XCircle className="size-3.5" /> Respinge
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
