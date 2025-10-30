"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type {
  CSVRow,
  MerchantToken,
  Order,
  RevenueSeriesPoint,
  RevenueSummary,
} from "@/types/merchant";

// Simple fetcher with JSON parsing
async function jfetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...init });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText);
  return res.json();
}

function toCSV(rows: CSVRow[]): string {
  if (!rows.length) return "";
  const keys = Array.from(
    rows.reduce((set, r) => {
      Object.keys(r).forEach((k) => set.add(k));
      return set;
    }, new Set<string>())
  );
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (s.includes(",") || s.includes("\n") || s.includes("\"")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const header = keys.join(",");
  const body = rows.map((r) => keys.map((k) => escape(r[k as keyof CSVRow])).join(",")).join("\n");
  return `${header}\n${body}`;
}

function downloadCSV(filename: string, rows: CSVRow[]) {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MerchantCustomDashboardPage() {
  const params = useParams() as { pageName?: string };
  const pageName = (params.pageName || "dashboard").toString();

  // Token acceptance management
  const [tokens, setTokens] = useState<MerchantToken[]>([]);
  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  // Revenue
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Poll every 5s for real-time-ish updates
  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      try {
        setError(null);
        const [t, o, r] = await Promise.all([
          jfetch<{ tokens: MerchantToken[] }>(`/api/merchant/tokens`),
          jfetch<{ orders: Order[] }>(`/api/merchant/orders`),
          jfetch<RevenueSummary>(`/api/merchant/revenue`),
        ]);
        if (!mounted) return;
        setTokens(t.tokens);
        setOrders(o.orders);
        setRevenue({ totalUSD: r.totalUSD, series: r.series });
      } catch (e: unknown) {
        if (!mounted) return;
        const msg = e instanceof Error ? e.message : "Failed to load merchant data";
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadAll();
    const id = setInterval(loadAll, 5000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const totalOrders = orders.length;
  const totalRevenueUSD = revenue?.totalUSD ?? 0;

  const chartPath = useMemo(() => {
    if (!revenue?.series?.length) return "";
    const width = 320;
    const height = 80;
    const pad = 6;
    const xs = revenue.series.map((_: RevenueSeriesPoint, i: number) => (i / (revenue.series.length - 1)) * (width - pad * 2) + pad);
    const ysRaw = revenue.series.map((p: RevenueSeriesPoint) => p.amount);
    const max = Math.max(...ysRaw, 1);
    const ys = ysRaw.map((y: number) => height - pad - (y / max) * (height - pad * 2));
    const d = xs.map((x: number, i: number) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
    return { d, width, height };
  }, [revenue]);

  async function toggleToken(symbol: string, accepted: boolean) {
    try {
      await jfetch(`/api/merchant/tokens`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ symbol, accepted }),
      });
      setTokens((prev) => prev.map((t) => (t.symbol === symbol ? { ...t, accepted } : t)));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update token";
      alert(msg);
    }
  }

  return (
    <main className="site-container section">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Merchant: {pageName}</h1>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() => downloadCSV(
              "orders.csv",
              orders.map((o) => ({
                id: o.id,
                status: o.status,
                amountUsd: o.amountUsd,
                token: o.token,
                createdAt: o.createdAt,
              }))
            )}
          >Export Orders CSV</button>
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() => downloadCSV("revenue.csv", ((revenue?.series || []).map((r: RevenueSeriesPoint) => ({ date: r.date, amount: r.amount })) as unknown as CSVRow[]))}
          >Export Revenue CSV</button>
        </div>
      </div>

      {loading && (<div className="mb-3 text-sm text-gray-500">Loading...</div>)}
      {error && (<div className="mb-3 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>)}

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue (USD)</div>
          <div className="text-2xl font-semibold">${totalRevenueUSD.toLocaleString()}</div>
          <div className="mt-2">
            <svg width={chartPath ? chartPath.width : 320} height={chartPath ? chartPath.height : 80} viewBox={`0 0 ${chartPath ? chartPath.width : 320} ${chartPath ? chartPath.height : 80}`}>
              <path d={chartPath ? chartPath.d : ""} fill="none" stroke="#2563eb" strokeWidth={2} />
            </svg>
          </div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
          <div className="text-2xl font-semibold">{totalOrders}</div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
          <div className="text-sm text-gray-600 dark:text-gray-400">Accepted Tokens</div>
          <div className="text-2xl font-semibold">{tokens.filter((t) => t.accepted).length}</div>
        </div>
      </div>

      {/* Token acceptance management */}
      <div className="mt-6 rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
        <h2 className="mb-2 text-lg font-semibold">Token Acceptance</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {tokens.map((t) => (
            <label key={t.symbol} className="flex items-center justify-between rounded-md border border-white/20 bg-white/40 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/10">
              <span className="font-medium">{t.symbol}</span>
              <input
                type="checkbox"
                checked={t.accepted}
                onChange={(e) => toggleToken(t.symbol, e.target.checked)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="mt-6 rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
        <h2 className="mb-2 text-lg font-semibold">Orders</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="px-2 py-2">Order ID</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Amount (USD)</th>
                <th className="px-2 py-2">Token</th>
                <th className="px-2 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-white/10">
                  <td className="px-2 py-2 font-mono">{o.id}</td>
                  <td className="px-2 py-2">{o.status}</td>
                  <td className="px-2 py-2">${Number(o.amountUsd || 0).toFixed(2)}</td>
                  <td className="px-2 py-2">{o.token}</td>
                  <td className="px-2 py-2">{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
