"use client";

import dynamic from "next/dynamic";

// WalletMultiButton requires window; load it only on client
const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function ConnectSolana() {
  return <WalletMultiButton />;
}
