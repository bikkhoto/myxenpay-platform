import Link from "next/link";
import { routes } from "@/lib/routes";

export default function Footer() {
  return (
    <footer className="border-t bg-white/60 py-6 text-sm text-gray-600 backdrop-blur dark:bg-black/60 dark:text-gray-300">
      <div className="site-container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p>&copy; {new Date().getFullYear()} MyXenPay. All rights reserved.</p>
        <nav className="flex flex-wrap items-center gap-3">
          <Link href={routes.about} className="hover:underline">About</Link>
          <Link href={routes.contact} className="hover:underline">Contact</Link>
          <Link href={routes.developers.home} className="hover:underline">Developers</Link>
        </nav>
      </div>
    </footer>
  );
}
