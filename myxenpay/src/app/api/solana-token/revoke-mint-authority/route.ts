import { NextRequest, NextResponse } from "next/server";
import { Keypair } from "@solana/web3.js";
import { revokeMintAuthority } from "@/services/solana-token-factory";

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
  const arr = JSON.parse(sk) as number[];
  const secretKey = Uint8Array.from(arr);
  return Keypair.fromSecretKey(secretKey);
}

export async function POST(req: NextRequest) {
  const unauth = requireAdmin(req);
  if (unauth) return unauth;

  try {
    const body = await req.json();
    const { mintAddress } = body ?? {};
    if (typeof mintAddress !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const payer = getPayerFromEnv();
    await revokeMintAuthority(payer, mintAddress);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
