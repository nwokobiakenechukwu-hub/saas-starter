import "dotenv/config";
import { z } from "zod";

const Env = z.object({
  PORT: z.string().default("8080"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().default("redis://localhost:6379"),

  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("15m"),
  REFRESH_SECRET: z.string(),
  REFRESH_EXPIRES_IN: z.string().default("30d"),

  STRIPE_SECRET: z.string().optional(),
  STRIPE_PRICE_PRO_MONTHLY: z.string().optional(),
  STRIPE_PRICE_PRO_YEARLY: z.string().optional()
});

export const env = Env.parse(process.env);
