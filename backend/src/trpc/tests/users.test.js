import { describe, it, expect } from 'vitest';
import { createCaller } from '../../trpc/appRouter.js';

describe('Users tRPC Integration Tests', () => {
  const caller = createCaller({});

  it('users.getAll should return a list of users', async () => {
    const res = await caller.users.getAll();
    expect(res.success).toBe(true);
    expect(Array.isArray(res.users)).toBe(true);
  });

  it('users.register should fail when name is empty', async () => {
    await expect(caller.users.register({ name: '' })).rejects.toThrow();
  });

  it('users.register should create a new user', async () => {
    const userName = `New Reg User ${Date.now()}`;
    const res = await caller.users.register({ name: userName });
    expect(res.success).toBe(true);
    expect(res.user).toBeDefined();
    expect(res.user.name).toBe(userName);
    expect(res.user.credits).toBe(100);
  });

  it('users.getById should return NOT_FOUND for non-existent user', async () => {
    await expect(caller.users.getById('non_existent_id_99999')).rejects.toThrow();
  });

  it('users.getById should return user details if user exists', async () => {
    const userName = `Jane Doe ${Date.now()}`;
    const regRes = await caller.users.register({ name: userName });
    const user = regRes.user;

    const res = await caller.users.getById(user.id);
    expect(res.success).toBe(true);
    expect(res.user.name).toBe(userName);
  });

  it('users.update should update user details', async () => {
    const userName = `John Update ${Date.now()}`;
    const regRes = await caller.users.register({ name: userName });
    const user = regRes.user;

    const res = await caller.users.update({ id: user.id, credits: 50 });
    expect(res.success).toBe(true);
    expect(res.user.credits).toBe(50);
  });

  it('deductUserCredits should be an internal function (not an exposed tRPC route)', async () => {
    // Calling caller.users.deductCredits should reject because no procedure exists
    await expect(caller.users.deductCredits()).rejects.toThrow();

    const userName = `Deduct User ${Date.now()}`;
    const regRes = await caller.users.register({ name: userName });
    const user = regRes.user;

    const { deductUserCredits } = await import('../../services/users.service.js');
    const updated = await deductUserCredits(user.id, 10);
    expect(updated.credits).toBe(90);
  });

  it('users.delete should delete an existing user', async () => {
    const userName = `User To Delete ${Date.now()}`;
    const regRes = await caller.users.register({ name: userName });
    const user = regRes.user;

    const res = await caller.users.delete(user.id);
    expect(res.success).toBe(true);

    await expect(caller.users.getById(user.id)).rejects.toThrow();
  });

  it('users.auth should save and update avatar', async () => {
    const userName = `Avatar User ${Date.now()}`;
    const avatarUrl = 'data:image/png;base64,mockAvatarData';
    const authRes = await caller.users.auth({ name: userName, avatar: avatarUrl });
    expect(authRes.success).toBe(true);
    expect(authRes.user.avatar).toBe(avatarUrl);

    // Updating avatar via users.auth again
    const updatedAvatar = 'data:image/png;base64,newAvatarData';
    const updatedRes = await caller.users.auth({ name: userName, avatar: updatedAvatar });
    expect(updatedRes.success).toBe(true);
    expect(updatedRes.user.avatar).toBe(updatedAvatar);
  });
});
