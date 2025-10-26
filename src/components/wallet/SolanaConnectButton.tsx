'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const SolanaConnectButton = () => {
  return (
    <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-lg !px-4 !py-2" />
  );
};
