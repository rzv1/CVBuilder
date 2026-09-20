import { describe, it, expect } from 'vitest';
import { createCaller } from '../../trpc/appRouter.js';

describe('AI tRPC Integration Tests', () => {
  const caller = createCaller({});

  it('ai.parseCv should throw error if text is empty', async () => {
    await expect(caller.ai.parseCv({ text: '' })).rejects.toThrow('Textul extras din CV este gol');
  });
});
