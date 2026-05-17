"use client";

import {
  Sparkles,
  Wand2,
  CheckCircle2,
  ArrowRight,
  X,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm">
      <div className="flex min-h-screen items-start justify-center p-4 sm:items-center sm:p-6">
        <div className="relative my-6 w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#050505] shadow-2xl">
          
          {/* Glow */}
          <div className="absolute left-1/2 top-0 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="relative p-5 sm:p-8">
            
            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-300 sm:text-sm">
              <Sparkles className="h-4 w-4 text-fuchsia-400" />

              Welcome to DescGen India
            </div>

            {/* Heading */}
            <h1 className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
              Generate marketplace-ready product listings in seconds.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
              AI-powered listing generation
              optimized for Indian
              marketplaces and sellers.
            </p>

            {/* Features */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
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
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                  <p className="text-sm leading-6 text-gray-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* Pro Tip */}
            <div className="mt-8 rounded-3xl border border-fuchsia-500/10 bg-fuchsia-500/5 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500">
                  <Wand2 className="h-6 w-6 text-white" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Pro Tip
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-gray-400">
                    Configure your brand tone
                    and writing style in the
                    Settings page for more
                    personalized AI outputs.
                  </p>
                </div>
              </div>
            </div>

            {/* Sticky CTA */}
            <div className="sticky bottom-0 mt-8 bg-[#050505] pt-4">
              <button
                onClick={onClose}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-4 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
              >
                Start Generating

                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}