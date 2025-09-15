"use client";
import { api } from "../../../lib/api";

export default function Billing() {
  async function startCheckout(priceId: string) {
    const { url } = await api<{ url: string }>("/api/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ priceId }),
    });
    window.location.href = url;
  }
  async function openPortal() {
    const { url } = await api<{ url: string }>("/api/billing/portal", { method: "POST" });
    window.location.href = url;
  }

  return (
    <main className="container">
      <h2>Billing</h2>
      <button onClick={() => startCheckout(process.env.NEXT_PUBLIC_PRICE_PRO_MONTHLY ?? "")}>
        Subscribe (Monthly)
      </button>{" "}
      <button onClick={openPortal}>Open Customer Portal</button>
    </main>
  );
}
