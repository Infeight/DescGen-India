"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  Sparkles,
  ArrowRight,
  Wand2,
} from "lucide-react";

import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

const supabase =
  createClient();

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);


async function handleLogin(
  e: React.FormEvent
) {
  e.preventDefault();

  const toastId =
    toast.loading(
      "Logging in..."
    );

  try {
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword(
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

    toast.success(
      "Welcome back!",
      {
        id: toastId,
      }
    );

    router.push(
      "/dashboard/generate"
    );

  } catch (error) {
    console.error(error);

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


 async function handleGoogleLogin() {
  const supabase =
    createClient();

  const {
    error,
  } =
    await supabase.auth.signInWithOAuth({
      provider: "google",

      options: {
        redirectTo:
          "https://descgen.shop/auth/callback",
      },
    });

  if (error) {
    toast.error(
      error.message
    );
  }
}


  return (
    <div className="relative flex min-h-screen overflow-hidden bg-black">
      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

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
            <Sparkles className="h-4 w-4 text-fuchsia-400" />

            AI-powered product descriptions
          </div>

          <h2 className="text-5xl font-bold leading-tight text-white">
            Generate marketplace-ready product listings in seconds.
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-400">
            Create optimized AI
            descriptions for
            Meesho, Amazon India,
            Flipkart, Myntra &
            Instagram Shops.
          </p>

          {/* Features */}
          <div className="mt-10 flex flex-col gap-4">
            {[
              "Bulk CSV generation",
              "Marketplace AI optimization",
              "Brand tone memory",
              "Hindi & Telugu support",
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
                  <div className="h-2 w-2 rounded-full bg-fuchsia-400" />

                  <p className="text-gray-300">
                    {item}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom */}
        <p className="text-sm text-gray-600">
          Built for Indian
          e-commerce sellers.
        </p>
      </div>

      {/* Right */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-16">
        <form
          onSubmit={
            handleLogin
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
              Welcome Back
            </h1>

            <p className="mt-2 text-gray-400">
              Login to continue
              generating AI
              product descriptions.
            </p>
          </div>

        {/* google login button  */}
         <button
  type="button"
  onClick={handleGoogleLogin}
  className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-white transition hover:bg-white/10"
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    alt="Google"
    className="h-5 w-5"
  />

  Continue with Google
</button>

<div className="mb-6 flex items-center gap-3">
  <div className="h-px flex-1 bg-white/10" />

  <span className="text-xs uppercase tracking-widest text-gray-500">
    Or continue with email
  </span>

  <div className="h-px flex-1 bg-white/10" />
</div>

          {/* Email */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-fuchsia-500/40"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-fuchsia-500/40"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />
          </div>

          <div className="flex justify-end">
  <Link
    href="/auth/forgot-password"
    className="text-sm text-gray-400 transition hover:text-white"
  >
    Forgot password?
  </Link>
</div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-4 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}

            {!loading && (
              <ArrowRight className="h-5 w-5" />
            )}
          </button>

          {/* Bottom */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <span
              onClick={() =>
                router.push(
                  "/auth/signup"
                )
              }
              className="cursor-pointer font-medium text-white transition hover:text-fuchsia-400"
            >
              Create account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}