import { http } from 'wagmi';
import { mainnet, polygon, bsc } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

export const wagmiConfig = getDefaultConfig({
  appName: 'MyXenPay Platform',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, bsc],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
  },
  ssr: true,
});

export const SUPPORTED_CHAINS = {
  ethereum: mainnet,
  polygon: polygon,
  bsc: bsc,
} as const;
