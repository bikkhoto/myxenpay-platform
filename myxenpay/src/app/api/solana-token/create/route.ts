import { NextRequest, NextResponse } from "next/server";
import { Keypair } from "@solana/web3.js";
import { createSPLToken } from "@/services/solana-token-factory";

function requireAdmin(req: NextRequest) {
  const adminKey = process.env.MYXENPAY_ADMIN_API_KEY;
  const provided = req.headers.get("x-admin-key");
  if (!adminKey || provided !== adminKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

function getPayerFromEnv() {
  const sk = process.env.SOLANA_PAYER_SECRET_KEY_JSON;
  if (!sk) throw new Error("SOLANA_PAYER_SECRET_KEY_JSON not configured");
  let arr: number[];
  try {
    arr = JSON.parse(sk);
  } catch {
    throw new Error("Invalid SOLANA_PAYER_SECRET_KEY_JSON (must be JSON array of numbers)");
  }
  const secretKey = Uint8Array.from(arr);
  return Keypair.fromSecretKey(secretKey);
}

export async function POST(req: NextRequest) {
  const unauth = requireAdmin(req);
  if (unauth) return unauth;

  try {
    const body = await req.json();
    let { name, symbol, decimals, supply } = body ?? {};
    if (typeof name !== "string" || typeof symbol !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    // normalize
    name = name.trim().slice(0, 32);
    symbol = symbol.trim().toUpperCase().slice(0, 10);
    if (typeof decimals !== "number" || !Number.isFinite(decimals)) decimals = 9;
    // SPL often uses 9; clamp between 0 and 9 for safety
    decimals = Math.max(0, Math.min(9, Math.floor(decimals)));
    if (typeof supply !== "number" || !Number.isFinite(supply)) supply = 0;
    // basic guardrails against accidental huge supply
    if (supply <= 0 || supply > 1e15) {
      return NextResponse.json({ error: "Supply out of bounds" }, { status: 400 });
    }

    const payer = getPayerFromEnv();
    const result = await createSPLToken(payer, { name, symbol, decimals, supply });
    return NextResponse.json({ ok: true, ...result });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
