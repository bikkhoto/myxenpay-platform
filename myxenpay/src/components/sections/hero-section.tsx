"use client";

import Link from "next/link";
import { MYXN_TOKEN_DISPLAY, TOKEN_DISPLAY_NAME } from "@/config/token";
import { useCallback, useState } from "react";
import { routes } from "@/lib/routes";

export default function HeroSection() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://myxenpay.finance";

  const openPopup = (url: string) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  const onShareTwitter = () => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(
      "🚀 MyxenPay - Global Crypto Payments Platform! \n\n💳 VISA Virtual Cards | 🌍 QR Payments Worldwide | 🎓 Student Rewards \n\nBuilt on @Solana #DeFi #CryptoPayments #Web3 #Solana #MyxenPay"
    );
    openPopup(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
  };

  const onShareTelegram = () => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(
      "🚀 MyxenPay - Global Crypto Payments Platform\n💳 VISA Virtual Cards | 🌍 QR Payments Worldwide | 🎓 Student Rewards\nBuilt on Solana #DeFi #CryptoPayments"
    );
    openPopup(`https://t.me/share/url?url=${url}&text=${text}`);
  };

  const onShareWhatsApp = () => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(
      "Check out MyxenPay - Global Crypto Payments Platform with VISA virtual cards, QR payments worldwide, and student rewards on Solana!"
    );
    openPopup(`https://wa.me/?text=${text}%20${url}`);
  };

  const onShareLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    const title = encodeURIComponent("MyxenPay - Global Crypto Payments Platform");
    const summary = encodeURIComponent(
      "Non-custodial DeFi platform with VISA virtual cards, QR payments worldwide, student rewards, and streaming payroll — all on Solana."
    );
    openPopup(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`);
  };

  const onShareFacebook = () => {
    const url = encodeURIComponent(shareUrl);
    openPopup(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
  };

  const onShareReddit = () => {
    const url = encodeURIComponent(shareUrl);
    const title = encodeURIComponent("MyxenPay - Global Crypto Payments Platform on Solana");
    openPopup(`https://reddit.com/submit?url=${url}&title=${title}`);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link copied to clipboard!");
    } catch {
      showToast("Failed to copy link");
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 pb-16 pt-24 text-center md:pt-28">
      {/* Optional subtle radial fade background to mirror PHP */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0)_30%)]" />

      <div className="mx-auto max-w-3xl">
  <h1 className="mb-4 bg-linear-to-br from-blue-500 to-amber-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">
          Global Crypto Payments Made Simple
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-700 opacity-80 dark:text-gray-300 md:text-xl">
          Accept payments anywhere in the world with QR codes, VISA virtual cards, and instant settlements — powered by {TOKEN_DISPLAY_NAME} on Solana.
        </p>

        {/* Social share buttons (glass morphism) */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <span className="w-full text-center text-sm font-semibold text-blue-600 dark:text-blue-400">Share MyxenPay</span>
          <button
            aria-label="Share on Twitter"
            onClick={onShareTwitter}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/20 text-xl text-gray-900 backdrop-blur-lg transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/10 dark:text-white"
          >
            🐦
          </button>
          <button
            aria-label="Share on Telegram"
            onClick={onShareTelegram}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/20 text-xl text-gray-900 backdrop-blur-lg transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/10 dark:text-white"
          >
            📢
          </button>
          <button
            aria-label="Share on WhatsApp"
            onClick={onShareWhatsApp}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/20 text-xl text-gray-900 backdrop-blur-lg transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/10 dark:text-white"
          >
            💬
          </button>
          <button
            aria-label="Share on LinkedIn"
            onClick={onShareLinkedIn}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/20 text-xl text-gray-900 backdrop-blur-lg transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/10 dark:text-white"
          >
            💼
          </button>
          <button
            aria-label="Share on Facebook"
            onClick={onShareFacebook}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/20 text-xl text-gray-900 backdrop-blur-lg transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/10 dark:text-white"
          >
            📘
          </button>
          <button
            aria-label="Share on Reddit"
            onClick={onShareReddit}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/20 text-xl text-gray-900 backdrop-blur-lg transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/10 dark:text-white"
          >
            🤖
          </button>
          <button
            aria-label="Copy link"
            onClick={onCopy}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/20 text-xl text-gray-900 backdrop-blur-lg transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/10 dark:text-white"
          >
            🔗
          </button>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={routes.contact}
            className="btn btn-primary inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg"
          >
            Join Waitlist
          </Link>
          <Link
            href={routes.developers.home}
            className="btn btn-secondary inline-flex items-center gap-2 rounded-xl border-2 border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white"
          >
            View {MYXN_TOKEN_DISPLAY} Demo
          </Link>
        </div>
      </div>

      {/* Share toast */}
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
    </section>
  );
}
