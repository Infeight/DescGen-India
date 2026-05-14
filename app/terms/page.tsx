import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Terms of Service - DescGen India",

  description:
    "Terms and conditions for using DescGen India.",

  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-16 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold">
            Terms of Service
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Last updated: August 2026
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-10 text-gray-300">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              1. Service Description
            </h2>

            <p className="leading-8">
              DescGen India provides
              AI-powered product
              description generation for
              Indian e-commerce sellers
              and creators. Outputs are
              AI-generated suggestions
              and should be reviewed
              before publishing.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              2. Credits & Usage
            </h2>

            <p className="leading-8">
              Credits are consumed when
              generating product
              descriptions. Free and paid
              plans include different
              credit allocations.
              Credits are non-transferable
              and may expire if your plan
              becomes inactive.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              3. Payments & Billing
            </h2>

            <p className="leading-8">
              All payments are processed
              securely through Razorpay
              in INR. DescGen India does
              not store payment card
              details or banking
              information.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              4. Refund Policy
            </h2>

            <p className="leading-8">
              We generally do not offer
              refunds for used credits or
              completed billing periods.
              If you face technical
              issues preventing usage,
              contact support within
              seven days for review.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              5. Acceptable Use
            </h2>

            <p className="leading-8">
              Users may not use DescGen
              India for spam, harmful,
              misleading, illegal, or
              policy-violating content.
              Abuse, excessive automated
              usage, or attempts to
              bypass limits may result in
              account suspension.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              6. Intellectual Property
            </h2>

            <p className="leading-8">
              Product descriptions
              generated using DescGen
              India belong to the user.
              The DescGen India platform,
              branding, and software are
              owned by DescGen India.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              7. Account Termination
            </h2>

            <p className="leading-8">
              We reserve the right to
              suspend or terminate
              accounts involved in abuse,
              fraud, or violations of
              these terms.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              8. Contact
            </h2>

            <p className="leading-8">
              Questions regarding these
              terms can be sent to{" "}
              <a
                href="mailto:support@descgen.shop"
                className="text-fuchsia-400 hover:underline"
              >
                support@descgen.shop
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}