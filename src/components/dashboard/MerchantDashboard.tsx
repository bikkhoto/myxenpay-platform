'use client';

import React from 'react';
import { MerchantData } from '@/types';

// Mock data - in production this would come from an API
const mockMerchantData: MerchantData = {
  id: '1',
  name: 'Demo Merchant',
  walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  chainType: 'ethereum',
  totalTransactions: 1234,
  totalVolume: '45,678.90',
};

const mockTransactions = [
  { id: '1', amount: '150.00', currency: 'USDC', status: 'completed', date: '2025-10-26' },
  { id: '2', amount: '89.50', currency: 'ETH', status: 'completed', date: '2025-10-25' },
  { id: '3', amount: '250.00', currency: 'SOL', status: 'pending', date: '2025-10-24' },
  { id: '4', amount: '500.00', currency: 'USDT', status: 'completed', date: '2025-10-23' },
  { id: '5', amount: '75.25', currency: 'MATIC', status: 'failed', date: '2025-10-22' },
];

export const MerchantDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Merchant Dashboard
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Volume</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            ${mockMerchantData.totalVolume}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Transactions</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {mockMerchantData.totalTransactions}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Success Rate</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            98.5%
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Active Chain</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white uppercase">
            {mockMerchantData.chainType}
          </div>
        </div>
      </div>

      {/* Merchant Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Merchant Information
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Name:</span>
            <span className="font-medium text-gray-800 dark:text-white">
              {mockMerchantData.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Wallet Address:</span>
            <span className="font-mono text-sm text-gray-800 dark:text-white">
              {mockMerchantData.walletAddress}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Recent Transactions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  ID
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Currency
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="py-3 px-4 text-gray-800 dark:text-white">#{tx.id}</td>
                  <td className="py-3 px-4 text-gray-800 dark:text-white">{tx.amount}</td>
                  <td className="py-3 px-4 text-gray-800 dark:text-white">{tx.currency}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : tx.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
