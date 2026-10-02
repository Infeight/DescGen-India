import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import {
  Activity,
  Sparkles,
  BarChart3,
  TrendingUp,
} from "lucide-react";

import { AnalyticsCharts } from "@/components/analyticsCharts";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function buildCreatorBreakdown(
  contentKits: number,
  outreach: number
) {
  return [
    {
      platform: "Content Kit",
      count: contentKits,
    },
    {
      platform:
        "Brand Outreach",
      count: outreach,
    },
  ];
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default async function CreatorAnalyticsPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user)
    redirect("/login");

  const {
    data: profile,
  } = await supabase
    .from("profiles")
    .select(`
      plan,
      credits_remaining,
      creator_content_kits_generated,
      creator_outreach_generated
    `)
    .eq("id", user.id)
    .single();

  const currentPlan =
    profile?.plan ??
    "free";

  const creditsRemaining =
    profile?.credits_remaining ??
    0;

  const contentKits =
    profile
      ?.creator_content_kits_generated ??
    0;

  const outreachAssets =
    profile
      ?.creator_outreach_generated ??
    0;

  const totalAssets =
    contentKits +
    outreachAssets;

  const maxCredits =
    currentPlan ===
    "starter"
      ? 100
      : currentPlan ===
        "pro"
      ? 500
      : currentPlan ===
        "business"
      ? 999999
      : 10;

  const usedCredits =
    Math.max(
      maxCredits -
        creditsRemaining,
      0
    );

  const usagePercentage =
    currentPlan ===
    "business"
      ? 0
      : Math.min(
          (usedCredits /
            maxCredits) *
            100,
          100
        );

  const creatorBreakdown =
    buildCreatorBreakdown(
      contentKits,
      outreachAssets
    );

  const fakeTimeline =
    creatorBreakdown.map(
      (item) => ({
        date:
          item.platform,
        count:
          item.count,
      })
    );

  return (
    <div className="relative flex flex-col gap-8">

      {/* Glow */}

      <div className="absolute left-1/2 top-0 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Header */}

      <div className="relative flex items-center gap-4">

        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 shadow-lg shadow-cyan-500/20">
          <BarChart3 className="h-7 w-7 text-white" />
        </div>

        <div>

          <h1 className="text-4xl font-bold text-white">
            Creator Analytics
          </h1>

          <p className="mt-1 text-gray-400">
            Monitor your creator
            AI usage and growth.
          </p>

        </div>

      </div>

      {/* Top Stats */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={
            <Sparkles className="h-5 w-5 text-fuchsia-400" />
          }
          label="Current Plan"
          value={currentPlan}
          capitalize
        />

        <StatCard
          icon={
            <Activity className="h-5 w-5 text-cyan-400" />
          }
          label="Credits Remaining"
          value={
            creditsRemaining
          }
        />

        <StatCard
          icon={
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          }
          label="Content Kits"
          value={
            contentKits
          }
        />

        <StatCard
          icon={
            <BarChart3 className="h-5 w-5 text-orange-400" />
          }
          label="Outreach Assets"
          value={
            outreachAssets
          }
        />

      </div>

      {/* Secondary Stats */}

      <div className="grid gap-5 md:grid-cols-3">

        <StatCard
          icon={
            <Sparkles className="h-5 w-5 text-fuchsia-400" />
          }
          label="Creator Assets"
          value={
            totalAssets
          }
        />

        <StatCard
          icon={
            <Activity className="h-5 w-5 text-cyan-400" />
          }
          label="Credits Used"
          value={
            usedCredits
          }
        />

        <StatCard
          icon={
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          }
          label="Creator Tools"
          value="3 Active"
        />

      </div>

      {/* Charts */}

      <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur-2xl">

        <div className="mb-6">

          <h2 className="text-2xl font-semibold text-white">
            Creator AI Insights
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Tool usage and AI
            activity breakdown.
          </p>

        </div>

        <AnalyticsCharts
          generationsByDay={
            fakeTimeline
          }
          platformBreakdown={
            creatorBreakdown
          }
          totalGenerations={
            totalAssets
          }
          usagePercentage={
            usagePercentage
          }
          usedCredits={
            usedCredits
          }
          maxCredits={
            maxCredits
          }
          currentPlan={
            currentPlan
          }
        />

      </div>

      {/* Creator Journey */}

      <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur-2xl">

        <h2 className="text-2xl font-semibold text-white">
          Creator Journey
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Your progress inside
          Creator Studio.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

            <p className="text-sm text-gray-400">
              🎬 Content Kits
            </p>

            <h3 className="mt-3 text-3xl font-bold text-white">
              {
                contentKits
              }
            </h3>

          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

            <p className="text-sm text-gray-400">
              🤝 Outreach Assets
            </p>

            <h3 className="mt-3 text-3xl font-bold text-white">
              {
                outreachAssets
              }
            </h3>

          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 p-5">

            <p className="text-sm text-gray-300">
              🚀 Coming Soon
            </p>

            <h3 className="mt-3 text-lg font-semibold text-white">
              Profile Analyzer
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              More creator tools
              are on the way.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

// ─────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  suffix,
  capitalize,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">

      <div className="flex items-center justify-between">

        <span className="text-gray-400">
          {label}
        </span>

        {icon}

      </div>

      <h3
        className={`mt-4 text-3xl font-bold text-white ${
          capitalize
            ? "capitalize"
            : ""
        }`}
      >
        {value}
      </h3>

      {suffix && (
        <p className="mt-2 text-sm text-gray-500">
          {suffix}
        </p>
      )}

    </div>
  );
}