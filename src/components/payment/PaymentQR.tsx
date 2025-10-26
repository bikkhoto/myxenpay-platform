'use client';

import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { ChainType } from '@/types';

interface PaymentQRProps {
  address: string;
  amount?: number;
  chainType: ChainType;
}

export const PaymentQR: React.FC<PaymentQRProps> = ({ address, amount, chainType }) => {
  const [copied, setCopied] = useState(false);

  const paymentData = JSON.stringify({
    address,
    amount,
    chainType,
    timestamp: Date.now(),
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="text-lg font-semibold text-gray-800 dark:text-white">
        Payment QR Code
      </div>
      <div className="p-4 bg-white rounded-lg">
        <QRCode value={paymentData} size={200} />
      </div>
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Chain:</span>
          <span className="font-medium text-gray-800 dark:text-white uppercase">{chainType}</span>
        </div>
        {amount && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Amount:</span>
            <span className="font-medium text-gray-800 dark:text-white">{amount}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Address:</span>
          <span className="font-mono text-xs text-gray-800 dark:text-white truncate max-w-[150px]">
            {address}
          </span>
        </div>
      </div>
      <button
        onClick={handleCopy}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        {copied ? 'Copied!' : 'Copy Address'}
      </button>
    </div>
  );
};
