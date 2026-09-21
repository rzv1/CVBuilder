import { describe, it, expect } from 'vitest';
import { createCaller } from '../../trpc/appRouter.js';

describe('CV tRPC Integration Tests', () => {
  const caller = createCaller({});

  it('cv.get should return CV content and style', async () => {
    const res = await caller.cv.get();
    expect(res.success).toBe(true);
    expect(res.content).toBeDefined();
    expect(res.style).toBeDefined();
  });

  it('cv.save should save CV data successfully', async () => {
    const getRes = await caller.cv.get();
    const content = getRes.content || {};
    const style = getRes.style || {};

    const res = await caller.cv.save({ content, style });
    expect(res.success).toBe(true);
    expect(res.message).toContain('salvat');
  });

  it('cv.save should handle partial updates as well', async () => {
    const getRes = await caller.cv.get();
    const content = getRes.content || {};

    const res = await caller.cv.save({ content });
    expect(res.success).toBe(true);
  });

  it('cv.save and cv.get should persist full content for a specific user across sessions', async () => {
    // 1. Create a new user
    const regRes = await caller.users.register({ name: `CvUser_${Date.now()}` });
    const userId = regRes.user.id;

    // 2. Save full mock content for this user
    const mockContent = {
      personal: {
        name: 'Test Persistent User',
        title: 'Software Engineer',
      },
      experience: [
        {
          id: 'exp-1',
          role: 'Engineer',
          company: 'Test Corp',
        },
      ],
      skills: [
        {
          id: 'sk-1',
          category: 'Core',
          items: ['React', 'Node'],
        },
      ],
    };

    const saveRes = await caller.cv.save({
      userId,
      content: mockContent,
    });
    expect(saveRes.success).toBe(true);

    // 3. Re-fetch CV data for this user (simulating login after logout)
    const fetched = await caller.cv.get({ userId });
    expect(fetched.success).toBe(true);
    expect(fetched.content).toBeDefined();
    expect(fetched.content.personal.name).toBe('Test Persistent User');
    expect(fetched.content.experience.length).toBe(1);
    expect(fetched.content.skills.length).toBe(1);
  });
});

