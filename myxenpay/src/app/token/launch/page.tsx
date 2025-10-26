"use client";

import { useMemo, useState } from "react";
import { calculateFeesWithRates, getRates } from "@/lib/fee-calculation";

type Chain = "solana" | "evm";

export default function TokenLaunchWizard() {
    const [step, setStep] = useState(1);
    const [loadingRates, setLoadingRates] = useState(false);
    const [ratesLoaded, setRatesLoaded] = useState(false);
    const [chain, setChain] = useState<Chain>("solana");
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [decimals, setDecimals] = useState(9);
    const [supply, setSupply] = useState("1000000000");

    const next = () => setStep((s) => Math.min(4, s + 1));
    const back = () => setStep((s) => Math.max(1, s - 1));

    const canNext1 = chain === "solana" || chain === "evm";
    const canNext2 = name.trim().length >= 2 && symbol.trim().length >= 2 && decimals >= 0 && Number(supply) > 0;

    const feePreview = useMemo(() => {
        const amount = 100; // preview base in USD for demonstration
        return calculateFeesWithRates(amount, "USD", { USD: 1, USDC: 1, SOL: 0, MYXN: 0, ETH: 0 });
    }, []);

    async function ensureRates() {
        if (ratesLoaded) return;
        setLoadingRates(true);
        await getRates();
        setRatesLoaded(true);
        setLoadingRates(false);
    }

    return (
        <main className="site-container section">
            <h1 className="text-2xl font-bold">Token Launch Wizard</h1>
            <p className="text-gray-600 dark:text-gray-400">Create a new token on Solana or EVM. This is a UI demo; on-chain deployment is not executed.</p>

            <ol className="mt-4 flex items-center gap-2 text-sm">
                {[1, 2, 3, 4].map((i) => (
                    <li key={i} className={"inline-flex h-7 w-7 items-center justify-center rounded-full " + (i <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300")}>{i}</li>
                ))}
            </ol>

            {step === 1 && (
                <div className="mt-4 rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
                    <h3 className="mb-3 text-base font-semibold">Select Chain</h3>
                    <div className="inline-flex overflow-hidden rounded-xl border border-white/20 text-sm dark:border-white/10">
                        <button className={`px-3 py-1.5 ${chain === "solana" ? "bg-blue-600 text-white" : "bg-transparent"}`} onClick={() => setChain("solana")}>Solana</button>
                        <button className={`px-3 py-1.5 ${chain === "evm" ? "bg-blue-600 text-white" : "bg-transparent"}`} onClick={() => setChain("evm")}>EVM</button>
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2">
                        <button className="rounded-md border px-3 py-2 text-sm" disabled>
                            Back
                        </button>
                        <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60" onClick={() => { ensureRates(); next(); }} disabled={!canNext1 || loadingRates}>
                            {loadingRates ? "Loading rates…" : "Next"}
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
                        <label className="mb-1 block text-xs">Token Name</label>
                        <input className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 dark:border-white/10" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
                        <label className="mb-1 block text-xs">Symbol</label>
                        <input className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 dark:border-white/10" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
                        <label className="mb-1 block text-xs">Decimals</label>
                        <input type="number" min={0} className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 dark:border-white/10" value={decimals} onChange={(e) => setDecimals(Number(e.target.value))} />
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
                        <label className="mb-1 block text-xs">Initial Supply</label>
                        <input type="number" min={1} className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 dark:border-white/10" value={supply} onChange={(e) => setSupply(e.target.value)} />
                    </div>
                    <div className="md:col-span-2 flex items-center justify-end gap-2">
                        <button className="rounded-md border px-3 py-2 text-sm" onClick={back}>Back</button>
                        <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60" onClick={next} disabled={!canNext2}>Next</button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Platform Fee (0.01%)</div>
                        <div className="text-xl font-semibold">${feePreview.usd.platformFee.toFixed(6)}</div>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Transaction Fee (0.06%)</div>
                        <div className="text-xl font-semibold">${feePreview.usd.transactionFee.toFixed(6)}</div>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Fee (0.07%)</div>
                        <div className="text-xl font-semibold">${feePreview.usd.totalFee.toFixed(6)}</div>
                    </div>
                    <div className="md:col-span-3 flex items-center justify-end gap-2">
                        <button className="rounded-md border px-3 py-2 text-sm" onClick={back}>Back</button>
                        <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white" onClick={next}>Next</button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="mt-4 rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
                    <h3 className="mb-2 text-base font-semibold">Review</h3>
                    <ul className="grid gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>Chain: <span className="font-semibold uppercase">{chain}</span></li>
                        <li>Name: <span className="font-semibold">{name}</span></li>
                        <li>Symbol: <span className="font-semibold">{symbol}</span></li>
                        <li>Decimals: <span className="font-semibold">{decimals}</span></li>
                        <li>Supply: <span className="font-semibold">{supply}</span></li>
                    </ul>
                    <div className="mt-4 flex items-center justify-end gap-2">
                        <button className="rounded-md border px-3 py-2 text-sm" onClick={back}>Back</button>
                        <button
                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                            onClick={() => {
                                alert("This demo does not deploy on-chain. Integrate deployment SDKs next.");
                            }}
                        >
                            Generate
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

