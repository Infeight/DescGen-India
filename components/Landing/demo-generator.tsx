"use client";

import { useState } from "react";

import { motion } from "framer-motion";

const platforms = [
  "Meesho",
  "Amazon",
  "Flipkart",
  "Myntra",
  "Instagram",
];

const DEMO_OUTPUTS = {
  Meesho: {
    v1: `✨ Upgrade your ethnic wardrobe with this beautiful floral cotton kurti. Lightweight, breathable, and perfect for daily comfort with stylish elegance.`,

    v2: `✔ Soft breathable cotton
✔ Floral printed design
✔ Comfortable summer wear
✔ Lightweight daily fashion`,

    v3: `🌸 Soft Cotton Kurti | Floral Print | Summer Ready`,
  },

  Amazon: {
    v1: `Premium women's floral cotton kurti crafted with breathable fabric for all-day comfort. Perfect for casual outings, office wear, and summer styling.`,

    v2: `• Material: Soft Cotton
• Pattern: Floral Print
• Occasion: Casual & Daily Wear
• Lightweight breathable fabric`,

    v3: `Women's Floral Cotton Kurti | Soft Breathable Fabric`,
  },

  Flipkart: {
    v1: `Stay stylish and comfortable with this floral cotton kurti designed for modern everyday fashion. Ideal for summer wear and casual occasions.`,

    v2: `✔ Soft premium cotton
✔ Floral trendy design
✔ Comfortable fit
✔ Perfect for daily use`,

    v3: `Elegant Floral Kurti | Soft Cotton Daily Wear`,
  },

  Myntra: {
    v1: `A contemporary floral kurti designed with breathable cotton fabric for effortless elegance and all-day comfort.`,

    v2: `• Elegant floral aesthetics
• Soft-touch cotton
• Relaxed silhouette
• Summer-ready comfort`,

    v3: `Minimal Floral Cotton Kurti for Everyday Styling`,
  },

  Instagram: {
    v1: `✨ Your next favorite summer fit is here 🌸 Soft cotton comfort + dreamy floral vibes for effortless everyday styling 💖`,

    v2: `🌸 Floral aesthetic
☁ Super soft cotton
✨ Lightweight & comfy
💖 Everyday fashion essential`,

    v3: `Soft girl floral kurti 🌸✨`,
  },
};

export default function DemoGenerator() {
  const [platform, setPlatform] =
    useState("Meesho");

  const [loading, setLoading] =
    useState(false);

  const [generated, setGenerated] =
    useState(false);

  const handleGenerate = async () => {
    setGenerated(false);

    setLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 1800)
    );

    setLoading(false);

    setGenerated(true);
  };

  const currentOutput =
    DEMO_OUTPUTS[
      platform as keyof typeof DEMO_OUTPUTS
    ];

  return (
    <section
      id="demo"
      className="relative overflow-hidden py-24"
    >
      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Experience the AI Generator
          </h2>

          <p className="mt-5 text-lg text-gray-400">
            Marketplace-aware AI descriptions
            optimized for Indian sellers.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
          {/* Product Showcase */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Product Info */}
            <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <p className="text-sm text-gray-500">
                Demo Product
              </p>

              <h3 className="mt-3 text-3xl font-bold text-white">
                Women Floral Kurti
              </h3>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "Soft Cotton",
                  "Floral Print",
                  "Summer Wear",
                  "Breathable Fabric",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300"
                  >
                    {feature}
                  </div>
                ))}
              </div>

              {/* Platform Selector */}
              <div className="mt-10">
                <p className="mb-4 text-sm text-gray-500">
                  Select Platform
                </p>

                <div className="flex flex-wrap gap-3">
                  {platforms.map((item) => (
                    <button
                      key={item}
                      onClick={() =>
                        setPlatform(item)
                      }
                      className={`rounded-2xl px-5 py-3 text-sm font-medium transition-all ${
                        platform === item
                          ? "bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-lg shadow-fuchsia-500/20"
                          : "border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Button */}
              <div className="mt-10">
                <button
                  onClick={
                    handleGenerate
                  }
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-8 py-4 font-semibold text-white transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {loading
                    ? "Generating AI Outputs..."
                    : `Generate for ${platform}`}
                </button>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    AI Output Preview
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-white">
                    {platform}
                  </h3>
                </div>

                <div className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-4 py-2 text-sm text-fuchsia-300">
                  AI Optimized
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="mt-8 flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-28 animate-pulse rounded-2xl bg-white/5"
                    />
                  ))}
                </div>
              )}

              {/* Outputs */}
              {generated && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-8 flex flex-col gap-5"
                >
                  {/* V1 */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.1,
                    }}
                    className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-5"
                  >
                    <p className="mb-3 text-sm font-semibold text-fuchsia-400">
                      Emotional Style
                    </p>

                    <p className="text-sm leading-7 text-gray-300">
                      {
                        currentOutput.v1
                      }
                    </p>
                  </motion.div>

                  {/* V2 */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.2,
                    }}
                    className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5"
                  >
                    <p className="mb-3 text-sm font-semibold text-cyan-400">
                      Feature Focused
                    </p>

                    <p className="whitespace-pre-line text-sm leading-7 text-gray-300">
                      {
                        currentOutput.v2
                      }
                    </p>
                  </motion.div>

                  {/* V3 */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.3,
                    }}
                    className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5"
                  >
                    <p className="mb-3 text-sm font-semibold text-emerald-400">
                      Short & Punchy
                    </p>

                    <p className="text-sm leading-7 text-gray-300">
                      {
                        currentOutput.v3
                      }
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {!generated &&
                !loading && (
                  <div className="mt-16 flex h-[300px] items-center justify-center rounded-3xl border border-dashed border-white/10 text-center text-gray-500">
                    Select a platform and generate
                    AI descriptions.
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}