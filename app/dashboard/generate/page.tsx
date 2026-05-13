"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";

import {
  Sparkles,
  Copy,
  RefreshCw,
  Wand2,
} from "lucide-react";

import { toast } from "sonner";

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

const STARTER_PRODUCTS = [
  {
    name:
      "Women Cotton Kurti",

    features:
      "Soft breathable cotton, floral print, lightweight summer wear, comfortable fit",

    platform:
      "Meesho",

    tone:
      "Friendly",

    language:
      "English",
  },

  {
    name:
      "Wireless Earbuds",

    features:
      "Bluetooth 5.3, deep bass, fast charging, noise cancellation, gaming mode",

    platform:
      "Amazon",

    tone:
      "Professional",

    language:
      "English",
  },

  {
    name:
      "Steel Water Bottle",

    features:
      "Leak-proof, insulated stainless steel, 1 litre capacity, durable body",

    platform:
      "Flipkart",

    tone:
      "Professional",

    language:
      "English",
  },

  {
    name:
      "Ayurvedic Hair Oil",

    features:
      "Natural herbs, reduces hair fall, improves scalp health, non-sticky formula",

    platform:
      "Instagram",

    tone:
      "Emotional",

    language:
      "English",
  },
];

export default function GeneratePage() {
  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<GenerateResponse | null>(
      null
    );

  const [copied, setCopied] =
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
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver:
      zodResolver(formSchema),
  });

  const router = useRouter();

  async function onSubmit(
    data: FormData
  ) {
    const toastId =
      toast.loading(
        "Generating AI descriptions..."
      );

    try {
      setLoading(true);

      setResult(null);

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
          toast.error(
            "No credits remaining. Upgrade required.",
            {
              id: toastId,
            }
          );

          router.push(
            "/pricing"
          );

          return;
        }

        toast.error(
          json.error ||
            "Something went wrong",
          {
            id: toastId,
          }
        );

        return;
      }

      setResult(json);

      toast.success(
        "Descriptions generated successfully.",
        {
          id: toastId,
        }
      );

      router.refresh();

    } catch (err) {
      console.error(err);

      toast.error(
        "Generation failed. Please try again.",
        {
          id: toastId,
        }
      );

    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate(
    variant: VariantKey
  ) {
    if (!lastFormData) return;

    const toastId =
      toast.loading(
        "Regenerating variant..."
      );

    setRegenerating(variant);

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
          toast.error(
            "No credits remaining. Upgrade required.",
            {
              id: toastId,
            }
          );

          router.push(
            "/pricing"
          );

          return;
        }

        toast.error(
          json.error ||
            "Regeneration failed.",
          {
            id: toastId,
          }
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

      toast.success(
        "Variant regenerated",
        {
          id: toastId,
        }
      );

      router.refresh();

    } catch (err) {
      console.error(err);

      toast.error(
        "Regeneration failed. Please try again.",
        {
          id: toastId,
        }
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

      toast.success(
        "Copied to clipboard"
      );

      setTimeout(
        () => setCopied(""),
        2000
      );

    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to copy"
      );
    }
  }

  function applyStarter(
    starter: (typeof STARTER_PRODUCTS)[0]
  ) {
    setValue(
      "productName",
      starter.name
    );

    setValue(
      "features",
      starter.features
    );

    setValue(
      "platform",
      starter.platform
    );

    setValue(
      "tone",
      starter.tone
    );

    setValue(
      "language",
      starter.language
    );

    toast.success(
      "Starter template applied"
    );
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

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {STARTER_PRODUCTS.map(
                    (item) => (
                      <button
                        key={
                          item.name
                        }
                        onClick={() =>
                          applyStarter(
                            item
                          )
                        }
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                      >
                        {
                          item.name
                        }
                      </button>
                    )
                  )}
                </div>
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