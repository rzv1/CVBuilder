import { beforeEach, afterAll } from 'vitest';
import { prisma } from '../../config/db.js';

export async function clearDatabase() {
  if (!prisma) return;
  try {
    await prisma.apiLog.deleteMany();
    await prisma.cvData.deleteMany();
    await prisma.docsContent.deleteMany();
    await prisma.docsSection.deleteMany();
    await prisma.blogArticle.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error('Error clearing database in test setup:', error);
  }
}

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  if (prisma) {
    await prisma.$disconnect();
  }
});
