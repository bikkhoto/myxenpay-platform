"use client";

import { useState } from "react";
import { TOKEN_SYMBOL, TOKEN_FULL_NAME } from "@/config/token";

export default function TokenMintAdmin() {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState("MyXenPay");
  const [symbol, setSymbol] = useState(TOKEN_SYMBOL);
  const [decimals, setDecimals] = useState<number>(9);
  const [supply, setSupply] = useState("1000000000");
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<null | { mintAddress: string; transactionSignature: string }>(null);
  const [error, setError] = useState<string | null>(null);
  // Extra admin actions
  const [mintAddress, setMintAddress] = useState("");
  const [destination, setDestination] = useState("");
  const [mintAmount, setMintAmount] = useState("0");
  const [mintingMore, setMintingMore] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<null | { ok: boolean; error?: string }>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const SOLANA_CLUSTER = (process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "mainnet").toLowerCase();
  function solanaExplorer(kind: "address" | "tx", value: string) {
    const base = "https://explorer.solana.com";
    const qp = SOLANA_CLUSTER === "devnet" || SOLANA_CLUSTER === "testnet" ? `?cluster=${SOLANA_CLUSTER}` : "";
    const path = kind === "address" ? `/address/${value}` : `/tx/${value}`;
    return `${base}${path}${qp}`;
  }
  function copyToClipboard(value: string, tag: string) {
    try {
      navigator.clipboard.writeText(value).then(() => {
        setCopied(tag);
        setTimeout(() => setCopied(null), 1500);
      });
    } catch {
      // no-op
    }
  }

  const canNext1 = name.trim().length > 0 && symbol.trim().length > 0 && decimals >= 0;
  const canNext2 = Number(supply) > 0;

  return (
    <main className="site-container section">
      <h1 className="text-2xl font-bold">Admin: {TOKEN_FULL_NAME} Mint</h1>
      <p className="text-gray-600 dark:text-gray-400">Create and manage the SPL token mint. For production, run via secure backend.</p>

      <ol className="mt-4 flex items-center gap-2 text-sm">
        {[1, 2, 3, 4].map((i) => (
          <li key={i} className={"inline-flex h-7 w-7 items-center justify-center rounded-full " + (i <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300")}>{i}</li>
        ))}
      </ol>

      {step === 1 && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
            <label className="mb-1 block text-xs">Name</label>
            <input className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 dark:border-white/10" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
            <label className="mb-1 block text-xs">Symbol</label>
            <input className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 dark:border-white/10" value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} />
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
            <label className="mb-1 block text-xs">Decimals</label>
            <input type="number" min={0} className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 dark:border-white/10" value={decimals} onChange={(e) => setDecimals(Number(e.target.value))} />
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-2">
            <button className="rounded-md border px-3 py-2 text-sm" disabled>
              Back
            </button>
            <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60" onClick={() => setStep(2)} disabled={!canNext1}>Next</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
            <label className="mb-1 block text-xs">Initial Supply</label>
            <input type="number" min={1} className="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 dark:border-white/10" value={supply} onChange={(e) => setSupply(e.target.value)} />
            <p className="mt-2 text-xs text-gray-500">Example: 1,000,000,000</p>
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-2">
            <button className="rounded-md border px-3 py-2 text-sm" onClick={() => setStep(1)}>Back</button>
            <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60" onClick={() => setStep(3)} disabled={!canNext2}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="text-sm text-gray-600 dark:text-gray-400">Mint Authority</div>
            <div className="text-xs">Your admin wallet</div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="text-sm text-gray-600 dark:text-gray-400">Freeze Authority</div>
            <div className="text-xs">Optional (future)</div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="text-sm text-gray-600 dark:text-gray-400">Security</div>
            <div className="text-xs">Multi-sig approvals recommended</div>
          </div>
          <div className="md:col-span-3 flex items-center justify-end gap-2">
            <button className="rounded-md border px-3 py-2 text-sm" onClick={() => setStep(2)}>Back</button>
            <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white" onClick={() => setStep(4)}>Next</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="mt-4 rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
          <h3 className="mb-2 text-base font-semibold">Review</h3>
          <ul className="grid gap-1 text-sm text-gray-700 dark:text-gray-300">
            <li>Name: <span className="font-semibold">{name}</span></li>
            <li>Symbol: <span className="font-semibold">{symbol}</span></li>
            <li>Decimals: <span className="font-semibold">{decimals}</span></li>
            <li>Initial Supply: <span className="font-semibold">{supply}</span></li>
          </ul>
          <div className="mt-3 text-xs text-amber-600">Note: On-chain creation should be executed on a secure backend or with a hardware wallet.</div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button className="rounded-md border px-3 py-2 text-sm" onClick={() => setStep(3)}>Back</button>
            <button
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              disabled={creating}
              onClick={async () => {
                try {
                  setError(null);
                  setResult(null);
                  setCreating(true);
                  const res = await fetch("/api/admin/solana-token/create", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ name, symbol, decimals, supply: Number(supply) }),
                  });
                  const json = await res.json();
                  if (!res.ok) throw new Error(json?.error || "Create failed");
                  setResult({ mintAddress: json.mintAddress, transactionSignature: json.transactionSignature });
                  setMintAddress(json.mintAddress ?? "");
                } catch (e: unknown) {
                  setError(e instanceof Error ? e.message : String(e));
                } finally {
                  setCreating(false);
                }
              }}
            >
              {creating ? "Creating…" : "Create"}
            </button>
          </div>
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
          {result && (
            <div className="mt-3 text-sm">
              <div className="flex items-center gap-2">
                <span>Mint Address:</span>
                <a className="font-mono text-blue-600 underline" target="_blank" rel="noreferrer" href={solanaExplorer("address", result.mintAddress)}>{result.mintAddress}</a>
                <button
                  className="rounded border px-2 py-1 text-xs"
                  onClick={() => copyToClipboard(result.mintAddress, "mint")}
                >{copied === "mint" ? "Copied" : "Copy"}</button>
              </div>
              <div className="flex items-center gap-2">
                <span>Tx Signature:</span>
                <a className="font-mono text-blue-600 underline" target="_blank" rel="noreferrer" href={solanaExplorer("tx", result.transactionSignature)}>{result.transactionSignature}</a>
                <button
                  className="rounded border px-2 py-1 text-xs"
                  onClick={() => copyToClipboard(result.transactionSignature, "tx")}
                >{copied === "tx" ? "Copied" : "Copy"}</button>
              </div>
            </div>
          )}
          {/* Post-creation admin actions */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
              <h4 className="mb-2 font-semibold">Mint more tokens</h4>
              <label className="mb-1 block text-xs">Mint Address</label>
              <input className="mb-2 w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm dark:border-white/10" value={mintAddress} onChange={(e) => setMintAddress(e.target.value)} />
              <label className="mb-1 block text-xs">Destination Wallet</label>
              <input className="mb-2 w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm dark:border-white/10" value={destination} onChange={(e) => setDestination(e.target.value)} />
              <label className="mb-1 block text-xs">Amount</label>
              <input type="number" min={0} className="mb-3 w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm dark:border-white/10" value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} />
              <button
                className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                disabled={mintingMore || !mintAddress || !destination || Number(mintAmount) <= 0}
                onClick={async () => {
                  try {
                    setError(null);
                    setMintingMore(true);
                    const res = await fetch("/api/admin/solana-token/mint", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ mintAddress, destination, amount: Number(mintAmount) }),
                    });
                    const json = await res.json();
                    if (!res.ok) throw new Error(json?.error || "Mint failed");
                    alert(`Minted. Signature: ${json.signature}`);
                  } catch (e: unknown) {
                    setError(e instanceof Error ? e.message : String(e));
                  } finally {
                    setMintingMore(false);
                  }
                }}
              >
                {mintingMore ? "Minting…" : "Mint"}
              </button>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/30 p-4 dark:border-white/10 dark:bg-white/10">
              <h4 className="mb-2 font-semibold">Revoke mint authority</h4>
              <label className="mb-1 block text-xs">Mint Address</label>
              <input className="mb-3 w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm dark:border-white/10" value={mintAddress} onChange={(e) => setMintAddress(e.target.value)} />
              <button
                className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                disabled={revoking || !mintAddress}
                onClick={async () => {
                  if (!confirm("Are you sure you want to revoke the mint authority? This cannot be undone.")) return;
                  try {
                    setError(null);
                    setRevoking(true);
                    const res = await fetch("/api/admin/solana-token/revoke-mint-authority", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ mintAddress }),
                    });
                    const json = await res.json();
                    if (!res.ok) throw new Error(json?.error || "Revoke failed");
                    alert("Mint authority revoked.");
                  } catch (e: unknown) {
                    setError(e instanceof Error ? e.message : String(e));
                  } finally {
                    setRevoking(false);
                  }
                }}
              >
                {revoking ? "Revoking…" : "Revoke"}
              </button>
              <div className="mt-4">
                <button
                  className="rounded-md border px-3 py-2 text-sm"
                  onClick={async () => {
                    try {
                      setVerifyStatus(null);
                      const url = new URL("/api/admin/solana-token/verify", window.location.origin);
                      url.searchParams.set("mintAddress", mintAddress);
                      const res = await fetch(url.toString(), { cache: "no-store" });
                      const json = await res.json();
                      setVerifyStatus({ ok: !!json.ok, error: json.error });
                    } catch (e: unknown) {
                      setVerifyStatus({ ok: false, error: e instanceof Error ? e.message : String(e) });
                    }
                  }}
                  disabled={!mintAddress}
                >
                  Verify Mint
                </button>
                {verifyStatus && (
                  <div className="mt-2 text-xs">
                    {verifyStatus.ok ? (
                      <span className="text-emerald-600">Mint verified</span>
                    ) : (
                      <span className="text-red-600">{verifyStatus.error || "Mint not found"}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
