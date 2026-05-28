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

import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

import PreviewModal from "@/components/preview/previewModal";

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

    price: z.string().optional(),
});

type FormData = z.infer<
  typeof formSchema
>;

type VariantKey =
  | "v1"
  | "v2"
  | "v3";

interface GenerateResponse {
 descriptions:  {v1: string;
  v2: string;
  v3: string;
  hsn_code?: string;
  hsn_description?: string;
  category_path?: string;
  platform_category?: string;
    platform?: string;
},
  freeImageAnalysisDate?: string | null;
  freeImageAnalysesUsed?: number | null;

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

  const [productImage, setProductImage] =
  useState<string | null>(null);

const [previewOpen, setPreviewOpen] =
  useState(false);  

  

  const [analysis, setAnalysis] =
  useState<{
    v1: any;
    v2: any;
    v3: any;
  } | null>(null);

const [analysisLoading, setAnalysisLoading] =
  useState(false);

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


  const [
  imageAnalysis,
  setImageAnalysis,
] = useState<any>(null);

const [
  imageAnalysisLoading,
  setImageAnalysisLoading,
] = useState(false);

const [showWhyAI, setShowWhyAI] =
  useState(false);

const [
  imageBase64,
  setImageBase64,
] = useState("");

const [
  hasGenerated,
  setHasGenerated,
] = useState(false);

const [
  imageAlreadyAnalyzed,
  setImageAlreadyAnalyzed,
] = useState(false);

const [
  listingAlreadyAnalyzed,
  setListingAlreadyAnalyzed,
] = useState(false);

const freeImageAnalysisAvailable = result?.freeImageAnalysisDate && new Date(result.freeImageAnalysisDate) > new Date() && result?.freeImageAnalysesUsed != null && result.freeImageAnalysesUsed < 1;

  const {
    register,
    handleSubmit,
    setValue,
      watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver:
      zodResolver(formSchema),
  });

  const router = useRouter();

   const watchedPlatform = watch("platform");

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
      setListingAlreadyAnalyzed(
  false
);

      if (data.price) {
  const priceStr   = data.price.replace(/[^\d]/g, "");
  const v1HasPrice = json.v1?.includes(priceStr);
  const v2HasPrice = json.v2?.includes(priceStr);
  const v3HasPrice = json.v3?.includes(priceStr);

  if (!v1HasPrice || !v2HasPrice || !v3HasPrice) {
    toast.warning(
      "Price may not have been applied correctly — please check the output before copying."
    );
  }
}

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
      setHasGenerated(true);
      setListingAlreadyAnalyzed(
  false
);

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

  // analyze image whenever a new image is uploaded for preview
 async function analyzeImage() {
  try {
   

    if (!imageBase64) {
      console.error(
        "NO BASE64 IMAGE FOUND"
      );

      return;
    }

    setImageAnalysisLoading(
      true
    );

    const response =
      await fetch(
        "/api/image-analysis",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            image: imageBase64,
            platform: watchedPlatform,
            productName: lastFormData?.productName || "",
            description: result?.descriptions?.v1 || "",
          }),
        }
      );

   
    const data =
      await response.json();

   
    setImageAnalysis(data);
    setImageAlreadyAnalyzed(true);
  } catch (err) {
    console.error(
      "IMAGE ANALYSIS ERROR:",
      err
    );
  } finally {
    setImageAnalysisLoading(
      false
    );
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
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

         <div className="flex flex-wrap items-center gap-2">
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
          <p className="break-words whitespace-pre-wrap text-sm leading-7 text-gray-300">
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex min-w-0 flex-col gap-8 overflow-x-hidden">
      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-3xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-lg shadow-fuchsia-500/20">
            <Wand2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
             Marketplace Intelligence Studio
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
             Generate platform-aware ecommerce listings optimized for marketplace behavior, buyer psychology, and conversion performance.
            </p>
          </div>
          
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
  {[
    "Amazon Optimized",
    "Instagram Native",
    "WhatsApp Selling",
  ].map((item) => (
    <div
      key={item}
      className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2.5 py-1 text-[11px] text-fuchsia-200 backdrop-blur-xl"
    >
      {item}
    </div>
  ))}
</div>
      </div>

      {/* Workspace */}
      <div className="grid min-w-0 gap-8 xl:grid-cols-[420px_1fr]">
        {/* LEFT PANEL */}
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-4 sm:p-7 backdrop-blur-2xl">
          <div className="mb-7">
            <h2 className="text-xl font-semibold text-white">
              Product Details
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Configure your AI
              generation settings.
            </p>
          </div>

         <div className="mb-6 rounded-3xl border border-cyan-500/10 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 p-4 backdrop-blur-xl">
  <button
    type="button"
    onClick={() =>
      setShowWhyAI(
        !showWhyAI
      )
    }
    className="flex w-full items-center justify-between"
  >
    <div>
      <h3 className="text-sm font-semibold text-white">
        Why not generic AI?
      </h3>

      <p className="mt-1 text-xs text-gray-400">
        See how DescGen India differs from basic AI generation
      </p>
    </div>

    <div
      className={`text-gray-400 transition-transform duration-300 ${
        showWhyAI
          ? "rotate-180"
          : ""
      }`}
    >
      ▼
    </div>
  </button>

  <div
    className={`grid transition-all duration-300 ${
      showWhyAI
        ? "mt-4 grid-rows-[1fr] opacity-100"
        : "grid-rows-[0fr] opacity-0"
    }`}
  >
    <div className="overflow-hidden">
      <p className="text-xs leading-6 text-gray-300">
        Generic AI tools generate the same style of content for every platform.

        DescGen India adapts listings for marketplace behavior, buyer psychology, formatting patterns, mobile readability, and platform-specific conversion structure.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          "Platform-aware formatting",
          "Marketplace-native tone",
          "Listing previews",
          "AI listing scoring",
          "Image compatibility analysis",
        ].map((item) => (
          <div
            key={item}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-gray-300"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
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
                className={`w-full min-w-0 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition ${
  errors.productName
    ? "border-red-500/60"
    : "border-white/10 focus:border-fuchsia-500/40"
}`}
                 
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
                className="min-h-[140px] w-full min-w-0 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-fuchsia-500/40"
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
                  "Myntra",
                  "Instagram",
                  "Facebook",
                  "WhatsApp"
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
                    className={`h-[52px] w-full rounded-2xl border
                      
                      ${
  errors[
    field.name as keyof FormData
  ]
    ? "border-red-500/60"
    : "border-white/10"
}

                      bg-black/30 px-4 text-white outline-none transition-all duration-300 hover:border-fuchsia-500/30 hover:bg-gradient-to-r hover:from-fuchsia-500/10 hover:to-cyan-500/10 focus:border-fuchsia-500/40 focus:bg-gradient-to-r focus:from-fuchsia-500/10 focus:to-cyan-500/10`}
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

            
           

{(watchedPlatform === "WhatsApp" || watchedPlatform === "Facebook") && (
  <div className="flex flex-col gap-1">
    <input
      type="text"
      placeholder="Product price e.g. Rs.499 (shown in caption)"
      className="w-full min-w-0 h-[52px] rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition-all duration-300 hover:border-fuchsia-500/30 focus:border-fuchsia-500/40 focus:bg-gradient-to-r focus:from-fuchsia-500/10 focus:to-cyan-500/10"
      {...register("price")}
    />
    <p className="text-xs text-gray-400">
      Optional but recommended — buyers expect to see price on {watchedPlatform}
    </p>
  </div>
)}

{/* // Product Image upload option for preview (not sent to API) */}
<div className="flex flex-col gap-2">
  <label className="text-sm font-medium text-gray-300">
    Product Image (Optional)
  </label>

 <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend = () => {
      setImageBase64(
        reader.result as string
      );
    };

    reader.readAsDataURL(
      file
    );

    setProductImage(
      URL.createObjectURL(file)
    );
    setImageAlreadyAnalyzed(false);

setImageAnalysis(null);
  }}
  className="w-full min-w-0 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-400 file:mr-4 file:rounded-xl file:border-0 file:bg-fuchsia-500/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-fuchsia-500/30"
/>

  <p className="text-xs text-gray-500">
    Used for marketplace preview simulation and AI image compatibility analysis. Images are never stored.
  </p>
</div>

{/* product price input for listing previews only */}

<div className="flex flex-col gap-2">
  <label className="text-sm font-medium text-gray-300">
    Product Price (Optional)
  </label>

  <input
    type="text"
   {...register("price")}
    placeholder="499"
    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-fuchsia-500/40"
  />

  <p className="text-xs text-gray-500">
    Used only for listing previews.
  </p>
</div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-4 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:opacity-50"
            >
              <Sparkles className="h-5 w-5" />

              {
  loading
    ? "Generating marketplace-aware listings..."
    : hasGenerated
    ? "Generate Again"
    : "Generate Marketplace Listings"
}
            </button>
          </form>

          <p className="mt-3 text-center text-xs leading-5 text-gray-500">
  Optimized for Indian ecommerce sellers across Amazon, Flipkart, Myntra, Meesho, Instagram, WhatsApp & more.
</p>
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
                  Generate marketplace-aware listings, preview how buyers may experience your product across platforms, and optimize for marketplace-specific engagement behavior.
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
           
            <div className="flex w-full flex-col items-stretch sm:items-end">
  <button
  disabled={
  analysisLoading ||
  listingAlreadyAnalyzed
}
   onClick={async () => {
  try {
    setAnalysisLoading(true);

    const response =
  await fetch(
    "/api/listing-analysis",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        platform:
          lastFormData?.platform,

        variants: {
  v1: result?.descriptions?.v1,
  v2: result?.descriptions?.v2,
  v3: result?.descriptions?.v3,
},
      }),
    }
  );

const res =
  await response.json();

    setAnalysis(res as any);

    setListingAlreadyAnalyzed(
  true
);

    setPreviewOpen(true);
  } catch (err) {
    console.error(err);
  } finally {
    setAnalysisLoading(false);
  }
}}
    className="mt-3 flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-4 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:opacity-50"
>
 {
  analysisLoading
    ? 
     <div className="flex items-center gap-2">
    <Loader2 className="h-4 w-4 animate-spin" />

    Analyzing...
  </div>
    : listingAlreadyAnalyzed
    ? "Listing already analyzed"
    : "Analyze Listing"
}
  </button>

  <p className="mt-2 px-1 text-center text-xs leading-5 text-gray-500 sm:text-right">
  {
    listingAlreadyAnalyzed
      ? "Generate or regenerate listings to analyze again."
      : "AI evaluates readability, engagement, SEO structure, and marketplace compatibility."
  }
</p>
</div>

              <VariantCard
                variantKey="v1"
                text={result.descriptions?.v1}
              />

              <VariantCard
                variantKey="v2"
                text={result.descriptions?.v2}
              />

              <VariantCard
                variantKey="v3"
                text={result.descriptions?.v3}
              />
            </>
          )}

          {result && result.descriptions?.hsn_code && (
<div className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl">
    <h2 className="mb-4 font-semibold text-white">
      Listing Helper
    </h2>
    <div className="flex flex-col gap-3 text-sm">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between rounded-xl bg-white/5 p-3">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">HSN Code</p>
          <p className="font-mono font-semibold text-white">{result.descriptions?.hsn_code}</p>
          <p className="text-xs text-gray-500 mt-0.5">{result.descriptions?.hsn_description}</p>
        </div>
       <button
  onClick={() =>
    handleCopy(
      result.descriptions?.hsn_code || "",
      "hsn"
    )
  }
  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 transition hover:bg-white/10"
>
  Copy
</button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between rounded-xl bg-white/5 p-3">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Category Path</p>
          <p className="font-medium text-white">{result.descriptions?.category_path}</p>
        </div>
        <button
          onClick={() =>
            handleCopy(
              result.descriptions?.category_path || "",
              "category"
            )
          }
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 transition hover:bg-white/10"
        >
          Copy
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between rounded-xl bg-white/5 p-3">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">{result.descriptions?.platform || "Platform"} Category</p>
          <p className="font-medium text-white">{result.descriptions?.platform_category}</p>
        </div>
        <button
          onClick={() =>
            handleCopy(
              result.descriptions?.platform_category || "",
              "platform_category"
            )
          }
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 transition hover:bg-white/10"
        >
          Copy
        </button>
      </div>

    </div>
    <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
  <p className="text-xs leading-6 text-amber-200">
    AI suggestion — HSN codes may not always
    be accurate for GST compliance, especially
    for niche products. Verify with a CA or
    the official GST portal before filing.
  </p>

  <a
    href="https://services.gst.gov.in/services/searchhsnsac"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-3 inline-flex items-center text-xs font-medium text-amber-300 underline hover:text-amber-200"
  >
    Verify HSN code on GST Portal →
  </a>
</div>
  </div>
)}

        </div>
      </div>

{/* preview modal for showing listing preview on Instagram/WhatsApp with image and description (test modal) */}
      <PreviewModal

  open={previewOpen}
  onClose={() =>{
    setPreviewOpen(false);
    setAnalysis(null);
    setImageAnalysis(null);
    setImageAlreadyAnalyzed(false);

  }
    
  }
  platform={
    lastFormData?.platform || ""
  }
  result={{
  v1: result?.descriptions?.v1 || "",
  v2: result?.descriptions?.v2 || "",
  v3: result?.descriptions?.v3 || "",
}}
  image={productImage}
  analysis={analysis}
analysisLoading={analysisLoading}
price={watch("price")}

imageAnalysis={imageAnalysis}

imageAnalysisLoading={
  imageAnalysisLoading
}

imageAlreadyAnalyzed={
  imageAlreadyAnalyzed
}

onAnalyzeImage={
  analyzeImage
}

freeImageAnalysisAvailable={
  freeImageAnalysisAvailable
}
/>

    </div>

  );
}

