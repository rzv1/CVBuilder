import { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessageApi } from '../api/aiApi.js';
import { useCv, useAuth, useAiProposal, useUI } from '../../../context/index.jsx';
import { trpcClient } from '../../../lib/trpc.js';

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

  // Configurable context window limit (default: 2)
  const [contextLimit, setContextLimit] = useState(2);

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(() => 'session-' + Date.now());
  const [messages, setMessages] = useState(() => getInitialWelcomeMessage(currentUser));
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeCredits = currentUser ? (currentUser.credits ?? 0) : 0;

  // Load chat sessions from Database for logged-in user
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      setSessions([]);
      setActiveSessionId('session-' + Date.now());
      setMessages(getInitialWelcomeMessage(null));
      return;
    }

    let isMounted = true;
    trpcClient.chat.list
      .query({ userId: currentUser.id })
      .then((res) => {
        if (!isMounted) return;
        if (res && res.success && Array.isArray(res.sessions)) {
          setSessions(res.sessions);
          if (res.sessions.length > 0) {
            // Check if existing activeSessionId matches one in database
            const matched = res.sessions.find((s) => s.id === activeSessionId);
            if (matched) {
              setMessages(matched.messages || []);
            } else {
              const firstSession = res.sessions[0];
              setActiveSessionId(firstSession.id);
              setMessages(firstSession.messages || []);

              // Check if the most recent session has patches to restore diffs
              const latestWithPatches = [...(firstSession.messages || [])]
                .reverse()
                .find((m) => m.patches && Array.isArray(m.patches) && m.patches.length > 0);
              if (latestWithPatches && onApplyPatches) {
                const cleanExplanation = latestWithPatches.text
                  ? latestWithPatches.text.replace(/```json[\s\S]*?```/g, '').trim()
                  : '';
                onApplyPatches({
                  explanation: cleanExplanation || 'Gemini a generat propuneri de modificări prin JSON patch.',
                  patches: latestWithPatches.patches
                });
              }
            }
          } else {
            // Clean initial state for user with no chat history
            setActiveSessionId('session-' + Date.now());
            setMessages(getInitialWelcomeMessage(currentUser));
          }
        }
      })
      .catch((err) => {
        console.warn('Eroare la încărcarea istoricului de chat din DB:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

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
      setMessages((prev) => [
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

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Deduct credit in current user state
    if (currentUser && setCurrentUser) {
      setCurrentUser((prev) => (prev ? { ...prev, credits: Math.max(0, (prev.credits ?? 0) - 1) } : null));
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

    setMessages([...nextMessages, initialAiMsg]);

    await sendChatMessageApi({
      messages: nextMessages,
      cvData,
      styleData,
      currentUser,
      contextLimit,
      onChunk: ({ accumulatedText, patches }) => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === aiMsgId) {
              return {
                ...msg,
                text: accumulatedText,
                patches: patches
              };
            }
            return msg;
          })
        );
      },
      onComplete: async ({ accumulatedText, patches }) => {
        const finalAiMsg = {
          id: aiMsgId,
          sender: 'ai',
          text: accumulatedText,
          timestamp: getCurrentTime(),
          isStreaming: false,
          patches: patches || null
        };

        const updatedMessages = [...nextMessages, finalAiMsg];
        setMessages(updatedMessages);

        // Determine title for chat session
        const existingSession = sessions.find((s) => s.id === activeSessionId);
        const cleanFirstUserMsg = userMsg.text.replace(/[\n\r]+/g, ' ').trim();
        const derivedTitle = cleanFirstUserMsg.length > 38 ? `${cleanFirstUserMsg.slice(0, 38)}...` : cleanFirstUserMsg;
        const sessionTitle = existingSession?.title && existingSession.title !== 'Conversație nouă'
          ? existingSession.title
          : (derivedTitle || 'Conversație');

        // Persist session and messages in Database for logged-in user
        if (currentUser && currentUser.id) {
          try {
            await trpcClient.chat.save.mutate({
              sessionId: activeSessionId,
              userId: currentUser.id,
              title: sessionTitle,
              messages: updatedMessages
            });

            // Update local sessions list
            setSessions((prev) => {
              const existingIdx = prev.findIndex((s) => s.id === activeSessionId);
              if (existingIdx >= 0) {
                const updated = [...prev];
                updated[existingIdx] = {
                  ...updated[existingIdx],
                  title: sessionTitle,
                  updatedAt: Date.now(),
                  date: formatSessionDate(),
                  messages: updatedMessages
                };
                return updated;
              } else {
                const newSession = {
                  id: activeSessionId,
                  title: sessionTitle,
                  date: formatSessionDate(),
                  updatedAt: Date.now(),
                  messages: updatedMessages
                };
                return [newSession, ...prev];
              }
            });
          } catch (persistErr) {
            console.error('Failed to persist chat session to database:', persistErr);
          }
        }

        // Automatically trigger visual diff proposal on CV if patches were generated
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
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === aiMsgId) {
              return {
                ...msg,
                text: 'Scuze, a intervenit o eroare la conectarea cu AI Assistant. Asigură-te că serverul este pornit.',
                isStreaming: false
              };
            }
            return msg;
          })
        );
        setIsTyping(false);
      }
    });
  };

  /**
   * Starts a brand new chat. The session is NOT saved to DB until the user sends their first message.
   */
  const handleNewChat = () => {
    if (isTyping) return;
    const newSessionId = 'session-' + Date.now();
    setActiveSessionId(newSessionId);
    setMessages(getInitialWelcomeMessage(currentUser));
    setInputText('');
    if (aiProposal.setPendingProposal) {
      aiProposal.setPendingProposal(null);
    }
  };

  /**
   * Reopens a chat session from history and restores visual diffs box if patches exist.
   */
  const handleSelectSession = (sessionId) => {
    if (isTyping || sessionId === activeSessionId) return;
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setActiveSessionId(session.id);
      const sessionMessages = session.messages || [];
      setMessages(sessionMessages);
      setInputText('');

      // Find the latest AI message that contains patches to immediately restore diffs
      const latestWithPatches = [...sessionMessages]
        .reverse()
        .find((m) => m.patches && Array.isArray(m.patches) && m.patches.length > 0);

      if (latestWithPatches && onApplyPatches) {
        const cleanExplanation = latestWithPatches.text
          ? latestWithPatches.text.replace(/```json[\s\S]*?```/g, '').trim()
          : '';
        onApplyPatches({
          explanation: cleanExplanation || 'Gemini a generat patch-uri JSON pentru actualizarea CV-ului.',
          patches: latestWithPatches.patches
        });
      } else if (aiProposal.setPendingProposal) {
        aiProposal.setPendingProposal(null);
      }
    }
  };

  /**
   * Deletes a chat session from Database and local state.
   */
  const handleDeleteSession = async (sessionId) => {
    if (currentUser && currentUser.id) {
      try {
        await trpcClient.chat.delete.mutate({ sessionId, userId: currentUser.id });
      } catch (err) {
        console.error('Eroare la ștergerea conversației:', err);
      }
    }

    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      if (sessionId === activeSessionId) {
        if (filtered.length > 0) {
          const nextSession = filtered[0];
          setActiveSessionId(nextSession.id);
          setMessages(nextSession.messages || []);

          const latestWithPatches = [...(nextSession.messages || [])]
            .reverse()
            .find((m) => m.patches && Array.isArray(m.patches) && m.patches.length > 0);
          if (latestWithPatches && onApplyPatches) {
            onApplyPatches({
              explanation: latestWithPatches.text.replace(/```json[\s\S]*?```/g, '').trim() || '',
              patches: latestWithPatches.patches
            });
          } else if (aiProposal.setPendingProposal) {
            aiProposal.setPendingProposal(null);
          }
        } else {
          const newId = 'session-' + Date.now();
          setActiveSessionId(newId);
          setMessages(getInitialWelcomeMessage(currentUser));
          if (aiProposal.setPendingProposal) {
            aiProposal.setPendingProposal(null);
          }
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
    handleDeleteSession,
    contextLimit,
    setContextLimit
  };
}
