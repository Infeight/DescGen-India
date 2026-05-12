"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    credits: 10,

    features: [
      "10 descriptions/month",
      "3 platforms",
      "English only",
    ],

    cta: "Get started",
  },

  {
    id: "starter",
    name: "Starter",
    price: 199,
    credits: 100,

    razorpayAmount: 199,

    features: [
      "100 descriptions/month",
      "All 5 platforms",
      "English + Hindi",
    ],

    cta:
      "Upgrade to Starter",
  },

  {
    id: "pro",
    name: "Pro",
    price: 399,
    credits: 500,

    razorpayAmount: 399,

    popular: true,

    features: [
      "500 descriptions/month",
      "Bulk CSV upload",
      "Brand tone memory",
    ],

    cta: "Upgrade to Pro",
  },

  {
    id: "business",
    name: "Business",
    price: 799,
    credits: -1,

    razorpayAmount: 799,

    features: [
      "Unlimited descriptions",
      "Priority support",
      "API access",
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
      router.push("/auth/signup");

      return;
    }

    try {
      setPaying(plan.id);

      const response =
        await fetch(
          "/api/payments/create-order",
          {
            method: "POST",

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

          order_id: data.orderId,

          amount:
            plan.razorpayAmount! *
            100,

          currency: "INR",

          name:
            "DescGen India",

          description: `${plan.name} Plan`,

          handler: function () {
            router.push(
              "/dashboard/generate?upgraded=true"
            );
          },
        });

      rzp.open();

    } catch (error) {
      console.error(error);

      alert(
        "Payment initialization failed"
      );

    } finally {
      setPaying("");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold">
          Simple pricing
        </h1>

        <p className="mt-4 text-lg text-gray-500">
          Upgrade when you need more
          AI generations
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-col gap-5 rounded-2xl border p-6
            ${
              plan.popular
                ? "border-black shadow-lg"
                : "border-gray-200"
            }`}
          >
            {plan.popular && (
              <span className="self-start rounded-full bg-black px-3 py-1 text-xs text-white">
                Most popular
              </span>
            )}

            <div>
              <p className="text-sm text-gray-500">
                {plan.name}
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {plan.price === 0
                  ? "Free"
                  : `₹${plan.price}`}
              </h2>
            </div>

            <ul className="flex flex-1 flex-col gap-2 text-sm text-gray-600">
              {plan.features.map(
                (feature) => (
                  <li
                    key={feature}
                  >
                    ✓ {feature}
                  </li>
                )
              )}
            </ul>

            <button
              onClick={() =>
                handleUpgrade(
                  plan
                )
              }
              disabled={
                paying === plan.id
              }
              className={`rounded-xl py-3 text-sm font-medium transition
              ${
                plan.popular
                  ? "bg-black text-white hover:bg-gray-800"
                  : "border border-gray-300 hover:bg-gray-50"
              }
              disabled:opacity-50`}
            >
              {paying === plan.id
                ? "Processing..."
                : plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}