import { describe, it, expect } from 'vitest';
import { calculateFeesWithRates, allocateRevenue, FEE_TOTAL, toUSD, fromUSD } from './fee-calculation';

const RATES = { USD: 1, USDC: 1, SOL: 100, MYXN: 2, ETH: 3000, MATIC: 1, BNB: 400 } as const;

describe('fee-calculation', () => {
  it('calculates 0.07% split correctly in USD', () => {
    const amount = 1000; // USD
    const res = calculateFeesWithRates(amount, 'USD', RATES);
    const platform = amount * 0.0001;
    const tx = amount * 0.0006;
    const total = platform + tx;
    expect(res.usd.platformFee).toBeCloseTo(platform, 1e-9);
    expect(res.usd.transactionFee).toBeCloseTo(tx, 1e-9);
    expect(res.usd.totalFee).toBeCloseTo(total, 1e-9);
    expect(FEE_TOTAL).toBeCloseTo(0.0007, 1e-9);
  });

  it('converts currencies consistently', () => {
    const usd = toUSD(1, 'SOL', RATES); // 1 SOL -> $100
    expect(usd).toBeCloseTo(100);
    const sol = fromUSD(100, 'SOL', RATES);
    expect(sol).toBeCloseTo(1);
  });

  it('allocates revenue as 30/40/30', () => {
    const fees = 100;
    const alloc = allocateRevenue(fees);
    expect(alloc.burns).toBeCloseTo(30);
    expect(alloc.development).toBeCloseTo(40);
    expect(alloc.operations).toBeCloseTo(30);
  });
});
