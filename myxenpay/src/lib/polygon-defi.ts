// Polygon DeFi helpers for MYXN
// Note: Many endpoints require deployed contract addresses and pair addresses.

export const QUICKSWAP_ROUTER_V2: `0x${string}` | null = (process.env.NEXT_PUBLIC_QUICKSWAP_ROUTER_V2 as `0x${string}`) || null;
export const QUICKSWAP_SUBGRAPH_URL = process.env.NEXT_PUBLIC_QUICKSWAP_SUBGRAPH_URL || ""; // Provide a subgraph URL via env.

// Utility to build bridge URLs (Polygon Bridge)
export function polygonBridgeUrl(tokenAddress?: string) {
  const base = "https://wallet.polygon.technology/bridge";
  return tokenAddress ? `${base}?token=${tokenAddress}` : base;
}

// Fetch MYXN/MATIC price via QuickSwap subgraph (requires pair address / query)
export async function getMyxnMaticPrice(pairAddress: `0x${string}`) {
  if (!QUICKSWAP_SUBGRAPH_URL) return null;
  const query = {
    query: `query Pair($id: ID!) { pair(id: $id) { token0Price token1Price reserve0 reserve1 } }`,
    variables: { id: pairAddress.toLowerCase() },
  };
  const res = await fetch(QUICKSWAP_SUBGRAPH_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(query),
  }).catch(() => null);
  if (!res) return null;
  const json = await res.json().catch(() => null);
  return json?.data?.pair ?? null;
}

export async function getMyxnLiquidity(pairAddress: `0x${string}`) {
  const data = await getMyxnMaticPrice(pairAddress);
  if (!data) return null;
  return { reserve0: Number(data.reserve0), reserve1: Number(data.reserve1) };
}
