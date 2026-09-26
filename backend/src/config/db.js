import { PrismaClient } from '@prisma/client';
import { DATABASE_URL } from './env.js';

let prisma;

try {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
  });
} catch (error) {
  console.warn('PrismaClient init warning:', error.message);
  prisma = null;
}

export { prisma };