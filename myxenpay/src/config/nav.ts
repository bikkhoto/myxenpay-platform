import { routes } from "@/lib/routes";

export type NavItem = { href: string; label: string };

// Primary navigation items for the top Navbar
export const mainNav: NavItem[] = [
  { href: routes.home, label: "Home" },
  { href: routes.wallet, label: "Wallet" },
  { href: routes.swap, label: "Swap" },
  { href: routes.staking, label: "Staking" },
  { href: routes.products.qr, label: "QR" },
  { href: routes.token.marketplace, label: "Marketplace" },
  { href: routes.merchants, label: "Merchants" },
  { href: routes.developers.home, label: "Developers" },
];

// Example of grouped navigation configuration for sidebars/sitemaps
export const groupedNav = {
  core: [
    { href: routes.wallet, label: "Wallet" },
    { href: routes.swap, label: "Swap" },
    { href: routes.staking, label: "Staking" },
    { href: routes.bridge, label: "Bridge" },
    { href: routes.dashboard, label: "Dashboard" },
  ],
  payments: [
    { href: routes.products.qr, label: "QR Payments" },
    { href: routes.crossChainPayments, label: "Cross-Chain" },
    { href: routes.currencyConverter, label: "Currency Converter" },
  ],
  token: [
    { href: routes.token.launch, label: "Launch" },
    { href: routes.token.manage, label: "Manage" },
    { href: routes.token.marketplace, label: "Marketplace" },
  ],
  developers: [
    { href: routes.developers.docs, label: "Docs" },
    { href: routes.developers.sdks, label: "SDKs" },
    { href: routes.developers.examples, label: "Examples" },
    { href: routes.developers.apiKeys, label: "API Keys" },
  ],
  marketing: [
    { href: routes.marketing.tokenomics, label: "Tokenomics" },
    { href: routes.marketing.fairLaunch, label: "Fair Launch" },
    { href: routes.marketing.burns, label: "Real Revenue Burns" },
  ],
};
