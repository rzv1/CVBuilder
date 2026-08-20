import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('AI API Integration Tests', () => {
  it('POST /api/ai/parse-cv should return 500 error if text is empty', async () => {
    const res = await request(app)
      .post('/api/ai/parse-cv')
      .send({ text: '' });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Textul extras din CV este gol');
  });
});
