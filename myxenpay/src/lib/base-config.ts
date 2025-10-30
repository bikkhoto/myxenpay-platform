import { createPublicClient, http, type PublicClient, type Transport } from "viem";
import type { Chain } from "viem/chains";
import { base } from "wagmi/chains";
import { readContract } from "wagmi/actions";
import { wagmiConfig } from "@/config/wagmi";

export const BASE_NETWORK = {
  name: "Base",
  chainId: 8453,
  rpcUrl: "https://mainnet.base.org",
  explorer: "https://basescan.org",
} as const;

export const MYXN_BASE_CONTRACT: `0x${string}` | null = (process.env.NEXT_PUBLIC_MYXN_BASE_CONTRACT as `0x${string}` | undefined) ?? null;

export function getBaseConnection(): PublicClient {
  // Casts applied to avoid type incompatibilities across differing viem/wagmi versions in workspace.
  return createPublicClient({ chain: base as unknown as Chain, transport: http(BASE_NETWORK.rpcUrl) as unknown as Transport }) as unknown as PublicClient;
}

export async function getBaseGasPrice() {
  const client = getBaseConnection();
  return client.getGasPrice();
}

const ERC20_ABI = [
  { inputs: [{ name: "owner", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], stateMutability: "view", type: "function" },
];

export async function getMYXNBalanceBase(walletAddress: `0x${string}`) {
  if (!MYXN_BASE_CONTRACT) return { decimals: 18, raw: BigInt(0), formatted: 0 };
  const decimals = (await readContract(wagmiConfig, { address: MYXN_BASE_CONTRACT, abi: ERC20_ABI as unknown as readonly unknown[], functionName: "decimals" })) as number;
  const raw = (await readContract(wagmiConfig, { address: MYXN_BASE_CONTRACT, abi: ERC20_ABI as unknown as readonly unknown[], functionName: "balanceOf", args: [walletAddress] })) as bigint;
  const denom = BigInt(10) ** BigInt(decimals);
  const formatted = Number(raw) / Number(denom);
  return { decimals, raw, formatted };
}

// Basescan
export const BASESCAN_API_KEY = process.env.NEXT_PUBLIC_BASESCAN_API_KEY || "";
export function baseScanAccountTxUrl(address: string) { return `${BASE_NETWORK.explorer}/address/${address}`; }
export function baseScanTxUrl(txHash: string) { return `${BASE_NETWORK.explorer}/tx/${txHash}`; }
export async function getBaseTokenTxHistory(address: string, contract?: string): Promise<unknown[]> {
  if (!BASESCAN_API_KEY) return [] as unknown[];
  const params = new URLSearchParams({ module: "account", action: contract ? "tokentx" : "txlist", address, sort: "desc", apikey: BASESCAN_API_KEY });
  if (contract) params.set("contractaddress", contract);
  const url = `https://api.basescan.org/api?${params.toString()}`;
  const res = await fetch(url);
  const json = await res.json().catch(() => ({}));
  return json?.result ?? [];
}
