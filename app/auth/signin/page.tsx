"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const { error } =
        await supabase.auth.signInWithPassword(
          {
            email,
            password,
          }
        );

      if (error) {
        setError(error.message);

        return;
      }

      router.push(
        "/dashboard/generate"
      );

    } catch (error) {
      console.error(error);

      setError(
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-2">
          <h1 className="text-3xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Login to continue generating AI descriptions.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="rounded-xl border border-gray-200 p-3 outline-none transition focus:border-black"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="rounded-xl border border-gray-200 p-3 outline-none transition focus:border-black"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-black p-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <span
            onClick={() =>
              router.push("/signup")
            }
            className="cursor-pointer font-medium text-black"
          >
            Signup
          </span>
        </p>
      </form>
    </div>
  );
}