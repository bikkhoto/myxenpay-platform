import { Keypair, PublicKey } from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  setAuthority,
  AuthorityType,
  getMint,
} from "@solana/spl-token";
import { getConnection } from "@/lib/solana-config";

export type CreateTokenResult = { mintAddress: string; transactionSignature: string };

// NOTE: These helpers require a signer (Keypair) that has SOL to pay fees.
// In a Next.js app, these are typically executed on a server or via an API route.
export async function createSPLToken(
  payer: Keypair,
  { decimals, supply }: { name: string; symbol: string; decimals: number; supply: number }
): Promise<CreateTokenResult> {
  const connection = getConnection();
  // 1) Create mint
  const mint = await createMint(connection, payer, payer.publicKey, payer.publicKey, decimals);
  // 2) Create ATA for payer and mint initial supply
  const ata = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer.publicKey);
  const units = BigInt(Math.floor(supply * 10 ** decimals));
  const sig = await mintTo(connection, payer, mint, ata.address, payer, units);
  // 3) (Optional) Create Metadata — Requires Metaplex Token Metadata program.
  // TODO: Integrate @metaplex-foundation/mpl-token-metadata to set name, symbol, uri.
  return { mintAddress: mint.toBase58(), transactionSignature: sig };
}

export async function mintTokens(
  payer: Keypair,
  { mintAddress, amount, destination }: { mintAddress: string; amount: number; destination: string }
) {
  const connection = getConnection();
  const mintPk = new PublicKey(mintAddress);
  const mintInfo = await getMint(connection, mintPk);
  const destPk = new PublicKey(destination);
  const ata = await getOrCreateAssociatedTokenAccount(connection, payer, mintPk, destPk);
  const units = BigInt(Math.floor(amount * 10 ** mintInfo.decimals));
  return mintTo(connection, payer, mintPk, ata.address, payer, units);
}

export async function setTokenAuthority(
  payer: Keypair,
  mintAddress: string,
  newAuthority: PublicKey | null,
  authorityType: AuthorityType = AuthorityType.MintTokens
) {
  const connection = getConnection();
  const mintPk = new PublicKey(mintAddress);
  return setAuthority(connection, payer, mintPk, payer.publicKey, authorityType, newAuthority);
}

export async function freezeToken(_payer: Keypair, _mintAddress: string) {
  void _payer;
  void _mintAddress;
  // Placeholder: requires freeze authority usage on token accounts.
  // Implement by calling freezeAccount on target token accounts as needed.
  throw new Error("freezeToken not implemented. Requires specific token accounts to freeze.");
}

export async function revokeMintAuthority(payer: Keypair, mintAddress: string) {
  return setTokenAuthority(payer, mintAddress, null, AuthorityType.MintTokens);
}

export async function verifyToken(mintAddress: string) {
  try {
    const connection = getConnection();
    const mintPk = new PublicKey(mintAddress);
    const mintInfo = await getMint(connection, mintPk);
    return !!mintInfo.supply;
  } catch {
    return false;
  }
}

export async function getTokenMetadata(mintAddress: string) {
  // Placeholder unless Metaplex metadata integration added.
  return { mintAddress, metadata: null } as const;
}
