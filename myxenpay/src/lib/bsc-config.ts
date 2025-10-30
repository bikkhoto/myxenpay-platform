import { createPublicClient, http, type PublicClient } from "viem";
import { bsc } from "wagmi/chains";
import { readContract } from "wagmi/actions";
import { wagmiConfig } from "@/config/wagmi";

// BSC network configuration
export const BSC_NETWORK = {
  name: "BNB Smart Chain",
  chainId: 56,
  rpcUrl: "https://bsc-dataseed.binance.org/",
  explorer: "https://bscscan.com",
} as const;

// Replace with deployed BEP-20 contract for $MYXN on BSC
export const MYXN_BSC_CONTRACT: `0x${string}` | null = (process.env.NEXT_PUBLIC_MYXN_BSC_CONTRACT as `0x${string}` | undefined) ?? null;

export function getBSCConnection(): PublicClient {
  return createPublicClient({ chain: bsc, transport: http(BSC_NETWORK.rpcUrl) });
}

export async function getBSCGasPrice() {
  const client = getBSCConnection();
  return client.getGasPrice(); // returns bigint (wei)
}

// Minimal ERC-20 ABI for balance
const ERC20_ABI = [
  { inputs: [{ name: "owner", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], stateMutability: "view", type: "function" },
];

export async function getMYXNBalanceBSC(walletAddress: `0x${string}`) {
  if (!MYXN_BSC_CONTRACT) return { decimals: 18, raw: BigInt(0), formatted: 0 };
  const decimals = (await readContract(wagmiConfig, { address: MYXN_BSC_CONTRACT, abi: ERC20_ABI as unknown as readonly unknown[], functionName: "decimals" })) as number;
  const raw = (await readContract(wagmiConfig, { address: MYXN_BSC_CONTRACT, abi: ERC20_ABI as unknown as readonly unknown[], functionName: "balanceOf", args: [walletAddress] })) as bigint;
  const denom = BigInt(10) ** BigInt(decimals);
  const formatted = Number(raw) / Number(denom);
  return { decimals, raw, formatted };
}

// BscScan API helpers
export const BSCSCAN_API_KEY = process.env.NEXT_PUBLIC_BSCSCAN_API_KEY || "";
export function bscScanAccountTxUrl(address: string) {
  return `${BSC_NETWORK.explorer}/address/${address}`;
}
export function bscScanTxUrl(txHash: string) {
  return `${BSC_NETWORK.explorer}/tx/${txHash}`;
}

export async function getBscTokenTxHistory(address: string, contract?: string): Promise<unknown[]> {
  if (!BSCSCAN_API_KEY) return [] as unknown[];
  const params = new URLSearchParams({
    module: "account",
    action: contract ? "tokentx" : "txlist",
    address,
    sort: "desc",
    apikey: BSCSCAN_API_KEY,
  });
  if (contract) params.set("contractaddress", contract);
  const url = `https://api.bscscan.com/api?${params.toString()}`;
  const res = await fetch(url);
  const json = await res.json().catch(() => ({}));
  return json?.result ?? [];
}
