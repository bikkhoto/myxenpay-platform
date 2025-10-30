import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const origin = req.nextUrl.origin;
    const body = await req.json();
    const res = await fetch(`${origin}/api/solana-token/revoke-mint-authority`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-admin-key": process.env.MYXENPAY_ADMIN_API_KEY || "",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
