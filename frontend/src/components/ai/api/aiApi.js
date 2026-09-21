import { trpcClient } from '../../../lib/trpc.js';

/**
 * Helper to parse RFC 6902 JSON patch block from stream text
 */
export const parseJsonPatchesFromText = (text) => {
  if (!text) return null;
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

/**
 * API call to send chat messages to AI assistant via tRPC
 */
export const sendChatMessageApi = async ({
  messages,
  cvData,
  styleData,
  currentUser,
  contextLimit = 2,
  generateMutation,
  onChunk,
  onComplete,
  onError
}) => {
  try {
    const token = currentUser?.id || localStorage.getItem('cv_builder_token') || '';
    const payload = {
      messages: messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      })),
      content: cvData,
      style: styleData,
      userId: token || currentUser?.id,
      userName: currentUser?.name,
      contextLimit
    };

    const res = generateMutation
      ? await generateMutation.mutateAsync(payload)
      : await trpcClient.chat.generate.mutate(payload);

    const fullText = res?.text || '';
    const patches = parseJsonPatchesFromText(fullText);

    // Stream chunks progressively to create fluid typewriter effect
    if (onChunk && fullText.length > 0) {
      const step = Math.max(3, Math.floor(fullText.length / 40));
      for (let i = step; i < fullText.length; i += step) {
        await new Promise(r => setTimeout(r, 18));
        const partial = fullText.slice(0, i);
        onChunk({ accumulatedText: partial, patches: parseJsonPatchesFromText(partial) });
      }
      onChunk({ accumulatedText: fullText, patches });
    }

    if (onComplete) {
      onComplete({ accumulatedText: fullText, patches });
    }
  } catch (err) {
    console.error('AI Chat Service Error via tRPC:', err);
    if (onError) {
      onError(err);
    }
  }
};

/**
 * API call to parse raw CV text using AI into a structured CV object via tRPC
 */
export const parseCvWithAi = async ({ text, currentUser }) => {
  const data = await trpcClient.ai.parseCv.mutate({
    text,
    userId: currentUser?.id,
    userName: currentUser?.name
  });

  if (!data?.success || !data?.cvData) {
    throw new Error(data?.error || 'A apărut o eroare la parsarea CV-ului cu AI.');
  }

  return data.cvData;
};


