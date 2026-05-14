import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Privacy Policy - DescGen India",

  description:
    "How DescGen India collects, uses, and protects your data.",

  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-16 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold">
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Last updated: May 2026
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-10 text-gray-300">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              1. Information We Collect
            </h2>

            <p className="leading-8">
              When you create an account,
              we collect your email
              address and securely
              encrypted authentication
              data through Supabase
              Authentication. We also
              store the product
              descriptions you generate,
              usage analytics, credits,
              and billing history.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              2. How We Use Your Information
            </h2>

            <p className="leading-8">
              Your information is used to
              provide AI-generated product
              descriptions, improve the
              platform experience, process
              payments, manage accounts,
              prevent abuse, and send
              important transactional
              emails such as welcome
              emails or password resets.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              3. Payments
            </h2>

            <p className="leading-8">
              Payments are securely
              processed by Razorpay. We
              do not store your card
              details, CVV, or banking
              information. Razorpay is
              PCI-DSS compliant.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              4. Data Storage & Security
            </h2>

            <p className="leading-8">
              Data is securely stored
              using Supabase PostgreSQL
              infrastructure hosted on
              AWS. We use industry
              standard encryption and
              security practices to
              protect user data.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              5. Third-Party Services
            </h2>

            <p className="leading-8">
              DescGen India uses trusted
              third-party providers
              including Google Gemini AI,
              Supabase, Vercel, Razorpay,
              and Resend to operate the
              platform efficiently.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              6. Your Rights
            </h2>

            <p className="leading-8">
              You may request deletion of
              your account and associated
              data by contacting us at
              support@descgen.shop.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              7. Contact
            </h2>

            <p className="leading-8">
              For privacy-related
              questions or requests,
              contact us at{" "}
              <a
                href="mailto:vrmtarun7@gmail.com"
                className="text-fuchsia-400 hover:underline"
              >
                vrmtarun7@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}