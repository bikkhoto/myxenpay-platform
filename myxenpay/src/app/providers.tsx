"use client";

import { ReactNode, useMemo } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";
import { wagmiConfig } from "@/config/wagmi";

type ProvidersProps = { children: ReactNode };

export default function Providers({ children }: ProvidersProps) {
  // React Query Client
  const queryClient = useMemo(() => new QueryClient(), []);

  // Solana RPC from env with sensible fallback to Devnet
  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com";
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new LedgerWalletAdapter()],
    []
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectionProvider endpoint={endpoint} config={{ commitment: "confirmed" }}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
