"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminThemeToggle from "./AdminThemeToggle";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Sign-in failed.");
      router.replace("/admin");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError.message ||
          "Sign-in could not be completed. Check your connection and try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <main className="lg">
      <div className="tt">
        <AdminThemeToggle />
      </div>
      <section className="card">
        <Image
          src="/oracrest-logo.svg"
          alt="ORACREST"
          width={545}
          height={108}
          priority
        />
        <h1>Admin sign in</h1>
        <p className="hint">Authorised team members only.</p>
        <form className="fgc" onSubmit={submit}>
          <label htmlFor="admin-email">
            Email
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label htmlFor="admin-password">
            Password
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={256}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <p className="err" role="alert" aria-live="polite">{error}</p>
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
