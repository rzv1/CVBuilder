import React from 'react';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  Check,
  X,
  Layers
} from 'lucide-react';
import { Button } from '@/frontend/src/components/ui/button';
import { Badge } from '@/frontend/src/components/ui/badge';
import { Input } from '@/frontend/src/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/frontend/src/components/ui/tabs';

/**
 * Simple Markdown Parser Helper for rendering inline formatting (bold, italic, code)
 */
function parseInlineMarkdown(text) {
  if (!text) return null;
  const tokens = [];
  const regex = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.substring(lastIndex, match.index));
    }
    const chunk = match[0];
    if ((chunk.startsWith('**') && chunk.endsWith('**')) || (chunk.startsWith('__') && chunk.endsWith('__'))) {
      tokens.push(<strong key={match.index} className="font-semibold text-slate-100">{chunk.slice(2, -2)}</strong>);
    } else if ((chunk.startsWith('*') && chunk.endsWith('*')) || (chunk.startsWith('_') && chunk.endsWith('_'))) {
      tokens.push(<em key={match.index} className="italic text-purple-200">{chunk.slice(1, -1)}</em>);
    } else if (chunk.startsWith('`') && chunk.endsWith('`')) {
      tokens.push(<code key={match.index} className="px-1 py-0.5 rounded bg-slate-900 text-purple-300 font-mono text-[11px] border border-slate-800">{chunk.slice(1, -1)}</code>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.substring(lastIndex));
  }

  return tokens.length > 0 ? tokens : text;
}

/**
 * Parses simple markdown blocks: headers (#, ##, ###), bullet lists (-, *, •), numbered lists (1.), and newlines
 */
export function SimpleMarkdown({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let currentList = null;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      if (currentList) {
        elements.push(currentList);
        currentList = null;
      }
      return;
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      if (currentList) { elements.push(currentList); currentList = null; }
      elements.push(
        <h5 key={`h3-${index}`} className="font-bold text-xs text-purple-300 mt-2 mb-1">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h5>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      if (currentList) { elements.push(currentList); currentList = null; }
      elements.push(
        <h4 key={`h2-${index}`} className="font-bold text-xs text-indigo-300 mt-2 mb-1">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      if (currentList) { elements.push(currentList); currentList = null; }
      elements.push(
        <h3 key={`h1-${index}`} className="font-extrabold text-sm text-slate-100 mt-2.5 mb-1">
          {parseInlineMarkdown(trimmed.slice(2))}
        </h3>
      );
      return;
    }

    // Unordered List Items
    if (/^[-*•]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*•]\s+/, '');
      const li = (
        <li key={`li-${index}`} className="flex items-start gap-1.5 my-0.5 text-xs text-slate-300">
          <span className="text-purple-400 select-none leading-relaxed">•</span>
          <span className="flex-1 leading-relaxed">{parseInlineMarkdown(itemText)}</span>
        </li>
      );
      if (!currentList) {
        currentList = <ul key={`ul-${index}`} className="my-1 space-y-0.5 list-none p-0">{[li]}</ul>;
      } else {
        currentList = React.cloneElement(currentList, {
          children: [...React.Children.toArray(currentList.props.children), li]
        });
      }
      return;
    }

    // Ordered List Items
    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (orderedMatch) {
      const num = orderedMatch[1];
      const itemText = orderedMatch[2];
      const li = (
        <li key={`oli-${index}`} className="flex items-start gap-1.5 my-0.5 text-xs text-slate-300">
          <span className="text-purple-400 font-semibold select-none leading-relaxed text-[11px]">{num}.</span>
          <span className="flex-1 leading-relaxed">{parseInlineMarkdown(itemText)}</span>
        </li>
      );
      if (!currentList) {
        currentList = <ol key={`ol-${index}`} className="my-1 space-y-0.5 list-none p-0">{[li]}</ol>;
      } else {
        currentList = React.cloneElement(currentList, {
          children: [...React.Children.toArray(currentList.props.children), li]
        });
      }
      return;
    }

    // Normal paragraph
    if (currentList) {
      elements.push(currentList);
      currentList = null;
    }

    elements.push(
      <p key={`p-${index}`} className="my-1 leading-relaxed text-xs text-slate-300">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });

  if (currentList) {
    elements.push(currentList);
  }

  return <div className="space-y-1">{elements}</div>;
}

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
