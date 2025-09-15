// apps/api/src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

export const prisma =
  // reuse in dev to avoid exhausting DB connections on HMR
  (globalThis as any).prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  (globalThis as any).prisma = prisma;
}