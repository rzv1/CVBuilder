import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sendChatMessageApi } from '../api/aiApi.js';
import { useCv, useAuth, useAiProposal, useUI } from '../../../context/index.jsx';
import { useTRPC } from '../../../lib/trpc.js';

const getInitialWelcomeMessage = (user) => {
  const userName = user?.name ? user.name : '';
  const greeting = userName ? `Salut, ${userName}!` : 'Salut!';
  return [
    {
      id: 'msg-welcome-' + Date.now(),
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
  const activeCredits = props.activeCredits ?? currentUser?.credits ?? 0;

  // Configurable context window limit (default: 2)
  const [contextLimit, setContextLimit] = useState(2);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // TanStack Query for Chat Sessions (registered in TanStack DevTools under Queries)
  const chatListQuery = useQuery({
    ...trpc.chat.list.queryOptions({ userId: currentUser?.id }),
    enabled: Boolean(currentUser?.id),
  });

  // TanStack Mutations for Chat Save, Delete, Generate (registered in TanStack DevTools under Mutations)
  const saveChatMutation = useMutation(
    trpc.chat.save.mutationOptions({
      onSuccess: () => {
        if (currentUser?.id) {
          queryClient.invalidateQueries({
            queryKey: trpc.chat.list.queryKey({ userId: currentUser.id }),
          });
        }
      },
    })
  );

  const deleteChatMutation = useMutation(
    trpc.chat.delete.mutationOptions({
      onSuccess: () => {
        if (currentUser?.id) {
          queryClient.invalidateQueries({
            queryKey: trpc.chat.list.queryKey({ userId: currentUser.id }),
          });
        }
      },
    })
  );

  const generateChatMutation = useMutation(
    trpc.chat.generate.mutationOptions()
  );

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(() => 'session-' + Date.now());
  const [messages, setMessages] = useState(() => getInitialWelcomeMessage(currentUser));
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeSessionIdRef = useRef(activeSessionId);
  useEffect(() => {
    activeSessionIdRef.current = activeSessionId;
  }, [activeSessionId]);

  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Sync loaded chat sessions from TanStack Query into local state
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      setSessions([]);
      setActiveSessionId('session-' + Date.now());
      setMessages(getInitialWelcomeMessage(null));
      return;
    }

    if (chatListQuery.data?.success && Array.isArray(chatListQuery.data.sessions)) {
      const serverSessions = chatListQuery.data.sessions;
      setSessions(serverSessions);

      // Synchronize already applied message IDs into aiProposal context
      serverSessions.forEach((s) => {
        (s.messages || []).forEach((m) => {
          if (m.applied && aiProposal.markMessageApplied) {
            aiProposal.markMessageApplied(m.id);
          }
        });
      });

      if (serverSessions.length > 0) {
        // Check if existing activeSessionId matches one in database
        const matched = serverSessions.find((s) => s.id === activeSessionIdRef.current);
        if (matched) {
          setMessages(matched.messages || []);
        } else if (messagesRef.current.length <= 1) {
          // Only auto-switch to firstSession if user has not started typing or sending in a new chat
          const firstSession = serverSessions[0];
          setActiveSessionId(firstSession.id);
          setMessages(firstSession.messages || []);

          // Check if the most recent session has patches to restore diffs (only if not already applied)
          const latestWithPatches = [...(firstSession.messages || [])]
            .reverse()
            .find((m) => m.patches && Array.isArray(m.patches) && m.patches.length > 0 && !m.applied && !aiProposal.appliedMessageIds?.has(m.id));
          if (latestWithPatches && onApplyPatches) {
            const cleanExplanation = latestWithPatches.text
              ? latestWithPatches.text.replace(/```json[\s\S]*?```/g, '').trim()
              : '';
            onApplyPatches({
              explanation: cleanExplanation || 'Gemini a generat propuneri de modificări prin JSON patch.',
              patches: latestWithPatches.patches,
              messageId: latestWithPatches.id,
              onApplied: handleMarkMessageApplied
            });
          }
        }
      }
    }
  }, [currentUser?.id, chatListQuery.data]);


  // Update welcome greeting when currentUser changes if only initial message is present
  useEffect(() => {
    if (messages.length === 1 && (messages[0].id === 'msg-welcome' || messages[0].id?.startsWith?.('msg-welcome'))) {
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

  const handleMarkMessageApplied = useCallback((messageId) => {
    if (!messageId) return;

    if (aiProposal.markMessageApplied) {
      aiProposal.markMessageApplied(messageId);
    }

    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((m) =>
        m.id === messageId ? { ...m, applied: true } : m
      );

      // Persist to Database if user is logged in
      if (currentUser && currentUser.id) {
        const currentSession = sessions.find((s) => s.id === activeSessionIdRef.current);
        saveChatMutation.mutate({
          sessionId: activeSessionIdRef.current,
          userId: currentUser.id,
          title: currentSession?.title || 'Conversație',
          messages: updatedMessages
        });
      }

      return updatedMessages;
    });

    setSessions((prevSessions) =>
      prevSessions.map((s) => {
        const hasMsg = s.messages?.some((m) => m.id === messageId);
        if (hasMsg) {
          const updatedMsgs = (s.messages || []).map((m) =>
            m.id === messageId ? { ...m, applied: true } : m
          );
          if (currentUser && currentUser.id && s.id !== activeSessionIdRef.current) {
            saveChatMutation.mutate({
              sessionId: s.id,
              userId: currentUser.id,
              title: s.title || 'Conversație',
              messages: updatedMsgs
            });
          }
          return {
            ...s,
            updatedAt: Date.now(),
            messages: updatedMsgs
          };
        }
        return s;
      })
    );

    if (aiProposal.pendingProposal?.messageId === messageId && aiProposal.setPendingProposal) {
      aiProposal.setPendingProposal(null);
    }
  }, [currentUser, sessions, saveChatMutation, aiProposal]);

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

    const currentSessionId = activeSessionIdRef.current;

    // Immediately create or update the session in history so it appears right away
    const cleanFirstUserMsg = userMsg.text.replace(/[\n\r]+/g, ' ').trim();
    const derivedTitle = cleanFirstUserMsg.length > 38 ? `${cleanFirstUserMsg.slice(0, 38)}...` : cleanFirstUserMsg;

    setSessions((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === currentSessionId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          updatedAt: Date.now(),
          date: formatSessionDate(),
          messages: nextMessages
        };
        return updated;
      } else {
        const newSession = {
          id: currentSessionId,
          title: derivedTitle || 'Conversație',
          date: formatSessionDate(),
          updatedAt: Date.now(),
          messages: nextMessages
        };
        return [newSession, ...prev];
      }
    });

    // Save initial session state to Database immediately via TanStack Mutation
    if (currentUser && currentUser.id) {
      saveChatMutation.mutate({
        sessionId: currentSessionId,
        userId: currentUser.id,
        title: derivedTitle || 'Conversație',
        messages: nextMessages
      });
    }

    const aiMsgId = `msg-${Date.now() + 1}`;
    const initialAiMsg = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      timestamp: getCurrentTime(),
      animate: true,
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
      generateMutation: generateChatMutation,
      onChunk: ({ accumulatedText, patches }) => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === aiMsgId) {
              return {
                ...msg,
                text: accumulatedText,
                patches: patches,
                animate: true,
                isStreaming: true
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
          animate: false,
          patches: patches || null
        };

        const updatedMessages = [...nextMessages, finalAiMsg];
        setMessages(updatedMessages);

        // Determine title for chat session
        const sessionTitle = derivedTitle || 'Conversație';

        // Update session and messages in Database for logged-in user via TanStack Mutation
        if (currentUser && currentUser.id) {
          try {
            await saveChatMutation.mutateAsync({
              sessionId: currentSessionId,
              userId: currentUser.id,
              title: sessionTitle,
              messages: updatedMessages
            });

            // Update local sessions list with final messages
            setSessions((prev) => {
              const existingIdx = prev.findIndex((s) => s.id === currentSessionId);
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
                  id: currentSessionId,
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
            patches: patches,
            messageId: aiMsgId,
            onApplied: handleMarkMessageApplied
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
    if (isTyping) return;
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setActiveSessionId(session.id);
      const sessionMessages = (session.messages && session.messages.length > 0)
        ? session.messages
        : getInitialWelcomeMessage(currentUser);
      setMessages(sessionMessages);
      setInputText('');

      // Find the latest AI message that contains patches to immediately restore diffs (only if not applied)
      const latestWithPatches = [...sessionMessages]
        .reverse()
        .find((m) => m.patches && Array.isArray(m.patches) && m.patches.length > 0 && !m.applied && !aiProposal.appliedMessageIds?.has(m.id));

      if (latestWithPatches && onApplyPatches) {
        const cleanExplanation = latestWithPatches.text
          ? latestWithPatches.text.replace(/```json[\s\S]*?```/g, '').trim()
          : '';
        onApplyPatches({
          explanation: cleanExplanation || 'Gemini a generat patch-uri JSON pentru actualizarea CV-ului.',
          patches: latestWithPatches.patches,
          messageId: latestWithPatches.id,
          onApplied: handleMarkMessageApplied
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
        await deleteChatMutation.mutateAsync({ sessionId, userId: currentUser.id });
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
            .find((m) => m.patches && Array.isArray(m.patches) && m.patches.length > 0 && !m.applied && !aiProposal.appliedMessageIds?.has(m.id));
          if (latestWithPatches && onApplyPatches) {
            onApplyPatches({
              explanation: latestWithPatches.text.replace(/```json[\s\S]*?```/g, '').trim() || '',
              patches: latestWithPatches.patches,
              messageId: latestWithPatches.id,
              onApplied: handleMarkMessageApplied
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
    setContextLimit,
    onApplyPatches,
    handleMarkMessageApplied
  };
}
