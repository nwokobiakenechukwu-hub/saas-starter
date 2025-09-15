// apps/api/src/lib/auth.ts
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";

// Narrow env types once so jwt.sign() sees exactly what it expects
const accessSecret: Secret = env.JWT_SECRET;
const refreshSecret: Secret = env.REFRESH_SECRET;

// Accepts "15m", "1h", 3600, etc.
const accessExpiresIn: SignOptions["expiresIn"] = env.JWT_EXPIRES_IN as unknown as SignOptions["expiresIn"];
const refreshExpiresIn: SignOptions["expiresIn"] = env.REFRESH_EXPIRES_IN as unknown as SignOptions["expiresIn"];

type JWTPayload = string | Buffer | object;

export function signAccess(payload: JWTPayload) {
  return jwt.sign(payload, accessSecret, { expiresIn: accessExpiresIn });
}

export function signRefresh(payload: JWTPayload) {
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn });
}

export function verifyAccess<T = unknown>(token: string): T {
  return jwt.verify(token, accessSecret) as T;
}

export function verifyRefresh<T = unknown>(token: string): T {
  return jwt.verify(token, refreshSecret) as T;
}

export function hash(s: string) {
  return bcrypt.hash(s, 10);
}

export function compare(s: string, h: string) {
  return bcrypt.compare(s, h);
}
