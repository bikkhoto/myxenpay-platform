import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          MyXenPay Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Multi-Chain Payment & Token Creation Ecosystem
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-500 max-w-3xl mx-auto">
          Accept payments and launch tokens across Solana, Ethereum, Polygon, and BSC.
          All in one unified platform.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {/* Multi-Chain Wallets */}
        <Link href="/payment" className="group">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow h-full">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              Multi-Chain Wallets
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect Solana (Phantom, Solflare) and EVM wallets (MetaMask, WalletConnect) seamlessly.
            </p>
          </div>
        </Link>

        {/* Universal Payment QR */}
        <Link href="/payment" className="group">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow h-full">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              Universal Payment QR
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Generate QR codes for payments across any supported blockchain network.
            </p>
          </div>
        </Link>

        {/* Token Launch Wizard */}
        <Link href="/token-launch" className="group">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow h-full">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              Token Launch Wizard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Launch your own token in minutes with our step-by-step wizard.
            </p>
          </div>
        </Link>

        {/* Merchant Dashboard */}
        <Link href="/dashboard" className="group">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow h-full">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              Merchant Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track transactions, manage payments, and monitor your crypto business.
            </p>
          </div>
        </Link>

        {/* Dark/Light Theme */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg h-full">
          <div className="text-4xl mb-4">🌓</div>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
            Theme Support
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Beautiful light and dark themes that adapt to your preference automatically.
          </p>
        </div>

        {/* Multi-Network Support */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg h-full">
          <div className="text-4xl mb-4">⛓️</div>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
            Multi-Network
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Support for Solana, Ethereum, Polygon, and Binance Smart Chain networks.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-lg mb-8 opacity-90">
          Connect your wallet and start accepting payments or launching tokens today.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/payment"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Create Payment QR
          </Link>
          <Link
            href="/token-launch"
            className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            Launch a Token
          </Link>
        </div>
      </div>
    </div>
  );
}
