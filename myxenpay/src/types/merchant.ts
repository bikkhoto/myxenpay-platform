export type CSVRowValue = string | number | boolean | null | undefined | Date;
export type CSVRow = Record<string, CSVRowValue>;

export type SupportedTokenSymbol = 'SOL' | 'ETH' | 'MATIC' | 'BNB' | 'MYXN';

export type MerchantToken = {
  symbol: SupportedTokenSymbol;
  accepted: boolean;
};

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  status: OrderStatus;
  amountUsd: number;
  token: SupportedTokenSymbol;
  createdAt: string; // ISO date string
}

export interface RevenueSeriesPoint {
  date: string; // YYYY-MM-DD
  amount: number; // USD amount for that day
}

export interface RevenueSummary {
  totalUSD: number;
  series: RevenueSeriesPoint[];
}
