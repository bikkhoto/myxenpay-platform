import { Connection, PublicKey } from "@solana/web3.js";

// ⚠️ Replace with actual mint after creation or set NEXT_PUBLIC_MYXN_SOLANA_MINT
export const MYXN_MINT_ADDRESS: string = process.env.NEXT_PUBLIC_MYXN_SOLANA_MINT || 'YOUR_NEW_MINT_ADDRESS_HERE';

export const SOLANA_RPC_ENDPOINTS: string[] = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-mainnet.rpc.extrnode.com',
  'https://rpc.ankr.com/solana',
];

export function getConnection(): Connection {
  // simple round-robin/random selection
  const idx = Math.floor(Math.random() * SOLANA_RPC_ENDPOINTS.length);
  const url = SOLANA_RPC_ENDPOINTS[idx];
  return new Connection(url, 'confirmed');
}

export function getMYXNMint(): PublicKey {
  return new PublicKey(MYXN_MINT_ADDRESS);
}

export function validateMintAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function getTokenSupply(): Promise<number> {
  const connection = getConnection();
  const mint = getMYXNMint();
  const supply = await connection.getTokenSupply(mint);
  return Number(supply.value.uiAmount ?? 0);
}
