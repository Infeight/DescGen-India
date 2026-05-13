import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-28">
      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/20 blur-3xl sm:h-[500px] sm:w-[500px]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center rounded-[32px] border border-white/10 bg-white/5 px-5 py-14 text-center backdrop-blur-2xl sm:rounded-[40px] sm:px-8 sm:py-20">
          {/* Heading */}
          <h2 className="max-w-4xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
            Scale your e-commerce listings with{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              AI-powered descriptions
            </span>
          </h2>

          {/* Subtext */}
          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:mt-8 sm:text-lg sm:leading-8">
            Save time, improve conversions, and generate
            marketplace-ready product descriptions built
            specifically for Indian sellers.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex w-full max-w-sm flex-col gap-4 sm:mt-12 sm:max-w-none sm:flex-row">
            <Link
              href="/auth/signup"
              className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-8 py-4 text-center font-semibold text-white transition hover:scale-[1.02]"
            >
              Start Free
            </Link>

            <Link
              href="/pricing"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-center font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
            >
              View Pricing
            </Link>
          </div>

          {/* Mini Stats */}
          <div className="mt-12 grid w-full gap-6 text-center sm:mt-16 sm:gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                AI
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Marketplace optimized
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                Bulk
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                CSV generation workflows
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                Smart
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Personalized AI outputs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}