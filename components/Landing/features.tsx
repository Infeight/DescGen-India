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
      className="relative overflow-hidden py-16 sm:py-24"
    >
      {/* Glow */}
      <div className="absolute right-0 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl sm:h-[400px] sm:w-[400px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Built for modern Indian sellers
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-400 sm:mt-6 sm:text-lg sm:leading-8">
            Everything you need to generate
            high-converting marketplace
            descriptions with AI.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {features.map(
            (feature, index) => (
              <div
                key={index}
                className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-500/30 hover:bg-white/[0.07] sm:p-6"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 text-xl sm:h-14 sm:w-14 sm:text-2xl">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="mt-5 text-lg font-semibold text-white sm:mt-6 sm:text-xl">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-6 text-gray-400 sm:mt-4 sm:leading-7">
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