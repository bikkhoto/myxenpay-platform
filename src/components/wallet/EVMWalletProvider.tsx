'use client';

import React, { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from '@/lib/config/wagmi';

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

interface EVMWalletProviderProps {
  children: ReactNode;
}

export const EVMWalletProvider: React.FC<EVMWalletProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
