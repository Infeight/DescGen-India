"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Sparkles,
  Copy,
  ChevronDown,
  Clock3,
  Package,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const supabase =
  createClient();

interface Generation {
  id: string;

  product_name: string;

  features: string;

  platform: string;

  output_v1: string;

  output_v2: string;

  output_v3: string;

  created_at: string;
}

const VARIANTS = [
  {
    key: "output_v1",
    label:
      "Emotional",
  },

  {
    key: "output_v2",
    label:
      "Features",
  },

  {
    key: "output_v3",
    label:
      "Punchy",
  },
] as const;

export default function HistoryPage() {
  const [history, setHistory] =
    useState<
      Generation[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [copied, setCopied] =
    useState("");

  async function fetchHistory() {
    try {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) return;

      const {
        data,
        error,
      } =
        await supabase
          .from(
            "generations"
          )
          .select("*")
          .eq(
            "user_id",
            user.id
          )
          .order(
            "created_at",
            {
              ascending:
                false,
            }
          );

      if (error) {
        console.error(
          error
        );

        return;
      }

      setHistory(
        data || []
      );

    } catch (error) {
      console.error(
        error
      );

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  async function handleCopy(
    text: string,
    key: string
  ) {
    try {
      await navigator.clipboard.writeText(
        text
      );

      setCopied(key);

      setTimeout(
        () =>
          setCopied(""),
        2000
      );

    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3].map(
          (i) => (
            <div
              key={i}
              className="h-52 animate-pulse rounded-[32px] border border-white/10 bg-white/5"
            />
          )
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-8">
      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-lg shadow-fuchsia-500/20">
          <Clock3 className="h-7 w-7 text-white" />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white">
            Generation History
          </h1>

          <p className="mt-1 text-gray-400">
            Browse and manage your
            previously generated
            AI descriptions.
          </p>
        </div>
      </div>

      {/* Empty */}
      {history.length ===
        0 && (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[32px] border border-dashed border-white/10 bg-white/5 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10">
            <Sparkles className="h-10 w-10 text-fuchsia-400" />
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-white">
            No Generations Yet
          </h2>

          <p className="mt-3 max-w-md text-gray-400">
            Your AI-generated
            descriptions will
            appear here after
            generation.
          </p>
        </div>
      )}

      {/* History */}
      <div className="flex flex-col gap-6">
        {history.map(
          (item) => (
            <HistoryCard
              key={item.id}
              item={item}
              copied={copied}
              onCopy={
                handleCopy
              }
            />
          )
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// History Card
// ─────────────────────────────────────────────
function HistoryCard({
  item,
  copied,
  onCopy,
}: {
  item: Generation;

  copied: string;

  onCopy: (
    text: string,
    key: string
  ) => void;
}) {
  const [expanded, setExpanded] =
    useState(false);

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      {/* Top */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10">
            <Package className="h-6 w-6 text-fuchsia-400" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              {
                item.product_name
              }
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                {
                  item.platform
                }
              </span>

              <span className="text-xs text-gray-500">
                {new Date(
                  item.created_at
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day:
                      "numeric",
                    month:
                      "short",
                    year:
                      "numeric",
                  }
                )}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            setExpanded(
              !expanded
            )
          }
          className="flex items-center gap-2 self-start rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10"
        >
          <ChevronDown
            className={`h-4 w-4 transition ${
              expanded
                ? "rotate-180"
                : ""
            }`}
          />

          {expanded
            ? "Hide"
            : "View"}
        </button>
      </div>

      {/* Features */}
      <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Product Features
        </h3>

        <p className="text-sm leading-7 text-gray-300">
          {item.features}
        </p>
      </div>

      {/* Variants */}
      {expanded && (
        <div className="mt-6 flex flex-col gap-5">
          {VARIANTS.map(
            (variant) => {
              const text =
                item[
                  variant.key
                ];

              const key =
                `${item.id}-${variant.key}`;

              return (
                <div
                  key={
                    variant.key
                  }
                  className="rounded-3xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {
                          variant.label
                        }{" "}
                        Variant
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        AI-generated
                        marketplace
                        copy
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        onCopy(
                          text,
                          key
                        )
                      }
                      className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10"
                    >
                      <Copy className="h-4 w-4" />

                      {copied ===
                      key
                        ? "Copied!"
                        : "Copy"}
                    </button>
                  </div>

                  <p className="whitespace-pre-wrap text-sm leading-8 text-gray-300">
                    {text}
                  </p>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}