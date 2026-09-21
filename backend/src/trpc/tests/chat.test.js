import { describe, it, expect } from 'vitest';
import { createCaller } from '../../trpc/appRouter.js';

describe('Chat tRPC Integration Tests', () => {
  const caller = createCaller({});
  const testUser = 'test_chat_user_' + Date.now();
  const sessionId = 'session_test_' + Date.now();

  it('chat.save should persist a chat session with messages and patches', async () => {
    // First register test user
    const regRes = await caller.users.register({ name: testUser });
    expect(regRes.success).toBe(true);
    const userId = regRes.user.id;

    const messages = [
      { id: 'm1', sender: 'user', text: 'Adaugă skill Docker', timestamp: '10:00' },
      {
        id: 'm2',
        sender: 'ai',
        text: 'Am adăugat Docker în skills.',
        timestamp: '10:01',
        patches: [{ target: 'content', op: 'add', path: '/skills/0/items/-', value: 'Docker' }]
      }
    ];

    const saveRes = await caller.chat.save({
      sessionId,
      userId,
      title: 'Adaugă skill Docker',
      messages
    });

    expect(saveRes.success).toBe(true);
    expect(saveRes.sessionId).toBe(sessionId);

    // List sessions
    const listRes = await caller.chat.list({ userId });
    expect(listRes.success).toBe(true);
    expect(listRes.sessions.length).toBeGreaterThanOrEqual(1);

    const foundSession = listRes.sessions.find(s => s.id === sessionId);
    expect(foundSession).toBeDefined();
    expect(foundSession.title).toBe('Adaugă skill Docker');
    expect(foundSession.messages.length).toBe(2);
    expect(foundSession.messages[1].patches).toEqual([
      { target: 'content', op: 'add', path: '/skills/0/items/-', value: 'Docker' }
    ]);

    // Delete session
    const delRes = await caller.chat.delete({ sessionId, userId });
    expect(delRes.success).toBe(true);

    // Verify deletion
    const afterDel = await caller.chat.list({ userId });
    expect(afterDel.sessions.find(s => s.id === sessionId)).toBeUndefined();
  });
});
