import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

export const billingRouter = Router();

billingRouter.post("/checkout", requireAuth, async (_req, res) => {
  // integrate Stripe here; return a Checkout URL
  return res.json({ url: "https://billing.example/checkout" });
});

billingRouter.post("/portal", requireAuth, async (_req, res) => {
  // integrate Stripe billing portal
  return res.json({ url: "https://billing.example/portal" });
});
