"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/wallet", label: "Wallet" },
  { href: "/swap", label: "Swap" },
  { href: "/staking", label: "Staking" },
  { href: "/products/qr", label: "QR" },
  { href: "/token/marketplace", label: "Marketplace" },
  { href: "/merchants", label: "Merchants" },
  { href: "/developers", label: "Developers" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur dark:bg-black/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="text-lg font-semibold">
          MyXenPay
        </Link>
        <nav className="-mx-2 hidden items-center gap-1 overflow-x-auto md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white",
                  active && "bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {/* Placeholder for future global actions (theme toggle, etc.) */}
        </div>
      </div>
    </header>
  );
}
