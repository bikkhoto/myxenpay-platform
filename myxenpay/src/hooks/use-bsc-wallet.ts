"use client";

import { useCallback, useState } from "react";
import { getAccount, connect, switchChain, getBalance } from "wagmi/actions";
import { wagmiConfig } from "@/config/wagmi";
import { erc20Approve, erc20BalanceOf, erc20Decimals, erc20Transfer } from "@/lib/bsc-contracts";
import { getBSCGasPrice, getBscTokenTxHistory, MYXN_BSC_CONTRACT } from "@/lib/bsc-config";
import { parseUnits, formatUnits } from "viem";

export function useBSCWallet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectBSCWallet = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await connect(wagmiConfig, { connector: wagmiConfig.connectors[0] });
      if (res.chainId !== 56) {
        await switchChain(wagmiConfig, { chainId: 56 });
      }
      return getAccount(wagmiConfig);
    } catch (e) {
      setError((e as Error).message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBSCBalances = useCallback(async () => {
    const acc = getAccount(wagmiConfig);
    if (!acc.address) return { myxn: 0, native: 0 };
    const [bnbBal, myxn] = await Promise.all([
      getBalance(wagmiConfig, { address: acc.address }),
      (async () => {
        if (!MYXN_BSC_CONTRACT) return 0;
        const decimals = await erc20Decimals(MYXN_BSC_CONTRACT);
        const raw = await erc20BalanceOf(MYXN_BSC_CONTRACT, acc.address!);
        return Number(formatUnits(raw, decimals));
      })(),
    ]);
    return { myxn, native: Number(bnbBal.formatted) };
  }, []);

  const sendMYXNBSC = useCallback(async (to: `0x${string}`, amount: string) => {
    if (!MYXN_BSC_CONTRACT) throw new Error("MYXN_BSC_CONTRACT not set");
    const decimals = await erc20Decimals(MYXN_BSC_CONTRACT);
    const value = parseUnits(amount, decimals);
    const { hash, receipt } = await erc20Transfer(MYXN_BSC_CONTRACT, to, value);
    return { hash, receipt };
  }, []);

  const approveMYXNSpender = useCallback(async (spender: `0x${string}`, amount: string) => {
    if (!MYXN_BSC_CONTRACT) throw new Error("MYXN_BSC_CONTRACT not set");
    const decimals = await erc20Decimals(MYXN_BSC_CONTRACT);
    const value = parseUnits(amount, decimals);
    const { hash, receipt } = await erc20Approve(MYXN_BSC_CONTRACT, spender, value);
    return { hash, receipt };
  }, []);

  const getBSCTransactionHistory = useCallback(async (address: string) => {
    return getBscTokenTxHistory(address, MYXN_BSC_CONTRACT ?? undefined);
  }, []);

  const getSuggestedGasPrice = useCallback(async () => {
    const gp = await getBSCGasPrice();
    return gp; // bigint wei
  }, []);

  return {
    loading, error,
    connectBSCWallet,
    getBSCBalances,
    sendMYXNBSC,
    approveMYXNSpender,
    getBSCTransactionHistory,
    getSuggestedGasPrice,
  };
}
