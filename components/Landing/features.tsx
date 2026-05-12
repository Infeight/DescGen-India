const features = [
  {
    title:
      "Marketplace Optimization",

    description:
      "Generate descriptions specifically optimized for Meesho, Amazon India, Flipkart, Myntra, and Instagram Shops.",

    icon: "🛍️",
  },

  {
    title:
      "Brand Tone Memory",

    description:
      "AI remembers your brand tone, audience, writing style, and CTA preferences automatically.",

    icon: "🧠",
  },

  {
    title:
      "Bulk CSV Generation",

    description:
      "Upload product data in bulk and generate marketplace-ready descriptions instantly.",

    icon: "📦",
  },

  {
    title:
      "Multi-Variant Outputs",

    description:
      "Generate emotional, feature-focused, and short punchy variations for every product.",

    icon: "✨",
  },

  {
    title:
      "Regenerate Variants",

    description:
      "Regenerate only the variant you want without wasting time regenerating everything.",

    icon: "🔄",
  },

  {
    title:
      "Analytics Dashboard",

    description:
      "Track generations, credits, payments, and platform activity with a modern analytics dashboard.",

    icon: "📊",
  },

  {
    title:
      "Credits & Billing",

    description:
      "Flexible SaaS pricing with secure Razorpay payments, plans, and credit-based AI usage.",

    icon: "💳",
  },

  {
    title:
      "AI-Powered Personalization",

    description:
      "Every output adapts to your business style and target audience for consistent branding.",

    icon: "🚀",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative py-24"
    >
      {/* Glow */}
      <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Built for modern Indian sellers
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-400">
            Everything you need to generate
            high-converting marketplace
            descriptions with AI.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(
            (feature, index) => (
              <div
                key={index}
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-500/30 hover:bg-white/[0.07]"
              >
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 text-2xl">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="mt-6 text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-sm leading-7 text-gray-400">
                  {feature.description}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}