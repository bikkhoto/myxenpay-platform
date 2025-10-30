export type ChainType = 'solana' | 'ethereum' | 'polygon' | 'bsc';

export interface WalletInfo {
  address: string;
  chainType: ChainType;
  balance?: string;
}

export interface PaymentRequest {
  id: string;
  amount: number;
  currency: string;
  recipient: string;
  chainType: ChainType;
  description?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface TokenConfig {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  chainType: ChainType;
  description?: string;
  logoUrl?: string;
}

export interface MerchantData {
  id: string;
  name: string;
  walletAddress: string;
  chainType: ChainType;
  totalTransactions: number;
  totalVolume: string;
}
