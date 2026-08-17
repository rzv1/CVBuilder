import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('Resources API Integration Tests', () => {
  it('GET /api/resources should return blog articles by default', async () => {
    const res = await request(app).get('/api/resources');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.type).toBe('blog');
    expect(Array.isArray(res.body.articles)).toBe(true);
    expect(Array.isArray(res.body.categories)).toBe(true);
  });

  it('GET /api/resources?type=docs should return docs sections and content', async () => {
    const res = await request(app).get('/api/resources?type=docs');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.type).toBe('docs');
    expect(Array.isArray(res.body.docsSections)).toBe(true);
    expect(res.body.docsContent).toBeDefined();
  });

  it('POST /api/resources should fail if title or category missing for blog', async () => {
    const res = await request(app)
      .post('/api/resources?type=blog')
      .send({ title: 'Test without category' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/resources should create a new blog article', async () => {
    const newArticle = {
      title: 'Test Article Title',
      category: 'misc',
      content: 'This is a test article content for vitest.',
      author: 'Tester'
    };

    const res = await request(app)
      .post('/api/resources?type=blog')
      .send(newArticle);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.article).toBeDefined();
    expect(res.body.article.title).toBe('Test Article Title');

    const createdId = res.body.article.id;

    // Clean up created article
    await request(app).delete(`/api/resources/${createdId}?type=blog`);
  });

  it('POST /api/resources?type=docs should create a new docs section', async () => {
    const newDoc = {
      sectionTitle: 'Test Doc Section',
      title: 'Test Doc Page',
      content: 'Doc content here.'
    };

    const res = await request(app)
      .post('/api/resources?type=docs')
      .send(newDoc);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.activeId).toBeDefined();

    const createdId = res.body.activeId;

    // Clean up created doc
    await request(app).delete(`/api/resources/${createdId}?type=docs`);
  });

  it('GET /api/resources/:id/export should export markdown file for an existing article', async () => {
    const listRes = await request(app).get('/api/resources?type=blog');
    const firstArticle = listRes.body.articles[0];
    expect(firstArticle).toBeDefined();

    const res = await request(app).get(`/api/resources/${firstArticle.id}/export?type=blog`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/markdown');
    expect(res.text).toContain(firstArticle.title);
  });

  it('PUT /api/resources/:id should return 404 for non-existent item', async () => {
    const res = await request(app)
      .put('/api/resources/non_existent_id?type=blog')
      .send({ title: 'New Title' });
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
