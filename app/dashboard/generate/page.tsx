"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";

import { ratelimit } from "@/lib/ratelimit";

import {
  Sparkles,
  Copy,
  RefreshCw,
  Wand2,
} from "lucide-react";

const formSchema = z.object({
  productName: z
    .string()
    .min(
      3,
      "Product name must be at least 3 characters"
    ),

  features: z
    .string()
    .min(
      10,
      "Features must be at least 10 characters"
    ),

  platform: z
    .string()
    .min(
      1,
      "Please select a platform"
    ),

  tone: z
    .string()
    .min(
      1,
      "Please select a tone"
    ),

  language: z
    .string()
    .min(
      1,
      "Please select a language"
    ),
});

type FormData = z.infer<
  typeof formSchema
>;

type VariantKey =
  | "v1"
  | "v2"
  | "v3";

interface GenerateResponse {
  v1: string;
  v2: string;
  v3: string;
}

const VARIANT_LABELS: Record<
  VariantKey,
  string
> = {
  v1: "Emotional",
  v2: "Features",
  v3: "Punchy",
};

export default function GeneratePage() {
  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<GenerateResponse | null>(
      null
    );

  const [copied, setCopied] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    regenerating,
    setRegenerating,
  ] = useState<VariantKey | null>(
    null
  );

  const [
    lastFormData,
    setLastFormData,
  ] = useState<FormData | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver:
      zodResolver(formSchema),
  });

  const router = useRouter();

  async function onSubmit(
    data: FormData
  ) {
    try {
      setLoading(true);

      setResult(null);

      setError("");

      setSuccess("");

      setLastFormData(data);

      const response =
        await fetch(
          "/api/generate",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              data
            ),
          }
        );

      const json =
        await response.json();

      if (!response.ok) {
        if (
          response.status ===
            403 &&
          json.code ===
            "NO_CREDITS"
        ) {
          setError(
            "No credits remaining. Upgrade required."
          );

          return;
        }

        setError(
          json.error ||
            "Something went wrong"
        );

        return;
      }

      setResult(json);

      setSuccess(
        "Descriptions generated successfully."
      );

      router.refresh();

    } catch (err) {
      console.error(err);

      setError(
        "Generation failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate(
    variant: VariantKey
  ) {
    if (!lastFormData) return;

    setRegenerating(variant);

    setError("");

    try {
      const response =
        await fetch(
          "/api/generate",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              ...lastFormData,

              onlyVariant:
                variant,
            }),
          }
        );

      const json =
        await response.json();

      if (!response.ok) {
        if (
          response.status ===
            403 &&
          json.code ===
            "NO_CREDITS"
        ) {
          setError(
            "No credits remaining. Upgrade required."
          );

          return;
        }

        setError(
          json.error ||
            "Regeneration failed."
        );

        return;
      }

      setResult((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          [variant]:
            json[variant],
        };
      });

      router.refresh();

    } catch (err) {
      console.error(err);

      setError(
        "Regeneration failed. Please try again."
      );

    } finally {
      setRegenerating(null);
    }
  }

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
        () => setCopied(""),
        2000
      );

    } catch (err) {
      console.error(err);
    }
  }

  function VariantCard({
    variantKey,
    text,
  }: {
    variantKey: VariantKey;
    text: string;
  }) {
    const isRegenerating =
      regenerating === variantKey;

    const isCopied =
      copied === variantKey;

    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20">
              <Sparkles className="h-5 w-5 text-fuchsia-400" />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Variant{" "}
                {variantKey.replace(
                  "v",
                  ""
                )}
              </h2>

              <p className="text-sm text-gray-400">
                {
                  VARIANT_LABELS[
                    variantKey
                  ]
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                handleRegenerate(
                  variantKey
                )
              }
              disabled={
                isRegenerating ||
                !!regenerating
              }
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 disabled:opacity-40"
            >
              <RefreshCw className="h-4 w-4" />

              {isRegenerating
                ? "Redoing..."
                : "Redo"}
            </button>

            <button
              onClick={() =>
                handleCopy(
                  text,
                  variantKey
                )
              }
              disabled={
                isRegenerating
              }
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 disabled:opacity-40"
            >
              <Copy className="h-4 w-4" />

              {isCopied
                ? "Copied!"
                : "Copy"}
            </button>
          </div>
        </div>

        {isRegenerating ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 rounded bg-white/10" />

            <div className="h-4 w-5/6 rounded bg-white/10" />

            <div className="h-4 w-4/6 rounded bg-white/10" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-8 text-gray-300">
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-8">
      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-lg shadow-fuchsia-500/20">
            <Wand2 className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              AI Description Studio
            </h1>

            <p className="mt-1 text-gray-400">
              Generate marketplace-ready
              product descriptions with
              AI.
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300">
          {success}
        </div>
      )}

      {/* Workspace */}
      <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
        {/* LEFT PANEL */}
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur-2xl">
          <div className="mb-7">
            <h2 className="text-xl font-semibold text-white">
              Product Details
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Configure your AI
              generation settings.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            className="flex flex-col gap-5"
          >
            {/* Product Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">
                Product Name
              </label>

              <input
                placeholder="Enter product name"
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-fuchsia-500/40"
                {...register(
                  "productName"
                )}
              />

              {errors.productName && (
                <p className="text-sm text-red-400">
                  {
                    errors
                      .productName
                      .message
                  }
                </p>
              )}
            </div>

            {/* Features */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">
                Product Features
              </label>

              <textarea
                placeholder="Enter product features"
                className="min-h-[140px] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-fuchsia-500/40"
                {...register(
                  "features"
                )}
              />

              {errors.features && (
                <p className="text-sm text-red-400">
                  {
                    errors
                      .features
                      .message
                  }
                </p>
              )}
            </div>

            {/* Selects */}
            {[
              {
                name:
                  "platform",

                label:
                  "Platform",

                options: [
                  "Meesho",
                  "Flipkart",
                  "Amazon",
                  "Instagram",
                ],
              },

              {
                name:
                  "tone",

                label:
                  "Tone",

                options: [
                  "Friendly",
                  "Luxury",
                  "Professional",
                  "Emotional",
                ],
              },

              {
                name:
                  "language",

                label:
                  "Language",

                options: [
                  "English",
                  "Hindi",
                  "Telugu",
                ],
              },
            ].map(
              (
                field
              ) => (
                <div
                  key={
                    field.name
                  }
                  className="flex flex-col gap-2"
                >
                  <label className="text-sm font-medium text-gray-300">
                    {
                      field.label
                    }
                  </label>

                  <select
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-fuchsia-500/40"
                    {...register(
                      field.name as keyof FormData
                    )}
                  >
                    <option value="">
                      Select{" "}
                      {
                        field.label
                      }
                    </option>

                    {field.options.map(
                      (
                        option
                      ) => (
                        <option
                          key={
                            option
                          }
                          value={
                            option
                          }
                        >
                          {
                            option
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>
              )
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-4 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:opacity-50"
            >
              <Sparkles className="h-5 w-5" />

              {loading
                ? "Generating..."
                : "Generate Descriptions"}
            </button>
          </form>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-5">
          {!result &&
            !loading && (
              <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-[32px] border border-dashed border-white/10 bg-white/5 p-10 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10">
                  <Sparkles className="h-10 w-10 text-fuchsia-400" />
                </div>

                <h2 className="mt-6 text-2xl font-semibold text-white">
                  Ready to Generate
                </h2>

                <p className="mt-3 max-w-md text-gray-400">
                  Fill in product details
                  and let AI generate
                  optimized descriptions
                  for Indian marketplaces.
                </p>
              </div>
            )}

          {loading && (
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map(
                (i) => (
                  <div
                    key={i}
                    className="h-48 animate-pulse rounded-[32px] border border-white/10 bg-white/5"
                  />
                )
              )}
            </div>
          )}

          {result && (
            <>
              <VariantCard
                variantKey="v1"
                text={result.v1}
              />

              <VariantCard
                variantKey="v2"
                text={result.v2}
              />

              <VariantCard
                variantKey="v3"
                text={result.v3}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}