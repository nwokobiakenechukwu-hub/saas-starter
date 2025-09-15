import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.js";
import { authRouter } from "./routes/auth.js";
import { billingRouter } from "./routes/billing.js";
import { openapiRouter } from "./openapi/index.js";
import { logger } from "./config/logger.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/billing", billingRouter);
app.use("/api/docs", openapiRouter);

app.use(errorHandler);

app.listen(Number(env.PORT), () => logger.info(`API on http://localhost:${env.PORT}`));
