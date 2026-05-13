import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 sm:pb-24 sm:pt-28">
        {/* Badge */}
        <div className="mb-6 rounded-full border border-fuchsia-500/20 bg-white/5 px-4 py-2 text-xs text-fuchsia-300 backdrop-blur-xl sm:px-5 sm:text-sm">
          AI-powered descriptions for Indian marketplaces
        </div>

        {/* Heading */}
        <h1 className="max-w-5xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-7xl">
          Generate high-converting{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            e-commerce product descriptions
          </span>{" "}
          in seconds.
        </h1>

        {/* Subheading */}
        <p className="mt-6 max-w-3xl text-base leading-7 text-gray-400 sm:mt-8 sm:text-lg md:text-xl">
          Create marketplace-optimized AI descriptions for
          Meesho, Amazon, Flipkart, Myntra, and Instagram
          Shops with personalization, bulk generation, and
          brand-aware AI.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex w-full max-w-screen-sm flex-col gap-4 sm:mt-10 sm:flex-row">
          <Link
            href="/auth/signup"
            className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-8 py-4 font-semibold text-white transition hover:scale-[1.02]"
          >
            Start Generating Free
          </Link>

          <a
            href="/#demo"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
          >
            Try Live Demo
          </a>
        </div>

        {/* Marketplace Logos */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500 sm:mt-20 sm:gap-6 sm:text-sm">
          <span className="rounded-full border border-white/10 px-4 py-2 sm:px-5">
            Meesho
          </span>

          <span className="rounded-full border border-white/10 px-4 py-2 sm:px-5">
            Amazon India
          </span>

          <span className="rounded-full border border-white/10 px-4 py-2 sm:px-5">
            Flipkart
          </span>

          <span className="rounded-full border border-white/10 px-4 py-2 sm:px-5">
            Myntra
          </span>

          <span className="rounded-full border border-white/10 px-4 py-2 sm:px-5">
            Instagram Shops
          </span>
        </div>

        {/* Dashboard Preview */}
        <div className="relative mt-14 w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-xl sm:mt-20 sm:p-4">
          {/* Fake Dashboard Header */}
          <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
            <div className="h-3 w-3 rounded-full bg-red-500" />

            <div className="h-3 w-3 rounded-full bg-yellow-500" />

            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>

          {/* Dashboard Content */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Left Panel */}
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left sm:p-5">
              <p className="text-sm text-gray-400">
                Product
              </p>

              <h3 className="mt-2 text-lg font-semibold text-white">
                Women Floral Kurti
              </h3>

              <div className="mt-6 flex flex-col gap-3">
                <div className="rounded-xl bg-white/5 p-3 text-sm text-gray-400">
                  Soft cotton
                </div>

                <div className="rounded-xl bg-white/5 p-3 text-sm text-gray-400">
                  Floral print
                </div>

                <div className="rounded-xl bg-white/5 p-3 text-sm text-gray-400">
                  Summer wear
                </div>
              </div>
            </div>

            {/* Center AI */}
            <div className="flex items-center justify-center rounded-2xl border border-fuchsia-500/20 bg-gradient-to-b from-fuchsia-500/10 to-cyan-500/10 p-4 sm:p-5">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-2xl sm:h-20 sm:w-20 sm:text-3xl">
                  ✨
                </div>

                <p className="mt-5 text-lg font-semibold text-white">
                  AI Processing
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  Marketplace optimized
                  generation
                </p>
              </div>
            </div>

            {/* Output */}
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left sm:p-5">
              <p className="text-sm text-gray-400">
                AI Output
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-4 text-sm text-gray-300">
                  ✨ Elegant floral kurti crafted for
                  comfort and effortless summer style.
                </div>

                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-gray-300">
                  ✔ Soft breathable cotton
                  <br />
                  ✔ Lightweight fit
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-gray-300">
                  🌸 Stylish summer essential
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}