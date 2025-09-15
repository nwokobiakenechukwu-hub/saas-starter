import type { RequestHandler } from "express";
import { verifyAccess } from "../lib/jwt.js";

export const requireAuth: RequestHandler = (req, res, next) => {
  const raw = req.headers.authorization || "";
  const token = raw.startsWith("Bearer ") ? raw.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = verifyAccess(token);
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
