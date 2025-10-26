export default function Footer() {
  return (
    <footer className="border-t bg-white/60 py-6 text-sm text-gray-600 backdrop-blur dark:bg-black/60 dark:text-gray-300">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p>&copy; {new Date().getFullYear()} MyXenPay. All rights reserved.</p>
        <nav className="flex flex-wrap items-center gap-3">
          <a href="/about" className="hover:underline">About</a>
          <a href="/contact" className="hover:underline">Contact</a>
          <a href="/developers" className="hover:underline">Developers</a>
        </nav>
      </div>
    </footer>
  );
}
