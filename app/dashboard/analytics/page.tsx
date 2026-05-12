import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnalyticsCharts } from "@/components/analyticsCharts";

// Build last 30 days array with generation counts per day
function buildGenerationsByDay(
  generations: { created_at: string }[]
): { date: string; count: number }[] {
  const days: { date: string; count: number }[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const label   = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const count   = generations?.filter((g) =>
      g.created_at.slice(0, 10) === dateStr
    ).length ?? 0;
    days.push({ date: label, count });
  }
  return days;
}

// Count generations per platform
function buildPlatformBreakdown(
  generations: { platform: string }[]
): { platform: string; count: number }[] {
  const counts: Record<string, number> = {};
  generations?.forEach(({ platform }) => {
    counts[platform] = (counts[platform] ?? 0) + 1;
  });
  return Object.entries(counts)
    .map(([platform, count]) => ({ platform, count }))
    .sort((a, b) => b.count - a.count);
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, credits_remaining")
    .eq("id", user.id)
    .single();

  // Fetch generations — need platform + created_at for charts
  const { data: generations } = await supabase
    .from("generations")
    .select("id, platform, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch recent payments
  const { data: payments } = await supabase
    .from("payments")
    .select("id, amount_inr, plan, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // ── Computed values ────────────────────────────────────────────
  const totalGenerations  = generations?.length ?? 0;
  const totalSpent        = payments?.reduce((acc, p) => acc + (p.amount_inr ?? 0), 0) ?? 0;
  const currentPlan       = profile?.plan ?? "free";
  const creditsRemaining  = profile?.credits_remaining ?? 0;

  const maxCredits =
    currentPlan === "starter"  ? 100    :
    currentPlan === "pro"      ? 500    :
    currentPlan === "business" ? 999999 : 10;

  const usedCredits      = Math.max(maxCredits - creditsRemaining, 0);
  const usagePercentage  = currentPlan === "business"
    ? 0
    : Math.min((usedCredits / maxCredits) * 100, 100);

  const generationsByDay  = buildGenerationsByDay(generations ?? []);
  const platformBreakdown = buildPlatformBreakdown(generations ?? []);

  // Most used platform
  const topPlatform = platformBreakdown[0]?.platform ?? "—";

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor your AI usage, credits, and payments.
        </p>
      </div>

      {/* Top stat cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <StatCard label="Current Plan"       value={currentPlan}        capitalize />
        <StatCard label="Credits Remaining"  value={creditsRemaining}   />
        <StatCard label="Total Generations"  value={totalGenerations}   />
        <StatCard label="Top Platform"       value={topPlatform}        />
      </div>

      {/* Second row */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <StatCard label="Total Spent"        value={`₹${totalSpent}`}   />
        <StatCard label="Credits Used"       value={usedCredits}        />
        <StatCard label="This Month"
          value={generationsByDay.slice(-30).reduce((s, d) => s + d.count, 0)}
          suffix="generations" />
      </div>

      {/* Charts — client component */}
      <AnalyticsCharts
              generationsByDay={generationsByDay}
              platformBreakdown={platformBreakdown}
              totalGenerations={totalGenerations}
              usagePercentage={usagePercentage}
              usedCredits={usedCredits}
              maxCredits={maxCredits}
              currentPlan={currentPlan}     />

      {/* Recent payments */}
      <div className="rounded-2xl border bg-white p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold">Recent Payments</h2>
          <p className="mt-0.5 text-sm text-gray-400">Your latest upgrades</p>
        </div>

        {payments && payments.length > 0 ? (
          <div className="flex flex-col divide-y divide-gray-50">
            {payments.map((payment) => (
              <div key={payment.id}
                className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-sm font-medium capitalize text-gray-900">
                    {payment.plan} Plan
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(payment.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs
                                   font-medium text-green-700">
                    Paid
                  </span>
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{payment.amount_inr}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-sm text-gray-400">No payments yet.</p>
            <a href="/pricing"
              className="text-xs text-gray-500 underline underline-offset-2 hover:text-gray-700">
              View pricing plans
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stat card component ──────────────────────────────────────────
function StatCard({
  label, value, capitalize, suffix,
}: {
  label:       string;
  value:       string | number;
  capitalize?: boolean;
  suffix?:     string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`mt-2 text-2xl font-bold text-gray-900 ${capitalize ? "capitalize" : ""}`}>
        {value}
        {suffix && (
          <span className="ml-1 text-sm font-normal text-gray-400">{suffix}</span>
        )}
      </p>
    </div>
  );
}