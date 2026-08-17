import React, { useState, useRef, useEffect } from 'react';
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
} from '../Icons.jsx';
import TypewriterText from './TypewriterText.jsx';
const getInitialWelcomeMessage = (user) => {
  const userName = user?.name ? user.name : '';
  const greeting = userName ? `Salut, ${userName}!` : 'Salut!';
  return [
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `${greeting} Am analizat structura CV-ului tău (content.json & style.json). Cu ce te pot ajuta astăzi pentru optimizarea sau reformularea secțiunilor?`,
      timestamp: 'Acum',
      animate: false
    }
  ];
};

export default function AiChatDrawer({ cvData, styleData, isOpen, setIsOpen, onApplyPatches, currentUser, setCurrentUser, onOpenAuthModal }) {
  const [messages, setMessages] = useState(() => getInitialWelcomeMessage(currentUser));
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeCredits = currentUser ? (currentUser.credits ?? 0) : 0;

  // Update welcome greeting when currentUser changes if only initial message is present
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'msg-welcome') {
      setMessages(getInitialWelcomeMessage(currentUser));
    }
  }, [currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  /**
   * Helper to parse RFC 6902 JSON patch block from text stream
   */
  const parseJsonPatchesFromText = (text) => {
    const match = text.match(/```json\s*patch\s*([\s\S]*?)```/) || text.match(/```json\s*([\s\S]*?)```/);
    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1].trim());
        if (Array.isArray(parsed)) return parsed;
        if (parsed.patches && Array.isArray(parsed.patches)) return parsed.patches;
      } catch (e) {
        // Partial or invalid json block during streaming
      }
    }
    return null;
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    if (activeCredits <= 0) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          text: text.trim(),
          timestamp: getCurrentTime()
        },
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: '⚠️ Ai epuizat creditele tale AI! Te rugăm să adaugi credite din CMS Admin.',
          timestamp: getCurrentTime(),
          animate: true
        }
      ]);
      if (!textToSend) setInputText('');
      return;
    }

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: getCurrentTime()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Deduct credit in current user state
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, credits: Math.max(0, (prev.credits ?? 0) - 1) } : null);
    }

    const aiMsgId = `msg-${Date.now() + 1}`;
    const initialAiMsg = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      timestamp: getCurrentTime(),
      animate: false,
      isStreaming: true,
      patches: null
    };

    setMessages(prev => [...prev, initialAiMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          content: cvData,
          style: styleData,
          userId: currentUser?.id,
          userName: currentUser?.name
        })
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        const patches = parseJsonPatchesFromText(accumulatedText);

        setMessages(prev => prev.map(msg => {
          if (msg.id === aiMsgId) {
            return {
              ...msg,
              text: accumulatedText,
              patches: patches
            };
          }
          return msg;
        }));
      }

      const finalPatches = parseJsonPatchesFromText(accumulatedText);
      setMessages(prev => prev.map(msg => {
        if (msg.id === aiMsgId) {
          return {
            ...msg,
            isStreaming: false,
            patches: finalPatches
          };
        }
        return msg;
      }));

      // Automatically trigger visual diff proposal if patches were received
      if (finalPatches && finalPatches.length > 0 && onApplyPatches) {
        const cleanExplanation = accumulatedText.replace(/```json[\s\S]*?```/g, '').trim();
        onApplyPatches({
          explanation: cleanExplanation || 'Gemini a generat patch-uri JSON restrânse pentru actualizarea CV-ului.',
          patches: finalPatches
        });
      }

    } catch (err) {
      console.error('AI Chat Error:', err);
      setMessages(prev => prev.map(msg => {
        if (msg.id === aiMsgId) {
          return {
            ...msg,
            text: 'Scuze, a intervenit o eroare la conectarea cu AI Assistant. Asigură-te că serverul CMS rulează pe portul 3001.',
            isStreaming: false
          };
        }
        return msg;
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages(getInitialWelcomeMessage(currentUser));
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-solid-panel">
      {/* Header */}
      <div className="drawer-header">
        <div className="header-info">
          <div className="avatar-icon">
            <Cpu size={18} />
          </div>
          <div>
            <div className="header-title-row">
              <h3>CV AI Assistant</h3>
            </div>
            <div className="header-context">
              <span className="context-label">Utilizator:</span> {currentUser ? currentUser.name : 'Vizitator'} • schema.json • content.json
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="header-btn" 
            onClick={handleNewChat} 
            title="Chat Nou"
            aria-label="Start new chat session"
          >
            <Plus size={18} />
          </button>
          <button 
            className="header-btn close-btn" 
            onClick={() => setIsOpen(false)} 
            title="Ascunde panoul AI Chat"
            aria-label="Close AI Chat Panel"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* AI Credits Remaining Progress Bar Container */}
      <div className="credits-bar-container" style={{
        padding: '0.7rem 1.1rem',
        background: '#090d16',
        borderBottom: '1px solid #1e293b'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: activeCredits > 10 ? '#a7f3d0' : '#fca5a5', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Zap size={13} style={{ color: '#fbbf24' }} /> {activeCredits} Credite Disponibile
          </span>
        </div>

        <div style={{
          width: '100%',
          height: '6px',
          background: '#1e293b',
          borderRadius: '999px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Math.min(100, Math.max(0, activeCredits))}%`,
            height: '100%',
            background: activeCredits > 20 ? 'linear-gradient(90deg, #10b981, #6366f1)' : 'linear-gradient(90deg, #f59e0b, #ef4444)',
            borderRadius: '999px',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      {/* Auth Overlay if not authenticated */}
      {!currentUser && (
        <div className="ai-chat-auth-overlay" style={{
          position: 'absolute',
          inset: 0,
          top: '60px',
          background: 'rgba(9, 13, 22, 0.92)',
          backdropFilter: 'blur(8px)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.25)'
          }}>
            <User size={28} style={{ color: '#c084fc' }} />
          </div>

          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Înregistrează-te pentru a folosi AI Agent
          </h4>

          <p style={{ fontSize: '0.82rem', color: '#94a3b8', maxWidth: '300px', lineHeight: '1.45', marginBottom: '1.5rem' }}>
            Introdu numele tău pentru a primi <strong style={{ color: '#fbbf24' }}>100 de credite AI cadou</strong> și rescrierea inteligentă cu Gemini.
          </p>

          <button
            type="button"
            onClick={onOpenAuthModal}
            style={{
              padding: '0.75rem 1.6rem',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: '#ffffff',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={16} style={{ color: '#fbbf24' }} /> Autentificare / Înregistrare
          </button>
        </div>
      )}

      {/* Message List */}
      <div className="drawer-messages">
        {messages.map((msg) => {
          const cleanText = (msg.text || '').replace(/```json[\s\S]*?```/g, '').trim();

          return (
            <div 
              key={msg.id} 
              className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'user-wrapper' : 'ai-wrapper'}`}
            >
              <div className="chat-avatar">
                {msg.sender === 'user' ? (
                  <User size={14} />
                ) : (
                  <Sparkles size={14} />
                )}
              </div>

              <div className="chat-bubble-content">
                <div className="bubble-header">
                  <span className="sender-name">
                    {msg.sender === 'user' ? 'Tu' : 'Gemini Smart Rewriter'}
                  </span>
                  <span className="timestamp">{msg.timestamp}</span>
                </div>

                <div className="bubble-text">
                  {msg.sender === 'ai' ? (
                    cleanText ? (
                      cleanText.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                          {line}
                          {idx < cleanText.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))
                    ) : (
                      msg.isStreaming ? <em>Se generează modificările inteligente...</em> : null
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
                  <div style={{
                    marginTop: '0.65rem',
                    background: '#090d16',
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    padding: '0.65rem 0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <FileCode size={14} /> {msg.patches.length} RFC 6902 JSON Patch{msg.patches.length > 1 ? 'es' : ''}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '1px 6px', borderRadius: '4px' }}>
                        ~85% Token Savings
                      </span>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1', fontFamily: 'monospace', marginBottom: '0.5rem', maxHeight: '100px', overflowY: 'auto' }}>
                      {msg.patches.map((p, i) => (
                        <div key={i} style={{ marginBottom: '2px' }}>
                          <span style={{ color: p.op === 'add' ? '#34d399' : '#f87171' }}>{p.op.toUpperCase()}</span> {p.path}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      style={{
                        width: '100%',
                        padding: '0.4rem 0.6rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                      onClick={() => {
                        if (onApplyPatches) {
                          onApplyPatches({
                            explanation: cleanText || 'Gemini a generat patch-uri JSON restrânse pentru CV.',
                            patches: msg.patches
                          });
                        }
                      }}
                    >
                      <Eye size={14} /> Vezi Chenar Diferențe pe CV
                    </button>
                  </div>
                )}

                {msg.actions && msg.actions.length > 0 && (
                  <div className="bubble-actions">
                    {msg.actions.map((act, i) => (
                      <button 
                        key={i} 
                        className="bubble-action-btn"
                        onClick={() => handleSendMessage(act.prompt)}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="chat-bubble-wrapper ai-wrapper typing-wrapper">
            <div className="chat-avatar">
              <Sparkles size={14} />
            </div>
            <div className="chat-bubble-content typing-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-text">Gemini scrie răspunsul & generează JSON Patch...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <div className="drawer-footer">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="chat-input-form"
        >
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Întreabă Gemini AI Agent (ex: Adaugă Kubernetes, mărește titlurile)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="send-btn" 
            disabled={!inputText.trim() || isTyping}
            title="Trimite mesaj"
          >
            <Send size={16} />
          </button>
        </form>
        <div className="footer-disclaimer">
          Vercel AI SDK • Gemini Smart File Rewriting • Streaming active
        </div>
      </div>
    </div>
  );
}
