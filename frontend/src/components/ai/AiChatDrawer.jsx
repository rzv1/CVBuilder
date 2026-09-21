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
  FileCode,
  History,
  Clock,
  MessageSquare,
  Trash2,
  Bot
} from 'lucide-react';
import TypewriterText from './TypewriterText.jsx';
import { useAiChat } from './hooks/useAiChat.js';

import { 
  Menu, 
  MenuTrigger, 
  MenuPopup, 
  MenuItem, 
  MenuItemGroup, 
  MenuItemGroupLabel, 
  MenuSeparator 
} from '@/frontend/components/ui/menu';

import { Button } from '@/frontend/src/components/ui/button';
import { Input } from '@/frontend/src/components/ui/input';
import { ProgressLinear } from '@/frontend/src/components/ui/progress-linear';
import { 
  Message, 
  MessageAvatar, 
  MessageContent, 
  MessageHeader 
} from '@/frontend/components/ui/message';
import { MessageScroller } from '@/frontend/components/ui/message-scroller';
import { Bubble, BubbleContent } from '@/frontend/components/ui/bubble';
import { Avatar, AvatarFallback } from '@/frontend/src/components/ui/avatar';
import { Marker, MarkerIcon, MarkerContent } from '@/frontend/components/ui/marker';
import { Spinner } from '@/frontend/components/ui/spinner';
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription, 
  EmptyContent 
} from '@/frontend/src/components/ui/empty';
import { cn } from '@/frontend/lib/utils';
import { useUI, useAuth } from '../../context/index.jsx';

export default function AiChatDrawer(props = {}) {
  const ui = useUI();
  const auth = useAuth();

  const isOpen = props.isOpen ?? ui.isAiChatOpen;
  const setIsOpen = props.setIsOpen ?? ui.setIsAiChatOpen;
  const currentUser = props.currentUser ?? auth.currentUser;
  const onOpenAuthModal = props.onOpenAuthModal ?? auth.openAuthModal;

  const {
    messages,
    inputText,
    setInputText,
    isTyping,
    activeCredits,
    inputRef,
    handleSendMessage,
    handleNewChat,
    sessions,
    activeSessionId,
    handleSelectSession,
    handleDeleteSession,
    contextLimit,
    setContextLimit
  } = useAiChat(props);


  if (!isOpen) return null;

  return (
    <div className="relative flex flex-col h-full w-full bg-slate-900 border-l border-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
            <Bot className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 leading-none">AI Rewriter</h3>
            </div>
            <div className="text-[11.5px] text-slate-400 mt-1">
              <span className="font-semibold text-indigo-400">Account:</span> {currentUser ? currentUser.name : 'Vizitator'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Configurable Context Window Selector */}
          <Menu
            positioning={{ placement: "bottom-end", gutter: 8 }}
            onSelect={(details) => {
              const val = parseInt(details.value, 10);
              if (val > 0) setContextLimit(val);
            }}
          >
            <MenuTrigger asChild>
              <Button
                variant="ghost"
                size="xs"
                className="h-8 px-2 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 rounded-lg gap-1"
                title="Fereastră de context AI (ultimele N mesaje)"
                aria-label="Configurare context mesaje"
              >
                <span className="text-slate-400">N=</span>
                <span className="text-indigo-400 font-bold">{contextLimit}</span>
              </Button>
            </MenuTrigger>
            <MenuPopup
              positionerClassName="z-[9999]"
              className="w-44 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-slate-200 shadow-2xl shadow-black/80 p-1.5 rounded-xl"
            >
              <MenuItemGroup>
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Context Istoric
                </div>
                {[1, 2, 3, 5, 8].map((n) => (
                  <MenuItem
                    key={n}
                    value={String(n)}
                    className={cn(
                      "flex items-center justify-between px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors",
                      contextLimit === n ? "bg-indigo-950 border border-indigo-500/40 text-indigo-200 font-semibold" : "hover:bg-slate-800 text-slate-300"
                    )}
                  >
                    <span>Ultimele {n} {n === 1 ? 'mesaj' : 'mesaje'}</span>
                    {contextLimit === n && <span className="text-[10px] text-indigo-400">✓</span>}
                  </MenuItem>
                ))}
              </MenuItemGroup>
            </MenuPopup>
          </Menu>

          {/* Istoric Chat-uri Dropdown Menu */}
          <Menu 
            positioning={{ placement: "bottom-end", gutter: 8 }}
            onSelect={(details) => {
              if (details.value === 'new-chat') {
                handleNewChat();
              } else if (details.value) {
                handleSelectSession(details.value);
              }
            }}
          >
            <MenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon-sm" 
                className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-700/60 rounded-lg" 
                title="Istoric conversații"
                aria-label="Deschide istoricul de chat-uri"
              >
                <History className="size-4" />
              </Button>
            </MenuTrigger>

            <MenuPopup 
              positionerClassName="z-[9999]"
              className="w-80 max-h-[380px] overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-slate-200 shadow-2xl shadow-black/80 p-1.5 rounded-xl"
            >
              <MenuItemGroup>
                <div className="flex items-center justify-between px-2.5 py-1.5">
                  <MenuItemGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 p-0">
                    Istoric Conversații
                  </MenuItemGroupLabel>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {sessions.length} {sessions.length === 1 ? 'chat' : 'chat-uri'}
                  </span>
                </div>

                <MenuSeparator className="bg-slate-800 my-1 -mx-1" />

                {sessions.length === 0 ? (
                  <div className="py-6 px-3 text-center">
                    <MessageSquare className="size-6 text-slate-600 mx-auto mb-1.5" />
                    <p className="text-xs font-medium text-slate-300">Nicio conversație salvată</p>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">Conversațiile tale vor apărea aici.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {sessions.map((session) => {
                      const isActive = session.id === activeSessionId;
                      const userMsgCount = session.messages?.filter(m => m.sender === 'user').length || 0;

                      return (
                        <MenuItem
                          key={session.id}
                          value={session.id}
                          onSelect={() => handleSelectSession(session.id)}
                          className={cn(
                            "group relative flex flex-col items-start gap-1 p-2 rounded-lg cursor-pointer transition-colors text-left",
                            isActive 
                              ? "bg-indigo-950/70 border border-indigo-500/40 text-slate-100" 
                              : "hover:bg-slate-800/80 text-slate-300 hover:text-slate-100 border border-transparent"
                          )}
                        >
                          <div className="flex items-center justify-between w-full gap-2">
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <MessageSquare className={cn("size-3.5 shrink-0", isActive ? "text-indigo-400" : "text-slate-400")} />
                              <span className="font-medium text-xs truncate text-slate-100">
                                {session.title || 'Conversație nouă'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {isActive && (
                                <span className="text-[9.5px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium px-1.5 py-0.5 rounded leading-none">
                                  Activ
                                </span>
                              )}
                              <button
                                type="button"
                                title="Șterge conversația"
                                aria-label="Șterge conversația"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSession(session.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded transition-opacity"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between w-full pl-5 text-[10.5px] text-slate-400">
                            <span className="flex items-center gap-1 text-slate-400">
                              <Clock className="size-2.5 text-slate-500" />
                              {session.date}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {userMsgCount} {userMsgCount === 1 ? 'mesaj' : 'mesaje'}
                            </span>
                          </div>
                        </MenuItem>
                      );
                    })}
                  </div>
                )}

                <MenuSeparator className="bg-slate-800 my-1 -mx-1" />

                <MenuItem
                  value="new-chat"
                  onSelect={handleNewChat}
                  className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 rounded-lg cursor-pointer transition-colors"
                >
                  <Plus className="size-3.5" />
                  <span>Începe o conversație nouă</span>
                </MenuItem>
              </MenuItemGroup>
            </MenuPopup>
          </Menu>

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

      {/* AI Credits Remaining ProgressLinear Bar */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/80 shrink-0">

        <ProgressLinear 
          value={Math.min(100, Math.max(0, activeCredits))} 
          className="h-1.5 bg-slate-800"
          indicatorClassName={activeCredits > 20 ? "bg-gradient-to-r from-emerald-500 to-indigo-500" : "bg-gradient-to-r from-amber-500 to-red-500"}
        />
      </div>

      {/* Auth Overlay if not authenticated - Using Empty component */}
      {!currentUser && (
        <div className="absolute inset-0 top-[57px] z-50 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200">
          <Empty className="w-full max-w-xs border-purple-500/30 bg-slate-900/90 shadow-2xl shadow-purple-950/50 p-6">
            <EmptyMedia variant="icon" className="bg-purple-950/50 text-purple-400 border border-purple-500/30 size-12 rounded-full mb-3">
              <User className="size-6 text-purple-400" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle className="text-base font-extrabold text-slate-100">
                Login for AI Agent
              </EmptyTitle>
              <EmptyDescription className="text-xs text-slate-400 leading-relaxed">
                Get <strong className="text-amber-300 font-semibold">100 AI credits</strong> gift.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                type="button"
                onClick={onOpenAuthModal}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs py-2.5 shadow-lg shadow-indigo-500/25 border-0 gap-2 rounded-lg"
              >
                <Zap className="size-4 text-amber-300 fill-amber-300" /> Auth
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      )}

      {/* Message List using MessageScroller and shadcn Message component */}
      <MessageScroller className="p-4 space-y-4 bg-slate-950/60" showScrollFade={true}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const cleanText = (msg.text || '').replace(/```json[\s\S]*?```/g, '').trim();
          const isThinking = !isUser && msg.isStreaming && !cleanText;

          return (
            <Message 
              key={msg.id} 
              align={isUser ? "end" : "start"} 
              className={cn("max-w-[90%]", isUser ? "ml-auto" : "mr-auto")}
            >
              <MessageAvatar className="size-7 shrink-0 self-start mt-0.5">
                <Avatar className={cn(
                  "size-7 shrink-0 shadow-sm",
                  isUser 
                    ? "bg-blue-600 text-white" 
                    : "bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white"
                )}>
                  <AvatarFallback className="size-full flex items-center justify-center bg-transparent text-white">
                    {isUser ? (
                      <User className="size-3.5" />
                    ) : (
                      <Bot className="size-3.5" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </MessageAvatar>

              <MessageContent>
                <MessageHeader className={cn("text-[11px] px-1", isUser ? "justify-end" : "justify-start")}>
                  <span className="font-semibold text-slate-400">
                    {isUser ? 'Tu' : 'AI Rewriter'}
                  </span>
                  <span className="text-slate-500 ml-2">{msg.timestamp}</span>
                </MessageHeader>

                {/* Message Bubble or Thinking Marker */}
                {isThinking ? (
                  <Marker role="status" className="px-1 py-1">
                    <MarkerIcon>
                      <Spinner className="size-3.5 text-indigo-400" />
                    </MarkerIcon>
                    <MarkerContent className="shimmer text-xs text-slate-300">
                      Thinking...
                    </MarkerContent>
                  </Marker>
                ) : (
                  <Bubble
                    variant={isUser ? "default" : "secondary"}
                    align={isUser ? "end" : "start"}
                    className={cn(isUser ? "max-w-[90%]" : "max-w-[95%]")}
                  >
                    <BubbleContent className={cn(
                      "text-xs leading-relaxed px-3.5 py-2.5 rounded-2xl break-words shadow-md transition-all",
                      isUser
                        ? "rounded-tr-none bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-900/30 border-0"
                        : "rounded-tl-none bg-slate-800/90 border border-slate-700/70 text-slate-200 shadow-slate-950/40"
                    )}>
                      {isUser ? (
                        msg.text.split('\n').map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            {idx < msg.text.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))
                      ) : (
                        <TypewriterText 
                          text={cleanText} 
                          isStreaming={msg.isStreaming} 
                          animate={false}
                        />
                      )}
                    </BubbleContent>
                  </Bubble>
                )}

                {/* RFC 6902 JSON Patch Card Component */}
                {msg.patches && msg.patches.length > 0 && (
                  <div className="mt-2 border-blue-500/40 bg-slate-950/90 p-3 shadow-lg shadow-blue-950/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                        <FileCode className="size-3.5" /> {msg.patches.length} JSON Patch{msg.patches.length > 1 ? 'es' : ''}
                      </span>

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
                  </div>
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
              </MessageContent>
            </Message>
          );
        })}

        {isTyping && !messages.some(m => m.isStreaming) && (
          <Message align="start" className="max-w-[90%] mr-auto">
            <MessageAvatar className="size-7 shrink-0 self-start mt-0.5">
              <Avatar className="size-7 shrink-0 bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-sm">
                <AvatarFallback className="size-full flex items-center justify-center bg-transparent text-white">
                  <Bot className="size-3.5" />
                </AvatarFallback>
              </Avatar>
            </MessageAvatar>
            <MessageContent>
              <MessageHeader className="text-[11px] px-1 justify-start">
                <span className="font-semibold text-slate-400">Gemini Smart Rewriter</span>
              </MessageHeader>
              <Marker role="status" className="px-1 py-1">
                <MarkerIcon>
                  <Spinner className="size-3.5 text-indigo-400" />
                </MarkerIcon>
                <MarkerContent className="shimmer text-xs text-slate-300">
                  Thinking...
                </MarkerContent>
              </Marker>
            </MessageContent>
          </Message>
        )}
      </MessageScroller>

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
            placeholder="Ask Gemini..."
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
          Vercel AI SDK • Streaming active
        </div>
      </div>
    </div>
  );
}
