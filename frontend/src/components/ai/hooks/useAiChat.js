import { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessageApi } from '../api/aiApi.js';
import { useCv, useAuth, useAiProposal, useUI } from '../../../context/index.jsx';

const getInitialWelcomeMessage = (user) => {
  const userName = user?.name ? user.name : '';
  const greeting = userName ? `Salut, ${userName}!` : 'Salut!';
  return [
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `${greeting} Cu ce te pot ajuta astăzi pentru optimizarea sau reformularea secțiunilor?`,
      timestamp: getCurrentTime(),
      animate: false
    }
  ];
};

const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const formatSessionDate = (dateInput = new Date()) => {
  try {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return new Intl.DateTimeFormat('ro-RO', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch (e) {
    return 'Recent';
  }
};

const defaultInitialSessions = [
  {
    id: 'session-sample-1',
    title: 'Optimizare experiență Senior Dev',
    date: '19 Sep, 17:20',
    updatedAt: Date.now() - 86400000,
    messages: [
      {
        id: 'msg-s1-1',
        sender: 'user',
        text: 'Cum pot reformula experiența de Senior Developer pentru un impact mai puternic?',
        timestamp: '17:20'
      },
      {
        id: 'msg-s1-2',
        sender: 'ai',
        text: 'Am optimizat descrierile rolului pentru a pune accent pe rezultate cuantificabile (creștere performanță cu 35%, arhitectură microservicii) și leadership tehnic.',
        timestamp: '17:21',
        animate: false
      }
    ]
  },
  {
    id: 'session-sample-2',
    title: 'Adăugare abilități Cloud & DevOps',
    date: '18 Sep, 11:05',
    updatedAt: Date.now() - 172800000,
    messages: [
      {
        id: 'msg-s2-1',
        sender: 'user',
        text: 'Sugerează-mi cele mai căutate skill-uri Cloud pentru rolul meu.',
        timestamp: '11:05'
      },
      {
        id: 'msg-s2-2',
        sender: 'ai',
        text: 'Îți recomand includerea: Docker, Kubernetes, AWS (ECS, Lambda, S3), CI/CD pipelines (GitHub Actions) și Terraform.',
        timestamp: '11:06',
        animate: false
      }
    ]
  }
];

const loadSavedSessions = () => {
  try {
    const raw = localStorage.getItem('cv_ai_chat_sessions');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load chat sessions:', e);
  }
  return defaultInitialSessions;
};

export function useAiChat(props = {}) {
  const cv = useCv();
  const auth = useAuth();
  const aiProposal = useAiProposal();
  const ui = useUI();

  const cvData = props.cvData ?? cv.cvData;
  const styleData = props.styleData ?? cv.styleData;
  const isOpen = props.isOpen ?? ui.isAiChatOpen;
  const onApplyPatches = props.onApplyPatches ?? aiProposal.handleApplyPatches;
  const currentUser = props.currentUser ?? auth.currentUser;
  const setCurrentUser = props.setCurrentUser ?? auth.setCurrentUser;

  const [sessions, setSessions] = useState(() => loadSavedSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => {
    try {
      const savedActiveId = localStorage.getItem('cv_ai_active_session_id');
      const loaded = loadSavedSessions();
      if (savedActiveId && loaded.some(s => s.id === savedActiveId)) {
        return savedActiveId;
      }
    } catch (e) {}
    return 'session-' + Date.now();
  });

  const [messages, setMessages] = useState(() => {
    const loaded = loadSavedSessions();
    const savedActiveId = localStorage.getItem('cv_ai_active_session_id');
    const existing = loaded.find(s => s.id === savedActiveId);
    if (existing && existing.messages && existing.messages.length > 0) {
      return existing.messages;
    }
    return getInitialWelcomeMessage(currentUser);
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeCredits = currentUser ? (currentUser.credits ?? 0) : 0;

  // Persist sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cv_ai_chat_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save chat sessions:', e);
    }
  }, [sessions]);

  // Persist activeSessionId to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cv_ai_active_session_id', activeSessionId);
    } catch (e) {}
  }, [activeSessionId]);

  // Update current session in sessions list when messages update
  useEffect(() => {
    const hasUserMessage = messages.some(m => m.sender === 'user');
    if (!hasUserMessage) return;

    const firstUserMsg = messages.find(m => m.sender === 'user')?.text || 'Conversație nouă';
    const cleanTitle = firstUserMsg.replace(/[\n\r]+/g, ' ').trim();
    const truncatedTitle = cleanTitle.length > 38 ? `${cleanTitle.slice(0, 38)}...` : cleanTitle;

    setSessions(prev => {
      const existingIndex = prev.findIndex(s => s.id === activeSessionId);
      if (existingIndex >= 0) {
        if (prev[existingIndex].messages === messages) return prev;
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          title: updated[existingIndex].title && updated[existingIndex].title !== 'Conversație nouă'
            ? updated[existingIndex].title
            : truncatedTitle,
          messages,
          updatedAt: Date.now()
        };
        return updated;
      } else {
        const newSession = {
          id: activeSessionId,
          title: truncatedTitle,
          date: formatSessionDate(),
          updatedAt: Date.now(),
          messages
        };
        return [newSession, ...prev];
      }
    });
  }, [messages, activeSessionId]);

  // Update welcome greeting when currentUser changes if only initial message is present
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'msg-welcome') {
      setMessages(getInitialWelcomeMessage(currentUser));
    }
  }, [currentUser]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping, scrollToBottom]);

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
          text: 'Ai epuizat creditele tale AI!',
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
    if (currentUser && setCurrentUser) {
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

    await sendChatMessageApi({
      messages: [...messages, userMsg],
      cvData,
      styleData,
      currentUser,
      onChunk: ({ accumulatedText, patches }) => {
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
      },
      onComplete: ({ accumulatedText, patches }) => {
        setMessages(prev => prev.map(msg => {
          if (msg.id === aiMsgId) {
            return {
              ...msg,
              isStreaming: false,
              patches: patches
            };
          }
          return msg;
        }));

        // Automatically trigger visual diff proposal if patches were received
        if (patches && patches.length > 0 && onApplyPatches) {
          const cleanExplanation = accumulatedText.replace(/```json[\s\S]*?```/g, '').trim();
          onApplyPatches({
            explanation: cleanExplanation || 'Gemini a generat patch-uri JSON restrânse pentru actualizarea CV-ului.',
            patches: patches
          });
        }

        setIsTyping(false);
      },
      onError: (err) => {
        console.error('AI Chat Error:', err);
        setMessages(prev => prev.map(msg => {
          if (msg.id === aiMsgId) {
            return {
              ...msg,
              text: 'Scuze, a intervenit o eroare la conectarea cu AI Assistant. Asigură-te că serverul e.',
              isStreaming: false
            };
          }
          return msg;
        }));
        setIsTyping(false);
      }
    });
  };

  const handleNewChat = () => {
    if (isTyping) return;
    const newSessionId = 'session-' + Date.now();
    setActiveSessionId(newSessionId);
    setMessages(getInitialWelcomeMessage(currentUser));
    setInputText('');
  };

  const handleSelectSession = (sessionId) => {
    if (isTyping || sessionId === activeSessionId) return;
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSessionId(session.id);
      setMessages(session.messages || []);
      setInputText('');
    }
  };

  const handleDeleteSession = (sessionId) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      if (sessionId === activeSessionId) {
        if (filtered.length > 0) {
          setActiveSessionId(filtered[0].id);
          setMessages(filtered[0].messages || []);
        } else {
          const newId = 'session-' + Date.now();
          setActiveSessionId(newId);
          setMessages(getInitialWelcomeMessage(currentUser));
        }
      }
      return filtered;
    });
  };

  return {
    messages,
    inputText,
    setInputText,
    isTyping,
    activeCredits,
    messagesEndRef,
    inputRef,
    handleSendMessage,
    handleNewChat,
    scrollToBottom,
    sessions,
    activeSessionId,
    handleSelectSession,
    handleDeleteSession
  };
}
