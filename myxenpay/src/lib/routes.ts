export const routes = {
  home: "/",
  about: "/about",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",

  // Core wallet & finance
  wallet: "/wallet",
  swap: "/swap",
  staking: "/staking",
  bridge: "/bridge",
  dashboard: "/dashboard",

  // Payments
  products: { qr: "/products/qr" },
  crossChainPayments: "/cross-chain-payments",
  currencyConverter: "/currency-converter",

  // Token platform
  token: {
    launch: "/token/launch",
    manage: "/token/manage",
    marketplace: "/token/marketplace",
    details: (mintAddress: string) => `/token/${mintAddress}`,
    commerce: (mintAddress: string) => `/token/${mintAddress}/commerce`,
    analytics: (mintAddress: string) => `/token/${mintAddress}/analytics`,
  },

  // Merchant platform
  merchants: "/merchants",
  merchant: {
    dashboard: "/merchant/dashboard",
    orders: "/merchant/orders",
    qr: "/merchant/qr-generator",
    payouts: "/merchant/payouts",
    settings: "/merchant/settings",
    tokens: "/merchant/tokens",
  },

  // Freelancer
  freelancer: {
    dashboard: "/freelancer/dashboard",
    escrow: "/freelancer/escrow",
    streaming: "/freelancer/streaming",
    profile: "/freelancer/profile",
  },

  // Vesting
  vesting: {
    home: "/vesting",
    create: "/vesting/create",
    details: (id: string) => `/vesting/${id}`,
  },

  // Admin
  admin: {
    dashboard: "/admin/dashboard",
    transactions: "/admin/transactions",
    merchants: "/admin/merchants",
    burn: "/admin/burn-management",
    users: "/admin/user-management",
    analytics: "/admin/analytics",
    fees: "/admin/fees",
  },

  // Developers
  developers: {
    home: "/developers",
    docs: "/developers/docs",
    apiKeys: "/developers/api-keys",
    sdks: "/developers/sdks",
    examples: "/developers/examples",
  },

  // University
  university: {
    home: "/university",
    verification: "/university/verification",
    partners: "/university/partners",
    cashback: "/university/cashback",
  },

  // Marketing
  marketing: {
    tokenomics: "/tokenomics",
    fairLaunch: "/fair-launch",
    burns: "/real-revenue-burns",
  },
} as const;

export type Routes = typeof routes;
