import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-28">
      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center rounded-[40px] border border-white/10 bg-white/5 px-8 py-20 text-center backdrop-blur-2xl">
        {/* Heading */}
        <h2 className="max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
          Scale your e-commerce listings with{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            AI-powered descriptions
          </span>
        </h2>

        {/* Subtext */}
        <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-400">
          Save time, improve conversions, and generate
          marketplace-ready product descriptions built
          specifically for Indian sellers.
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/auth/signup"
            className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-8 py-4 font-semibold text-white transition hover:scale-[1.02]"
          >
            Start Free
          </Link>

          <Link
            href="/pricing"
            className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
          >
            View Pricing
          </Link>
        </div>

        {/* Mini Stats */}
        <div className="mt-16 grid gap-8 text-center md:grid-cols-3">
          <div>
            <h3 className="text-3xl font-bold text-white">
              AI
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Marketplace optimized
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-white">
              Bulk
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              CSV generation workflows
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-white">
              Smart
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Personalized AI outputs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}