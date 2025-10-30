# MyXenPay Platform

A multi-chain payment and token creation ecosystem built with Next.js 14, TypeScript, and Tailwind CSS. Support for Solana and EVM-compatible blockchains (Ethereum, Polygon, BSC).

## Features

- 🔗 **Multi-Chain Wallet Integration**: Connect Solana (Phantom, Solflare) and EVM wallets (MetaMask, WalletConnect)
- 📱 **Universal Payment QR System**: Generate QR codes for payments across any supported blockchain
- 🚀 **Token Launch Wizard**: Launch your own token with an intuitive step-by-step wizard
- 📊 **Merchant Dashboard**: Track transactions, manage payments, and monitor your business
- 🌓 **Dark/Light Theme**: Beautiful themes that adapt to your system preference

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Solana Integration**: @solana/wallet-adapter, @solana/web3.js
- **EVM Integration**: Wagmi, RainbowKit, Viem
- **Theme**: next-themes
- **QR Generation**: react-qr-code

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bikkhoto/myxenpay-platform.git
cd myxenpay-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
   - Get a WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Set your preferred Solana network (devnet, testnet, or mainnet-beta)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
myxenpay-platform/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── dashboard/         # Merchant dashboard page
│   │   ├── payment/           # Payment QR generation page
│   │   ├── token-launch/      # Token launch wizard page
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── dashboard/         # Dashboard components
│   │   ├── payment/           # Payment components
│   │   ├── token/             # Token launch components
│   │   ├── wallet/            # Wallet connection components
│   │   ├── Navigation.tsx     # Main navigation
│   │   ├── ThemeProvider.tsx  # Theme provider
│   │   └── ThemeToggle.tsx    # Theme toggle button
│   ├── lib/
│   │   └── config/            # Configuration files
│   └── types/                 # TypeScript type definitions
├── public/                     # Static assets
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Supported Chains

### Solana
- Devnet
- Testnet
- Mainnet Beta

### EVM
- Ethereum Mainnet
- Polygon
- Binance Smart Chain (BSC)

## Features Overview

### 1. Multi-Chain Wallet Support
Connect wallets from both Solana and EVM ecosystems:
- **Solana**: Phantom, Solflare, Torus
- **EVM**: MetaMask, WalletConnect, Rainbow, and more via RainbowKit

### 2. Universal Payment QR
Generate payment QR codes with:
- Customizable recipient address
- Optional amount specification
- Multi-chain support
- Easy copy-to-clipboard functionality

### 3. Token Launch Wizard
Launch tokens through a simple 3-step process:
1. **Basic Information**: Name, symbol, and blockchain selection
2. **Token Economics**: Supply, decimals, and description
3. **Review & Launch**: Final verification before deployment

### 4. Merchant Dashboard
Monitor your crypto business with:
- Total transaction volume
- Transaction count and success rate
- Recent transaction history
- Multi-chain support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support, please open an issue in the GitHub repository.
