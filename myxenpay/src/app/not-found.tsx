import Link from "next/link";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="site-container section text-center">
      <h1 className="mb-2 text-3xl font-semibold">Page not found</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href={routes.home} className="rounded-md border px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900">
          Home
        </Link>
        <Link href={routes.developers.home} className="rounded-md border px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900">
          Developers
        </Link>
        <Link href={routes.contact} className="rounded-md border px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900">
          Contact
        </Link>
      </div>
    </div>
  );
}
