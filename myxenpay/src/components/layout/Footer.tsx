import Link from "next/link";
import { routes } from "@/lib/routes";

export default function Footer() {
  return (
    <footer className="border-t bg-white/60 py-8 text-sm text-gray-600 backdrop-blur dark:bg-black/60 dark:text-gray-300">
      <div className="site-container flex flex-col gap-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              Secure Crypto Payment Gateway for Solana and EVM
            </p>
            <p className="mt-1 max-w-2xl text-gray-600 dark:text-gray-400">
              Accept payments instantly with developer-friendly APIs, on-chain transparency, and enterprise-grade security.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              "SSL Secured",
              "Instant Settlements",
              "Verified by Solana",
              "Solana Pay Verified",
              "GDPR Compliant",
            ].map((label) => (
              <span
                key={label}
                className="rounded-full border px-3 py-1 text-xs text-gray-700 dark:text-gray-300"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 md:flex-row">
          <p className="text-gray-600 dark:text-gray-400">&copy; 2025 MyXenPay. All rights reserved.</p>
          <nav className="flex flex-wrap items-center gap-3">
            <Link href={routes.about} className="hover:underline">About</Link>
            <Link href={routes.contact} className="hover:underline">Contact</Link>
            <Link href={routes.developers.home} className="hover:underline">Developers</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
