import { clusterApiUrl, Cluster } from '@solana/web3.js';

export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';

export const SOLANA_RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl(SOLANA_NETWORK as Cluster);

export const solanaConfig = {
  network: SOLANA_NETWORK,
  endpoint: SOLANA_RPC_ENDPOINT,
};
