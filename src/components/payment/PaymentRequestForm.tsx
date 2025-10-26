'use client';

import React, { useState } from 'react';
import { ChainType } from '@/types';
import { PaymentQR } from './PaymentQR';

export const PaymentRequestForm: React.FC = () => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [chainType, setChainType] = useState<ChainType>('ethereum');
  const [showQR, setShowQR] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (address) {
      setShowQR(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Generate Payment QR Code
      </h2>
      
      {!showQR ? (
        <form onSubmit={handleGenerate} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Blockchain Network
            </label>
            <select
              value={chainType}
              onChange={(e) => setChainType(e.target.value as ChainType)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="solana">Solana</option>
              <option value="ethereum">Ethereum</option>
              <option value="polygon">Polygon</option>
              <option value="bsc">BSC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter wallet address"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount (Optional)
            </label>
            <input
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate QR Code
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <PaymentQR
            address={address}
            amount={amount ? parseFloat(amount) : undefined}
            chainType={chainType}
          />
          <button
            onClick={() => setShowQR(false)}
            className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate New QR Code
          </button>
        </div>
      )}
    </div>
  );
};
