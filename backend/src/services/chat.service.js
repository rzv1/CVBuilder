import { prisma } from '../config/db.js';

function formatSessionDate(dateInput = new Date()) {
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
}

/**
 * Retrieves all chat sessions and messages for a given user.
 */
export async function getChatSessions(userId) {
  if (!userId) return [];

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { name: decodeURIComponent(userId) }
        ]
      }
    });

    if (!user) return [];

    const sessions = await prisma.chatSession.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return sessions.map((s) => ({
      id: s.id,
      title: s.title,
      updatedAt: s.updatedAt ? new Date(s.updatedAt).getTime() : Date.now(),
      date: formatSessionDate(s.updatedAt),
      messages: (s.messages || []).map((m) => {
        let parsedPatches = null;
        let applied = false;
        if (m.patches) {
          try {
            const raw = JSON.parse(m.patches);
            if (raw && typeof raw === 'object') {
              if (Array.isArray(raw)) {
                parsedPatches = raw;
                applied = false;
              } else if (Array.isArray(raw.list)) {
                parsedPatches = raw.list;
                applied = Boolean(raw.applied);
              }
            }
          } catch (err) {
            console.warn('Failed to parse patches for message:', m.id, err.message);
          }
        }
        return {
          id: m.id,
          sender: m.sender,
          text: m.text,
          patches: parsedPatches,
          applied: applied,
          timestamp: m.timestamp || '',
          animate: false
        };
      })
    }));
  } catch (err) {
    throw new Error('Eroare la preluarea istoricului de chat: ' + err.message);
  }
}

/**
 * Upserts a chat session and synchronizes all its messages (including AI JSON patches).
 */
export async function saveChatSession({ sessionId, userId, title, messages }) {
  if (!sessionId || !userId) {
    throw new Error('sessionId și userId sunt obligatorii pentru salvarea conversației.');
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { name: decodeURIComponent(userId) }
        ]
      }
    });

    if (!user) {
      throw new Error('Utilizatorul nu a fost găsit.');
    }

    const session = await prisma.chatSession.upsert({
      where: { id: sessionId },
      update: {
        title: title || 'Conversație',
        updatedAt: new Date()
      },
      create: {
        id: sessionId,
        userId: user.id,
        title: title || 'Conversație'
      }
    });

    // Delete existing messages and replace with fresh list to maintain full consistency
    await prisma.chatMessage.deleteMany({ where: { sessionId: session.id } });

    if (Array.isArray(messages) && messages.length > 0) {
      await prisma.chatMessage.createMany({
        data: messages.map((m) => {
          let patchesStr = null;
          if (m.patches) {
            if (m.applied) {
              patchesStr = JSON.stringify({ applied: true, list: m.patches });
            } else {
              patchesStr = JSON.stringify(m.patches);
            }
          }
          return {
            id: m.id || ('msg-' + Math.random().toString(36).substring(2, 9)),
            sessionId: session.id,
            sender: m.sender || 'user',
            text: m.text || '',
            patches: patchesStr,
            timestamp: m.timestamp || ''
          };
        })
      });
    }

    return {
      success: true,
      sessionId: session.id,
      title: session.title,
      updatedAt: session.updatedAt
    };
  } catch (err) {
    throw new Error('Eroare la salvarea conversației: ' + err.message);
  }
}

/**
 * Deletes a chat session by ID.
 */
export async function deleteChatSession(sessionId, userId) {
  if (!sessionId) {
    throw new Error('sessionId este obligatoriu.');
  }

  try {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId }
    });

    if (session) {
      await prisma.chatMessage.deleteMany({ where: { sessionId } });
      await prisma.chatSession.delete({ where: { id: sessionId } });
    }

    return { success: true, id: sessionId };
  } catch (err) {
    throw new Error('Eroare la ștergerea conversației: ' + err.message);
  }
}
