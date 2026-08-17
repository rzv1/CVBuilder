import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('Logs API Integration Tests', () => {
  it('GET /api/logs should return logs array and stats object', async () => {
    const res = await request(app).get('/api/logs');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.logs)).toBe(true);
    expect(res.body.stats).toBeDefined();
  });

  it('DELETE /api/logs should clear logs and return success message', async () => {
    const res = await request(app).delete('/api/logs');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('șterse cu succes');

    const getRes = await request(app).get('/api/logs');
    expect(getRes.status).toBe(200);
    expect(getRes.body.logs.length).toBe(0);
  });
});
