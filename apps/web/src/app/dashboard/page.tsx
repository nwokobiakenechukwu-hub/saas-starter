"use client";
import { api } from "../../lib/api";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [health, setHealth] = useState<any>(null);
  useEffect(() => { api<any>("/healthz").then(setHealth).catch(console.error); }, []);
  return (
    <main className="container">
      <h2>Dashboard</h2>
      <pre>{JSON.stringify(health, null, 2)}</pre>
    </main>
  );
}
