"use client";

import { create } from "zustand";
import { Connection, PublicKey, Transaction, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { useEffect } from "react";
import {
  getAssociatedTokenAddress,
  createTransferInstruction as splCreateTransferInstruction,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  connect as evmConnect,
  disconnect as evmDisconnect,
  getAccount,
  watchAccount,
  getBalance as evmGetBalance,
  sendTransaction as evmSendTransaction,
  waitForTransactionReceipt,
  switchChain,
  readContract,
  writeContract,
} from "wagmi/actions";
import { wagmiConfig } from "@/config/wagmi";
import { formatUnits, parseUnits } from "viem";

type ChainKey = "solana" | "evm";
type TokenSpec = { type: "native" | "spl" | "erc20"; mintOrAddress?: string; decimals?: number };

type WalletState = {
  // EVM
  evmConnected: boolean;
  evmAddress: string | null;
  evmChainId: number | null;
  evmLoading: boolean;
  evmError: string | null;

  // Solana
  solanaConnected: boolean;
  solanaAddress: string | null;
  solanaLoading: boolean;
  solanaError: string | null;
};

const useWalletStore = create<WalletState>(() => ({
  evmConnected: false,
  evmAddress: null,
  evmChainId: null,
  evmLoading: false,
  evmError: null,

  solanaConnected: false,
  solanaAddress: null,
  solanaLoading: false,
  solanaError: null,
}));

type PhantomLikeProvider = {
  connect: () => Promise<{ publicKey?: { toString(): string } }>;
  disconnect?: () => Promise<void>;
  publicKey?: { toString(): string } | null;
  signAndSendTransaction: (tx: Transaction) => Promise<{ signature: string }>;
};

function getSolanaProvider(): PhantomLikeProvider | null {
  if (typeof window === "undefined") return null;
  // Phantom provider style
  const w = window as unknown as { solana?: PhantomLikeProvider; phantom?: { solana?: PhantomLikeProvider } };
  return w.solana || w.phantom?.solana || null;
}

function getSolanaConnection(): Connection {
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com";
  return new Connection(endpoint, "confirmed");
}

export function useMultiChainWallet() {
  const state = useWalletStore();
  const setState = useWalletStore.setState;

  // Keep EVM connection status in sync with wagmi (subscribe once)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const unwatch = watchAccount(wagmiConfig, {
      onChange(account) {
        setState({
          evmConnected: !!account.address,
          evmAddress: account.address ?? null,
          evmChainId: account.chainId ?? null,
        } as Partial<WalletState>);
      },
    });
    return () => {
      try {
        unwatch?.();
      } catch {}
    };
  }, [setState]);

  async function connectWallet(chain: ChainKey, connector?: string) {
    if (chain === "solana") {
      setState({ solanaLoading: true, solanaError: null });
      try {
        const provider = getSolanaProvider();
        if (!provider) throw new Error("Solana wallet not found. Install Phantom or Backpack.");
        const res = await provider.connect();
        const address = res?.publicKey?.toString?.() ?? provider.publicKey?.toString?.() ?? null;
        setState({ solanaConnected: true, solanaAddress: address });
        return { address };
      } catch (e) {
        setState({ solanaError: (e as Error).message });
        throw e;
      } finally {
        setState({ solanaLoading: false });
      }
    }

    // EVM
    setState({ evmLoading: true, evmError: null });
    try {
      const target = wagmiConfig.connectors.find((c) =>
        connector ? c.id === connector || c.name === connector : true
      );
      const res = await evmConnect(wagmiConfig, { connector: target ?? wagmiConfig.connectors[0] });
      setState({ evmConnected: true, evmAddress: res.accounts?.[0] ?? getAccount(wagmiConfig).address ?? null, evmChainId: res.chainId });
      return { address: res.accounts?.[0] ?? getAccount(wagmiConfig).address };
    } catch (e) {
      setState({ evmError: (e as Error).message });
      throw e;
    } finally {
      setState({ evmLoading: false });
    }
  }

  async function disconnectWallet(chain: ChainKey) {
    if (chain === "solana") {
      try {
        const provider = getSolanaProvider();
        if (provider?.disconnect) await provider.disconnect();
      } finally {
        setState({ solanaConnected: false, solanaAddress: null });
      }
      return;
    }
    try {
      await evmDisconnect(wagmiConfig);
    } finally {
      setState({ evmConnected: false, evmAddress: null, evmChainId: null });
    }
  }

  async function getBalance(chain: ChainKey, token?: TokenSpec) {
    if (chain === "solana") {
      if (!state.solanaAddress) return null;
      const owner = new PublicKey(state.solanaAddress);
      const connection = getSolanaConnection();
      if (!token || token.type === "native") {
        const lamports = await connection.getBalance(owner);
        return { symbol: "SOL", amount: lamports / 1_000_000_000 };
      }
      if (token.type === "spl" && token.mintOrAddress) {
        const mint = new PublicKey(token.mintOrAddress);
        const parsed = await connection.getParsedTokenAccountsByOwner(owner, { mint });
        let ui = 0;
        for (const acc of parsed.value) {
          const data = acc.account.data as unknown as { parsed?: { info?: { tokenAmount?: { uiAmount?: number } } } };
          const amt = data.parsed?.info?.tokenAmount?.uiAmount;
          if (typeof amt === "number") ui += amt;
        }
        return { symbol: "SPL", amount: ui };
      }
      return null;
    }

    // EVM
    const address = getAccount(wagmiConfig).address;
    if (!address) return null;
    if (!token || token.type === "native") {
      const bal = await evmGetBalance(wagmiConfig, { address });
      return { symbol: "ETH", amount: Number(bal.formatted) };
    }
    if (token.type === "erc20" && token.mintOrAddress) {
      const erc20 = token.mintOrAddress as `0x${string}`;
      // Fetch decimals if not provided
      const decimals = token.decimals ?? (await readContract(wagmiConfig, { address: erc20, abi: ERC20_ABI, functionName: "decimals" })) as number;
      const raw = (await readContract(wagmiConfig, { address: erc20, abi: ERC20_ABI, functionName: "balanceOf", args: [address] })) as bigint;
      const amount = Number(formatUnits(raw, decimals));
      return { symbol: "ERC20", amount };
    }
    return null;
  }

  type EvmTx = { to: `0x${string}`; value?: bigint; data?: `0x${string}` };

  type SolTransfer = { type: "sol-transfer"; to: string; amountSol?: number; lamports?: number };
  type SplTransfer = { type: "spl-transfer"; mint: string; to: string; amount: string | number; decimals?: number };
  type Erc20Transfer = { type: "erc20-transfer"; token: `0x${string}`; to: `0x${string}`; amount: string; decimals?: number };

  async function sendTransaction(
    chain: ChainKey,
    tx: Transaction | { serialized: string } | EvmTx | SolTransfer | SplTransfer | Erc20Transfer
  ) {
    if (chain === "solana") {
      const provider = getSolanaProvider();
      if (!provider) throw new Error("Solana wallet not found");
      // If Transaction instance provided, rely on wallet to sign and send
      if (tx instanceof Transaction) {
        // Ensure recentBlockhash is set by the caller for best results
        const { signature } = await provider.signAndSendTransaction(tx);
        return { hash: signature };
      }
      // If serialized payload provided (base64)
      if ("serialized" in tx) {
        const connection = getSolanaConnection();
        const sig = await connection.sendRawTransaction(Buffer.from(tx.serialized, "base64"));
        return { hash: sig };
      }
      // Simple native transfer
      if ("type" in tx && tx.type === "sol-transfer") {
        if (!state.solanaAddress) throw new Error("Not connected to Solana");
        const from = new PublicKey(state.solanaAddress);
        const to = new PublicKey(tx.to);
        const lamports = tx.lamports ?? Math.floor((tx.amountSol ?? 0) * 1_000_000_000);
        const connection = getSolanaConnection();
        const { blockhash } = await connection.getLatestBlockhash();
        const ix = SystemProgram.transfer({ fromPubkey: from, toPubkey: to, lamports });
        const t = new Transaction().add(ix);
        t.feePayer = from;
        t.recentBlockhash = blockhash;
        const { signature } = await provider.signAndSendTransaction(t);
        return { hash: signature };
      }
      // SPL token transfer
      if ("type" in tx && tx.type === "spl-transfer") {
        if (!state.solanaAddress) throw new Error("Not connected to Solana");
        const owner = new PublicKey(state.solanaAddress);
        const mint = new PublicKey(tx.mint);
        const dest = new PublicKey(tx.to);
        const connection = getSolanaConnection();
        const ownerAta = await getAssociatedTokenAddress(mint, owner, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
        const destAta = await getAssociatedTokenAddress(mint, dest, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
  const ixs: TransactionInstruction[] = [];
        const destInfo = await connection.getAccountInfo(destAta);
        if (!destInfo) {
          ixs.push(createAssociatedTokenAccountInstruction(owner, destAta, dest, mint, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID));
        }
        const decimals = tx.decimals ?? 9;
        const raw = BigInt(Math.floor(Number(tx.amount) * 10 ** decimals));
        ixs.push(splCreateTransferInstruction(ownerAta, destAta, owner, raw, [], TOKEN_PROGRAM_ID));
        const { blockhash } = await connection.getLatestBlockhash();
        const t = new Transaction().add(...ixs);
        t.feePayer = owner;
        t.recentBlockhash = blockhash;
        const { signature } = await provider.signAndSendTransaction(t);
        return { hash: signature };
      }
      throw new Error("Unsupported Solana transaction payload");
    }

    // EVM transaction (native transfer or contract call)
    if (hasType(tx) && tx.type === "erc20-transfer") {
      const erc = tx as Erc20Transfer;
      const decimals = erc.decimals ?? (await readContract(wagmiConfig, { address: erc.token, abi: ERC20_ABI, functionName: "decimals" })) as number;
      const value = parseUnits(erc.amount, decimals);
      const hash = await writeContract(wagmiConfig, { address: erc.token, abi: ERC20_ABI, functionName: "transfer", args: [erc.to, value] });
      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
      return { hash, receipt };
    } else {
      const evm = tx as EvmTx;
      const hash = await evmSendTransaction(wagmiConfig, {
        to: evm.to,
        value: evm.value,
        data: evm.data,
      });
      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
      return { hash, receipt };
    }
  }

  async function switchEVMChain(chainId: number) {
    // Narrow the type by resolving the target from configured chains
    const target = wagmiConfig.chains.find((c) => c.id === chainId);
    if (!target) throw new Error(`Unsupported EVM chain id: ${chainId}`);
    const res = await switchChain(wagmiConfig, { chainId: target.id });
    setState({ evmChainId: res.id });
    return res;
  }

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    getBalance,
    sendTransaction,
    switchEVMChain,
    // Unified additions
    async getBalancesAllChains() {
      const result = {
        solana: { myxn: 0, native: 0 },
        bsc: { myxn: 0, native: 0 },
        polygon: { myxn: 0, native: 0 },
        base: { myxn: 0, native: 0 },
      };
      // Solana native only here; token balances can be queried via getBalance({type:"spl", mintOrAddress:...})
      try {
        const sol = await getBalance("solana");
        result.solana.native = sol?.amount ?? 0;
      } catch {}
      // For EVMs, native only; MYXN queried in chain-specific hooks
      try {
        const evm = await getBalance("evm");
        const chainId = state.evmChainId;
        if (chainId === 56) result.bsc.native = evm?.amount ?? 0;
        if (chainId === 137) result.polygon.native = evm?.amount ?? 0;
        if (chainId === 8453) result.base.native = evm?.amount ?? 0;
      } catch {}
      return result;
    },
    async sendMYXNUniversal(chain: "solana" | "bsc" | "polygon" | "base", _to: string, _amount: string) {
      // Mark parameters as intentionally unused to satisfy strict linting rules.
      void _to;
      void _amount;
      if (chain === "solana") {
        throw new Error("Use SPL transfer via 'sendTransaction' with type 'spl-transfer' and the MYXN mint.");
      }
      // EVM chain routing is handled by dedicated hooks; here we provide a simple guard.
      throw new Error("Use chain-specific hooks (use-bsc-wallet, use-polygon-wallet, use-base-wallet) to send MYXN.");
    },
    async getPreferredChain() {
      // Very simple heuristic: prefer the currently connected EVM chain, else Solana if connected
      if (state.evmConnected && state.evmChainId) return state.evmChainId;
      if (state.solanaConnected) return "solana";
      return 8453; // default preference: Base
    },
  };
}

// Minimal ERC-20 ABI for balance/transfer/decimals
const ERC20_ABI = [
  { inputs: [{ name: "owner", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "symbol", outputs: [{ name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "to", type: "address" }, { name: "value", type: "uint256" }], name: "transfer", outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" },
];

function hasType(x: unknown): x is { type: string } {
  return typeof x === "object" && x !== null && "type" in x;
}
