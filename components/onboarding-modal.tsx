"use client";

import {
  Sparkles,
  Wand2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface Props {
  open: boolean;

  onClose: () => void;
}

export default function OnboardingModal({
  open,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[36px] border border-white/10 bg-[#050505] p-8 shadow-2xl">
        {/* Glow */}
        <div className="absolute left-1/2 top-0 h-[240px] w-[240px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

        {/* Content */}
        <div className="relative">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
            <Sparkles className="h-4 w-4 text-fuchsia-400" />

            Welcome to DescGen India
          </div>

          {/* Heading */}
          <h1 className="max-w-xl text-4xl font-bold leading-tight text-white">
            Generate marketplace-ready product descriptions in seconds.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-gray-400">
            AI-powered listing generation
            optimized for Indian
            marketplaces and sellers.
          </p>

          {/* Features */}
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              "Amazon India optimized listings",
              "Meesho-friendly descriptions",
              "Flipkart SEO formatting",
              "Instagram product captions",
              "Bulk CSV generation",
              "Brand memory AI system",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" />

                <p className="text-sm leading-6 text-gray-300">
                  {item}
                </p>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="mt-8 rounded-3xl border border-fuchsia-500/10 bg-fuchsia-500/5 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500">
                <Wand2 className="h-6 w-6 text-white" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Pro Tip
                </h3>

                <p className="mt-2 text-sm leading-7 text-gray-400">
                  Configure your brand tone
                  and writing style in the
                  Settings page for much
                  more personalized AI
                  outputs.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-4 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
          >
            Start Generating

            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}