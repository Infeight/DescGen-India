"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { sendWelcomeEmail } from "@/lib/email";

import { toast } from "sonner";

import {
  Sparkles,
  ArrowRight,
  Wand2,
  CheckCircle2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const supabase =
  createClient();

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  

 async function handleSignup(
  e: React.FormEvent
) {
  e.preventDefault();

  const toastId =
    toast.loading(
      "Creating account..."
    );

  setLoading(true);

  // Validation
  if (
    !email ||
    !password
  ) {
    toast.error(
      "Email and password are required.",
      {
        id: toastId,
      }
    );

    setLoading(false);

    return;
  }

  if (
    password.length <
    6
  ) {
    toast.error(
      "Password must be at least 6 characters.",
      {
        id: toastId,
      }
    );

    setLoading(false);

    return;
  }

  try {
    const {
      data,
      error,
    } =
      await supabase.auth.signUp(
        {
          email,
          password,
        }
      );

    if (error) {
      toast.error(
        error.message,
        {
          id: toastId,
        }
      );

      return;
    }

    if (
      data.session
    ) {
      toast.success(
        "Account created successfully!",
        {
          id: toastId,
        }
      );

      if (data.user) {
  sendWelcomeEmail(email).catch(
    console.error
  );
}

      router.push(
        "/dashboard/generate"
      );

    } else {
      toast.success(
        "Account created! Please check your email to confirm your account.",
        {
          id: toastId,
        }
      );
    }

  } catch (err) {
    console.error(err);

    toast.error(
      "Something went wrong. Please try again.",
      {
        id: toastId,
      }
    );

  } finally {
    setLoading(false);
  }
}

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-black">
      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Left */}
      <div className="relative hidden flex-1 flex-col justify-between border-r border-white/10 p-12 lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-lg shadow-fuchsia-500/20">
            <Wand2 className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              DescGen India
            </h1>

            <p className="text-sm text-gray-500">
              AI Commerce Assistant
            </p>
          </div>
        </div>

        {/* Hero */}
        <div className="max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-cyan-400" />

            Built for Indian sellers
          </div>

          <h2 className="text-5xl font-bold leading-tight text-white">
            Start generating AI-powered product listings today.
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-400">
            Create high-converting
            marketplace descriptions
            optimized for Meesho,
            Amazon India, Flipkart,
            Myntra, and Instagram.
          </p>

          {/* Features */}
          <div className="mt-10 flex flex-col gap-4">
            {[
              "Marketplace AI optimization",
              "Bulk CSV generation",
              "Brand memory system",
              "Multi-language support",
            ].map(
              (
                item
              ) => (
                <div
                  key={
                    item
                  }
                  className="flex items-center gap-3"
                >
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />

                  <p className="text-gray-300">
                    {item}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-600">
          AI infrastructure for
          Indian commerce.
        </p>
      </div>

      {/* Right */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-16">
        <form
          onSubmit={
            handleSignup
          }
          className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl"
        >
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500">
              <Wand2 className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-white">
                DescGen India
              </h1>

              <p className="text-xs text-gray-500">
                AI Commerce Assistant
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white">
              Create Account
            </h1>

            <p className="mt-2 text-gray-400">
              Start generating
              AI-powered product
              descriptions in
              seconds.
            </p>
          </div>

          

          {/* Email */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-500/40"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Minimum 6 characters"
              required
              minLength={6}
              value={
                password
              }
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-500/40"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-4 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}

            {!loading && (
              <ArrowRight className="h-5 w-5" />
            )}
          </button>

          <p className="text-center text-xs leading-6 text-gray-400">
  By creating an account you agree to our{" "}
  <a
    href="/terms"
    className="underline hover:text-gray-300"
  >
    Terms of Service
  </a>{" "}
  and{" "}
  <a
    href="/privacy"
    className="underline hover:text-gray-300"
  >
    Privacy Policy
  </a>
</p>

          {/* Bottom */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() =>
                router.push(
                  "/auth/signin"
                )
              }
              className="cursor-pointer font-medium text-white transition hover:text-cyan-400"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}