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
});
