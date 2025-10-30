import { createPublicClient, http, type PublicClient } from "viem";
import { polygon } from "wagmi/chains";
import { readContract } from "wagmi/actions";
import { wagmiConfig } from "@/config/wagmi";

export const POLYGON_NETWORK = {
  name: "Polygon",
  chainId: 137,
  rpcUrl: "https://polygon-rpc.com",
  explorer: "https://polygonscan.com",
} as const;

export const MYXN_POLYGON_CONTRACT: `0x${string}` | null = (process.env.NEXT_PUBLIC_MYXN_POLYGON_CONTRACT as `0x${string}` | undefined) ?? null;

export function getPolygonConnection(): PublicClient {
  return createPublicClient({ chain: polygon, transport: http(POLYGON_NETWORK.rpcUrl) });
}

export async function getPolygonGasPrice() {
  const client = getPolygonConnection();
  return client.getGasPrice();
}

const ERC20_ABI = [
  { inputs: [{ name: "owner", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], stateMutability: "view", type: "function" },
];

export async function getMYXNBalancePolygon(walletAddress: `0x${string}`) {
  if (!MYXN_POLYGON_CONTRACT) return { decimals: 18, raw: BigInt(0), formatted: 0 };
  const decimals = (await readContract(wagmiConfig, { address: MYXN_POLYGON_CONTRACT, abi: ERC20_ABI as unknown as readonly unknown[], functionName: "decimals" })) as number;
  const raw = (await readContract(wagmiConfig, { address: MYXN_POLYGON_CONTRACT, abi: ERC20_ABI as unknown as readonly unknown[], functionName: "balanceOf", args: [walletAddress] })) as bigint;
  const denom = BigInt(10) ** BigInt(decimals);
  const formatted = Number(raw) / Number(denom);
  return { decimals, raw, formatted };
}

// Polygonscan
export const POLYGONSCAN_API_KEY = process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY || "";
export function polygonScanAccountTxUrl(address: string) { return `${POLYGON_NETWORK.explorer}/address/${address}`; }
export function polygonScanTxUrl(txHash: string) { return `${POLYGON_NETWORK.explorer}/tx/${txHash}`; }
export async function getPolygonTokenTxHistory(address: string, contract?: string): Promise<unknown[]> {
  if (!POLYGONSCAN_API_KEY) return [] as unknown[];
  const params = new URLSearchParams({ module: "account", action: contract ? "tokentx" : "txlist", address, sort: "desc", apikey: POLYGONSCAN_API_KEY });
  if (contract) params.set("contractaddress", contract);
  const url = `https://api.polygonscan.com/api?${params.toString()}`;
  const res = await fetch(url);
  const json = await res.json().catch(() => ({}));
  return json?.result ?? [];
}
