import { writeContract, readContract, waitForTransactionReceipt } from "wagmi/actions";
import { wagmiConfig } from "@/config/wagmi";

export const ERC20_ABI = [
  { inputs: [{ name: "owner", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "symbol", outputs: [{ name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "to", type: "address" }, { name: "value", type: "uint256" }], name: "transfer", outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ name: "spender", type: "address" }, { name: "value", type: "uint256" }], name: "approve", outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], name: "allowance", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
] as const;

export async function erc20BalanceOf(token: `0x${string}`, owner: `0x${string}`) {
  return (await readContract(wagmiConfig, { address: token, abi: ERC20_ABI, functionName: "balanceOf", args: [owner] })) as bigint;
}

export async function erc20Decimals(token: `0x${string}`) {
  return (await readContract(wagmiConfig, { address: token, abi: ERC20_ABI, functionName: "decimals" })) as number;
}

export async function erc20Transfer(token: `0x${string}`, to: `0x${string}`, amount: bigint) {
  const hash = await writeContract(wagmiConfig, { address: token, abi: ERC20_ABI, functionName: "transfer", args: [to, amount] });
  const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
  return { hash, receipt };
}

export async function erc20Approve(token: `0x${string}`, spender: `0x${string}`, amount: bigint) {
  const hash = await writeContract(wagmiConfig, { address: token, abi: ERC20_ABI, functionName: "approve", args: [spender, amount] });
  const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
  return { hash, receipt };
}

export async function erc20Allowance(token: `0x${string}`, owner: `0x${string}`, spender: `0x${string}`) {
  return (await readContract(wagmiConfig, { address: token, abi: ERC20_ABI, functionName: "allowance", args: [owner, spender] })) as bigint;
}

// PancakeSwap v2 Router (mainnet)
export const PANCAKESWAP_ROUTER_V2: `0x${string}` = (process.env.NEXT_PUBLIC_PANCAKESWAP_ROUTER_V2 as `0x${string}`) || "0x10ED43C718714eb63d5aA57B78B54704E256024E";

export function bscScanTxUrl(txHash: string) {
  return `https://bscscan.com/tx/${txHash}`;
}
