import { NextResponse } from 'next/server';
import type { RevenueSeriesPoint, RevenueSummary } from '@/types/merchant';

function generateRevenue(days = 14): RevenueSummary {
  const today = new Date();
  const series: RevenueSeriesPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const base = 100 + Math.sin(i / 2) * 50;
    const amount = Math.max(0, Number((base + (Math.random() - 0.5) * 30).toFixed(2)));
    series.push({ date, amount });
  }
  const totalUSD = Number(series.reduce((acc, p) => acc + p.amount, 0).toFixed(2));
  return { totalUSD, series };
}

export async function GET() {
  const data = generateRevenue();
  return NextResponse.json(data);
}
