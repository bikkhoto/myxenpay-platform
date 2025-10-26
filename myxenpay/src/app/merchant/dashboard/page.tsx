"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useMultiChainWallet } from "@/hooks/use-multi-chain-wallet";
import { calculateFeesWithRates, getRates, Rates } from "@/lib/fee-calculation";

export default function MerchantDashboard() {
    const wallet = useMultiChainWallet();
    const [rates, setRates] = useState<Rates>({ USD: 1, USDC: 1, SOL: 0, MYXN: 0, ETH: 0 });
    useEffect(() => {
        getRates().then(setRates).catch(() => void 0);
    }, []);

    const kpis = useMemo(() => {
        // Demo static KPIs, you can replace with real data later
        const today = 12543.87;
        const orders = 32;
        const avg = today / Math.max(1, orders);
        const fees = calculateFeesWithRates(today, "USD", rates).usd.totalFee;
        return { today, orders, avg, fees };
    }, [rates]);

    const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n || 0);

    return (
        <main className="site-container section">
            <h1 className="text-2xl font-bold">Merchant Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Overview of sales, fees, and payouts.</p>

            {/* KPI Cards */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                <Kpi label="Today's Volume" value={fmt(kpis.today)} />
                <Kpi label="Orders" value={kpis.orders.toString()} />
                <Kpi label="Avg Order" value={fmt(kpis.avg)} />
                <Kpi label="Fees (0.07%)" value={fmt(kpis.fees)} />
            </div>

            {/* Wallet Status & Quick Actions */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
                    <div className="mb-2 text-sm font-semibold">Wallet Status</div>
                    <div className="text-xs text-gray-700 dark:text-gray-300">Solana: {wallet.solanaConnected ? wallet.solanaAddress : "Disconnected"}</div>
                    <div className="text-xs text-gray-700 dark:text-gray-300">EVM: {wallet.evmConnected ? wallet.evmAddress : "Disconnected"}</div>
                    <div className="mt-3">
                        <Link href="/products/qr" className="inline-flex rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white">Create Payment QR</Link>
                    </div>
                </div>

                {/* Recent Orders (demo) */}
                <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10 md:col-span-2">
                    <div className="mb-2 text-sm font-semibold">Recent Orders</div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead>
                                <tr className="text-gray-600 dark:text-gray-400">
                                    <th className="px-2 py-2">Order</th>
                                    <th className="px-2 py-2">Customer</th>
                                    <th className="px-2 py-2">Amount</th>
                                    <th className="px-2 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1,2,3,4,5].map((i) => (
                                    <tr key={i} className="border-t border-white/10">
                                        <td className="px-2 py-2">MXN-{1000+i}</td>
                                        <td className="px-2 py-2">Customer {i}</td>
                                        <td className="px-2 py-2">{fmt(100 + i * 12.34)}</td>
                                        <td className="px-2 py-2">
                                            <span className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-600">Paid</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Payouts (demo) */}
            <div className="mt-6 rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
                <div className="mb-2 text-sm font-semibold">Payouts</div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <div className="text-sm text-gray-700 dark:text-gray-300">Next payout: Friday</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Method: USDC (Solana)</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Estimated: {fmt(2743.19)}</div>
                </div>
            </div>
        </main>
    );
}

function Kpi({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{value}</div>
        </div>
    );
}

