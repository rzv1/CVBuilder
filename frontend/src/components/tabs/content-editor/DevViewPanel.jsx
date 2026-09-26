import React from 'react';
import Editor from '@monaco-editor/react';
import {
  FileText,
  Sliders,
  Columns,
  Square,
  Zap,
  ZapOff,
  Play,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Swap, SwapIndicator } from '@/src/components/ui/swap';
import { useDevView } from './hooks/useDevView.jsx';

export default function DevViewPanel(props = {}) {
  const devState = useDevView();

  const activeDevFile = props.activeDevFile ?? devState.activeDevFile;
  const setActiveDevFile = props.setActiveDevFile ?? devState.setActiveDevFile;
  const isSplitView = props.isSplitView ?? devState.isSplitView;
  const setIsSplitView = props.setIsSplitView ?? devState.setIsSplitView;
  const autoRun = props.autoRun ?? devState.autoRun;
  const setAutoRun = props.setAutoRun ?? devState.setAutoRun;
  const isRunning = props.isRunning ?? devState.isRunning;
  const handleRunCode = props.handleRunCode ?? devState.handleRunCode;
  const contentYaml = props.contentYaml ?? devState.contentYaml;
  const handleContentChange = props.handleContentChange ?? devState.handleContentChange;
  const styleYaml = props.styleYaml ?? devState.styleYaml;
  const handleStyleChange = props.handleStyleChange ?? devState.handleStyleChange;
  const monacoOptions = props.monacoOptions ?? devState.monacoOptions;
  const handleBeforeMount = props.handleBeforeMount ?? devState.handleBeforeMount;
  const handleEditorMount = props.handleEditorMount ?? devState.handleEditorMount;
  const syntaxError = props.syntaxError ?? devState.syntaxError;
  const setSyntaxError = props.setSyntaxError ?? devState.setSyntaxError;
  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Dev View Top Control Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 shrink-0 flex-wrap gap-2">
        {/* Left Side: File Tabs Selector using Ark Tabs */}
        <Tabs
          value={isSplitView ? '' : activeDevFile}
          onValueChange={(details) => {
            if (details.value) {
              setActiveDevFile(details.value);
              if (isSplitView) setIsSplitView(false);
            }
          }}
          className="w-auto"
        >
          <TabsList className="h-7.5 bg-slate-950 border border-slate-800 p-0.5 rounded-lg flex items-center gap-1">
            <TabsTrigger
              value="content"
              className={`gap-1.5 text-xs py-1 px-2.5 h-6 rounded-md font-semibold transition-colors ${
                !isSplitView && activeDevFile === 'content'
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="size-3.5 text-blue-400" />
              <span>content.yaml</span>
            </TabsTrigger>
            <TabsTrigger
              value="style"
              className={`gap-1.5 text-xs py-1 px-2.5 h-6 rounded-md font-semibold transition-colors ${
                !isSplitView && activeDevFile === 'style'
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="size-3.5 text-purple-400" />
              <span>style.yaml</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Center/Right Controls: Split View (Swap), Auto-Run (Swap), Run Button */}
        <div className="flex items-center gap-2.5">
          {/* Split View Toggle with Swap */}
          <Button
            type="button"
            variant={isSplitView ? "secondary" : "outline"}
            size="xs"
            onClick={() => setIsSplitView((prev) => !prev)}
            className={`h-7.5 text-xs font-semibold px-2.5 rounded-lg transition-all ${
              isSplitView
                ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/50 shadow-sm shadow-indigo-950/40 hover:bg-indigo-900/60'
                : 'bg-slate-900/90 text-slate-300 border border-slate-700/60 hover:text-white hover:bg-slate-800'
            }`}
            title={isSplitView ? "Comută pe vizualizare simplă" : "Comută pe vizualizare split (side-by-side)"}
          >
            <Swap swap={isSplitView}>
              <SwapIndicator type="on" className="inline-flex items-center gap-1.5">
                <Columns className="size-3.5 text-indigo-400" />
                <span>Split View</span>
              </SwapIndicator>
              <SwapIndicator type="off" className="inline-flex items-center gap-1.5">
                <Square className="size-3.5 text-slate-400" />
                <span>Single View</span>
              </SwapIndicator>
            </Swap>
          </Button>

          {/* Auto-Run Toggle with Swap */}
          <Button
            type="button"
            variant={autoRun ? "secondary" : "outline"}
            size="xs"
            onClick={() => setAutoRun((prev) => !prev)}
            className={`h-7.5 text-xs font-semibold px-2.5 rounded-lg transition-all ${
              autoRun
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-950/40 hover:bg-emerald-900/60'
                : 'bg-slate-900/90 text-slate-400 border border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={autoRun ? "Dezactivează Auto-Run" : "Activează Auto-Run la fiecare modificare"}
          >
            <Swap swap={autoRun}>
              <SwapIndicator type="on" className="inline-flex items-center gap-1.5">
                <Zap className="size-3.5 text-emerald-400 fill-emerald-400" />
                <span>Auto-Run On</span>
              </SwapIndicator>
              <SwapIndicator type="off" className="inline-flex items-center gap-1.5">
                <ZapOff className="size-3.5 text-slate-500" />
                <span>Auto-Run Off</span>
              </SwapIndicator>
            </Swap>
          </Button>

          {/* Run Code Button */}
          <Button
            size="xs"
            onClick={handleRunCode}
            disabled={isRunning}
            className="h-7.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold gap-1.5 text-xs px-3 rounded-lg shadow-md shadow-emerald-900/20 disabled:opacity-60 border-0"
            title="Rulează codul manual (Ctrl+Enter)"
          >
            <Play className="size-3.5 fill-current" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </Button>
        </div>
      </div>

      {/* Editor Body Area: Single View vs Split View */}
      <div className={`flex-1 flex overflow-hidden ${isSplitView ? 'divide-x divide-slate-800' : ''}`}>
        {(isSplitView || activeDevFile === 'content') && (
          <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
            <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900/60 border-b border-slate-800 shrink-0">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <FileText className="size-3.5 text-blue-400" /> content.yaml
              </span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold text-blue-400 border-blue-500/30 bg-blue-950/40">Read/Write</Badge>
            </div>
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                language="yaml"
                path="content.yaml"
                beforeMount={handleBeforeMount}
                onMount={handleEditorMount}
                theme="vs-dark"
                value={contentYaml}
                onChange={handleContentChange}
                options={monacoOptions}
              />
            </div>
          </div>
        )}

        {(isSplitView || activeDevFile === 'style') && (
          <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
            <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900/60 border-b border-slate-800 shrink-0">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders className="size-3.5 text-purple-400" /> style.yaml
              </span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold text-purple-400 border-purple-500/30 bg-purple-950/40">Read/Write</Badge>
            </div>
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                language="yaml"
                path="style.yaml"
                beforeMount={handleBeforeMount}
                onMount={handleEditorMount}
                theme="vs-dark"
                value={styleYaml}
                onChange={handleStyleChange}
                options={monacoOptions}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status & Syntax Error Zone */}
      <div className={`px-4 py-2 border-t text-xs shrink-0 ${
        syntaxError 
          ? 'bg-red-950/80 border-red-500/40 text-red-300' 
          : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}>
        {syntaxError ? (
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 text-red-400 shrink-0" />
              <Badge variant="destructive" className="text-[10px] font-bold">SYNTAX ERROR</Badge>
              <span className="font-mono text-red-200 font-semibold">Line {syntaxError.line}:{syntaxError.column}</span>
              <span className="text-slate-300">{syntaxError.message}</span>
            </div>
            <Button 
              variant="outline" 
              size="xs" 
              className="h-6 text-[11px] bg-red-900/50 border-red-500/40 text-red-200 hover:bg-red-900 hover:text-white"
              onClick={() => setSyntaxError(null)}
            >
              Quick Fix / Clear
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span className="font-bold text-emerald-400">Syntax Valid</span>
              <span className="text-slate-400 text-[11px]">0 errors • Live YAML Schema Verified</span>
            </div>
            <Badge variant="secondary" className="text-[10px] font-semibold bg-slate-800 text-slate-300">
              {autoRun ? '⚡ Auto-Sync Active' : '⏸ Manual Run Mode'}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
