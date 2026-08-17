import fs from 'fs';
import { USERS_DATA_PATH } from '../config/paths.js';
import { prisma } from '../config/db.js';
import { slugify } from '../utils/slugify.js';

// Disk fallback helpers
function loadUsersFromDisk() {
  try {
    if (fs.existsSync(USERS_DATA_PATH)) {
      const content = fs.readFileSync(USERS_DATA_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Eroare la citirea utilizatorilor din disc:', err.message);
  }
  return [];
}

function saveUsersToDisk(users) {
  try {
    fs.writeFileSync(USERS_DATA_PATH, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Eroare la salvarea utilizatorilor pe disc:', err.message);
    return false;
  }
}

export async function getUsers() {
  if (prisma) {
    try {
      const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
      if (users.length > 0) return users;
    } catch (err) {
      console.warn('Prisma getUsers error, fallback to disk:', err.message);
    }
  }
  return loadUsersFromDisk();
}

export async function getUserById(userId) {
  if (prisma) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: userId },
            { name: { equals: decodeURIComponent(userId), mode: 'insensitive' } }
          ]
        }
      });
      if (user) return user;
    } catch (err) {
      console.warn('Prisma getUserById error, fallback to disk:', err.message);
    }
  }
  const users = loadUsersFromDisk();
  return users.find(u => u.id === userId || u.name.toLowerCase() === decodeURIComponent(userId).toLowerCase()) || null;
}

export async function registerUser(name) {
  const trimmedName = (name || '').trim();
  if (!trimmedName) {
    throw new Error('Numele este obligatoriu pentru înregistrare.');
  }

  const now = new Date();
  const existingUser = await getUserById(trimmedName);

  if (existingUser) {
    return await updateUser(existingUser.id, { lastActive: now.toISOString(), status: 'active' });
  }

  const newId = 'usr_' + slugify(trimmedName) + '_' + Math.random().toString(36).substring(2, 7);
  const newUser = {
    id: newId,
    name: trimmedName,
    credits: 100,
    status: 'active',
    createdAt: now.toISOString(),
    lastActive: now.toISOString()
  };

  if (prisma) {
    try {
      const created = await prisma.user.create({
        data: {
          id: newUser.id,
          name: newUser.name,
          credits: newUser.credits,
          status: newUser.status,
          createdAt: now,
          lastActive: now
        }
      });
      // Also update disk for sync
      const diskUsers = loadUsersFromDisk();
      diskUsers.unshift(newUser);
      saveUsersToDisk(diskUsers);
      return created;
    } catch (err) {
      console.warn('Prisma registerUser error, fallback to disk:', err.message);
    }
  }

  const users = loadUsersFromDisk();
  users.unshift(newUser);
  saveUsersToDisk(users);
  return newUser;
}

export async function updateUser(userId, data) {
  const now = new Date();
  
  if (prisma) {
    try {
      const existing = await prisma.user.findFirst({
        where: { OR: [{ id: userId }, { name: { equals: decodeURIComponent(userId), mode: 'insensitive' } }] }
      });
      if (existing) {
        const updateData = { lastActive: now };
        if (data.credits !== undefined) updateData.credits = Math.max(0, parseInt(data.credits, 10) || 0);
        if (data.name !== undefined && data.name.trim()) updateData.name = data.name.trim();
        if (data.status !== undefined) updateData.status = data.status;

        const updated = await prisma.user.update({
          where: { id: existing.id },
          data: updateData
        });

        // Sync disk
        const users = loadUsersFromDisk();
        const idx = users.findIndex(u => u.id === existing.id);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...data, lastActive: now.toISOString() };
          saveUsersToDisk(users);
        }
        return updated;
      }
    } catch (err) {
      console.warn('Prisma updateUser error, fallback to disk:', err.message);
    }
  }

  const users = loadUsersFromDisk();
  const index = users.findIndex(u => u.id === userId || u.name.toLowerCase() === decodeURIComponent(userId).toLowerCase());
  if (index === -1) {
    throw new Error('Utilizatorul nu a fost găsit.');
  }

  if (data.credits !== undefined) users[index].credits = Math.max(0, parseInt(data.credits, 10) || 0);
  if (data.name !== undefined && data.name.trim()) users[index].name = data.name.trim();
  if (data.status !== undefined) users[index].status = data.status;
  users[index].lastActive = now.toISOString();

  saveUsersToDisk(users);
  return users[index];
}

export async function deleteUser(userId) {
  if (prisma) {
    try {
      const existing = await prisma.user.findFirst({
        where: { OR: [{ id: userId }, { name: { equals: decodeURIComponent(userId), mode: 'insensitive' } }] }
      });
      if (existing) {
        await prisma.user.delete({ where: { id: existing.id } });
      }
    } catch (err) {
      console.warn('Prisma deleteUser error, fallback to disk:', err.message);
    }
  }

  let users = loadUsersFromDisk();
  const initialLength = users.length;
  users = users.filter(u => u.id !== userId && u.name.toLowerCase() !== decodeURIComponent(userId).toLowerCase());
  if (users.length === initialLength) {
    throw new Error('Utilizatorul nu a fost găsit.');
  }
  saveUsersToDisk(users);
  return users;
}

export async function deductUserCredits(userId, amount = 1) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('Utilizatorul nu a fost găsit.');
  }
  if (user.credits < amount) {
    const err = new Error('Nu mai ai credite AI disponibile!');
    err.credits = user.credits;
    throw err;
  }

  const updatedCredits = user.credits - amount;
  return await updateUser(user.id, { credits: updatedCredits });
}
