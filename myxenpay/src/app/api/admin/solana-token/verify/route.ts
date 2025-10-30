import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const origin = req.nextUrl.origin;
    const res = await fetch(`${origin}/api/solana-token/verify?${req.nextUrl.searchParams.toString()}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      cache: "no-store",
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
