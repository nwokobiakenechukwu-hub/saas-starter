import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { compare, hash, signAccess, signRefresh } from "../lib/jwt.js";
import { env } from "../config/env.js";

export const authRouter = Router();

const RegisterBody = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
});

const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

authRouter.post("/register", async (req, res) => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });
  const { email, password, name } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email already used" });

  const passwordHash = await hash(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, name }
  });

  const accessToken = signAccess({ sub: user.id, email: user.email });
  const refreshToken = signRefresh({ sub: user.id });

  await prisma.refreshSession.create({
    data: {
      userId: user.id,
      tokenHash: await hash(refreshToken),
      userAgent: req.headers["user-agent"] || "",
      ip: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "",
      expiresAt: new Date(Date.now() + ms(env.REFRESH_EXPIRES_IN))
    }
  });

  res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken });
});

authRouter.post("/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = signAccess({ sub: user.id, email: user.email });
  const refreshToken = signRefresh({ sub: user.id });

  await prisma.refreshSession.create({
    data: {
      userId: user.id,
      tokenHash: await hash(refreshToken),
      userAgent: req.headers["user-agent"] || "",
      ip: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "",
      expiresAt: new Date(Date.now() + ms(env.REFRESH_EXPIRES_IN))
    }
  });

  res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken });
});

authRouter.post("/refresh", async (req, res) => {
  const token = req.body?.refreshToken as string;
  if (!token) return res.status(400).json({ error: "Missing refreshToken" });

  const sessions = await prisma.refreshSession.findMany({});
  // verify against stored hashes
  let session = null;
  for (const s of sessions) {
    if (await compare(token, s.tokenHash)) { session = s; break; }
  }
  if (!session) return res.status(401).json({ error: "Invalid refresh token" });

  // naive expiration check
  if (session.expiresAt.getTime() < Date.now()) return res.status(401).json({ error: "Expired" });

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return res.status(401).json({ error: "No user" });

  const accessToken = signAccess({ sub: user.id, email: user.email });
  res.json({ accessToken });
});

function ms(expr: string) {
  // "15m", "30d" → ms
  const m = /^(\d+)([smhd])$/.exec(expr);
  if (!m) return 0;
  const n = Number(m[1]);
  const unit = m[2];
  const mult = unit === "s" ? 1e3 : unit === "m" ? 60e3 : unit === "h" ? 3600e3 : 86400e3;
  return n * mult;
}
