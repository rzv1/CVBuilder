import { PrismaClient } from '@prisma/client';

let prisma;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.warn('PrismaClient init warning:', error.message);
  prisma = null;
}

export { prisma };