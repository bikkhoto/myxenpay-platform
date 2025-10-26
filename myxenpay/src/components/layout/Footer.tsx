"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import { useCallback, useState } from "react";

export default function Footer() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://myxenpay.finance";
  const openPopup = (url: string) => window.open(url, "_blank", "width=600,height=400");

  const share = {
    twitter: () => {
      const url = encodeURIComponent(shareUrl);
      const text = encodeURIComponent(
        "🚀 MyxenPay - Global Crypto Payments Platform! \n\n💳 VISA Virtual Cards | 🌍 QR Payments Worldwide | 🎓 Student Rewards \n\nBuilt on @Solana #DeFi #CryptoPayments #Web3 #Solana #MyxenPay"
      );
      openPopup(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
    },
    telegram: () => {
      const url = encodeURIComponent(shareUrl);
      const text = encodeURIComponent(
        "🚀 MyxenPay - Global Crypto Payments Platform\n💳 VISA Virtual Cards | 🌍 QR Payments Worldwide | 🎓 Student Rewards\nBuilt on Solana #DeFi #CryptoPayments"
      );
      openPopup(`https://t.me/share/url?url=${url}&text=${text}`);
    },
    whatsapp: () => {
      const url = encodeURIComponent(shareUrl);
      const text = encodeURIComponent(
        "Check out MyxenPay - Global Crypto Payments Platform with VISA virtual cards, QR payments worldwide, and student rewards on Solana!"
      );
      openPopup(`https://wa.me/?text=${text}%20${url}`);
    },
    linkedin: () => {
      const url = encodeURIComponent(shareUrl);
      const title = encodeURIComponent("MyxenPay - Global Crypto Payments Platform");
      const summary = encodeURIComponent(
        "Non-custodial DeFi platform with VISA virtual cards, QR payments worldwide, student rewards, and streaming payroll — all on Solana."
      );
      openPopup(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`);
    },
    facebook: () => {
      const url = encodeURIComponent(shareUrl);
      openPopup(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
    },
    copy: async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast("Link copied to clipboard!");
      } catch {
        showToast("Failed to copy link");
      }
    },
  } as const;

  return (
    <footer className="border-t border-white/10 bg-white/10 text-sm text-gray-700 backdrop-blur-md dark:border-white/5 dark:bg-black/20 dark:text-gray-300">
      <div className="site-container py-10">
        {/* Top: brand + badges + social */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">MyXenPay</h3>
            <p className="mt-2 max-w-xl text-gray-600 dark:text-gray-400">
              Secure Crypto Payment Gateway for the Future of Finance. Accept instant payments with developer-friendly APIs,
              on-chain transparency, and enterprise-grade security.
            </p>

            {/* Company Registration */}
            <div className="mt-4 rounded-xl border border-white/20 bg-white/20 p-3 text-sm text-gray-800 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-gray-200">
              🏢 <strong>UK Registered Company</strong>
              <br />Registration Number: Pending
            </div>

            {/* Social share */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button onClick={share.twitter} aria-label="Share on Twitter" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/20 text-lg backdrop-blur transition hover:-translate-y-0.5 hover:shadow dark:border-white/10 dark:bg-white/10">🐦</button>
              <button onClick={share.telegram} aria-label="Share on Telegram" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/20 text-lg backdrop-blur transition hover:-translate-y-0.5 hover:shadow dark:border-white/10 dark:bg-white/10">📢</button>
              <button onClick={share.whatsapp} aria-label="Share on WhatsApp" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/20 text-lg backdrop-blur transition hover:-translate-y-0.5 hover:shadow dark:border-white/10 dark:bg-white/10">💬</button>
              <button onClick={share.linkedin} aria-label="Share on LinkedIn" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/20 text-lg backdrop-blur transition hover:-translate-y-0.5 hover:shadow dark:border-white/10 dark:bg-white/10">💼</button>
              <button onClick={share.facebook} aria-label="Share on Facebook" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/20 text-lg backdrop-blur transition hover:-translate-y-0.5 hover:shadow dark:border-white/10 dark:bg-white/10">📘</button>
              <button onClick={share.copy} aria-label="Copy link" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/20 text-lg backdrop-blur transition hover:-translate-y-0.5 hover:shadow dark:border-white/10 dark:bg-white/10">🔗</button>
            </div>
          </div>

          {/* Verified Badges */}
          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: "#9945FF" }}>✅ Verified by Solana</span>
              <span className="rounded-full px-3 py-1 text-xs font-semibold text-white bg-linear-to-r from-[#9945FF] to-[#14F195]">⚡ Solana Pay Verified</span>
              <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: "#059669" }}>🔒 GDPR Compliant</span>
              <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: "#00d664" }}>🔐 SSL Secured</span>
              <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: "#1a1f71" }}>💳 VISA Verified</span>
              <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: "#dc2626" }}>�️ Secure Payment</span>
            </div>
          </div>
        </div>

        {/* Links grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 border-t border-white/10 pt-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Product</h4>
            <ul className="space-y-2">
              <li><Link href={routes.merchants} className="opacity-80 transition hover:opacity-100">For Businesses</Link></li>
              <li><Link href={routes.developers.home} className="opacity-80 transition hover:opacity-100">Developers</Link></li>
              <li><Link href={routes.marketing.tokenomics} className="opacity-80 transition hover:opacity-100">Tokenomics</Link></li>
              <li><Link href={routes.university.cashback} className="opacity-80 transition hover:opacity-100">Student Rewards</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Resources</h4>
            <ul className="space-y-2">
              <li><Link href={routes.developers.docs} className="opacity-80 transition hover:opacity-100">Whitepaper</Link></li>
              <li><Link href={routes.developers.docs} className="opacity-80 transition hover:opacity-100">Documentation</Link></li>
              <li><Link href={routes.developers.docs} className="opacity-80 transition hover:opacity-100">FAQ</Link></li>
              <li><Link href={routes.contact} className="opacity-80 transition hover:opacity-100">Help Center</Link></li>
              <li><Link href={routes.developers.home} className="opacity-80 transition hover:opacity-100">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Company</h4>
            <ul className="space-y-2">
              <li><Link href={routes.about} className="opacity-80 transition hover:opacity-100">About Us</Link></li>
              <li><Link href={routes.contact} className="opacity-80 transition hover:opacity-100">Contact</Link></li>
              <li><Link href={routes.privacy} className="opacity-80 transition hover:opacity-100">Privacy Policy</Link></li>
              <li><Link href={routes.terms} className="opacity-80 transition hover:opacity-100">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Connect</h4>
            <ul className="space-y-2">
              <li><a href="https://x.com/myxenpay" target="_blank" rel="noreferrer" className="opacity-80 transition hover:opacity-100">Twitter / X</a></li>
              <li><a href="https://t.me/myxenpay" target="_blank" rel="noreferrer" className="opacity-80 transition hover:opacity-100">Telegram</a></li>
              <li><a href="https://github.com/bikkhoto/myxenpay.finance" target="_blank" rel="noreferrer" className="opacity-80 transition hover:opacity-100">GitHub</a></li>
            </ul>
            <div className="mt-3 rounded-lg border border-white/20 bg-white/20 p-3 text-xs backdrop-blur dark:border-white/10 dark:bg-white/10">
              🚀 <strong>Launching Soon:</strong> Join our waitlist for early access
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-gray-600 dark:text-gray-400">
          © 2025 MyXenPay LTD. All rights reserved. Making crypto payments accessible for everyone.
        </div>
      </div>

      {/* Share Toast */}
      <div
        className={
          "pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transform rounded-xl bg-green-400 px-4 py-2 font-semibold text-black shadow transition-all " +
          (toast ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0")
        }
        role="status"
        aria-live="polite"
      >
        {toast || ""}
      </div>
    </footer>
  );
}
