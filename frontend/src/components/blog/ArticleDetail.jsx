import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Clock, Tag, Calendar } from 'lucide-react';
import { Card } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';
import { Badge } from '@/frontend/components/ui/badge';
import CodeBlock from './CodeBlock.jsx';

export default function ArticleDetail({ article, onBack }) {
  if (!article) return null;

  return (
    <Card className="w-full max-w-4xl mx-auto bg-slate-900 border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6">
      {/* Back Navigation & Meta Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="gap-2 text-xs font-semibold hover:bg-slate-800 text-slate-300"
        >
          <ArrowLeft className="size-4" />
          <span>Înapoi la Articole</span>
        </Button>

        <div className="flex items-center gap-3 text-xs">
          {article.categoryName && (
            <Badge variant="purple" className="px-2.5 py-0.5 font-bold">
              {article.categoryName}
            </Badge>
          )}
          {article.readTime && (
            <span className="flex items-center gap-1.5 text-slate-400">
              <Clock className="size-3.5" /> {article.readTime}
            </span>
          )}
        </div>
      </div>

      {/* Main Header / Title & Author */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 leading-tight tracking-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Author Bar */}
          <div className="flex items-center gap-3">
            {article.avatar ? (
              <img
                src={article.avatar}
                alt={article.author || 'Author'}
                className="size-10 rounded-full border border-indigo-500/30 object-cover shadow-sm"
              />
            ) : (
              <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                {(article.author || 'A').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-sm font-bold text-slate-200">{article.author}</div>
              {article.date && (
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="size-3" /> Publicat pe {article.date}
                </div>
              )}
            </div>
          </div>

          {/* Tags Bar */}
          {Array.isArray(article.tags) && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {article.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="gap-1 text-[11px] text-slate-400 bg-slate-950 border border-slate-800">
                  <Tag className="size-3 text-sky-400" /> {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* Markdown Body Content with Syntax Highlighting */}
      <div className="prose prose-invert max-w-none text-slate-300">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: CodeBlock,
            h1: ({ children }) => (
              <h1 className="text-2xl font-extrabold text-slate-100 mt-8 mb-4 border-b border-slate-800 pb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold text-slate-100 mt-6 mb-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-bold text-slate-200 mt-5 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-slate-300 leading-relaxed my-3 text-sm sm:text-base">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-1.5 my-3 text-slate-300 text-sm sm:text-base">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-1.5 my-3 text-slate-300 text-sm sm:text-base">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-indigo-500 bg-indigo-950/30 p-4 my-4 rounded-r-lg italic text-slate-300 text-sm">
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 underline hover:text-indigo-300 transition-colors"
              >
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border-b border-slate-800 bg-slate-950 p-2.5 font-bold text-slate-200">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border-b border-slate-800/60 p-2.5 text-slate-300">
                {children}
              </td>
            ),
          }}
        >
          {article.content || ''}
        </ReactMarkdown>
      </div>
    </Card>
  );
}
