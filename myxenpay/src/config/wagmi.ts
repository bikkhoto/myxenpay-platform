import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
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
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
  connectors,
});

export type { Config } from "wagmi";
