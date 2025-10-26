"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { mainNav } from "@/config/nav";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import dynamic from "next/dynamic";

const UniversalConnect = dynamic(() => import("@/components/wallet/UniversalConnect"), { ssr: false });

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const mounted = typeof window !== "undefined";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur dark:bg-black/80">
      <div className="site-container flex h-14 items-center gap-4">
        <Link href="/" className="text-lg font-semibold">
          MyXenPay
        </Link>
        <nav className="-mx-2 hidden items-center gap-1 overflow-x-auto md:flex">
          {mainNav.map((item) => {
            const active = isActive(item.href);
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
        <div className="ml-auto flex items-center gap-2 md:ml-auto">
          {/* Universal connect */}
          <UniversalConnect />
          {/* Theme toggle */}
          {mounted && (
            <button
              type="button"
              aria-label="Toggle theme"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
           >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}
        </div>
        <button
          className="ml-auto inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm md:hidden"
          aria-label="Toggle Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="border-b bg-white/95 py-2 dark:bg-black/95 md:hidden">
          <nav className="site-container flex flex-col">
            {mainNav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white",
                    active && "bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
