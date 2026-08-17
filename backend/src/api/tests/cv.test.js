import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('CV API Integration Tests', () => {
  it('GET /api/cv should return CV content and style', async () => {
    const res = await request(app).get('/api/cv');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.content).toBeDefined();
    expect(res.body.style).toBeDefined();
  });

  it('POST /api/cv should save CV data successfully', async () => {
    const getRes = await request(app).get('/api/cv');
    const content = getRes.body.content || {};
    const style = getRes.body.style || {};

    const res = await request(app)
      .post('/api/cv')
      .send({ content, style });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('salvat');
  });

  it('PUT /api/cv and PATCH /api/cv should also save CV data', async () => {
    const getRes = await request(app).get('/api/cv');
    const content = getRes.body.content || {};

    const putRes = await request(app)
      .put('/api/cv')
      .send({ content });

    expect(putRes.status).toBe(200);
    expect(putRes.body.success).toBe(true);

    const patchRes = await request(app)
      .patch('/api/cv')
      .send({ content });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.success).toBe(true);
  });
});
