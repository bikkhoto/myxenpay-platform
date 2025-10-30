// Centralized MYXN token identity and chain config
// Always use these constants to ensure consistent branding across the app.

export const TOKEN_DISPLAY_NAME = "$MYXN"; // Always with $ prefix
export const TOKEN_SYMBOL = "MYXN"; // Always uppercase
export const TOKEN_FULL_NAME = "MyXenPay Token"; // Full name for formal contexts

// Primary Solana SPL Mint for $MYXN
export const SOLANA_MYXN_MINT = "57oUbtUKNaQu8KActsPSNg61LFV7u4tTjHY1Ek4PVRyj";

// Supported chains metadata for frontend selection and labeling
export type SupportedChainKey = "solana" | "base" | "polygon" | "bsc";

export const SUPPORTED_CHAINS: Array<{
  key: SupportedChainKey;
  label: string;
  standard: "SPL Token" | "ERC-20" | "BEP-20";
  notes?: string;
}> = [
  { key: "solana", label: "Solana", standard: "SPL Token", notes: "High-speed, low-cost transactions" },
  { key: "base", label: "Base", standard: "ERC-20", notes: "Ethereum ecosystem integration" },
  { key: "polygon", label: "Polygon", standard: "ERC-20", notes: "Established DeFi ecosystem" },
  { key: "bsc", label: "BNB Smart Chain", standard: "BEP-20", notes: "Emerging markets, high-volume regions" },
];

// Branding helpers
export const MYXN_TOKEN_DISPLAY = `${TOKEN_DISPLAY_NAME} token`;
export const MYXN_TOKEN_CANONICAL = `${TOKEN_SYMBOL} token`;
