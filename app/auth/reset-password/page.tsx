"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { toast } from "sonner";

import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();

export default function ResetPasswordPage() {
  const router =
    useRouter();

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleUpdatePassword(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (
      password.length < 6
    ) {
      toast.error(
        "Password must be at least 6 characters."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      toast.error(
        "Passwords do not match."
      );

      return;
    }

    const toastId =
      toast.loading(
        "Updating password..."
      );

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.updateUser(
          {
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
        "Password updated successfully.",
        {
          id: toastId,
        }
      );

      setTimeout(() => {
        router.push(
          "/auth/signin"
        );
      }, 1200);

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
      <div className="absolute left-1/2 top-0 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-lg shadow-fuchsia-500/20">
            <Sparkles className="h-7 w-7 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Reset Password
          </h1>

          <p className="mt-2 text-gray-400">
            Create a new secure password for your account.
          </p>
        </div>

        <form
          onSubmit={
            handleUpdatePassword
          }
          className="flex flex-col gap-5"
        >
          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              New Password
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <LockKeyhole className="h-5 w-5 text-gray-500" />

              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full bg-transparent text-white outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              Confirm Password
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <LockKeyhole className="h-5 w-5 text-gray-500" />

              <input
                type="password"
                placeholder="Confirm new password"
                value={
                  confirmPassword
                }
                onChange={(e) =>
                  setConfirmPassword(
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
              ? "Updating..."
              : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}