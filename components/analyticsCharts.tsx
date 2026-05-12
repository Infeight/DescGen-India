"use client";

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

interface Props {
  generationsByDay:  { date: string; count: number }[];
  platformBreakdown: { platform: string; count: number }[];
  totalGenerations:  number;
  usagePercentage:   number;
  usedCredits:       number;
  maxCredits:        number;
  currentPlan:       string;
}

const PLATFORM_COLORS: Record<string, string> = {
  Amazon:    "#F97316",
  Meesho:    "#EC4899",
  Flipkart:  "#3B82F6",
  Instagram: "#A855F7",
  Myntra:    "#8B5CF6",
  Other:     "#6B7280",
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-900">
        {payload[0].value} {payload[0].name}
      </p>
    </div>
  );
}

export function AnalyticsCharts({
  generationsByDay,
  platformBreakdown,
  totalGenerations,
  usagePercentage,
  usedCredits,
  maxCredits,
  currentPlan,
}: Props) {
  const hasGenerations = totalGenerations > 0;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Generations over time ───────────────────────────────── */}
      <div className="rounded-2xl border bg-white p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900">
            Generations Over Time
          </h2>
          <p className="mt-0.5 text-sm text-gray-400">
            Last 30 days
          </p>
        </div>

        {hasGenerations ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={generationsByDay}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="genGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#111827" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" name="generations"
                stroke="#111827" strokeWidth={2}
                fill="url(#genGradient)" dot={false} activeDot={{ r: 4, fill: "#111827" }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart message="Generate your first description to see trends" />
        )}
      </div>

      {/* ── Platform breakdown + Credits donut ─────────────────── */}
      <div className="grid gap-5 md:grid-cols-2">

        {/* Platform bar chart */}
        <div className="rounded-2xl border bg-white p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900">
              Platform Breakdown
            </h2>
            <p className="mt-0.5 text-sm text-gray-400">
              Generations per platform
            </p>
          </div>

          {hasGenerations && platformBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={platformBreakdown}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="platform" tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="generations" radius={[4, 4, 0, 0]}>
                  {platformBreakdown.map((entry) => (
                    <Cell key={entry.platform}
                      fill={PLATFORM_COLORS[entry.platform] ?? PLATFORM_COLORS.Other} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No platform data yet" />
          )}

          {/* Legend */}
          {platformBreakdown.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {platformBreakdown.map((p) => (
                <div key={p.platform} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{ background: PLATFORM_COLORS[p.platform] ?? PLATFORM_COLORS.Other }} />
                  <span className="text-xs text-gray-500">
                    {p.platform} <span className="font-medium text-gray-700">({p.count})</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Credits donut */}
        <div className="rounded-2xl border bg-white p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900">
              Credit Usage
            </h2>
            <p className="mt-0.5 text-sm text-gray-400">
              Current billing period
            </p>
          </div>

          {currentPlan === "business" ? (
            <div className="flex h-[200px] flex-col items-center justify-center gap-2">
              <span className="text-3xl">∞</span>
              <p className="text-sm text-gray-400">Unlimited credits</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative">
                <PieChart width={160} height={160}>
                  <Pie data={[
                      { name: "Used",      value: usedCredits },
                      { name: "Remaining", value: Math.max(maxCredits - usedCredits, 0) },
                    ]}
                    cx={75} cy={75} innerRadius={52} outerRadius={72}
                    dataKey="value" strokeWidth={0} startAngle={90} endAngle={-270}>
                    <Cell fill="#111827" />
                    <Cell fill="#F3F4F6" />
                  </Pie>
                </PieChart>
                {/* Centre label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">
                    {Math.round(usagePercentage)}%
                  </span>
                  <span className="text-xs text-gray-400">used</span>
                </div>
              </div>

              <div className="mt-4 flex w-full justify-around text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">{usedCredits}</p>
                  <p className="text-xs text-gray-400">Used</p>
                </div>
                <div className="w-px bg-gray-100" />
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {maxCredits - usedCredits}
                  </p>
                  <p className="text-xs text-gray-400">Remaining</p>
                </div>
                <div className="w-px bg-gray-100" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{maxCredits}</p>
                  <p className="text-xs text-gray-400">Total</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Daily activity sparkline ────────────────────────────── */}
      {hasGenerations && (
        <div className="rounded-2xl border bg-white p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900">
              Activity Heatmap
            </h2>
            <p className="mt-0.5 text-sm text-gray-400">
              Generation activity — last 30 days
            </p>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={generationsByDay}
              margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
              <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                {generationsByDay.map((entry, i) => (
                  <Cell key={i}
                    fill={entry.count > 0 ? "#111827" : "#F3F4F6"}
                    opacity={entry.count > 0
                      ? 0.3 + (entry.count / Math.max(...generationsByDay.map(d => d.count))) * 0.7
                      : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-between text-xs text-gray-300">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-xl bg-gray-50">
      <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24">
        <path d="M3 3v18h18M7 16l4-4 4 4 4-4"
          stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}