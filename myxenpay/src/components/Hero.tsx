"use client";

import ConnectEth from "./eth/ConnectEth";
import ConnectSolana from "./solana/ConnectSolana";

export default function Hero() {
  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-4xl font-bold">MyXenPay</h1>
        <p className="mt-2 text-gray-600">
          Connect your Ethereum or Solana wallet to get started.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ConnectEth />
          <ConnectSolana />
        </div>
      </div>
    </section>
  );
}
