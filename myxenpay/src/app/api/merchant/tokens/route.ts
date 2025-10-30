import { NextRequest, NextResponse } from 'next/server';
import type { MerchantToken, SupportedTokenSymbol } from '@/types/merchant';

// In-memory mock; replace with DB in production
const TOKENS: MerchantToken[] = [
  { symbol: 'MYXN', accepted: true },
  { symbol: 'SOL', accepted: true },
  { symbol: 'ETH', accepted: true },
  { symbol: 'MATIC', accepted: true },
  { symbol: 'BNB', accepted: true },
];

export async function GET() {
  return NextResponse.json({ tokens: TOKENS });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { symbol: SupportedTokenSymbol; accepted: boolean };
    const { symbol, accepted } = body;
    const idx = TOKENS.findIndex((t) => t.symbol === symbol);
    if (idx >= 0) {
      TOKENS[idx] = { symbol, accepted };
    } else {
      TOKENS.push({ symbol, accepted });
    }
    return NextResponse.json({ ok: true, token: { symbol, accepted } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid payload';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
