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
} from '../Icons';
import TypewriterText from './TypewriterText';
import { INITIAL_AI_CHAT_MESSAGES } from '../../mockData';

export default function AiChatDrawer({ cvData, styleData, isOpen, setIsOpen, onApplyPatches }) {
  const [messages, setMessages] = useState(INITIAL_AI_CHAT_MESSAGES.map(m => ({ ...m, animate: false })));
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiCredits, setAiCredits] = useState(85);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: getCurrentTime()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);
    setAiCredits(prev => Math.max(0, prev - 1));

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
          style: styleData
        })
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamedText += chunk;

        const patches = parseJsonPatchesFromText(streamedText);

        setMessages(prev => prev.map(m => {
          if (m.id === aiMsgId) {
            return {
              ...m,
              text: streamedText,
              patches: patches || m.patches
            };
          }
          return m;
        }));
      }

      const finalPatches = parseJsonPatchesFromText(streamedText);
      setMessages(prev => prev.map(m => {
        if (m.id === aiMsgId) {
          return {
            ...m,
            isStreaming: false,
            patches: finalPatches
          };
        }
        return m;
      }));

      // Automatically trigger visual diff proposal if patches were received
      if (finalPatches && finalPatches.length > 0 && onApplyPatches) {
        const cleanExplanation = streamedText.replace(/```json[\s\S]*?```/g, '').trim();
        onApplyPatches({
          explanation: cleanExplanation || 'Gemini a generat patch-uri JSON restrânse pentru actualizarea CV-ului.',
          patches: finalPatches
        });
      }

    } catch (err) {
      console.error('Streaming error:', err);
      setMessages(prev => prev.map(m => {
        if (m.id === aiMsgId) {
          return {
            ...m,
            text: 'A apărut o eroare la conexiunea cu AI Agent: ' + err.message,
            isStreaming: false
          };
        }
        return m;
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'ai',
        text: 'Conversație nouă inițializată. Cu ce te pot ajuta astăzi pentru optimizarea CV-ului?',
        timestamp: getCurrentTime(),
        animate: false
      }
    ]);
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
              <span className="status-badge">
                <span className="status-dot"></span> Gemini 1.5 Flash
              </span>
            </div>
            <div className="header-context">
              <span className="context-label">Context:</span> schema.json • content.json • style.json
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Zap size={13} style={{ color: '#fbbf24' }} /> Smart Rewriter Token Saver
          </span>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#a7f3d0' }}>
            RFC 6902 Patches Active
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
            width: `${aiCredits}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #10b981, #6366f1)',
            borderRadius: '999px',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

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
