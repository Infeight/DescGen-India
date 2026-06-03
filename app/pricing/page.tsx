"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  Sparkles,
  Check,
  Crown,
  Rocket,
  Building2,
} from "lucide-react";

const PLANS = [
  {
    id: "free",

    name: "Free",

    price: 0,

    credits: 10,

    icon: Sparkles,

    description:
      "Perfect for trying AI-powered product descriptions.",

    features: [
      "10 descriptions/month",
      "3 platforms",
      "English only",
      "Basic AI outputs",
    ],

    cta: "Get Started",
  },

  {
    id: "starter",

    name: "Starter",

    price: 99,

    credits: 100,

    icon: Rocket,

    razorpayAmount: 99,

    description:
      "Ideal for growing sellers scaling their listings.",

    features: [
      "100 descriptions/month",
      "All 5 platforms",
      "English + Hindi",
      "Advanced AI prompts",
      "Priority generation",
    ],

    cta:
      "Upgrade to Starter",
  },

  {
    id: "pro",

    name: "Pro",

    price: 399,

    credits: 500,

    icon: Crown,

    razorpayAmount: 399,

    popular: true,

    description:
      "Best for serious e-commerce businesses and agencies.",

    features: [
      "500 descriptions/month",
      "Bulk CSV upload",
      "Brand tone memory",
      "Marketplace overrides",
      "Analytics dashboard",
      "Premium AI quality",
    ],

    cta: "Upgrade to Pro",
  },

  {
    id: "business",

    name: "Business",

    price: 999,

    credits: -1,

    icon: Building2,

    razorpayAmount: 999,

    description:
      "Built for high-volume AI commerce operations.",

    features: [
      "Unlimited descriptions",
      "Priority support",
      "API access",
      "Advanced scalability",
      "Unlimited bulk processing",
      "Future enterprise features",
    ],

    cta:
      "Upgrade to Business",
  },
];

export default function PricingPage() {
  const router = useRouter();

  const [paying, setPaying] =
    useState("");

  async function handleUpgrade(
    plan:
      (typeof PLANS)[0]
  ) {
    if (plan.price === 0) {
      router.push(
        "/auth/signup"
      );

      return;
    }

    try {
      setPaying(plan.id);

      const response =
        await fetch(
          "/api/payments/create-order",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              plan: plan.id,

              amount:
                plan.razorpayAmount,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Failed to create order"
        );

        return;
      }

      const rzp =
        new (
          window as any
        ).Razorpay({
          key:
            process.env
              .NEXT_PUBLIC_RAZORPAY_KEY_ID,

          order_id:
            data.orderId,

          amount:
            plan.razorpayAmount! *
            100,

          currency:
            "INR",

          name:
            "DescGen India",

          description: `${plan.name} Plan`,

          handler:
            function () {
              router.push(
                "/dashboard/generate?upgraded=true"
              );
            },
        });

      rzp.open();

    } catch (error) {
      console.error(
        error
      );

      alert(
        "Payment initialization failed"
      );

    } finally {
      setPaying("");
    }
  }

  return (
    <div className="relative overflow-hidden bg-black px-6 py-20">
      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Hero */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-fuchsia-400" />

            AI Commerce Pricing
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
            Scale Your Product
            Listings with AI
          </h1>

          <div className="mt-6 inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
  🚀 Public Beta • Payments are temporarily unavailable while we complete payment provider onboarding.
</div>

          {/* <p className="mt-6 text-lg leading-8 text-gray-400">
            Generate marketplace-ready
            product descriptions for
            Meesho, Amazon India,
            Flipkart, Myntra, and
            Instagram Shops.
          </p> */}

          <p className="mt-6 text-lg leading-8 text-gray-400">
  Every new account currently receives
  <span className="font-semibold text-white">
    {" "}10 free credits{" "}
  </span>
  during our public beta.
  Payments will be enabled soon.
</p>
        </div>

        {/* Pricing Grid */}
        <div className="grid gap-8 lg:grid-cols-4">
          {PLANS.map(
            (plan) => {
              const Icon =
                plan.icon;

              const isPopular =
                plan.popular;

              return (
                <div
                  key={
                    plan.id
                  }
                  className={`relative flex flex-col rounded-[32px] border p-7 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 ${
                    isPopular
                      ? "border-fuchsia-500/30 bg-gradient-to-b from-fuchsia-500/10 to-cyan-500/10 shadow-2xl shadow-fuchsia-500/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  {/* Top */}
                  <div className="mb-8">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-3xl ${
                        isPopular
                          ? "bg-gradient-to-r from-fuchsia-500 to-cyan-500"
                          : "bg-white/10"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          isPopular
                            ? "text-white"
                            : "text-gray-300"
                        }`}
                      />
                    </div>

                    <div className="mt-6">
                      <h2 className="text-2xl font-bold text-white">
                        {
                          plan.name
                        }
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        {
                          plan.description
                        }
                      </p>
                    </div>

                    <div className="mt-8 flex items-end gap-2">
                      <span className="text-5xl font-bold tracking-tight text-white">
                        {plan.price ===
                        0
                          ? "Free"
                          : `₹${plan.price}`}
                      </span>

                      {plan.price !==
                        0 && (
                        <span className="mb-1 text-sm text-gray-500">
                          /month
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-1 flex-col gap-4">
                    {plan.features.map(
                      (
                        feature
                      ) => (
                        <div
                          key={
                            feature
                          }
                          className="flex items-start gap-3"
                        >
                          <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          </div>

                          <p className="text-sm leading-6 text-gray-300">
                            {
                              feature
                            }
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  {/* CTA */}
                  <button disabled
                    onClick={() =>
                      handleUpgrade(
                        plan
                      )
                    }
                    // disabled={
                    //   paying ===
                    //   plan.id
                    // }
                    className={`mt-10 rounded-2xl px-5 py-4 text-sm font-semibold transition duration-300 ${
                      isPopular
                        ? "bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-lg shadow-fuchsia-500/20 hover:scale-[1.02]"
                        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    } disabled:opacity-50`}
                  >
                    {paying ===
                    plan.id
                      ? "Processing..."
                      : plan.cta}
                  </button>
                </div>
              );
            }
          )}
        </div>

        {/* Bottom */}
        <div className="mt-16 text-center">
          {/* <p className="text-sm text-gray-500">
            Secure payments powered
            by Razorpay • Cancel
            anytime • GST invoices
            available
          </p> */}

          <p className="text-sm text-gray-500">
  Public Beta • Every new account receives 10 free credits • Payments coming soon
</p>
        </div>
      </div>
    </div>
  );
}