import { NextResponse } from 'next/server';
import type { Order } from '@/types/merchant';

// Mock orders; replace with DB/source of truth in production
const ORDERS: Order[] = [
  { id: 'ord_1001', status: 'paid', amountUsd: 49.99, token: 'MYXN', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 'ord_1002', status: 'pending', amountUsd: 19.99, token: 'MATIC', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: 'ord_1003', status: 'failed', amountUsd: 9.99, token: 'BNB', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 'ord_1004', status: 'paid', amountUsd: 120.0, token: 'ETH', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'ord_1005', status: 'refunded', amountUsd: 29.0, token: 'SOL', createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
];

export async function GET() {
  return NextResponse.json({ orders: ORDERS });
}
