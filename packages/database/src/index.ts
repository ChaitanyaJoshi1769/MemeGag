export { PrismaClient } from '@prisma/client';
export * from '@prisma/client';

// Re-export types for easier access
import { PrismaClient } from '@prisma/client';

// Create a singleton instance for use across the application
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!('__prisma' in global)) {
    (global as any).__prisma = new PrismaClient();
  }
  prisma = (global as any).__prisma;
}

export default prisma;
