import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SolanaWalletProvider } from "@/components/wallet/SolanaWalletProvider";
import { EVMWalletProvider } from "@/components/wallet/EVMWalletProvider";
import { Navigation } from "@/components/Navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MyXenPay Platform - Multi-Chain Payment & Token Ecosystem",
  description: "Universal payment QR system, token launch wizard, and merchant dashboard supporting Solana and EVM chains",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <EVMWalletProvider>
            <SolanaWalletProvider>
              <Navigation />
              <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {children}
              </main>
            </SolanaWalletProvider>
          </EVMWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
