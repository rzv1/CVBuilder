import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('Utils API Integration Tests', () => {
  it('POST /api/utils/readtime should calculate reading time correctly', async () => {
    const res = await request(app)
      .post('/api/utils/readtime')
      .send({ content: 'Hello world this is a test text for read time calculation.' });

    expect(res.status).toBe(200);
    expect(res.body.readTime).toBeDefined();
    expect(typeof res.body.readTime).toBe('string');
  });

  it('POST /api/utils/slugify should convert text to a clean URL slug', async () => {
    const res = await request(app)
      .post('/api/utils/slugify')
      .send({ text: 'Cum să îți creezi un CV de succes în 2026!' });

    expect(res.status).toBe(200);
    expect(res.body.slug).toBe('cum-sa-iti-creezi-un-cv-de-succes-in-2026');
  });

  it('POST /api/export-md should format article JSON payload to markdown', async () => {
    const payload = {
      title: 'Titlu Test',
      categoryName: 'AI Agent',
      date: '17 August 2026',
      author: 'Antigravity',
      summary: 'Sumar scurt',
      content: 'Continutul articolului aici.'
    };

    const res = await request(app)
      .post('/api/export-md')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/markdown');
    expect(res.text).toContain('Titlu Test');
    expect(res.text).toContain('Continutul articolului aici.');
  });
});
