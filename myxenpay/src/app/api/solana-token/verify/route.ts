import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/services/solana-token-factory";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mintAddress = searchParams.get("mintAddress");
  if (!mintAddress) return NextResponse.json({ error: "mintAddress is required" }, { status: 400 });
  try {
    const ok = await verifyToken(mintAddress);
    return NextResponse.json({ ok });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
