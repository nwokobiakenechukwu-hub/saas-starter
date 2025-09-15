// apps/api/src/lib/tokens.ts
import { sign, verify, type SignOptions, type Secret, type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";

// Use the library's own type for expiresIn to avoid importing `ms`
type ExpiresIn = SignOptions["expiresIn"]; // number | string (ms.StringValue)

const accessExpiresIn = env.JWT_EXPIRES_IN as ExpiresIn;
const refreshExpiresIn = env.REFRESH_EXPIRES_IN as ExpiresIn;

const accessSecret: Secret = env.JWT_SECRET;
const refreshSecret: Secret = env.REFRESH_SECRET;

const accessOpts: SignOptions = { algorithm: "HS256", expiresIn: accessExpiresIn };
const refreshOpts: SignOptions = { algorithm: "HS256", expiresIn: refreshExpiresIn };

// Make payload explicit so the correct overload is chosen
type JWTPayload = string | Buffer | object;

export function signAccess(payload: JWTPayload) {
  return sign(payload, accessSecret, accessOpts);
}
export function signRefresh(payload: JWTPayload) {
  return sign(payload, refreshSecret, refreshOpts);
}
export function verifyAccess<T extends JwtPayload = JwtPayload>(token: string): T {
  return verify(token, accessSecret) as T;
}
export function verifyRefresh<T extends JwtPayload = JwtPayload>(token: string): T {
  return verify(token, refreshSecret) as T;
}

// password helpers
export function hash(s: string) { return bcrypt.hash(s, 10); }
export function compare(s: string, h: string) { return bcrypt.compare(s, h); }
