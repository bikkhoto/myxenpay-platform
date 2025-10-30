import { createConfig, http } from "wagmi";
import { polygon, base, bsc } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

// Prefer explicit, env-driven WalletConnect configuration
const wcProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const connectors = [
  injected(),
  // Only include WalletConnect if a projectId is provided to avoid runtime errors
  ...(wcProjectId
    ? [
        walletConnect({
          projectId: wcProjectId,
          // Let the connector render its default modal if needed
          showQrModal: true,
        }),
      ]
    : []),
];

export const wagmiConfig = createConfig({
  // Restrict to supported EVM networks per platform spec
  chains: [base, polygon, bsc],
  transports: {
    [base.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
  },
  connectors,
});

export type { Config } from "wagmi";
