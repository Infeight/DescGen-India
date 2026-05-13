"use client";

import { useState } from "react";

import Link from "next/link";

import {
  Mail,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

import { toast } from "sonner";

import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();

export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleReset(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const toastId =
      toast.loading(
        "Sending reset email..."
      );

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo:
              `${window.location.origin}/auth/reset-password`,
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
        "Password reset email sent successfully.",
        {
          id: toastId,
        }
      );

      setEmail("");

    } catch (err) {
      console.error(err);

      toast.error(
        "Something went wrong.",
        {
          id: toastId,
        }
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4">
      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-lg shadow-fuchsia-500/20">
            <Sparkles className="h-7 w-7 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Forgot Password
          </h1>

          <p className="mt-2 text-gray-400">
            Enter your email and we’ll send you a reset link.
          </p>
        </div>

        <form
          onSubmit={handleReset}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              Email Address
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <Mail className="h-5 w-5 text-gray-500" />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="w-full bg-transparent text-white outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={
              loading
            }
            className="mt-2 flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-4 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:opacity-50"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>

        <Link
          href="/auth/signin"
          className="mt-6 flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to login
        </Link>
      </div>
    </div>
  );
}