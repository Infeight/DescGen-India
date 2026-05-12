"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters"),
  features:    z.string().min(10, "Features must be at least 10 characters"),
  platform:    z.string().min(1, "Please select a platform"),
  tone:        z.string().min(1, "Please select a tone"),
  language:    z.string().min(1, "Please select a language"),
});

type FormData = z.infer<typeof formSchema>;
type VariantKey = "v1" | "v2" | "v3";

interface GenerateResponse {
  v1: string;
  v2: string;
  v3: string;
}

const VARIANT_LABELS: Record<VariantKey, string> = {
  v1: "Emotional",
  v2: "Features",
  v3: "Punchy",
};

export default function GeneratePage() {
  const [loading,      setLoading]      = useState(false);
  const [result,       setResult]       = useState<GenerateResponse | null>(null);
  const [copied,       setCopied]       = useState("");
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");
  const [regenerating, setRegenerating] = useState<VariantKey | null>(null);  // ← new
  const [lastFormData, setLastFormData] = useState<FormData | null>(null);    // ← new

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  async function onSubmit(data: FormData) {
    try {
      setLoading(true);
      setResult(null);
      setError("");
      setSuccess("");
      setLastFormData(data);  // ← save form values for regenerate

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        if (response.status === 403 && json.code === "NO_CREDITS") {
          setError("No credits remaining. Upgrade required.");
          return;
        }
        setError(json.error || "Something went wrong");
        return;
      }

      setResult(json);
      setSuccess("Descriptions generated successfully.");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Regenerate single variant ──────────────────────────────────────────────
  async function handleRegenerate(variant: VariantKey) {
    if (!lastFormData) return;
    setRegenerating(variant);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lastFormData,
          onlyVariant: variant,   // ← tells API to generate only this variant
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        if (response.status === 403 && json.code === "NO_CREDITS") {
          setError("No credits remaining. Upgrade required.");
          return;
        }
        setError(json.error || "Regeneration failed.");
        return;
      }

      // merge only the regenerated variant into existing result
      setResult((prev) => {
        if (!prev) return prev;
        return { ...prev, [variant]: json[variant] };  // ← only update one key
      });
      router.refresh();

    } catch (err) {
      console.error(err);
      setError("Regeneration failed. Please try again.");
    } finally {
      setRegenerating(null);
    }
  }

  async function handleCopy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 30000);
    } catch (err) {
      console.error(err);
    }
  }

  // ── Variant card ───────────────────────────────────────────────────────────
  function VariantCard({ variantKey, text }: { variantKey: VariantKey; text: string }) {
    const isRegenerating = regenerating === variantKey;
    const isCopied       = copied === variantKey;

    return (
      <div className="rounded-2xl border bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">
              Variant {variantKey.replace("v", "")}
            </h2>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {VARIANT_LABELS[variantKey]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Redo button */}
            <button
              onClick={() => handleRegenerate(variantKey)}
              disabled={isRegenerating || !!regenerating}
              className="rounded-lg border px-3 py-1 text-sm transition
                         hover:bg-gray-100 disabled:cursor-not-allowed
                         disabled:opacity-40 active:scale-95"
            >
              {isRegenerating ? "Redoing..." : "↺ Redo"}
            </button>

            {/* Copy button */}
            <button
              onClick={() => handleCopy(text, variantKey)}
              disabled={isRegenerating}
              className="rounded-lg border px-3 py-1 text-sm transition
                         hover:bg-gray-100 disabled:opacity-40"
            >
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Show shimmer while regenerating this variant */}
        {isRegenerating ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 w-full rounded bg-gray-100" />
            <div className="h-3 w-5/6 rounded bg-gray-100" />
            <div className="h-3 w-4/6 rounded bg-gray-100" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Generate Description</h1>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-xl border p-6">
        <div className="flex flex-col gap-1">
          <input placeholder="Product Name" className="rounded border p-3" {...register("productName")} />
          {errors.productName && <p className="text-sm text-red-500">{errors.productName.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <textarea placeholder="Product Features" className="min-h-[120px] rounded border p-3" {...register("features")} />
          {errors.features && <p className="text-sm text-red-500">{errors.features.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <select className="rounded border p-3" {...register("platform")}>
            <option value="">Select Platform</option>
            <option value="Meesho">Meesho</option>
            <option value="Flipkart">Flipkart</option>
            <option value="Amazon">Amazon</option>
            <option value="Instagram">Instagram</option>
          </select>
          {errors.platform && <p className="text-sm text-red-500">{errors.platform.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <select className="rounded border p-3" {...register("tone")}>
            <option value="">Select Tone</option>
            <option value="Friendly">Friendly</option>
            <option value="Luxury">Luxury</option>
            <option value="Professional">Professional</option>
            <option value="Emotional">Emotional</option>
          </select>
          {errors.tone && <p className="text-sm text-red-500">{errors.tone.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <select className="rounded border p-3" {...register("language")}>
            <option value="">Select Language</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Telugu">Telugu</option>
          </select>
          {errors.language && <p className="text-sm text-red-500">{errors.language.message}</p>}
        </div>

        <button type="submit" disabled={loading}
          className="rounded bg-black p-3 text-white disabled:opacity-50">
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {result && (
        <div className="flex flex-col gap-4">
          <VariantCard variantKey="v1" text={result.v1} />
          <VariantCard variantKey="v2" text={result.v2} />
          <VariantCard variantKey="v3" text={result.v3} />
        </div>
      )}
    </div>
  );
}