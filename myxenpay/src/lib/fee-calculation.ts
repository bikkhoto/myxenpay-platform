export type Currency = "USD" | "USDC" | "SOL" | "MYXN" | "ETH";

export type Rates = Record<Currency, number>; // price in USD per 1 unit of currency

const FEE_PLATFORM = 0.0001; // 0.01%
const FEE_TRANSACTION = 0.0006; // 0.06%
export const FEE_TOTAL = FEE_PLATFORM + FEE_TRANSACTION; // 0.07%

let cachedRates: { rates: Rates; ts: number } | null = null;
const CACHE_MS = 60_000; // 1 min

function now() {
  return Date.now();
}

function buildFallbackRates(): Rates {
  const myxnFallback = Number(process.env.NEXT_PUBLIC_MYXN_PRICE_USD || 0) || 0;
  return { USD: 1, USDC: 1, SOL: 0, MYXN: myxnFallback, ETH: 0 };
}

export async function getRates(force = false): Promise<Rates> {
  if (!force && cachedRates && now() - cachedRates.ts < CACHE_MS) return cachedRates.rates;
  const controller = new AbortController();
  const fallback = buildFallbackRates();
  try {
    const solEth = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana,ethereum&vs_currencies=usd",
      { signal: controller.signal }
    ).then((r) => r.json());
    const myxnId = process.env.NEXT_PUBLIC_CG_ID_MYXN;
    let myxn = fallback.MYXN;
    if (myxnId) {
      try {
        const d = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(myxnId)}&vs_currencies=usd`,
          { signal: controller.signal }
        ).then((r) => r.json());
        myxn = d?.[myxnId]?.usd ?? fallback.MYXN;
      } catch {}
    }
    const rates: Rates = {
      USD: 1,
      USDC: 1,
      SOL: solEth?.solana?.usd ?? 0,
      ETH: solEth?.ethereum?.usd ?? 0,
      MYXN: myxn,
    };
    cachedRates = { rates, ts: now() };
    return rates;
  } catch {
    // network failure -> return fallback
    cachedRates = { rates: fallback, ts: now() };
    return fallback;
  }
}

export function toUSD(amount: number, currency: Currency, rates: Rates): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  if (currency === "USD" || currency === "USDC") return amount; // 1:1
  const p = rates[currency] || 0;
  return p > 0 ? amount * p : 0;
}

export function fromUSD(usd: number, currency: Currency, rates: Rates): number {
  if (!Number.isFinite(usd) || usd <= 0) return 0;
  if (currency === "USD" || currency === "USDC") return usd; // 1:1
  const p = rates[currency] || 0;
  return p > 0 ? usd / p : 0;
}

export type FeeBreakdown = {
  platformFee: number;
  transactionFee: number;
  totalFee: number;
  currency: Currency;
  usd: {
    platformFee: number;
    transactionFee: number;
    totalFee: number;
  };
};

export function calculateFeesWithRates(amount: number, currency: Currency, rates: Rates): FeeBreakdown {
  const usdAmount = toUSD(amount, currency, rates);
  const usdPlatform = usdAmount * FEE_PLATFORM;
  const usdTx = usdAmount * FEE_TRANSACTION;
  const usdTotal = usdPlatform + usdTx;
  // return amounts in the original currency for UI display
  const platformFee = fromUSD(usdPlatform, currency, rates);
  const transactionFee = fromUSD(usdTx, currency, rates);
  const totalFee = fromUSD(usdTotal, currency, rates);
  return {
    platformFee,
    transactionFee,
    totalFee,
    currency,
    usd: { platformFee: usdPlatform, transactionFee: usdTx, totalFee: usdTotal },
  };
}

export async function calculateFees(amount: number, currency: Currency): Promise<FeeBreakdown> {
  const rates = await getRates();
  return calculateFeesWithRates(amount, currency, rates);
}

export async function getPlatformFee(amount: number, currency: Currency): Promise<number> {
  return (await calculateFees(amount, currency)).platformFee;
}

export async function getTransactionFee(amount: number, currency: Currency): Promise<number> {
  return (await calculateFees(amount, currency)).transactionFee;
}

export async function getNetAmount(amount: number, currency: Currency): Promise<number> {
  const { totalFee } = await calculateFees(amount, currency);
  return Math.max(0, amount - totalFee);
}

export function allocateRevenue(fees: number) {
  // Split given number into 30% burns, 40% development, 30% operations
  const burns = fees * 0.3;
  const development = fees * 0.4;
  const operations = fees * 0.3;
  return { burns, development, operations };
}
