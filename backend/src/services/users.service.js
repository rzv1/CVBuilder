import { prisma } from '../config/db.js';

const slugify = (text) => (text || 'user').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export async function getUsers() {
  try {
    return await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (err) {
    throw new Error('Eroare la preluarea utilizatorilor din Prisma DB: ' + err.message);
  }
}

export async function getUserById(userId) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { name: decodeURIComponent(userId) }
        ]
      }
    });
    return user || null;
  } catch (err) {
    throw new Error('Eroare la căutarea utilizatorului în Prisma DB: ' + err.message);
  }
}

export async function loginUserByName(name) {
  const trimmedName = (name || '').trim();
  if (!trimmedName) {
    throw new Error('Numele de utilizator este obligatoriu pentru conectare.');
  }

  const user = await getUserById(trimmedName);
  if (!user) {
    throw new Error('Utilizatorul nu a fost găsit. Te rugăm să îți creezi un cont nou.');
  }

  const now = new Date();
  return await updateUser(user.id, { lastActive: now, status: 'active' });
}

export async function registerUserByName(name, avatar) {
  const trimmedName = (name || '').trim();
  if (!trimmedName) {
    throw new Error('Numele de utilizator este obligatoriu pentru înregistrare.');
  }

  const existingUser = await getUserById(trimmedName);
  if (existingUser) {
    throw new Error('Acest nume de utilizator este deja folosit. Te rugăm să alegi alt nume sau să te conectezi.');
  }

  const now = new Date();
  const newId = 'usr_' + slugify(trimmedName) + '_' + Math.random().toString(36).substring(2, 7);

  try {
    return await prisma.user.create({
      data: {
        id: newId,
        name: trimmedName,
        avatar: avatar || null,
        credits: 100,
        status: 'active',
        createdAt: now,
        lastActive: now
      }
    });
  } catch (err) {
    throw new Error('Eroare la înregistrarea utilizatorului în Prisma DB: ' + err.message);
  }
}

export async function getOrCreateUserByName(name, avatar) {
  const trimmedName = (name || '').trim();
  if (!trimmedName) {
    throw new Error('Numele este obligatoriu pentru autentificare.');
  }

  const now = new Date();
  const existingUser = await getUserById(trimmedName);

  if (existingUser) {
    const updatePayload = { lastActive: now.toISOString(), status: 'active' };
    if (avatar !== undefined) updatePayload.avatar = avatar;
    return await updateUser(existingUser.id, updatePayload);
  }

  return await registerUserByName(trimmedName, avatar);
}

export const registerUser = registerUserByName;
export const loginUser = loginUserByName;

export async function updateUser(userId, data) {
  const now = new Date();
  
  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { name: decodeURIComponent(userId) }] }
    });

    if (!existing) {
      throw new Error('Utilizatorul nu a fost găsit.');
    }

    const updateData = { lastActive: now };
    if (data.credits !== undefined) updateData.credits = Math.max(0, parseInt(data.credits, 10) || 0);
    if (data.name !== undefined && data.name.trim()) updateData.name = data.name.trim();
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.status !== undefined) updateData.status = data.status;

    return await prisma.user.update({
      where: { id: existing.id },
      data: updateData
    });
  } catch (err) {
    throw new Error('Eroare la actualizarea utilizatorului în Prisma DB: ' + err.message);
  }
}

export async function deleteUser(userId) {
  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { name: decodeURIComponent(userId) }] }
    });

    if (!existing) {
      throw new Error('Utilizatorul nu a fost găsit.');
    }

    await prisma.user.delete({ where: { id: existing.id } });
    return await getUsers();
  } catch (err) {
    throw new Error('Eroare la ștergerea utilizatorului din Prisma DB: ' + err.message);
  }
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

// Internal server function - not exposed as an HTTP route or tRPC procedure
export const deductCredits = deductUserCredits;

