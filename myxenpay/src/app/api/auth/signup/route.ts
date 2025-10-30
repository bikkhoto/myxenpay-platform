import { NextRequest, NextResponse } from 'next/server';

type Role = 'merchant' | 'user' | 'admin';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string; password?: string; role?: Role };
    const { email, password, role } = body;
    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    // Stub: persist user in DB and hash password
    return NextResponse.json({ ok: true, message: `Signed up as ${role}` });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid request';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
