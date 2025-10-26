"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const ConnectSolana = dynamic(() => import("@/components/solana/ConnectSolana"), { ssr: false });
import ConnectEth from "@/components/eth/ConnectEth";

export default function UniversalConnect({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"solana" | "evm">("solana");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium",
          "hover:bg-gray-100 dark:hover:bg-gray-900",
          className
        )}
      >
        Connect Wallet
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />

          {/* Modal */}
          <div className="relative z-10 w-[92%] max-w-lg rounded-2xl border border-white/20 bg-white/80 p-4 shadow-xl backdrop-blur dark:border-white/10 dark:bg-black/70">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Connect Wallet</h3>
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="mb-4 inline-flex overflow-hidden rounded-xl border border-white/20 text-sm dark:border-white/10">
              <button
                className={cn(
                  "px-3 py-1.5",
                  tab === "solana"
                    ? "bg-blue-600 text-white"
                    : "bg-transparent text-gray-700 hover:bg-white/10 dark:text-gray-300"
                )}
                onClick={() => setTab("solana")}
              >
                Solana
              </button>
              <button
                className={cn(
                  "px-3 py-1.5",
                  tab === "evm"
                    ? "bg-blue-600 text-white"
                    : "bg-transparent text-gray-700 hover:bg-white/10 dark:text-gray-300"
                )}
                onClick={() => setTab("evm")}
              >
                EVM
              </button>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
              {tab === "solana" ? <ConnectSolana /> : <ConnectEth />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
