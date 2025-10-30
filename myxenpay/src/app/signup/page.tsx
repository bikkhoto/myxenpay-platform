"use client";

import { useState } from "react";

type Role = "merchant" | "user" | "admin";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("merchant");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || res.statusText);
      setStatus(data?.message || "Signup successful");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="site-container section">
      <h1 className="mb-4 text-2xl font-bold">Create your account</h1>
      {status && <div className="mb-3 rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-700">{status}</div>}
      {error && <div className="mb-3 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={onSubmit} className="max-w-md space-y-3 rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
        <label className="block text-sm">
          <span className="mb-1 block">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="••••••••"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="merchant">Merchant</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md border px-4 py-2 text-sm disabled:opacity-60"
        >{loading ? 'Signing up…' : 'Sign up'}</button>
      </form>
    </main>
  );
}
