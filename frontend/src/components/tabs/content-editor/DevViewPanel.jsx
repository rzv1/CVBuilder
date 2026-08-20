import React from 'react';
import Editor from '@monaco-editor/react';
import {
  FileText,
  Sliders,
  Columns,
  Play,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/frontend/components/ui/button';
import { Badge } from '@/frontend/components/ui/badge';

export default function DevViewPanel({
  activeDevFile,
  setActiveDevFile,
  isSplitView,
  setIsSplitView,
  autoRun,
  setAutoRun,
  isRunning,
  handleRunCode,
  contentYaml,
  handleContentChange,
  styleYaml,
  handleStyleChange,
  monacoOptions,
  handleBeforeMount,
  handleEditorMount,
  syntaxError,
  setSyntaxError
}) {
  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Dev View Top Control Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 shrink-0 flex-wrap gap-2">
        {/* Left Side: File Tabs Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setActiveDevFile('content')}
            className={`h-7 text-xs font-semibold gap-1.5 px-3 rounded-md transition-colors ${
              activeDevFile === 'content' && !isSplitView
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="size-3.5 text-blue-400" />
            <span>content.yaml</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setActiveDevFile('style')}
            className={`h-7 text-xs font-semibold gap-1.5 px-3 rounded-md transition-colors ${
              activeDevFile === 'style' && !isSplitView
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="size-3.5 text-purple-400" />
            <span>style.yaml</span>
          </Button>
        </div>

        {/* Center/Right Controls: Split View, Auto-Run, Run Button */}
        <div className="flex items-center gap-3">
          {/* Split View Toggle */}
          <Button
            variant="outline"
            size="xs"
            onClick={() => setIsSplitView(prev => !prev)}
            className={`h-7 text-xs font-semibold gap-1.5 rounded-lg border-slate-700/60 ${
              isSplitView
                ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/50'
                : 'bg-slate-900 text-slate-300 hover:text-white'
            }`}
            title="Split view side-by-side"
          >
            <Columns className="size-3.5" />
            <span>Split View</span>
          </Button>

          {/* Auto-Run Toggle Switch */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg" title="Auto-run pe fiecare modificare">
            <span className="text-xs font-semibold text-slate-400">Auto-Run</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoRun}
                onChange={(e) => setAutoRun(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Run Code Button */}
          <Button
            size="xs"
            onClick={handleRunCode}
            disabled={isRunning}
            className="h-7 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold gap-1.5 text-xs rounded-lg shadow-md shadow-emerald-900/20 disabled:opacity-60"
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
              <Badge variant="blue" className="text-[10px] py-0 px-1.5 font-semibold">Read/Write</Badge>
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
              <Badge variant="purple" className="text-[10px] py-0 px-1.5 font-semibold">Read/Write</Badge>
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
