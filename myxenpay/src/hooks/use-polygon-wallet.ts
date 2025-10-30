"use client";

import { useCallback, useState } from "react";
import { getAccount, connect, switchChain, getBalance } from "wagmi/actions";
import { wagmiConfig } from "@/config/wagmi";
import { erc20BalanceOf, erc20Decimals, erc20Transfer } from "@/lib/bsc-contracts"; // Reuse ERC-20 helpers
import { getPolygonGasPrice, getPolygonTokenTxHistory, MYXN_POLYGON_CONTRACT } from "@/lib/polygon-config";
import { parseUnits, formatUnits } from "viem";

export function usePolygonWallet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectPolygonWallet = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await connect(wagmiConfig, { connector: wagmiConfig.connectors[0] });
      if (res.chainId !== 137) {
        await switchChain(wagmiConfig, { chainId: 137 });
      }
      return getAccount(wagmiConfig);
    } catch (e) {
      setError((e as Error).message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPolygonBalances = useCallback(async () => {
    const acc = getAccount(wagmiConfig);
    if (!acc.address) return { myxn: 0, native: 0 };
    const [maticBal, myxn] = await Promise.all([
      getBalance(wagmiConfig, { address: acc.address }),
      (async () => {
        if (!MYXN_POLYGON_CONTRACT) return 0;
        const decimals = await erc20Decimals(MYXN_POLYGON_CONTRACT);
        const raw = await erc20BalanceOf(MYXN_POLYGON_CONTRACT, acc.address!);
        return Number(formatUnits(raw, decimals));
      })(),
    ]);
    return { myxn, native: Number(maticBal.formatted) };
  }, []);

  const sendMYXNPolygon = useCallback(async (to: `0x${string}`, amount: string) => {
    if (!MYXN_POLYGON_CONTRACT) throw new Error("MYXN_POLYGON_CONTRACT not set");
    const decimals = await erc20Decimals(MYXN_POLYGON_CONTRACT);
    const value = parseUnits(amount, decimals);
    const { hash, receipt } = await erc20Transfer(MYXN_POLYGON_CONTRACT, to, value);
    return { hash, receipt };
  }, []);

  const getPolygonTransactionHistory = useCallback(async (address: string) => {
    return getPolygonTokenTxHistory(address, MYXN_POLYGON_CONTRACT ?? undefined);
  }, []);

  const getSuggestedGasPrice = useCallback(async () => {
    const gp = await getPolygonGasPrice();
    return gp; // bigint wei
  }, []);

  return {
    loading, error,
    connectPolygonWallet,
    getPolygonBalances,
    sendMYXNPolygon,
    getPolygonTransactionHistory,
    getSuggestedGasPrice,
  };
}
