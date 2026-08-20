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
 * API call to send chat messages to AI assistant and receive streamed response
 */
export const sendChatMessageApi = async ({
  messages,
  cvData,
  styleData,
  currentUser,
  onChunk,
  onComplete,
  onError
}) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        content: cvData,
        style: styleData,
        userId: currentUser?.id,
        userName: currentUser?.name
      })
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

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
      if (onChunk) {
        onChunk({ accumulatedText, patches });
      }
    }

    const finalPatches = parseJsonPatchesFromText(accumulatedText);
    if (onComplete) {
      onComplete({ accumulatedText, patches: finalPatches });
    }
  } catch (err) {
    console.error('AI Chat Service Error:', err);
    if (onError) {
      onError(err);
    }
  }
};

/**
 * API call to parse raw CV text using AI into a structured CV object
 */
export const parseCvWithAi = async ({ text, currentUser }) => {
  const response = await fetch('/api/ai/parse-cv', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      userId: currentUser?.id,
      userName: currentUser?.name
    })
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'A apărut o eroare la parsarea CV-ului cu AI.');
  }

  return data.cvData;
};

