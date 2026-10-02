"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  Sparkles,
  MessageSquare,
  IndianRupee,
  BarChart3,
  Settings,
  Crown,
  LogOut,
  Menu,
  Home,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { createClient } from "@/lib/supabase/client";

const NAV = [
  {
    href: "/creator",
    label: "Content Kit",
    icon: Sparkles,
  }, 
  {
    href: "/creator/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    href: "/creator/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase =
    createClient();

  const router =
    useRouter();

  const pathname =
    usePathname();

  const [credits, setCredits] =
    useState<number | null>(
      null
    );

  const [email, setEmail] =
    useState("");

  useEffect(() => {
  let channel: ReturnType<typeof supabase.channel> | null = null;

  async function load() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/signin?redirect=/creator");
      return;
    }

    setEmail(user.email ?? "");

    // Initial credit load
    const { data, error } = await supabase
      .from("profiles")
      .select("credits_remaining")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setCredits(data.credits_remaining);
    }

    // Listen for credit changes
    channel = supabase
      .channel(`creator-credits-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          const newCredits = payload.new.credits_remaining;

          if (typeof newCredits === "number") {
            setCredits(newCredits);
          }
        }
      )
      .subscribe();
  }

  load();

  return () => {
    if (channel) {
      supabase.removeChannel(channel);
    }
  };
}, [router, supabase]);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Sidebar */}

      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-white/10 bg-black/70 backdrop-blur-2xl lg:flex lg:flex-col">

        {/* Logo */}

        <div className="border-b border-white/10 p-8">
          <Link href="/">
            <h1 className="text-2xl font-bold">
              DescGen
              <span className="text-cyan-400">
                India
              </span>
            </h1>
          </Link>

          <p className="mt-2 text-sm text-gray-400">
            AI Creator Workspace
          </p>
        </div>

        {/* Workspace Switch */}

        <div className="p-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2">

            <Link
              href="/dashboard/generate"
              className="flex items-center gap-3 rounded-xl p-3 text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              🛍 Seller Workspace
            </Link>

            <div className="mt-2 flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/10 p-3 text-white">
              🎬 Creator Studio
            </div>

          </div>
        </div>

        {/* Navigation */}

        <div className="flex-1 px-5">
          <div className="space-y-2">
            {NAV.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  pathname ===
                  item.href;

                return (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                      active
                        ? "bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/10 text-white"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />

                    <span>
                      {
                        item.label
                      }
                    </span>
                  </Link>
                );
              }
            )}
          </div>
        </div>

        {/* Upgrade */}

        <div className="m-5 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 p-5">

          <Crown className="h-8 w-8 text-cyan-300" />

          <h3 className="mt-4 font-semibold">
            Creator Pro
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            More credits, faster AI
            and premium creator
            tools.
          </p>

          <button className="mt-5 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-3 font-medium">
            Upgrade
          </button>

        </div>

      </aside>

      {/* Main */}

      <div className="lg:ml-72">

        {/* Header */}

        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-2xl">

          <div className="flex items-center justify-between px-4 py-4 lg:px-8 lg:py-5">

            {/* Mobile */}

            <div className="flex items-center gap-3 lg:hidden">

              <Sheet>

                <SheetTrigger>

                  <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Menu className="h-5 w-5 text-white" />
                  </button>

                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="w-72 border-white/10 bg-black text-white"
                >

{/* switch work space */}

                   <div className="mt-8 mb-6 rounded-2xl border border-white/10 bg-white/5 p-2">

    {/* Creator - Active */}
    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/10 p-3 text-white">
      🎬 Creator Studio
    </div>

    {/* Seller */}
    <Link
      href="/dashboard/generate"
      className="mt-2 flex items-center gap-3 rounded-xl p-3 text-gray-400 transition hover:bg-white/5 hover:text-white"
    >
      🛍 Seller Workspace
    </Link>

  </div>

                  <div className="mt-8 space-y-2">

                    {NAV.map(
                      (
                        item
                      ) => {
                        const Icon =
                          item.icon;

                        return (
                          <Link
                            key={
                              item.href
                            }
                            href={
                              item.href
                            }
                            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white"
                          >
                            <Icon className="h-5 w-5" />

                            {
                              item.label
                            }
                          </Link>
                        );
                      }
                    )}

                  </div>

                </SheetContent>

              </Sheet>

              <div>
                <h2 className="text-lg font-bold">
                  DescGen India
                </h2>

                <p className="text-xs text-gray-400">
                  AI Creator Workspace
                </p>
              </div>

            </div>

            {/* Desktop */}

            <div className="hidden lg:block">
              <h2 className="text-xl font-semibold">
                Creator Studio
              </h2>

              <p className="text-sm text-gray-400">
                Create content and
                win brand deals
              </p>
            </div>

            {/* Right */}

            <div className="flex items-center gap-4">

              {credits !==
                null && (
                <div
                  className={`rounded-full border px-5 py-2 text-sm font-semibold ${
                    credits <=
                    3
                      ? "border-red-500/20 bg-red-500/10 text-red-300"
                      : "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
                  }`}
                >
                  ⚡{" "}
                  {credits} Credits
                </div>
              )}

              <button
                onClick={async () => {
                  await fetch(
                    "/auth/logout",
                    {
                      method:
                        "POST",
                    }
                  );

                  window.location.href =
                    "/";
                }}
                className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 lg:block"
              >
                Logout
              </button>

            </div>

          </div>

        </header>

        {/* Content */}

        <main className="w-full min-w-0 p-4 pb-28 lg:p-8">
          {children}
        </main>

      </div>

      {/* Mobile Bottom Nav */}

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-2xl lg:hidden">

        <div className="grid grid-cols-5">

          {NAV.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                pathname ===
                item.href;

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  className={`flex flex-col items-center justify-center gap-1 py-3 text-xs transition ${
                    active
                      ? "text-cyan-400"
                      : "text-gray-500"
                  }`}
                >
                  <Icon className="h-5 w-5" />

                  <span>
                    {
                      item.label
                    }
                  </span>
                </Link>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}