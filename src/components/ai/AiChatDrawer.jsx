import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  MessageSquare, 
  Plus, 
  User, 
  Cpu, 
  Target, 
  CheckCircle, 
  Zap 
} from '../Icons';
import TypewriterText from './TypewriterText';
import { INITIAL_AI_CHAT_MESSAGES } from '../../mockData';

export default function AiChatDrawer({ cvData, isOpen, setIsOpen }) {
  const [messages, setMessages] = useState(INITIAL_AI_CHAT_MESSAGES.map(m => ({ ...m, animate: false })));
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiCredits, setAiCredits] = useState(85); // 85 / 100 AI credits
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
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

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: getCurrentTime()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Deduct 1 credit per AI prompt
    setAiCredits(prev => Math.max(0, prev - 1));

    // Simulate smart AI Response after brief delay
    setTimeout(() => {
      let aiReplyText = '';
      const lowerText = text.toLowerCase();

      if (lowerText.includes('rezumat') || lowerText.includes('summary')) {
        aiReplyText = `Am analizat rezumatul tău actual ("${cvData?.personal?.summary?.slice(0, 60)}...").\n\nIată o propunere optimizată cu focus pe Leadership și Cloud:\n\n"Senior Full Stack Engineer & Cloud Architect cu peste 7 ani de experiență în scalarea aplicațiilor web distribuite. Expert în React, Node.js și arhitecturi cloud AWS, demonstrat prin reducerea costurilor de infrastructură cu 38% și creșterea vitezei de livrare de 4x."`;
      } else if (lowerText.includes('ats') || lowerText.includes('scor') || lowerText.includes('cuvinte cheie')) {
        aiReplyText = `Scorul tău ATS estimat pentru profilul de **Senior Cloud Engineer** este de **92%**.\n\n**Sugestii rapide:**\n• Adaugă "Terraform" și "Kubernetes" în secțiunea de Skills.\n• Include cifre procentuale în primele 2 bullet-point-uri de la experiență.`;
      } else if (lowerText.includes('gramatica') || lowerText.includes('stil') || lowerText.includes('corect')) {
        aiReplyText = `Am verificat textul CV-ului pentru ${cvData?.personal?.name || 'profilul tău'}. Limbajul este profesional, clar și folosește verbe puternice de acțiune ("Led", "Orchestrated", "Accelerated"). Nu au fost detectate erori gramaticale.`;
      } else if (lowerText.includes('competen') || lowerText.includes('skill')) {
        aiReplyText = `Pentru roluri de Lead / Architect în 2026, îți recomand să evidențiezi următoarele tehnologii în CV-ul tău:\n\n• **Cloud & Infra:** AWS, Docker, Kubernetes, Terraform\n• **Frontend:** React 19, TypeScript, Next.js App Router, Web Vitals\n• **Backend & Data:** Node.js, GraphQL, Redis, PostgreSQL`;
      } else {
        aiReplyText = `Am recepționat solicitarea ta legată de CV-ul lui **${cvData?.personal?.name || 'Alexandru'}**. Pot aplica ajustări automate pe secțiunile de Experiență, Proiecte sau Competențe. Ce parte ai dori să rafinăm în continuare?`;
      }

      const aiMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: getCurrentTime(),
        animate: true,
        isStreaming: true
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
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
                <span className="status-dot"></span> Online
              </span>
            </div>
            <div className="header-context">
              <span className="context-label">Context:</span> {cvData?.personal?.name || 'Alexandru Popescu'}
            </div>
          </div>
        </div>

        <div className="header-actions">
          {/* Plus Icon for New Chat */}
          <button 
            className="header-btn" 
            onClick={handleNewChat} 
            title="Chat Nou"
            aria-label="Start new chat session"
          >
            <Plus size={18} />
          </button>
          {/* Close Panel Button */}
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
            <Zap size={13} style={{ color: '#fbbf24' }} /> Credite AI Rămase
          </span>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#a7f3d0' }}>
            {aiCredits} / 100
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
            background: 'linear-gradient(90deg, #6366f1, #a855f7)',
            borderRadius: '999px',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      {/* Message List */}
      <div className="drawer-messages">
        {messages.map((msg) => (
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
                  {msg.sender === 'user' ? 'Tu' : 'AI Resume Agent'}
                </span>
                <span className="timestamp">{msg.timestamp}</span>
              </div>

              <div className="bubble-text">
                {msg.sender === 'ai' ? (
                  <TypewriterText 
                    text={msg.text} 
                    speed={14}
                    animate={msg.animate !== false} 
                    isStreaming={msg.isStreaming}
                    onCharacterTyped={scrollToBottom}
                    onComplete={() => {
                      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isStreaming: false, animate: false } : m));
                    }}
                  />
                ) : (
                  msg.text.split('\n').map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      {idx < msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))
                )}
              </div>

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
        ))}

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
              <span className="typing-text">AI scrie răspunsul...</span>
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
            placeholder="Întreabă AI Agent despre CV-ul tău..."
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
          Powered by Antigravity AI Engine • Modificările sunt sincronizate în timp real
        </div>
      </div>
    </div>
  );
}
