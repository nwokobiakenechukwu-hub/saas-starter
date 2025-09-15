import type { ErrorRequestHandler } from "express";
import { logger } from "../config/logger.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error(err);
  if (res.headersSent) return;
  res.status(500).json({ error: "Server error" });
};
