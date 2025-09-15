"use client";
import { useLogin, useRegister } from "../hooks/useAuth";
import { useState } from "react";
import Link from "next/link";
import s from "../styles/auth.module.scss";

export default function Home() {
  const login = useLogin();
  const register = useRegister();
  const [email, setEmail] = useState("founder@example.com");
  const [password, setPassword] = useState("changeme123");

  return (
    <main className={s.wrap}>
      <section className={s.panel}>
        <h1 className={s.h1}>Welcome back</h1>
        <p className={s.p}>Sign in or create an account to continue.</p>

        <div className={s.form}>
          <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />

          <div className="actions">
            <button className="btn" onClick={() => login.mutate({ email, password })}>
              {login.isPending ? "Signing in…" : "Sign in"}
            </button>
            <button className="btn" onClick={() => register.mutate({ email, password, name: "Founder" })}>
              {register.isPending ? "Creating…" : "Create account"}
            </button>
          </div>
          {(login.isError || register.isError) && (
            <p style={{ color: "#ef4444" }}>
              {(login.error as Error)?.message || (register.error as Error)?.message}
            </p>
          )}
          <p className={s.p} style={{ marginTop: 10 }}>
            After login, go to <Link href="/dashboard">Dashboard</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
