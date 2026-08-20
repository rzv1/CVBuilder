import { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessageApi } from '../api/aiApi.js';

const getInitialWelcomeMessage = (user) => {
  const userName = user?.name ? user.name : '';
  const greeting = userName ? `Salut, ${userName}!` : 'Salut!';
  return [
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `${greeting} Am analizat structura CV-ului tău (content & style). Cu ce te pot ajuta astăzi pentru optimizarea sau reformularea secțiunilor?`,
      timestamp: 'Acum',
      animate: false
    }
  ];
};

const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

export function useAiChat({
  cvData,
  styleData,
  isOpen,
  onApplyPatches,
  currentUser,
  setCurrentUser
}) {
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
          text: 'Ai epuizat creditele tale AI! Te rugăm să adaugi credite din CMS Admin.',
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
              text: 'Scuze, a intervenit o eroare la conectarea cu AI Assistant. Asigură-te că serverul CMS rulează pe portul 3001.',
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
    setMessages(getInitialWelcomeMessage(currentUser));
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
    scrollToBottom
  };
}
