import React from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Plus, 
  User, 
  Cpu, 
  Zap,
  Eye,
  FileCode
} from 'lucide-react';
import TypewriterText from './TypewriterText.jsx';
import { useAiChat } from './hooks/useAiChat.js';

import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { Badge } from '@/frontend/components/ui/badge';
import { Progress } from '@/frontend/components/ui/progress';
import { Card, CardContent } from '@/frontend/components/ui/card';

export default function AiChatDrawer({ 
  cvData, 
  styleData, 
  isOpen, 
  setIsOpen, 
  onApplyPatches, 
  currentUser, 
  setCurrentUser, 
  onOpenAuthModal 
}) {
  const {
    messages,
    inputText,
    setInputText,
    isTyping,
    activeCredits,
    messagesEndRef,
    inputRef,
    handleSendMessage,
    handleNewChat
  } = useAiChat({
    cvData,
    styleData,
    isOpen,
    onApplyPatches,
    currentUser,
    setCurrentUser
  });

  if (!isOpen) return null;

  return (
    <div className="relative flex flex-col h-full w-full bg-slate-900 border-l border-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
            <Cpu className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 leading-none">CV AI Assistant</h3>
            </div>
            <div className="text-[11.5px] text-slate-400 mt-1">
              <span className="font-semibold text-indigo-400">Context:</span> {currentUser ? currentUser.name : 'Vizitator'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button 
            variant="ghost" 
            size="icon-sm" 
            className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-700/60 rounded-lg" 
            onClick={handleNewChat} 
            title="Chat Nou"
            aria-label="Start new chat session"
          >
            <Plus className="size-4.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon-sm" 
            className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 border border-slate-700/60 rounded-lg" 
            onClick={() => setIsOpen(false)} 
            title="Ascunde panoul AI Chat"
            aria-label="Close AI Chat Panel"
          >
            <X className="size-4.5" />
          </Button>
        </div>
      </div>

      {/* AI Credits Remaining Progress Bar */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center justify-center mb-1.5">
          <span className={`text-xs font-bold flex items-center gap-1.5 ${activeCredits > 10 ? 'text-emerald-400' : 'text-red-400'}`}>
            <Zap className="size-3.5 text-amber-400 fill-amber-400" /> {activeCredits} Credite Disponibile
          </span>
        </div>

        <Progress 
          value={Math.min(100, Math.max(0, activeCredits))} 
          className="h-1.5 bg-slate-800"
          indicatorClassName={activeCredits > 20 ? "bg-gradient-to-r from-emerald-500 to-indigo-500" : "bg-gradient-to-r from-amber-500 to-red-500"}
        />
      </div>

      {/* Auth Overlay if not authenticated */}
      {!currentUser && (
        <div className="absolute inset-0 top-[57px] z-50 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200">
          <Card className="w-full max-w-xs border-purple-500/30 bg-slate-900/90 shadow-2xl shadow-purple-950/50">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-purple-500/40 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                <User className="size-7 text-purple-400" />
              </div>

              <h4 className="text-base font-extrabold text-slate-100 mb-2">
                Înregistrează-te pentru a folosi AI Agent
              </h4>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Introdu numele tău pentru a primi <strong className="text-amber-300 font-semibold">100 de credite AI cadou</strong> și rescrierea inteligentă cu Gemini.
              </p>

              <Button
                type="button"
                onClick={onOpenAuthModal}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs py-2.5 shadow-lg shadow-indigo-500/25 border-0 gap-2 rounded-lg"
              >
                <Zap className="size-4 text-amber-300 fill-amber-300" /> Autentificare / Înregistrare
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/60">
        {messages.map((msg) => {
          const cleanText = (msg.text || '').replace(/```json[\s\S]*?```/g, '').trim();

          return (
            <div 
              key={msg.id} 
              className={`flex gap-2.5 max-w-[88%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full shadow-sm mt-0.5 ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white'
              }`}>
                {msg.sender === 'user' ? (
                  <User className="size-3.5" />
                ) : (
                  <Sparkles className="size-3.5" />
                )}
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                <div className={`flex items-center gap-2 text-[11px] ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  <span className="font-semibold text-slate-400">
                    {msg.sender === 'user' ? 'Tu' : 'Gemini Smart Rewriter'}
                  </span>
                  <span className="text-slate-500">{msg.timestamp}</span>
                </div>

                <div className={`text-xs leading-relaxed px-3.5 py-2.5 rounded-2xl break-words shadow-md ${
                  msg.sender === 'user'
                    ? 'rounded-tr-none bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-900/30'
                    : 'rounded-tl-none bg-slate-800/90 border border-slate-700/70 text-slate-200 shadow-slate-950/40'
                }`}>
                  {msg.sender === 'ai' ? (
                    cleanText ? (
                      cleanText.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                          {line}
                          {idx < cleanText.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))
                    ) : (
                      msg.isStreaming ? <em className="text-slate-400 italic">Se generează modificările inteligente...</em> : null
                    )
                  ) : (
                    msg.text.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        {idx < msg.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))
                  )}
                </div>

                {/* RFC 6902 JSON Patch Card Component */}
                {msg.patches && msg.patches.length > 0 && (
                  <Card className="mt-2 border-blue-500/40 bg-slate-950/90 p-3 shadow-lg shadow-blue-950/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                        <FileCode className="size-3.5" /> {msg.patches.length} RFC 6902 JSON Patch{msg.patches.length > 1 ? 'es' : ''}
                      </span>
                      <Badge variant="success" className="text-[10px] px-1.5 py-0.5 font-medium">
                        ~85% Token Savings
                      </Badge>
                    </div>

                    <div className="text-[11px] text-slate-300 font-mono mb-3 max-h-24 overflow-y-auto p-2 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1">
                      {msg.patches.map((p, i) => (
                        <div key={i} className="truncate">
                          <span className={p.op === 'add' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                            {p.op.toUpperCase()}
                          </span>{' '}
                          <span className="text-slate-300">{p.path}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold gap-1.5 shadow-md shadow-blue-900/30 rounded-lg"
                      onClick={() => {
                        if (onApplyPatches) {
                          onApplyPatches({
                            explanation: cleanText || 'Gemini a generat patch-uri JSON restrânse pentru CV.',
                            patches: msg.patches
                          });
                        }
                      }}
                    >
                      <Eye className="size-3.5" /> Vezi Chenar Diferențe pe CV
                    </Button>
                  </Card>
                )}

                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {msg.actions.map((act, i) => (
                      <Button 
                        key={i} 
                        variant="outline"
                        size="xs"
                        className="bg-indigo-950/40 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/50 hover:text-white text-[11px]"
                        onClick={() => handleSendMessage(act.prompt)}
                      >
                        {act.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2.5 max-w-[88%] mr-auto">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-sm mt-0.5">
              <Sparkles className="size-3.5" />
            </div>
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/70 px-3.5 py-2.5 rounded-2xl rounded-tl-none shadow-md">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.32s]"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.16s]"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
              </div>
              <span className="text-xs text-slate-400 italic">Gemini scrie răspunsul & generează JSON Patch...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-slate-950 border border-slate-700/70 rounded-xl p-1.5 pl-3 transition-colors focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50"
        >
          <Input
            ref={inputRef}
            type="text"
            className="border-0 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-8 shadow-none"
            placeholder="Întreabă Gemini AI Agent (ex: Adaugă Kubernetes, mărește titlurile)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            size="icon-sm" 
            disabled={!inputText.trim() || isTyping}
            className="h-8 w-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 shrink-0 shadow-md shadow-indigo-600/30"
            title="Trimite mesaj"
          >
            <Send className="size-4" />
          </Button>
        </form>
        <div className="text-[10px] text-center text-slate-500 mt-2">
          Vercel AI SDK • Gemini Smart File Rewriting • Streaming active
        </div>
      </div>
    </div>
  );
}
