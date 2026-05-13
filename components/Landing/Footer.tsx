import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black">
      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-[250px] w-[250px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 py-14 sm:px-6 lg:flex-row lg:justify-between lg:gap-20">
        {/* Brand */}
        <div className="max-w-md">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-white"
          >
            DescGen
            <span className="text-fuchsia-500">
              India
            </span>
          </Link>

          <p className="mt-5 text-sm leading-7 text-gray-400">
            AI-powered product description generator
            built specifically for Indian marketplace
            sellers, creators, and e-commerce brands.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
              AI Powered
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
              Made in India 🇮🇳
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Product
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-gray-400">
              <a
                href="#features"
                className="transition hover:text-white"
              >
                Features
              </a>

              <a
                href="#pricing"
                className="transition hover:text-white"
              >
                Pricing
              </a>

              <a
                href="#demo"
                className="transition hover:text-white"
              >
                Demo
              </a>

              <Link
                href="/dashboard/generate"
                className="transition hover:text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-gray-400">
              <a
                href="mailto:tarundandugula1@gmail.com"
                className="transition hover:text-white"
              >
                Contact
              </a>

              <a
                href="https://descgen.shop"
                className="transition hover:text-white"
              >
                Website
              </a>

              <Link
                href="/auth/signup"
                className="transition hover:text-white"
              >
                Start Free
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-gray-400">
              <Link
                href="/privacy"
                className="transition hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-white"
              >
                Terms of Service
              </Link>

              <Link
                href="/pricing"
                className="transition hover:text-white"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-center text-sm text-gray-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <p>
            © 2026 DescGen India. All rights reserved.
          </p>

          <p>
            Built with AI for modern Indian sellers.
          </p>
        </div>
      </div>
    </footer>
  );
}