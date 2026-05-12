import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight"
        >
          DescGen
          <span className="text-fuchsia-500">
            India
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
          <a href="#features">
            Features
          </a>

          <a href="/#pricing">
            Pricing
          </a>

          <a href="/#demo">
            Demo
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/auth/signin"
            className="text-sm text-gray-300 transition hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/auth/signup"
            className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-5 py-2 text-sm font-medium text-white transition hover:scale-[1.02]"
          >
            Start Free
          </Link>
        </div>
      </div>
    </header>
  );
}