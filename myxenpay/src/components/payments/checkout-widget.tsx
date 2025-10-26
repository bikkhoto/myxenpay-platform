"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Existing connect components
import ConnectEth from "@/components/eth/ConnectEth";
const ConnectSolana = dynamic(() => import("@/components/solana/ConnectSolana"), { ssr: false });

type Chain = "solana" | "evm";

export default function CheckoutWidget() {
  const [amount, setAmount] = useState<string>("");
  const [chain, setChain] = useState<Chain>("solana");

  const parsed = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [amount]);

  // 0.07% total = 0.01% platform + 0.06% transaction
  const fees = useMemo(() => {
    const platform = parsed * 0.0001;
    const tx = parsed * 0.0006;
    const total = platform + tx;
    const grand = parsed + total;
    return { platform, tx, total, grand };
  }, [parsed]);

  const format = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 6 }).format(n || 0);

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/20 bg-white/20 p-5 shadow-sm backdrop-blur-lg",
        "dark:border-white/10 dark:bg-white/10"
      )}
    >
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Checkout</h3>
        <div className="inline-flex overflow-hidden rounded-xl border border-white/20 text-sm dark:border-white/10">
          <button
            className={cn(
              "px-3 py-1.5",
              chain === "solana"
                ? "bg-blue-600 text-white"
                : "bg-transparent text-gray-700 hover:bg-white/10 dark:text-gray-300"
            )}
            onClick={() => setChain("solana")}
          >
            Solana
          </button>
          <button
            className={cn(
              "px-3 py-1.5",
              chain === "evm"
                ? "bg-blue-600 text-white"
                : "bg-transparent text-gray-700 hover:bg-white/10 dark:text-gray-300"
            )}
            onClick={() => setChain("evm")}
          >
            EVM
          </button>
        </div>
      </div>

      {/* Amount input */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Amount</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:text-gray-100"
            />
            <span className="rounded-md border border-white/20 px-2 py-1 text-xs text-gray-700 dark:border-white/10 dark:text-gray-300">
              USD
            </span>
          </div>
        </div>

        {/* Connect area */}
        <div className="flex items-center justify-end gap-2 rounded-xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
          {chain === "solana" ? <ConnectSolana /> : <ConnectEth />}
        </div>
      </div>

      {/* Fees */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
        <FeeCard label="Subtotal" value={format(parsed)} />
        <FeeCard label="Platform (0.01%)" value={format(fees.platform)} />
        <FeeCard label="Transaction (0.06%)" value={format(fees.tx)} />
        <FeeCard label="Total (0.07%)" value={format(fees.total)} highlight />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
        <div className="text-sm text-gray-600 dark:text-gray-400">Grand Total</div>
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{format(fees.grand)}</div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          disabled={parsed <= 0}
          className={cn(
            "inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition",
            parsed > 0 ? "hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg" : "opacity-60"
          )}
          onClick={() => {
            // Placeholder action
            // Here you'd kick off a payment flow depending on selected chain
            alert(`Proceed to pay ${format(fees.grand)} on ${chain.toUpperCase()}`);
          }}
        >
          Pay {format(fees.grand)}
        </button>
      </div>
    </div>
  );
}

function FeeCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/20 bg-white/30 p-4 text-sm dark:border-white/10 dark:bg-white/10",
        highlight && "ring-1 ring-blue-400/40"
      )}
    >
      <div className="text-gray-600 dark:text-gray-400">{label}</div>
      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  );
}
