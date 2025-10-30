"use client";

import { useEffect, useMemo, useState } from "react";
import { TOKEN_DISPLAY_NAME } from "@/config/token";

type MarketData = {
    priceUsd: number | null;
    marketCapUsd: number | null;
};

function useMarketData() {
    const [data, setData] = useState<MarketData>({ priceUsd: null, marketCapUsd: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const id = process.env.NEXT_PUBLIC_CG_ID || "solana"; // Demo default; set NEXT_PUBLIC_CG_ID for real token
        const controller = new AbortController();
        async function run() {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
                    { signal: controller.signal }
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                const price = json?.market_data?.current_price?.usd ?? null;
                const mc = json?.market_data?.market_cap?.usd ?? null;
                setData({ priceUsd: price, marketCapUsd: mc });
                            } catch (e) {
                                if (typeof e === "object" && e && "name" in e && (e as { name?: string }).name === "AbortError") {
                                    return;
                                }
                setError("Failed to load market data");
            } finally {
                setLoading(false);
            }
        }
        run();
        const t = setInterval(run, 60_000); // refresh every minute
        return () => {
            controller.abort();
            clearInterval(t);
        };
    }, []);

    return { ...data, loading, error };
}

function fmtUSD(n: number | null, opts: Intl.NumberFormatOptions = {}) {
    if (n == null || Number.isNaN(n)) return "N/A";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 6, ...opts }).format(n);
}

// reserved helper if numeric formatting is needed in later expansions
// function fmtNumber(n: number | null) {
//   if (n == null || Number.isNaN(n)) return "N/A";
//   return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
// }

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-black/40">
            <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            {children}
        </div>
    );
}

function PieChart({ segments }: { segments: Array<{ label: string; value: number; color: string }> }) {
    const total = segments.reduce((a, b) => a + b.value, 0);
    const stops = [] as string[];
    let acc = 0;
    for (const s of segments) {
        const start = (acc / total) * 100;
        acc += s.value;
        const end = (acc / total) * 100;
        stops.push(`${s.color} ${start}% ${end}%`);
    }
    const bg = `conic-gradient(${stops.join(", ")})`;
    return (
        <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="h-48 w-48 shrink-0 rounded-full border border-white/20 shadow-inner" style={{ backgroundImage: bg }} />
            <ul className="grid gap-2 text-sm">
                {segments.map((s) => (
                    <li key={s.label} className="flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: s.color }} />
                        <span className="text-gray-700 dark:text-gray-300">
                            {s.label} – {((s.value / total) * 100).toFixed(0)}%
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function StackedBar({ items }: { items: Array<{ label: string; value: number; color: string }> }) {
    const total = items.reduce((a, b) => a + b.value, 0);
    return (
        <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex h-5 w-full">
                {items.map((it) => (
                    <div key={it.label} className="h-full" style={{ width: `${(it.value / total) * 100}%`, backgroundColor: it.color }} />
                ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300 md:grid-cols-3">
                {items.map((it) => (
                    <div key={it.label} className="flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: it.color }} />
                        {it.label} ({((it.value / total) * 100).toFixed(0)}%)
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function TokenomicsPage() {
    const { priceUsd, marketCapUsd, loading, error } = useMarketData();

    const burnProgress = useMemo(() => {
        if (!marketCapUsd) return 0;
        const pct = Math.min(30, Math.floor(marketCapUsd / 1_000_000));
        return pct;
    }, [marketCapUsd]);

    const distribution = [
        { label: "Fair Launch", value: 70, color: "#3b82f6" },
        { label: "Treasury", value: 15, color: "#22c55e" },
        { label: "Team", value: 10, color: "#f59e0b" },
        { label: "Ecosystem", value: 5, color: "#8b5cf6" },
    ];

    const revenue = [
        { label: "Burns (30%)", value: 30, color: "#ef4444" },
        { label: "Development (40%)", value: 40, color: "#3b82f6" },
        { label: "Operations (30%)", value: 30, color: "#10b981" },
    ];

    return (
        <main className="section site-container">
            <header className="mb-6">
                <h1 className="text-3xl font-bold">{TOKEN_DISPLAY_NAME} Tokenomics</h1>
                <p className="text-gray-600 dark:text-gray-400">Transparent distribution, sustainable mechanics, and aligned incentives.</p>
            </header>

            {/* Market data */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <SectionCard title="Price (USD)">
                    <div className="text-2xl font-semibold">{fmtUSD(priceUsd, { maximumFractionDigits: 6 })}</div>
                    <p className="text-xs text-gray-500">{loading ? "Refreshing…" : error ? error : "Powered by CoinGecko (demo)"}</p>
                </SectionCard>
                <SectionCard title="Market Cap">
                    <div className="text-2xl font-semibold">{fmtUSD(marketCapUsd, { maximumFractionDigits: 0 })}</div>
                    <p className="text-xs text-gray-500">1% burn per $1M market cap up to 30%</p>
                </SectionCard>
                <SectionCard title="Burn Progress">
                    <div className="mb-2 flex items-end justify-between">
                        <div className="text-2xl font-semibold">{burnProgress}%</div>
                        <div className="text-xs text-gray-500">Target: 30%</div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
                        <div className="h-full bg-red-500" style={{ width: `${(burnProgress / 30) * 100}%` }} />
                    </div>
                </SectionCard>
            </div>

            {/* Distribution */}
            <SectionCard title="Token Distribution">
                <PieChart segments={distribution} />
            </SectionCard>

            {/* Fee breakdown */}
            <div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <SectionCard title="Total Fee">
                    <div className="text-3xl font-bold">0.07%</div>
                    <p className="text-xs text-gray-500">Efficient and competitive structure</p>
                </SectionCard>
                <SectionCard title="Platform Fee">
                    <div className="text-3xl font-bold">0.01%</div>
                    <p className="text-xs text-gray-500">Funds ongoing development and operations</p>
                </SectionCard>
                <SectionCard title="Transaction Fee">
                    <div className="text-3xl font-bold">0.06%</div>
                    <p className="text-xs text-gray-500">Supports validators and network stability</p>
                </SectionCard>
            </div>

            {/* Revenue allocation */}
            <SectionCard title="Revenue Allocation">
                <StackedBar items={revenue} />
            </SectionCard>

            {/* Student cashback */}
            <SectionCard title="Student Cashback Program">
                <p className="text-gray-700 dark:text-gray-300">
                    Eligible students receive <span className="font-semibold">5% cashback</span> on university payments, capped at
                    <span className="font-semibold"> $500</span>. Off-chain verified, no KYC required.
                </p>
            </SectionCard>
        </main>
    );
}
