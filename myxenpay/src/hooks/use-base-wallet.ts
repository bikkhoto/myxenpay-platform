"use client";

import { useCallback, useState } from "react";
import { getAccount, connect, switchChain, getBalance } from "wagmi/actions";
import { wagmiConfig } from "@/config/wagmi";
import { erc20BalanceOf, erc20Decimals, erc20Transfer } from "@/lib/bsc-contracts"; // Reuse ERC-20 helpers
import { getBaseGasPrice, getBaseTokenTxHistory, MYXN_BASE_CONTRACT } from "@/lib/base-config";
import { parseUnits, formatUnits } from "viem";

export function useBaseWallet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectBaseWallet = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await connect(wagmiConfig, { connector: wagmiConfig.connectors[0] });
      if (res.chainId !== 8453) {
        await switchChain(wagmiConfig, { chainId: 8453 });
      }
      return getAccount(wagmiConfig);
    } catch (e) {
      setError((e as Error).message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBaseBalances = useCallback(async () => {
    const acc = getAccount(wagmiConfig);
    if (!acc.address) return { myxn: 0, native: 0 };
    const [ethBal, myxn] = await Promise.all([
      getBalance(wagmiConfig, { address: acc.address }),
      (async () => {
        if (!MYXN_BASE_CONTRACT) return 0;
        const decimals = await erc20Decimals(MYXN_BASE_CONTRACT);
        const raw = await erc20BalanceOf(MYXN_BASE_CONTRACT, acc.address!);
        return Number(formatUnits(raw, decimals));
      })(),
    ]);
    return { myxn, native: Number(ethBal.formatted) };
  }, []);

  const sendMYXNBase = useCallback(async (to: `0x${string}`, amount: string) => {
    if (!MYXN_BASE_CONTRACT) throw new Error("MYXN_BASE_CONTRACT not set");
    const decimals = await erc20Decimals(MYXN_BASE_CONTRACT);
    const value = parseUnits(amount, decimals);
    const { hash, receipt } = await erc20Transfer(MYXN_BASE_CONTRACT, to, value);
    return { hash, receipt };
  }, []);

  const getBaseTransactionHistory = useCallback(async (address: string) => {
    return getBaseTokenTxHistory(address, MYXN_BASE_CONTRACT ?? undefined);
  }, []);

  const getSuggestedGasPrice = useCallback(async () => {
    const gp = await getBaseGasPrice();
    return gp; // bigint wei
  }, []);

  return {
    loading, error,
    connectBaseWallet,
    getBaseBalances,
    sendMYXNBase,
    getBaseTransactionHistory,
    getSuggestedGasPrice,
  };
}
