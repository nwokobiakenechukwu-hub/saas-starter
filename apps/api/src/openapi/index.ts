// apps/api/src/openapi/index.ts
import { Router, type RequestHandler } from "express";
import swaggerUi from "swagger-ui-express";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

const User = z
  .object({
    id: z.string().openapi({ example: "usr_123" }),
    email: z.string().email().openapi({ example: "jane@example.com" }),
  })
  .openapi("User");

registry.registerPath({
  method: "get",
  path: "/api/health",
  responses: {
    200: { description: "ok" },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);
const doc = generator.generateDocument({
  openapi: "3.0.0",
  info: { title: "API", version: "1.0.0" },
  servers: [{ url: "http://localhost:8080" }],
});

export const openapiRouter = Router();
openapiRouter.use(
  "/",
  ...(swaggerUi.serve as unknown as RequestHandler[]),
  swaggerUi.setup(doc, { explorer: true }) as unknown as RequestHandler
);
