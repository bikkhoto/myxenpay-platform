"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { Currency, Rates, getRates, toUSD, calculateFeesWithRates } from "@/lib/fee-calculation";
type Chain = "solana" | "evm";
type EvmNetwork = "base" | "polygon" | "bsc";

function useRatesState() {
    const [rates, setRates] = useState<Rates>({ USD: 1, USDC: 1, SOL: 0, MYXN: 0, ETH: 0, MATIC: 0, BNB: 0 });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let mounted = true;
        async function run() {
            setLoading(true);
            const r = await getRates();
            if (mounted) setRates(r);
            setLoading(false);
        }
        run();
        const t = setInterval(run, 60_000);
        return () => {
            mounted = false;
            clearInterval(t);
        };
    }, []);
    return { rates, loading };
}

export default function QRGenerator() {
    const { rates, loading } = useRatesState();
    const [chain, setChain] = useState<Chain>("solana");
    const [currency, setCurrency] = useState<Currency>("USD");
    const [amount, setAmount] = useState<string>("");
    const [qrDataUrl, setQrDataUrl] = useState<string>("");
    const [link, setLink] = useState<string>("");
    const [copied, setCopied] = useState(false);
    const [evmNetwork, setEvmNetwork] = useState<EvmNetwork>("base");

    const amountNum = Number(amount) || 0;
    const amountUSD = useMemo(() => toUSD(amountNum, currency, rates), [amountNum, currency, rates]);
    const fees = useMemo(() => calculateFeesWithRates(amountNum, currency, rates), [amountNum, currency, rates]);

    // Build payment link
    useEffect(() => {
        async function build() {
            const label = encodeURIComponent("MyXenPay Payment");
            const message = encodeURIComponent("Thank you for your purchase");

            if (chain === "solana") {
                const recipient = process.env.NEXT_PUBLIC_SOLANA_RECIPIENT || "8uR9i2Fi1xJcimZ8hQ2o8W1g2o8tqv7C5L4w7n8v9xYz"; // demo pubkey
                let url = `solana:${recipient}?label=${label}&message=${message}`;
                // Convert USD to SOL amount if needed
                const amountSOL = rates.SOL > 0 ? amountUSD / rates.SOL : 0;
                if (amountSOL > 0) url += `&amount=${amountSOL.toFixed(6)}`;
                setLink(url);
                try {
                    const dataUrl = await QRCode.toDataURL(url, { width: 320, margin: 2 });
                    setQrDataUrl(dataUrl);
                        } catch {
                    setQrDataUrl("");
                }
                return;
            }

            // EVM EIP-681 native transfer on selected network
            const recipient = process.env.NEXT_PUBLIC_EVM_RECIPIENT || "0x0000000000000000000000000000000000000000";
            const chainIdMap: Record<EvmNetwork, number> = { base: 8453, polygon: 137, bsc: 56 };
            const chainId = chainIdMap[evmNetwork];
            const nativePriceUSD = evmNetwork === "base" ? (rates.ETH || 0) : evmNetwork === "polygon" ? (rates.MATIC || 0) : (rates.BNB || 0);
            const nativeAmount = nativePriceUSD > 0 ? amountUSD / nativePriceUSD : 0;
            const wei = BigInt(Math.floor(nativeAmount * 1e18));
            const valueHex = `0x${wei.toString(16)}`;
            const url = `ethereum:${recipient}@${chainId}?value=${valueHex}`;
            setLink(url);
            try {
                const dataUrl = await QRCode.toDataURL(url, { width: 320, margin: 2 });
                setQrDataUrl(dataUrl);
                    } catch {
                setQrDataUrl("");
            }
        }
        build();
    }, [chain, amountUSD, rates, evmNetwork]);

    const formatUSD = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 6 }).format(n || 0);

    return (
        <main className="site-container section">
            <h1 className="text-2xl font-bold">QR Payment Generator</h1>
            <p className="text-gray-600 dark:text-gray-400">Create Solana Pay and EVM (EIP-681) payment links with live conversion and fees.</p>

            {/* Chain toggle */}
            <div className="mt-4 inline-flex overflow-hidden rounded-xl border border-white/20 text-sm dark:border-white/10">
                <button
                    className={`px-3 py-1.5 ${chain === "solana" ? "bg-blue-600 text-white" : "bg-transparent text-gray-700 hover:bg-white/10 dark:text-gray-300"}`}
                    onClick={() => setChain("solana")}
                >
                    Solana
                </button>
                <button
                    className={`px-3 py-1.5 ${chain === "evm" ? "bg-blue-600 text-white" : "bg-transparent text-gray-700 hover:bg-white/10 dark:text-gray-300"}`}
                    onClick={() => setChain("evm")}
                >
                    EVM
                </button>
            </div>

            {/* EVM network selection (Base, Polygon, BSC) */}
            {chain === "evm" && (
                <div className="mt-3 inline-flex overflow-hidden rounded-xl border border-white/20 text-sm dark:border-white/10">
                    {(["base", "polygon", "bsc"] as EvmNetwork[]).map((n) => (
                        <button
                            key={n}
                            className={`px-3 py-1.5 ${evmNetwork === n ? "bg-indigo-600 text-white" : "bg-transparent text-gray-700 hover:bg-white/10 dark:text-gray-300"}`}
                            onClick={() => setEvmNetwork(n)}
                        >
                            {n === "base" ? "Base" : n === "polygon" ? "Polygon" : "BSC"}
                        </button>
                    ))}
                </div>
            )}

            {/* Amount input + currency */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Amount</label>
                    <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:text-gray-100"
                    />
                </div>
                <div className="rounded-xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Currency</label>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as Currency)}
                        className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:text-gray-100"
                    >
                        <option value="USD">USD</option>
                        <option value="SOL">SOL</option>
                        <option value="USDC">USDC</option>
                        <option value="MYXN">MYXN</option>
                    </select>
                    <p className="mt-2 text-xs text-gray-500">{loading ? "Loading rates…" : `USD est: ${formatUSD(amountUSD)}`}</p>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
                    <label className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400">Fees</label>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                            <div className="text-gray-600 dark:text-gray-400">Platform</div>
                            <div className="font-semibold">{formatUSD(fees.usd.platformFee)}</div>
                        </div>
                        <div>
                            <div className="text-gray-600 dark:text-gray-400">Tx</div>
                            <div className="font-semibold">{formatUSD(fees.usd.transactionFee)}</div>
                        </div>
                        <div>
                            <div className="text-gray-600 dark:text-gray-400">Total</div>
                            <div className="font-semibold">{formatUSD(fees.usd.totalFee)}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* QR + Link */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center justify-center rounded-2xl border border-white/20 bg-white/20 p-6 backdrop-blur dark:border-white/10 dark:bg-white/10">
                    {qrDataUrl ? (
                        <Image src={qrDataUrl} alt="Payment QR" width={256} height={256} className="h-64 w-64" />
                    ) : (
                        <div className="text-sm text-gray-500">Enter an amount to generate QR</div>
                    )}
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/20 p-6 backdrop-blur dark:border-white/10 dark:bg-white/10">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Link</div>
                    <div className="mt-2 break-all rounded-lg border border-white/20 bg-white/30 p-3 text-xs dark:border-white/10 dark:bg-white/10">
                        {link || ""}
                    </div>
                    <div className="mt-3 flex gap-2">
                        <button
                            type="button"
                            disabled={!link}
                            onClick={() => {
                                if (!link) return;
                                navigator.clipboard.writeText(link).then(() => {
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 1500);
                                });
                            }}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold ${link ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}
                        >
                            {copied ? "Copied" : "Copy Link"}
                        </button>
                    </div>
                    <p className="mt-3 text-xs text-gray-500">Solana Pay URL for Solana, EIP-681 URL for EVM.</p>
                </div>
            </div>
        </main>
    );
}

