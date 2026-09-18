import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/frontend/components/ui/button';

export default function CodeBlock({ inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If it's inline code (e.g. `const x = 1` inside prose)
  if (inline || (!match && !codeString.includes('\n'))) {
    return (
      <code
        className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-xs border border-slate-700/60"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="my-4 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg group">
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
        <span className="font-mono text-sky-400 font-semibold uppercase tracking-wider text-[11px]">
          {language || 'code'}
        </span>
        <Button
          variant="ghost"
          size="xs"
          onClick={handleCopy}
          className="gap-1.5 text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 h-7 px-2"
          title="Copiază codul"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copiat!</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy Snippet</span>
            </>
          )}
        </Button>
      </div>

      {/* Syntax Highlighting Container */}
      <div className="overflow-x-auto text-xs font-mono">
        <SyntaxHighlighter
          language={language || 'text'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.25rem 1rem',
            background: 'transparent',
            fontSize: '0.825rem',
            lineHeight: '1.6'
          }}
          codeTagProps={{
            style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }
          }}
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
