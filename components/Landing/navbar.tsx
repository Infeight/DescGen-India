"use client";

import Link from "next/link";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

import {
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] =
    useState(false);

  const [user, setUser] =
  useState<any>(null);

const [loading, setLoading] =
  useState(true);

const supabase =
  createClient();
  
  
  useEffect(() => {
  const getSession =
    async () => {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      setUser(
        session?.user ?? null
      );

      setLoading(false);
    };

  getSession();

  const {
    data: authListener,
  } =
    supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(
          session?.user ?? null
        );
      }
    );

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);

if (loading) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">
        <div className="h-7 w-40 animate-pulse rounded bg-white/10" />

        <div className="hidden gap-4 md:flex">
          <div className="h-10 w-20 animate-pulse rounded-xl bg-white/10" />
          <div className="h-10 w-28 animate-pulse rounded-xl bg-white/10" />
        </div>
      </div>
    </header>
  );
}

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white sm:text-2xl"
        >
          DescGen
          <span className="text-fuchsia-500">
            India
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
          <a
            href="#features"
            className="transition hover:text-white"
          >
            Features
          </a>

          <a
            href="/#pricing"
            className="transition hover:text-white"
          >
            Pricing
          </a>

          <a
            href="/#demo"
            className="transition hover:text-white"
          >
            Demo
          </a>

           <a
              href="/#founding-creators"
              onClick={() =>
                setOpen(false)
              }
              className="transition hover:text-white"
            >
              Founding Creators
            </a>
        </nav>

        {/* Desktop Actions */}
       {/* Desktop Actions */}
<div className="hidden items-center gap-4 md:flex">
  {user ? (
    <>
      <Link
        href="/dashboard/generate"
        className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-5 py-2 text-sm font-medium text-white transition hover:scale-[1.02]"
      >
        Generate
      </Link>

      <button
        onClick={async () => {
          await fetch(
            "/auth/logout",
            {
              method: "POST",
            }
          );

          window.location.href =
            "/";
        }}
        className="text-sm text-gray-300 transition hover:text-white"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        href="/auth/signin"
        className="text-sm text-gray-300 transition hover:text-white"
      >
        Login
      </Link>

      <Link
        href="/auth/signup"
        className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-5 py-2 text-sm font-medium text-white transition hover:scale-[1.02]"
      >
        Start Free
      </Link>
    </>
  )}
</div>

        {/* Mobile Menu Button */}
        <button
          onClick={() =>
            setOpen(!open)
          }
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-white/10 bg-black/95 px-4 py-5 backdrop-blur-2xl md:hidden">
          <nav className="flex flex-col gap-5 text-sm text-gray-300">
            <a
              href="#features"
              onClick={() =>
                setOpen(false)
              }
              className="transition hover:text-white"
            >
              Features
            </a>

            <a
              href="/#pricing"
              onClick={() =>
                setOpen(false)
              }
              className="transition hover:text-white"
            >
              Pricing
            </a>

            <a
              href="/#demo"
              onClick={() =>
                setOpen(false)
              }
              className="transition hover:text-white"
            >
              Demo
            </a>

            <a
              href="/#founding-creators"
              onClick={() =>
                setOpen(false)
              }
              className="transition hover:text-white"
            >
              Founding Creators
            </a>

            <div className="mt-2 flex flex-col gap-3">
          <div className="mt-2 flex flex-col gap-3">
  {user ? (
    <>
      <Link
        href="/dashboard/generate"
        onClick={() =>
          setOpen(false)
        }
        className="flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        Generate
      </Link>

      <button
        onClick={async () => {
          await fetch(
            "/auth/logout",
            {
              method: "POST",
            }
          );

          window.location.href =
            "/";
        }}
        className="flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        href="/auth/signin"
        onClick={() =>
          setOpen(false)
        }
        className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
      >
        Login
      </Link>

      <Link
        href="/auth/signup"
        onClick={() =>
          setOpen(false)
        }
        className="flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        Start Free
      </Link>
    </>
  )}
</div>
</div>
          </nav>
        </div>
      )}
    </header>
  );
}