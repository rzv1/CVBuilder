import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('Users API Integration Tests', () => {
  it('GET /api/users should return a list of users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it('POST /api/users/register should fail when name is empty', async () => {
    const res = await request(app).post('/api/users/register').send({ name: '' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/users/register should create a new user', async () => {
    const userName = `New Reg User ${Date.now()}`;
    const res = await request(app)
      .post('/api/users/register')
      .send({ name: userName });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.name).toBe(userName);
    expect(res.body.user.credits).toBe(100);
  });

  it('GET /api/users/:id should return 404 for non-existent user', async () => {
    const res = await request(app).get('/api/users/non_existent_id_99999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/users/:id should return user details if user exists', async () => {
    const userName = `Jane Doe ${Date.now()}`;
    const regRes = await request(app)
      .post('/api/users/register')
      .send({ name: userName });
    const user = regRes.body.user;

    const res = await request(app).get(`/api/users/${user.id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.name).toBe(userName);
  });

  it('PUT /api/users/:id should update user details', async () => {
    const userName = `John Update ${Date.now()}`;
    const regRes = await request(app)
      .post('/api/users/register')
      .send({ name: userName });
    const user = regRes.body.user;

    const res = await request(app)
      .put(`/api/users/${user.id}`)
      .send({ credits: 50 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.credits).toBe(50);
  });

  it('POST /api/users/:id/deduct should deduct credits', async () => {
    const userName = `Deduct User ${Date.now()}`;
    const regRes = await request(app)
      .post('/api/users/register')
      .send({ name: userName });
    const user = regRes.body.user;

    const res = await request(app)
      .post(`/api/users/${user.id}/deduct`)
      .send({ amount: 10 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.credits).toBe(90);
  });

  it('DELETE /api/users/:id should delete an existing user', async () => {
    const userName = `User To Delete ${Date.now()}`;
    const regRes = await request(app)
      .post('/api/users/register')
      .send({ name: userName });
    const user = regRes.body.user;

    const res = await request(app).delete(`/api/users/${user.id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const getRes = await request(app).get(`/api/users/${user.id}`);
    expect(getRes.status).toBe(404);
  });
});
