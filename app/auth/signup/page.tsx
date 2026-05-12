"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");   // ← show confirmation message not alert

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // basic client-side validation
    if (!email || !password) {
      setMessage("Email and password are required.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setMessage(error.message);
        return;
      }

      // ✅ DO NOT manually insert into profiles here
      // The database trigger handles it automatically on auth.users insert

      // Two cases Supabase returns:
      // 1. Email confirmation ON  → data.session is null, user gets confirm email
      // 2. Email confirmation OFF → data.session exists, user is logged in immediately

      if (data.session) {
        // Email confirmation disabled — user is live immediately
        router.push("/dashboard/generate");
      } else {
        // Email confirmation enabled — tell them to check email
        setMessage("Account created! Please check your email to confirm before logging in.");
      }

    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSignup}
        className="flex w-[350px] flex-col gap-4 rounded-xl border p-6"
      >
        <h1 className="text-2xl font-bold">Create Account</h1>

        <input
          type="email"
          placeholder="Email"
          required
          className="rounded border p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          required
          minLength={6}
          className="rounded border p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* show errors/messages inline instead of alert() */}
        {message && (
          <p className={`text-sm ${message.includes("created") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black p-3 text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/auth/signin" className="text-black underline">Log in</a>
        </p>
      </form>
    </div>
  );
}