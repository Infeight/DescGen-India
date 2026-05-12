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
  LayoutDashboard,
  History,
  Settings,
  BarChart3,
  FileSpreadsheet,
  Sparkles,
  LogOut,
  Crown,
} from "lucide-react";

import { createClient }
from "@/lib/supabase/client";

const NAV = [
  {
    href:
      "/dashboard/generate",

    label:
      "Generate",

    icon:
      Sparkles,
  },

  {
    href:
      "/dashboard/history",

    label:
      "History",

    icon:
      History,
  },

  {
    href:
      "/dashboard/bulk",

    label:
      "Bulk CSV",

    icon:
      FileSpreadsheet,
  },

  {
    href:
      "/dashboard/analytics",

    label:
      "Analytics",

    icon:
      BarChart3,
  },

  {
    href:
      "/dashboard/settings",

    label:
      "Settings",

    icon:
      Settings,
  },
];

export default function DashboardLayout({
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

  const [plan, setPlan] =
    useState("free");

  // useEffect(() => {
  //   async function load() {
  //     const {
  //       data: { user },
  //     } =
  //       await supabase.auth.getUser();

  //     if (!user) return;

  //     setEmail(
  //       user.email ?? ""
  //     );

  //     const { data } =
  //       await supabase
  //         .from("profiles")
  //         .select(`
  //           credits_remaining,
  //           plan
  //         `)
  //         .eq(
  //           "id",
  //           user.id
  //         )
  //         .single();

  //     if (data) {
  //       setCredits(
  //         data.credits_remaining
  //       );

  //       setPlan(
  //         data.plan
  //       );
  //     }
  //   }

  //   load();
  // }, []);

  useEffect(() => {
  let channel: any;

  async function load() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setEmail(user.email ?? "");

    // Initial credits fetch
    const { data } = await supabase
      .from("profiles")
      .select("credits_remaining")
      .eq("id", user.id)
      .single();

    if (data) {
      setCredits(data.credits_remaining);
    }

    // Realtime subscription
    channel = supabase
      .channel(`credits-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log(
            "REALTIME CREDIT UPDATE:",
            payload
          );

          const updatedCredits =
            payload.new
              .credits_remaining;

          setCredits(
            updatedCredits
          );
        }
      )
      .subscribe();
  }

  load();

  return () => {
    if (channel) {
      supabase.removeChannel(
        channel
      );
    }
  };
}, []);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push(
      "/auth/signin"
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* SIDEBAR */}
      <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-white/10 bg-white/5 backdrop-blur-2xl">
        {/* Logo */}
        <div className="border-b border-white/10 px-6 py-6">
          <Link href="/">
            <h1 className="text-2xl font-bold tracking-tight">
              DescGen{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                India
              </span>
            </h1>
          </Link>

          <p className="mt-2 text-sm text-gray-400">
            AI Commerce Workspace
          </p>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Workspace
          </p>

          <nav className="flex flex-col gap-2">
            {NAV.map((item) => {
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
                  className={`group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-300 ${
                    active
                      ? "border border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/10 text-white shadow-lg shadow-fuchsia-500/10"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition ${
                      active
                        ? "text-fuchsia-400"
                        : "text-gray-500 group-hover:text-white"
                    }`}
                  />

                  <span className="text-sm font-medium">
                    {
                      item.label
                    }
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Upgrade Card */}
          <div className="mt-10 rounded-3xl border border-fuchsia-500/20 bg-gradient-to-b from-fuchsia-500/10 to-cyan-500/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500">
                <Crown className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Upgrade Plan
                </p>

                <p className="text-xs text-gray-400">
                  Unlock bulk & premium AI
                </p>
              </div>
            </div>

            <Link
              href="/pricing"
              className="mt-5 flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
            >
              Upgrade Now
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-5">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="truncate text-sm font-medium text-white">
              {email}
            </p>

            <div className="mt-3 flex items-center justify-between">
              <div className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium capitalize text-fuchsia-300">
                {plan} Plan
              </div>

              <button
                onClick={
                  handleLogout
                }
                className="flex items-center gap-2 text-sm text-red-400 transition hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />

                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex flex-1 flex-col">
        {/* HEADER */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-2xl">
          <div className="flex items-center justify-between px-8 py-5">
            {/* Left */}
            <div>
              <h2 className="text-xl font-semibold">
                Dashboard
              </h2>

              <p className="text-sm text-gray-400">
                Manage your AI commerce workflows
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
                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  }`}
                >
                  {Number.isInteger(
                    credits
                  )
                    ? credits
                    : credits.toFixed(
                        1
                      )}{" "}
                  Credits
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}