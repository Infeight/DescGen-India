import Link from "next/link";

const plans = [
  {
    name: "Free",

    price: "₹0",

    credits: "10 Credits",

    description:
      "Perfect for trying the platform.",

    features: [
      "AI product descriptions",
      "3 output variants",
      "Marketplace optimization",
      "Basic analytics",
    ],

    highlight: false,
  },

  {
    name: "Starter",

    price: "₹99",

    credits: "100 Credits",

    description:
      "For growing sellers and creators.",

    features: [
      "Everything in Free",
      "Bulk CSV generation",
      "Brand personalization",
      "Advanced analytics",
    ],

    highlight: false,
  },

  {
    name: "Pro",

    price: "₹399",

    credits: "500 Credits",

    description:
      "Best for serious marketplace sellers.",

    features: [
      "Everything in Starter",
      "Priority AI generation",
      "Faster bulk workflows",
      "Regenerate variants",
    ],

    highlight: true,
  },

  {
    name: "Business",

    price: "Custom",

    credits: "Unlimited",

    description:
      "For teams, agencies, and scale.",

    features: [
      "Unlimited generations",
      "Priority support",
      "Custom workflows",
      "Future API access",
    ],

    highlight: false,
  },
];

export default function PricingPreview() {
  return (
    <section
      id="pricing"
      className="relative py-24"
    >
      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Simple pricing for every seller
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-400">
            Flexible credit-based pricing
            designed for Indian
            e-commerce workflows.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="mt-20 grid gap-6 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-8 transition duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? "border-fuchsia-500/40 bg-gradient-to-b from-fuchsia-500/10 to-cyan-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {/* Popular Badge */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-1 text-xs font-semibold text-white">
                  MOST POPULAR
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-white">
                {plan.name}
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm leading-7 text-gray-400">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mt-8">
                <span className="text-5xl font-bold text-white">
                  {plan.price}
                </span>

                {plan.price !==
                  "Custom" && (
                  <span className="ml-2 text-gray-400">
                    /month
                  </span>
                )}
              </div>

              {/* Credits */}
              <p className="mt-4 text-sm font-medium text-fuchsia-300">
                {plan.credits}
              </p>

              {/* Features */}
              <div className="mt-8 flex flex-col gap-4">
                {plan.features.map(
                  (feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-1 h-2 w-2 rounded-full bg-fuchsia-400" />

                      <p className="text-sm text-gray-300">
                        {feature}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* CTA */}
              <Link
                href="/signup"
                className={`mt-10 flex items-center justify-center rounded-2xl px-5 py-4 text-sm font-semibold transition ${
                  plan.highlight
                    ? "bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white hover:scale-[1.02]"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}