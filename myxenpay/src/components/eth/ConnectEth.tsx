"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectEth() {
  const { isConnected, address } = useAccount();
  const { connect, connectors, status } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">{address}</span>
        <button
          className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800"
          onClick={() => disconnect()}
        >
          Disconnect ETH
        </button>
      </div>
    );
  }

  const first = connectors[0];
  const onConnect = () => {
    if (first) connect({ connector: first });
  };

  return (
    <button
      className="rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-60"
      onClick={onConnect}
      disabled={status === "pending" || !first}
    >
      {status === "pending" ? "Connecting…" : "Connect ETH"}
    </button>
  );
}
