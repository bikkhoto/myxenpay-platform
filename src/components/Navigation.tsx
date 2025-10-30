'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { SolanaConnectButton } from './wallet/SolanaConnectButton';
import { EVMConnectButton } from './wallet/EVMConnectButton';

export const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Payment QR', href: '/payment' },
    { label: 'Token Launch', href: '/token-launch' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                MyXenPay
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex space-x-2">
              <SolanaConnectButton />
              <EVMConnectButton />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
