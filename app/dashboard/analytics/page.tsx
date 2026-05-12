import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { AnalyticsCharts } from "@/components/analyticsCharts";

import {
  Activity,
  CreditCard,
  Sparkles,
  BarChart3,
  TrendingUp,
} from "lucide-react";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function buildGenerationsByDay(
  generations: {
    created_at: string;
  }[]
): {
  date: string;
  count: number;
}[] {
  const days: {
    date: string;
    count: number;
  }[] = [];

  const now = new Date();

  for (
    let i = 29;
    i >= 0;
    i--
  ) {
    const d =
      new Date(now);

    d.setDate(
      now.getDate() - i
    );

    const dateStr =
      d
        .toISOString()
        .slice(0, 10);

    const label =
      d.toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
        }
      );

    const count =
      generations?.filter(
        (g) =>
          g.created_at.slice(
            0,
            10
          ) === dateStr
      ).length ?? 0;

    days.push({
      date: label,
      count,
    });
  }

  return days;
}

function buildPlatformBreakdown(
  generations: {
    platform: string;
  }[]
): {
  platform: string;
  count: number;
}[] {
  const counts: Record<
    string,
    number
  > = {};

  generations?.forEach(
    ({ platform }) => {
      counts[platform] =
        (counts[
          platform
        ] ?? 0) + 1;
    }
  );

  return Object.entries(
    counts
  )
    .map(
      ([
        platform,
        count,
      ]) => ({
        platform,
        count,
      })
    )
    .sort(
      (a, b) =>
        b.count - a.count
    );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default async function AnalyticsPage() {
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
    .select(
      "plan, credits_remaining"
    )
    .eq("id", user.id)
    .single();

  const {
    data: generations,
  } = await supabase
    .from("generations")
    .select(
      "id, platform, created_at"
    )
    .eq(
      "user_id",
      user.id
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  const {
    data: payments,
  } = await supabase
    .from("payments")
    .select(
      "id, amount_inr, plan, created_at"
    )
    .eq(
      "user_id",
      user.id
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    )
    .limit(5);

  // Metrics
  const totalGenerations =
    generations?.length ??
    0;

  const totalSpent =
    payments?.reduce(
      (acc, p) =>
        acc +
        (p.amount_inr ??
          0),
      0
    ) ?? 0;

  const currentPlan =
    profile?.plan ??
    "free";

  const creditsRemaining =
    profile?.credits_remaining ??
    0;

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

  const generationsByDay =
    buildGenerationsByDay(
      generations ?? []
    );

  const platformBreakdown =
    buildPlatformBreakdown(
      generations ?? []
    );

  const topPlatform =
    platformBreakdown[0]
      ?.platform ?? "—";

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
            Analytics
          </h1>

          <p className="mt-1 text-gray-400">
            Monitor AI usage,
            credits, payments,
            and marketplace
            activity.
          </p>
        </div>
      </div>

      {/* Stats */}
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
          value={creditsRemaining}
        />

        <StatCard
          icon={
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          }
          label="Total Generations"
          value={totalGenerations}
        />

        <StatCard
          icon={
            <BarChart3 className="h-5 w-5 text-orange-400" />
          }
          label="Top Platform"
          value={topPlatform}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard
          icon={
            <CreditCard className="h-5 w-5 text-fuchsia-400" />
          }
          label="Total Spent"
          value={`₹${totalSpent}`}
        />

        <StatCard
          icon={
            <Activity className="h-5 w-5 text-cyan-400" />
          }
          label="Credits Used"
          value={usedCredits}
        />

        <StatCard
          icon={
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          }
          label="This Month"
          value={generationsByDay
            .slice(-30)
            .reduce(
              (s, d) =>
                s +
                d.count,
              0
            )}
          suffix="generations"
        />
      </div>

      {/* Charts */}
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">
            AI Usage Insights
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Generation trends,
            platform distribution,
            and usage metrics.
          </p>
        </div>

        <AnalyticsCharts
          generationsByDay={
            generationsByDay
          }
          platformBreakdown={
            platformBreakdown
          }
          totalGenerations={
            totalGenerations
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

      {/* Payments */}
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Recent Payments
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Your latest plan
              upgrades and
              transactions.
            </p>
          </div>
        </div>

        {payments &&
        payments.length > 0 ? (
          <div className="flex flex-col gap-3">
            {payments.map(
              (payment) => (
                <div
                  key={
                    payment.id
                  }
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold capitalize text-white">
                      {
                        payment.plan
                      }{" "}
                      Plan
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(
                        payment.created_at
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month:
                            "short",
                          year:
                            "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                      Paid
                    </span>

                    <p className="text-lg font-bold text-white">
                      ₹
                      {
                        payment.amount_inr
                      }
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 py-16 text-center">
            <CreditCard className="h-10 w-10 text-gray-600" />

            <h3 className="mt-5 text-lg font-semibold text-white">
              No Payments Yet
            </h3>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              Upgrade your plan
              to unlock higher AI
              generation limits
              and premium
              features.
            </p>

            <a
              href="/pricing"
              className="mt-6 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
            >
              View Pricing
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────
function StatCard({
  label,
  value,
  capitalize,
  suffix,
  icon,
}: {
  label: string;

  value: string | number;

  capitalize?: boolean;

  suffix?: string;

  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {label}
        </p>

        <div>
          {icon}
        </div>
      </div>

      <p
        className={`mt-5 text-3xl font-bold text-white ${
          capitalize
            ? "capitalize"
            : ""
        }`}
      >
        {value}

        {suffix && (
          <span className="ml-2 text-sm font-normal text-gray-500">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}