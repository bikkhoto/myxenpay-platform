'use client';

import React, { useState } from 'react';
import { TokenConfig } from '@/types';

export const TokenLaunchWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [tokenConfig, setTokenConfig] = useState<Partial<TokenConfig>>({
    chainType: 'solana',
    decimals: 9,
  });

  const handleInputChange = (field: keyof TokenConfig, value: string | number) => {
    setTokenConfig({ ...tokenConfig, [field]: value });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleLaunch = () => {
    console.log('Launching token with config:', tokenConfig);
    alert('Token launch simulation - In production, this would deploy your token!');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Token Launch Wizard
      </h2>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                stepNum <= step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
              }`}
            >
              {stepNum}
            </div>
            {stepNum < 3 && (
              <div
                className={`w-full h-1 mx-2 ${
                  stepNum < step ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Basic Token Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Token Name
              </label>
              <input
                type="text"
                value={tokenConfig.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., MyXen Token"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Token Symbol
              </label>
              <input
                type="text"
                value={tokenConfig.symbol || ''}
                onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                placeholder="e.g., MXN"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blockchain Network
              </label>
              <select
                value={tokenConfig.chainType}
                onChange={(e) => handleInputChange('chainType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="solana">Solana</option>
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="bsc">Binance Smart Chain</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Token Economics */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Token Economics
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Supply
              </label>
              <input
                type="text"
                value={tokenConfig.totalSupply || ''}
                onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                placeholder="e.g., 1000000000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Decimals
              </label>
              <input
                type="number"
                value={tokenConfig.decimals || 9}
                onChange={(e) => handleInputChange('decimals', parseInt(e.target.value))}
                min="0"
                max="18"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Common values: 9 for Solana, 18 for EVM chains
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={tokenConfig.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your token..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Step 3: Review & Launch */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Review & Launch
            </h3>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {tokenConfig.name || 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Symbol:</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {tokenConfig.symbol || 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Network:</span>
                <span className="font-semibold text-gray-800 dark:text-white uppercase">
                  {tokenConfig.chainType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Supply:</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {tokenConfig.totalSupply || 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Decimals:</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {tokenConfig.decimals}
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ This is a demo. In production, launching a token will require connecting your wallet
                and paying gas fees. Always verify all details before launching.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={
                step === 1 && (!tokenConfig.name || !tokenConfig.symbol) ||
                step === 2 && !tokenConfig.totalSupply
              }
              className="ml-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleLaunch}
              className="ml-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Launch Token
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
