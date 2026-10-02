"use client";

import { useState } from "react";
import { toast } from "sonner";

import type {
  DealType,
  DeliverableFormat,
  Platform,
  PricingInput,
} from "@/lib/creator/pricing/types";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface Deliverable {
  id: string;
  platform: Platform;
  format: DeliverableFormat;
  quantity: number;
  revisions: number;
  rawFootage: boolean;
  scriptByCreator: boolean;
  hookVariants: number;
  staysLive: boolean;
  liveDurationDays: number;
  linkRequired: boolean;
  brandTagRequired: boolean;
}

const PLATFORM_OPTIONS: {
  value: Platform;
  label: string;
}[] = [
  {
    value: "instagram",
    label: "Instagram",
  },
  {
    value: "tiktok",
    label: "TikTok",
  },
  {
    value: "youtube",
    label: "YouTube",
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
  },
];

const FORMAT_OPTIONS: {
  value: DeliverableFormat;
  label: string;
  platform: Platform;
}[] = [
  {
    value: "instagram_reel",
    label: "Instagram Reel",
    platform: "instagram",
  },
  {
    value: "instagram_story",
    label: "Instagram Story",
    platform: "instagram",
  },
  {
    value: "instagram_static",
    label: "Instagram Static Post",
    platform: "instagram",
  },
  {
    value: "instagram_carousel",
    label: "Instagram Carousel",
    platform: "instagram",
  },
  {
    value: "tiktok",
    label: "TikTok",
    platform: "tiktok",
  },
  {
    value: "youtube_short",
    label: "YouTube Short",
    platform: "youtube",
  },
  {
    value: "youtube_integration",
    label: "YouTube Integration",
    platform: "youtube",
  },
  {
    value: "youtube_dedicated",
    label: "Dedicated YouTube Video",
    platform: "youtube",
  },
];




const createDeliverable = (): Deliverable => ({
  id: crypto.randomUUID(),
  platform: "instagram",
  format: "instagram_reel",
  quantity: 1,
  revisions: 2,
  rawFootage: false,
  scriptByCreator: false,
  hookVariants: 1,
  staysLive: false,
  liveDurationDays: 30,
  linkRequired: false,
  brandTagRequired: false,
});

export default function PriceNegotiator() {
  const [step, setStep] = useState<Step>(1);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<any>(null);

  const [dealType, setDealType] =
    useState<DealType>("ugc");

  const [deliverables, setDeliverables] =
    useState<Deliverable[]>([
      createDeliverable(),
    ]);


    const [audience, setAudience] = useState({
  platform: "instagram" as Platform,
  followers: 0,
  medianViews: 0,
  averageViews: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  saves: 0,
  storyViews: 0,
  followerGrowth3m: 0,
  topCountry: "",
  cityTier: "",
  ageGroup: "",
  gender: "",
  bestPostViews: 0,
});


// step 4
const [creator, setCreator] = useState({
  niche: "",
  paidCollabs: "0" as "0" | "1-3" | "4-10" | "10+",
  productionQuality: "phone_only" as
    | "phone_only"
    | "phone_lighting_mic"
    | "professional",
  editing: "self_edited" as "self_edited" | "raw",
  portfolioUrl: "",
  provenResults: false,
  provenResultsNote: "",
  languages: [] as string[],
});

  /*
   * These states will be populated
   * in the next steps.
   */

  const [formData, setFormData] =
    useState<
      Partial<PricingInput>
    >({});

  function updateDeliverable(
    id: string,
    updates: Partial<Deliverable>
  ) {
    setDeliverables((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item
      )
    );
  }

  function addDeliverable() {
    setDeliverables((current) => [
      ...current,
      createDeliverable(),
    ]);
  }

  function removeDeliverable(
    id: string
  ) {
    if (deliverables.length === 1) {
      toast.error(
        "You need at least one deliverable."
      );
      return;
    }

    setDeliverables((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  }


// this connects ui and api
  const calculatePrice = async () => {
  try {
    setLoading(true);

    const pricingInput: PricingInput = {
      currency: "INR",
      dealType,
      deliverables,
      audience:
        dealType === "ugc"
          ? undefined
          : audience,
      creator,
      usage,
      brand,
      preferences,
    };

    const response = await fetch(
      "/api/creator/pricing",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pricingInput),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Unable to calculate pricing."
      );
    }

    console.log("PRICING RESULT:", data);

    setResult(data);
  } catch (error: any) {
    console.error(
      "PRICE CALCULATION ERROR:",
      error
    );

    toast.error(
      error?.message ||
        "Unable to calculate your pricing."
    );
  } finally {
    setLoading(false);
  }
};

  //////////

  async function nextStep() {
    if (step === 1 && !dealType) {
      toast.error(
        "Select a deal type first."
      );
      return;
    }

    if (
      step === 2 &&
      deliverables.length === 0
    ) {
      toast.error(
        "Add at least one deliverable."
      );
      return;
    }


    if (step === 3) {
  const requiresAudience =
    dealType === "influencer" || dealType === "hybrid";

  if (requiresAudience) {
    if (!audience.followers || audience.followers <= 0) {
      toast.error("Please enter your follower count.");
      return;
    }

    if (!audience.medianViews || audience.medianViews <= 0) {
      toast.error("Please enter your median views.");
      return;
    }
  }

  setStep(4);
  return;
}


if (step === 4) {
  if (!creator.niche.trim()) {
    toast.error("Please enter your creator niche.");
    return;
  }

  setStep(5);
  return;
}


if (step === 5) {
  setStep(6);
  return;
}


if (step === 6) {
  if (brand.offerAmount < 0) {
    toast.error("Offer amount cannot be negative.");
    return;
  }

  if (brand.productValue < 0) {
    toast.error("Product value cannot be negative.");
    return;
  }

  if (
    brand.commissionPercent < 0 ||
    brand.commissionPercent > 100
  ) {
    toast.error("Commission must be between 0% and 100%.");
    return;
  }

  if (brand.turnaroundDays < 1) {
    toast.error("Please enter a valid turnaround.");
    return;
  }

  setStep(7);
  return;
}

if (step === 7) {
  if (preferences.minimumRate < 0) {
    toast.error("Minimum rate cannot be negative.");
    return;
  }

  await calculatePrice();
  return;
}

    setStep(
      (current) =>
        Math.min(
          current + 1,
          7
        ) as Step
    );
  }

  function previousStep() {
    setStep(
      (current) =>
        Math.max(
          current - 1,
          1
        ) as Step
    );
  }



// for step 3


  function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-white">
        {title}
      </h3>

      {description && (
        <p className="mt-1 text-sm text-zinc-500">
          {description}
        </p>
      )}
    </div>
  );
}


  /* =========================================================
     STEP 3 — AUDIENCE
  ========================================================= */

  function AudienceStep({
  dealType,
  audience,
  updateAudience,
}: {
  dealType: DealType;
  audience: {
    platform: Platform;
    followers: number;
    medianViews: number;
    averageViews: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    storyViews: number;
    followerGrowth3m: number;
    topCountry: string;
    cityTier: string;
    ageGroup: string;
    gender: string;
    bestPostViews: number;
  };
  updateAudience: (
    key: keyof typeof audience,
    value: string | number
  ) => void;
}) {
  const isUGC = dealType === "ugc";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Tell us about your audience
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          These numbers help us estimate the value of an influencer or
          hybrid deal. Use your analytics rather than guessing whenever
          possible.
        </p>

        {isUGC && (
          <div className="mt-4 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-4">
            <p className="text-sm text-cyan-200">
              Audience data is optional for Pure UGC. UGC pricing focuses
              more on deliverables, production quality, experience and
              usage rights.
            </p>
          </div>
        )}
      </div>

      {/* Platform */}
      <section className="space-y-4">
        <SectionTitle
          title="Primary platform"
          description="Choose the platform whose audience metrics you're providing."
        />

        <SelectField
          label="Platform"
          value={audience.platform}
          onChange={(value) =>
            updateAudience("platform", value as Platform)
          }
          options={[
            { value: "instagram", label: "Instagram" },
            { value: "tiktok", label: "TikTok" },
            { value: "youtube", label: "YouTube" },
            { value: "whatsapp", label: "WhatsApp" },
          ]}
        />
      </section>

      {/* Reach */}
      <section className="space-y-4">
        <SectionTitle
          title="Reach & audience size"
          description="Median views are especially important for the pricing calculation."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <NumberField
            label="Followers"
            value={audience.followers}
            onChange={(value) => updateAudience("followers", value)}
            placeholder="e.g. 12500"
            min={0}
          />

          <NumberField
            label="Median views"
            value={audience.medianViews}
            onChange={(value) => updateAudience("medianViews", value)}
            placeholder="e.g. 8500"
            min={0}
            helpText="Preferred over average views because viral posts can skew averages."
          />

          <NumberField
            label="Average views"
            value={audience.averageViews}
            onChange={(value) => updateAudience("averageViews", value)}
            placeholder="Optional"
            min={0}
          />

          <NumberField
            label="Best recent post views"
            value={audience.bestPostViews}
            onChange={(value) =>
              updateAudience("bestPostViews", value)
            }
            placeholder="Optional"
            min={0}
          />

          <NumberField
            label="Story views"
            value={audience.storyViews}
            onChange={(value) => updateAudience("storyViews", value)}
            placeholder="Optional"
            min={0}
          />

          <NumberField
            label="Follower growth — last 3 months (%)"
            value={audience.followerGrowth3m}
            onChange={(value) =>
              updateAudience("followerGrowth3m", value)
            }
            placeholder="e.g. 12"
            min={0}
          />
        </div>
      </section>

      {/* Engagement */}
      <section className="space-y-4">
        <SectionTitle
          title="Engagement"
          description="Recent post averages are useful when available."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField
            label="Likes"
            value={audience.likes}
            onChange={(value) => updateAudience("likes", value)}
            placeholder="Optional"
            min={0}
          />

          <NumberField
            label="Comments"
            value={audience.comments}
            onChange={(value) => updateAudience("comments", value)}
            placeholder="Optional"
            min={0}
          />

          <NumberField
            label="Shares"
            value={audience.shares}
            onChange={(value) => updateAudience("shares", value)}
            placeholder="Optional"
            min={0}
          />

          <NumberField
            label="Saves"
            value={audience.saves}
            onChange={(value) => updateAudience("saves", value)}
            placeholder="Optional"
            min={0}
          />
        </div>
      </section>

      {/* Demographics */}
      <section className="space-y-4">
        <SectionTitle
          title="Audience demographics"
          description="Optional, but more complete information can improve confidence."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            label="Top audience country"
            value={audience.topCountry}
            onChange={(value) =>
              updateAudience("topCountry", value)
            }
            options={[
              { value: "", label: "Not sure" },
              { value: "India", label: "India" },
              { value: "United States", label: "United States" },
              { value: "United Kingdom", label: "United Kingdom" },
              { value: "United Arab Emirates", label: "UAE" },
              { value: "Canada", label: "Canada" },
              { value: "Australia", label: "Australia" },
              { value: "Other", label: "Other" },
            ]}
          />

          <SelectField
            label="City tier"
            value={audience.cityTier}
            onChange={(value) =>
              updateAudience("cityTier", value)
            }
            options={[
              { value: "", label: "Not sure" },
              { value: "tier_1", label: "Tier 1 cities" },
              { value: "tier_2", label: "Tier 2 cities" },
              { value: "tier_3", label: "Tier 3 / smaller cities" },
              { value: "mixed", label: "Mixed" },
            ]}
          />

          <SelectField
            label="Main age group"
            value={audience.ageGroup}
            onChange={(value) =>
              updateAudience("ageGroup", value)
            }
            options={[
              { value: "", label: "Not sure" },
              { value: "13_17", label: "13–17" },
              { value: "18_24", label: "18–24" },
              { value: "25_34", label: "25–34" },
              { value: "35_44", label: "35–44" },
              { value: "45_plus", label: "45+" },
              { value: "mixed", label: "Mixed" },
            ]}
          />

          <SelectField
            label="Main audience gender"
            value={audience.gender}
            onChange={(value) =>
              updateAudience("gender", value)
            }
            options={[
              { value: "", label: "Not sure" },
              { value: "women", label: "Mostly women" },
              { value: "men", label: "Mostly men" },
              { value: "mixed", label: "Mixed" },
            ]}
          />
        </div>
      </section>

      {/* Tip */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
        <div className="flex gap-3">
          <div className="mt-0.5 text-lg">💡</div>

          <div>
            <p className="text-sm font-medium text-white">
              Where to find these numbers
            </p>

            <p className="mt-1 text-sm leading-6 text-zinc-400">
              Check your Instagram, YouTube or TikTok analytics for
              follower count, median/average views, engagement and
              audience demographics. Don't inflate the numbers —
              accurate inputs produce more useful pricing guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


  const updateAudience = (
  key: keyof typeof audience,
  value: string | number
) => {
  setAudience((prev) => ({
    ...prev,
    [key]: value,
  }));
};




const updateCreator = (
  key: keyof typeof creator,
  value: string | boolean | string[]
) => {
  setCreator((prev) => ({
    ...prev,
    [key]: value,
  }));
};

const toggleLanguage = (language: string) => {
  setCreator((prev) => ({
    ...prev,
    languages: prev.languages.includes(language)
      ? prev.languages.filter((item) => item !== language)
      : [...prev.languages, language],
  }));
};



/* =========================================================
   STEP 4 — CREATOR
========================================================= */

function CreatorProfileStep({
  creator,
  updateCreator,
  toggleLanguage,
}: {
  creator: {
    niche: string;
    paidCollabs: "0" | "1-3" | "4-10" | "10+";
    productionQuality:
      | "phone_only"
      | "phone_lighting_mic"
      | "professional";
    editing: "self_edited" | "raw";
    portfolioUrl: string;
    provenResults: boolean;
    provenResultsNote: string;
    languages: string[];
  };
  updateCreator: (
    key: keyof typeof creator,
    value: string | boolean | string[]
  ) => void;
  toggleLanguage: (language: string) => void;
}) {
  const languages = [
    "English",
    "Hindi",
    "Telugu",
    "Tamil",
    "Kannada",
    "Malayalam",
    "Marathi",
    "Bengali",
    "Other",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Tell us about you
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Your niche, experience and production setup help us adjust
          the pricing guidance for the type of work you're offering.
        </p>
      </div>

      {/* Niche */}
      <section className="space-y-4">
        <SectionTitle
          title="Creator niche"
          description="What type of content do you primarily create?"
        />

        <input
          type="text"
          value={creator.niche}
          onChange={(e) =>
            updateCreator("niche", e.target.value)
          }
          placeholder="e.g. fashion, beauty, tech, fitness"
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-400/10"
        />

        <div className="flex flex-wrap gap-2">
          {[
            "Fashion",
            "Beauty",
            "Tech",
            "Fitness",
            "Food",
            "Travel",
            "Finance",
            "Education",
            "Gaming",
            "Lifestyle",
          ].map((niche) => (
            <button
              key={niche}
              type="button"
              onClick={() =>
                updateCreator("niche", niche)
              }
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                creator.niche.toLowerCase() ===
                niche.toLowerCase()
                  ? "border-fuchsia-400/50 bg-fuchsia-400/10 text-fuchsia-200"
                  : "border-white/10 bg-white/3 text-zinc-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {niche}
            </button>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <SectionTitle
          title="Paid collaboration experience"
          description="How many paid brand collaborations have you completed?"
        />

        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { value: "0", label: "None" },
            { value: "1-3", label: "1–3" },
            { value: "4-10", label: "4–10" },
            { value: "10+", label: "10+" },
          ].map((item) => {
            const selected =
              creator.paidCollabs === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  updateCreator(
                    "paidCollabs",
                    item.value
                  )
                }
                className={`rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-fuchsia-400/50 bg-fuchsia-400/10"
                    : "border-white/10 bg-white/3 hover:border-white/20"
                }`}
              >
                <p className="text-sm font-medium text-white">
                  {item.label}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {item.value === "0"
                    ? "Just getting started"
                    : "Paid brand deals"}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Production */}
      <section className="space-y-4">
        <SectionTitle
          title="Production quality"
          description="Choose the setup that most closely represents your typical brand content."
        />

        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              value: "phone_only",
              title: "Phone only",
              description:
                "Phone camera with basic setup",
            },
            {
              value: "phone_lighting_mic",
              title: "Phone + setup",
              description:
                "Phone with lighting / microphone",
            },
            {
              value: "professional",
              title: "Professional",
              description:
                "Camera or professional production setup",
            },
          ].map((item) => {
            const selected =
              creator.productionQuality === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  updateCreator(
                    "productionQuality",
                    item.value
                  )
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  selected
                    ? "border-cyan-400/50 bg-cyan-400/10"
                    : "border-white/10 bg-white/3 hover:border-white/20"
                }`}
              >
                <p className="text-sm font-medium text-white">
                  {item.title}
                </p>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Editing */}
      <section className="space-y-4">
        <SectionTitle
          title="Editing"
          description="How is the final content normally delivered?"
        />

        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              value: "self_edited",
              title: "I edit it myself",
              description:
                "You handle the editing and deliver the finished content.",
            },
            {
              value: "raw",
              title: "Raw footage",
              description:
                "The brand receives raw footage or handles editing.",
            },
          ].map((item) => {
            const selected =
              creator.editing === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  updateCreator(
                    "editing",
                    item.value
                  )
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  selected
                    ? "border-cyan-400/50 bg-cyan-400/10"
                    : "border-white/10 bg-white/3 hover:border-white/20"
                }`}
              >
                <p className="text-sm font-medium text-white">
                  {item.title}
                </p>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Portfolio */}
      <section className="space-y-4">
        <SectionTitle
          title="Portfolio"
          description="Optional, but useful when you're presenting yourself to a brand."
        />

        <input
          type="url"
          value={creator.portfolioUrl}
          onChange={(e) =>
            updateCreator(
              "portfolioUrl",
              e.target.value
            )
          }
          placeholder="https://yourportfolio.com"
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-400/10"
        />
      </section>

      {/* Proven results */}
      <section className="space-y-4">
        <SectionTitle
          title="Proven results"
          description="Have you demonstrated measurable results from previous collaborations?"
        />

        <ToggleField
          label="I have proven results to show brands"
          description="Share measurable results or KPI proof."
          checked={creator.provenResults}
          onChange={(value) =>
            updateCreator(
              "provenResults",
              value
            )
          }
        />

        {creator.provenResults && (
          <textarea
            value={creator.provenResultsNote}
            onChange={(e) =>
              updateCreator(
                "provenResultsNote",
                e.target.value
              )
            }
            placeholder="Example: Generated 120k views for a skincare campaign and drove 85 tracked clicks..."
            rows={4}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-400/10"
          />
        )}
      </section>

      {/* Languages */}
      <section className="space-y-4">
        <SectionTitle
          title="Content languages"
          description="Select the languages you can comfortably create branded content in."
        />

        <div className="flex flex-wrap gap-2">
          {languages.map((language) => {
            const selected =
              creator.languages.includes(language);

            return (
              <button
                key={language}
                type="button"
                onClick={() =>
                  toggleLanguage(language)
                }
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  selected
                    ? "border-fuchsia-400/50 bg-fuchsia-400/10 text-fuchsia-200"
                    : "border-white/10 bg-white/3 text-zinc-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {language}
              </button>
            );
          })}
        </div>
      </section>

      {/* Tip */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
        <div className="flex gap-3">
          <div className="mt-0.5 text-lg">✨</div>

          <div>
            <p className="text-sm font-medium text-white">
              Don't undersell your production work
            </p>

            <p className="mt-1 text-sm leading-6 text-zinc-400">
              A deal isn't priced only by follower count. Production
              quality, editing, experience and proven results can all
              affect the value of a deliverable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}





const [usage, setUsage] = useState({
  paidAds: false,
  duration: "none" as
    | "none"
    | "30_days"
    | "90_days"
    | "6_months"
    | "12_months"
    | "perpetual",
  exclusivity: "none" as
    | "none"
    | "30_days"
    | "60_days"
    | "90_days"
    | "180_days",
  competitorScope: "none" as
    | "none"
    | "narrow"
    | "broad",
  territory: "country" as
    | "local"
    | "country"
    | "global",
  brandCanModify: false,
});


const updateUsage = (
  key: keyof typeof usage,
  value: string | boolean
) => {
  setUsage((prev) => ({
    ...prev,
    [key]: value,
  }));
};



function UsageRightsStep({
  usage,
  updateUsage,
}: {
  usage: {
    paidAds: boolean;
    duration:
      | "none"
      | "30_days"
      | "90_days"
      | "6_months"
      | "12_months"
      | "perpetual";
    exclusivity:
      | "none"
      | "30_days"
      | "60_days"
      | "90_days"
      | "180_days";
    competitorScope:
      | "none"
      | "narrow"
      | "broad";
    territory:
      | "local"
      | "country"
      | "global";
    brandCanModify: boolean;
  };
  updateUsage: (
    key: keyof typeof usage,
    value: string | boolean
  ) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Usage rights & exclusivity
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Tell us what the brand wants to do with your content after
          you deliver it. Extended usage and restrictions can affect
          your pricing significantly.
        </p>
      </div>

      {/* Paid ads */}
      <section className="space-y-4">
        <SectionTitle
          title="Paid advertising"
          description="Will the brand use your content in paid advertisements?"
        />

        <ToggleField
          label="Brand can use my content for paid ads"
          description="Allow paid advertising use of your delivered content."
          checked={usage.paidAds}
          onChange={(value) =>
            updateUsage("paidAds", value)
          }
        />

        {usage.paidAds && (
          <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/5 p-4">
            <p className="text-sm text-fuchsia-200">
              Paid advertising is different from simply posting
              organic content. Make sure the agreement clearly states
              where and how your content can be used.
            </p>
          </div>
        )}
      </section>

      {/* Usage duration */}
      <section className="space-y-4">
        <SectionTitle
          title="Usage duration"
          description="How long can the brand use the delivered content?"
        />

        <SelectField
          label="Content usage period"
          value={usage.duration}
          onChange={(value) =>
            updateUsage("duration", value)
          }
          options={[
            {
              value: "none",
              label: "No additional usage rights",
            },
            {
              value: "30_days",
              label: "30 days",
            },
            {
              value: "90_days",
              label: "90 days",
            },
            {
              value: "6_months",
              label: "6 months",
            },
            {
              value: "12_months",
              label: "12 months",
            },
            {
              value: "perpetual",
              label: "Perpetual / unlimited",
            },
          ]}
        />

        {usage.duration === "perpetual" && (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
            <p className="text-sm text-amber-200">
              Perpetual usage means the brand can continue using the
              content indefinitely. Review this term carefully before
              accepting it.
            </p>
          </div>
        )}
      </section>

      {/* Exclusivity */}
      <section className="space-y-4">
        <SectionTitle
          title="Exclusivity"
          description="Will you be restricted from working with competing brands?"
        />

        <SelectField
          label="Exclusivity duration"
          value={usage.exclusivity}
          onChange={(value) =>
            updateUsage("exclusivity", value)
          }
          options={[
            {
              value: "none",
              label: "No exclusivity",
            },
            {
              value: "30_days",
              label: "30 days",
            },
            {
              value: "60_days",
              label: "60 days",
            },
            {
              value: "90_days",
              label: "90 days",
            },
            {
              value: "180_days",
              label: "180 days",
            },
          ]}
        />

        {usage.exclusivity !== "none" && (
          <div className="space-y-4">
            <SelectField
              label="Competitor scope"
              value={usage.competitorScope}
              onChange={(value) =>
                updateUsage(
                  "competitorScope",
                  value
                )
              }
              options={[
                {
                  value: "narrow",
                  label: "Narrow — direct competitors only",
                },
                {
                  value: "broad",
                  label: "Broad — wider category restriction",
                },
              ]}
            />

            <div className="rounded-2xl border border-orange-400/20 bg-orange-400/5 p-4">
              <p className="text-sm text-orange-200">
                Exclusivity can prevent you from accepting other
                brand deals during the restricted period. Make sure
                the competitor category is clearly defined.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Territory */}
      <section className="space-y-4">
        <SectionTitle
          title="Territory"
          description="Where can the brand use the content?"
        />

        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              value: "local",
              title: "Local",
              description:
                "A specific city or local market",
            },
            {
              value: "country",
              title: "Country",
              description:
                "Across the creator's country",
            },
            {
              value: "global",
              title: "Global",
              description:
                "Worldwide usage",
            },
          ].map((item) => {
            const selected =
              usage.territory === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  updateUsage(
                    "territory",
                    item.value
                  )
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  selected
                    ? "border-cyan-400/50 bg-cyan-400/10"
                    : "border-white/10 bg-white/3 hover:border-white/20"
                }`}
              >
                <p className="text-sm font-medium text-white">
                  {item.title}
                </p>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Modification rights */}
      <section className="space-y-4">
        <SectionTitle
          title="Modification rights"
          description="Can the brand edit, crop, remix or otherwise modify your delivered content?"
        />

        <ToggleField
          label="Brand can modify my content"
          description="The brand may edit, crop, or remix the content."
          checked={usage.brandCanModify}
          onChange={(value) =>
            updateUsage(
              "brandCanModify",
              value
            )
          }
        />
      </section>

      {/* Summary */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
        <p className="text-sm font-medium text-white">
          Current rights summary
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <SummaryItem
            label="Paid ads"
            value={usage.paidAds ? "Included" : "Not included"}
          />

          <SummaryItem
            label="Usage"
            value={formatUsageDuration(usage.duration)}
          />

          <SummaryItem
            label="Exclusivity"
            value={formatExclusivity(usage.exclusivity)}
          />

          <SummaryItem
            label="Territory"
            value={formatTerritory(usage.territory)}
          />

          <SummaryItem
            label="Modification"
            value={
              usage.brandCanModify
                ? "Allowed"
                : "Not allowed"
            }
          />
        </div>
      </div>

      {/* Tip */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
        <div className="flex gap-3">
          <div className="mt-0.5 text-lg">⚠️</div>

          <div>
            <p className="text-sm font-medium text-white">
              Read the rights clause carefully
            </p>

            <p className="mt-1 text-sm leading-6 text-zinc-400">
              A content fee and a usage-rights fee are separate
              concepts. Check duration, paid advertising, territory,
              exclusivity and modification rights before accepting a
              deal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-3">
      <p className="text-xs text-zinc-500">
        {label}
      </p>

      <p className="mt-1 text-sm text-zinc-200">
        {value}
      </p>
    </div>
  );
}

function formatUsageDuration(
  duration:
    | "none"
    | "30_days"
    | "90_days"
    | "6_months"
    | "12_months"
    | "perpetual"
) {
  const labels = {
    none: "No additional rights",
    "30_days": "30 days",
    "90_days": "90 days",
    "6_months": "6 months",
    "12_months": "12 months",
    perpetual: "Perpetual",
  };

  return labels[duration];
}

function formatExclusivity(
  exclusivity: "none" | "30_days" | "60_days" | "90_days" | "180_days"
) {
  const labels = {
    none: "No exclusivity",
    "30_days": "30 days",
    "60_days": "60 days",
    "90_days": "90 days",
    "180_days": "180 days",
  };

  return labels[exclusivity];
}

function formatTerritory(
  territory: "local" | "country" | "global"
) {
  const labels = {
    local: "Local",
    country: "Country",
    global: "Global",
  };

  return labels[territory];
}


// step6

const [brand, setBrand] = useState({
  offerAmount: 0,
  productValue: 0,
  commissionPercent: 0,
  brandSize: "small" as
    | "startup"
    | "small"
    | "mid"
    | "large",
  brandName: "",
  paymentTiming: "on_delivery" as
    | "upfront"
    | "50_50"
    | "on_delivery"
    | "after_post"
    | "net_30"
    | "net_60",
  turnaroundDays: 7,
  contractProvided: false,
  outreachChannel: "dm" as
    | "dm"
    | "email"
    | "whatsapp"
    | "agency",
  representedByAgency: false,
});

const updateBrand = (
  key: keyof typeof brand,
  value: string | number | boolean
) => {
  setBrand((prev) => ({
    ...prev,
    [key]: value,
  }));
};


function formatPaymentTiming(
  timing:
    | "upfront"
    | "50_50"
    | "on_delivery"
    | "after_post"
    | "net_30"
    | "net_60"
) {
  const labels = {
    upfront: "100% upfront",
    "50_50": "50/50",
    on_delivery: "On delivery",
    after_post: "After post",
    net_30: "Net 30",
    net_60: "Net 60",
  };

  return labels[timing];
}


function BrandTermsStep({
  brand,
  updateBrand,
}: {
  brand: {
    offerAmount: number;
    productValue: number;
    commissionPercent: number;
    brandSize:
      | "startup"
      | "small"
      | "mid"
      | "large";
    brandName: string;
    paymentTiming:
      | "upfront"
      | "50_50"
      | "on_delivery"
      | "after_post"
      | "net_30"
      | "net_60";
    turnaroundDays: number;
    contractProvided: boolean;
    outreachChannel:
      | "dm"
      | "email"
      | "whatsapp"
      | "agency";
    representedByAgency: boolean;
  };
  updateBrand: (
    key: keyof typeof brand,
    value: string | number | boolean
  ) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Brand terms
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          What has the brand offered, and what are the commercial
          conditions? We'll compare the offer against your calculated
          target price.
        </p>
      </div>

      {/* Offer */}
      <section className="space-y-4">
        <SectionTitle
          title="What is the brand offering?"
          description="Enter the cash amount offered for the complete deal."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <NumberField
            label="Cash offer (₹)"
            value={brand.offerAmount}
            onChange={(value) =>
              updateBrand("offerAmount", value)
            }
            placeholder="e.g. 5000"
            min={0}
          />

          <NumberField
            label="Product value (₹)"
            value={brand.productValue}
            onChange={(value) =>
              updateBrand("productValue", value)
            }
            placeholder="0 if there is no product"
            min={0}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
          <p className="text-xs leading-5 text-zinc-500">
            Product value is shown separately from cash. Receiving a
            product does not automatically mean it has the same value
            as cash compensation.
          </p>
        </div>
      </section>

      {/* Commission */}
      <section className="space-y-4">
        <SectionTitle
          title="Commission"
          description="If the brand is offering performance-based commission, enter the percentage."
        />

        <div className="max-w-sm">
          <NumberField
            label="Commission (%)"
            value={brand.commissionPercent}
            onChange={(value) =>
              updateBrand(
                "commissionPercent",
                Math.min(100, Math.max(0, value))
              )
            }
            placeholder="e.g. 10"
            min={0}
          />
        </div>
      </section>

      {/* Brand identity */}
      <section className="space-y-4">
        <SectionTitle
          title="Brand"
          description="Optional information about the company making the offer."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-200">
              Brand name
            </label>

            <input
              type="text"
              value={brand.brandName}
              onChange={(e) =>
                updateBrand(
                  "brandName",
                  e.target.value
                )
              }
              placeholder="e.g. BrandName"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-400/10"
            />
          </div>

          <SelectField
            label="Brand size"
            value={brand.brandSize}
            onChange={(value) =>
              updateBrand("brandSize", value)
            }
            options={[
              {
                value: "startup",
                label: "Startup",
              },
              {
                value: "small",
                label: "Small business",
              },
              {
                value: "mid",
                label: "Mid-sized company",
              },
              {
                value: "large",
                label: "Large / established brand",
              },
            ]}
          />
        </div>
      </section>

      {/* Payment */}
      <section className="space-y-4">
        <SectionTitle
          title="Payment terms"
          description="When will you actually receive the money?"
        />

        <SelectField
          label="Payment timing"
          value={brand.paymentTiming}
          onChange={(value) =>
            updateBrand(
              "paymentTiming",
              value
            )
          }
          options={[
            {
              value: "upfront",
              label: "100% upfront",
            },
            {
              value: "50_50",
              label: "50% upfront / 50% later",
            },
            {
              value: "on_delivery",
              label: "On content delivery",
            },
            {
              value: "after_post",
              label: "After content goes live",
            },
            {
              value: "net_30",
              label: "Net 30 days",
            },
            {
              value: "net_60",
              label: "Net 60 days",
            },
          ]}
        />

        {(brand.paymentTiming === "net_30" ||
          brand.paymentTiming === "net_60" ||
          brand.paymentTiming === "after_post") && (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
            <p className="text-sm text-amber-200">
              Delayed payment increases the commercial risk of the
              deal. Make sure the payment deadline is clearly written
              into the agreement.
            </p>
          </div>
        )}
      </section>

      {/* Turnaround */}
      <section className="space-y-4">
        <SectionTitle
          title="Turnaround"
          description="How quickly does the brand expect the content?"
        />

        <div className="max-w-sm">
          <NumberField
            label="Delivery deadline (days)"
            value={brand.turnaroundDays}
            onChange={(value) =>
              updateBrand(
                "turnaroundDays",
                value
              )
            }
            placeholder="e.g. 7"
            min={1}
          />
        </div>

        {brand.turnaroundDays <= 2 && (
          <div className="rounded-2xl border border-orange-400/20 bg-orange-400/5 p-4">
            <p className="text-sm text-orange-200">
              This is a fast turnaround. A rush premium may be applied
              by the pricing engine.
            </p>
          </div>
        )}
      </section>

      {/* Contract */}
      <section className="space-y-4">
        <SectionTitle
          title="Agreement"
          description="Has the brand provided a written contract or agreement?"
        />

        <ToggleField
          label="Brand has provided a contract"
          description="A written agreement or contract is already in place."
          checked={brand.contractProvided}
          onChange={(value) =>
            updateBrand("contractProvided", value)
          }
        />

        {!brand.contractProvided && (
          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4">
            <p className="text-sm text-yellow-200">
              Consider getting the agreed deliverables, payment,
              usage rights and deadlines in writing before starting
              work.
            </p>
          </div>
        )}
      </section>

      {/* Outreach */}
      <section className="space-y-4">
        <SectionTitle
          title="How did the brand contact you?"
          description="This helps describe the deal context."
        />

        <SelectField
          label="Outreach channel"
          value={brand.outreachChannel}
          onChange={(value) =>
            updateBrand(
              "outreachChannel",
              value
            )
          }
          options={[
            {
              value: "dm",
              label: "Instagram / social DM",
            },
            {
              value: "email",
              label: "Email",
            },
            {
              value: "whatsapp",
              label: "WhatsApp",
            },
            {
              value: "agency",
              label: "Agency",
            },
          ]}
        />

        <ToggleField
          label="An agency is representing the brand"
          description="The brand is being managed by an agency or third-party rep."
          checked={brand.representedByAgency}
          onChange={(value) =>
            updateBrand("representedByAgency", value)
          }
        />
      </section>

      {/* Summary */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
        <p className="text-sm font-medium text-white">
          Deal snapshot
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryItem
            label="Cash offer"
            value={`₹${brand.offerAmount.toLocaleString("en-IN")}`}
          />

          <SummaryItem
            label="Product value"
            value={`₹${brand.productValue.toLocaleString("en-IN")}`}
          />

          <SummaryItem
            label="Commission"
            value={`${brand.commissionPercent}%`}
          />

          <SummaryItem
            label="Payment"
            value={formatPaymentTiming(
              brand.paymentTiming
            )}
          />

          <SummaryItem
            label="Turnaround"
            value={`${brand.turnaroundDays} days`}
          />

          <SummaryItem
            label="Contract"
            value={
              brand.contractProvided
                ? "Provided"
                : "Not provided"
            }
          />
        </div>
      </div>
    </div>
  );
}


// stpe 7


const [preferences, setPreferences] = useState({
  minimumRate: 0,
  negotiationTone: "professional" as
    | "friendly"
    | "professional"
    | "firm",
  dealImportance: "flexible" as
    | "need_money"
    | "flexible"
    | "can_walk_away",
});


const updatePreferences = (
  key: keyof typeof preferences,
  value: string | number
) => {
  setPreferences((prev) => ({
    ...prev,
    [key]: value,
  }));
};

function PreferencesStep({
  preferences,
  updatePreferences,
}: {
  preferences: {
    minimumRate: number;
    negotiationTone:
      | "friendly"
      | "professional"
      | "firm";
    dealImportance:
      | "need_money"
      | "flexible"
      | "can_walk_away";
  };
  updatePreferences: (
    key: keyof typeof preferences,
    value: string | number
  ) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Your negotiation preferences
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Pricing isn't only about market-style calculations. Your
          personal minimum and negotiation situation matter too.
        </p>
      </div>

      {/* Minimum rate */}
      <section className="space-y-4">
        <SectionTitle
          title="Your minimum acceptable rate"
          description="The lowest cash amount you'd personally be willing to accept for this deal."
        />

        <div className="max-w-md">
          <NumberField
            label="Minimum rate (₹)"
            value={preferences.minimumRate}
            onChange={(value) =>
              updatePreferences(
                "minimumRate",
                value
              )
            }
            placeholder="Leave at 0 if you don't have a floor"
            min={0}
          />
        </div>

        <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-4">
          <p className="text-sm leading-6 text-cyan-200">
            This acts as your personal floor. The pricing engine will
            not recommend a walk-away price below this amount.
          </p>
        </div>
      </section>

      {/* Negotiation tone */}
      <section className="space-y-4">
        <SectionTitle
          title="Negotiation tone"
          description="How would you like your counteroffer to sound?"
        />

        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              value: "friendly",
              title: "Friendly",
              description:
                "Warm, collaborative and relationship-focused.",
            },
            {
              value: "professional",
              title: "Professional",
              description:
                "Clear, confident and business-focused.",
            },
            {
              value: "firm",
              title: "Firm",
              description:
                "Direct and clear about your requirements.",
            },
          ].map((item) => {
            const selected =
              preferences.negotiationTone ===
              item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  updatePreferences(
                    "negotiationTone",
                    item.value
                  )
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  selected
                    ? "border-fuchsia-400/50 bg-fuchsia-400/10"
                    : "border-white/10 bg-white/3 hover:border-white/20"
                }`}
              >
                <p className="text-sm font-medium text-white">
                  {item.title}
                </p>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Deal importance */}
      <section className="space-y-4">
        <SectionTitle
          title="How important is this deal?"
          description="This helps the negotiation guidance reflect your flexibility."
        />

        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              value: "need_money",
              title: "I need the money",
              description:
                "I'm more willing to negotiate to close the deal.",
            },
            {
              value: "flexible",
              title: "I'm flexible",
              description:
                "I'm open to reasonable trade-offs.",
            },
            {
              value: "can_walk_away",
              title: "I can walk away",
              description:
                "I'm comfortable declining if the terms aren't right.",
            },
          ].map((item) => {
            const selected =
              preferences.dealImportance ===
              item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  updatePreferences(
                    "dealImportance",
                    item.value
                  )
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  selected
                    ? "border-cyan-400/50 bg-cyan-400/10"
                    : "border-white/10 bg-white/3 hover:border-white/20"
                }`}
              >
                <p className="text-sm font-medium text-white">
                  {item.title}
                </p>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Important note */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
        <div className="flex gap-3">
          <div className="mt-0.5 text-lg">🎯</div>

          <div>
            <p className="text-sm font-medium text-white">
              Your floor is personal
            </p>

            <p className="mt-1 text-sm leading-6 text-zinc-400">
              The calculator provides pricing guidance — it doesn't
              decide what you must charge. Your experience, workload,
              relationship with the brand and financial situation can
              all affect what you personally accept.
            </p>
          </div>
        </div>
      </div>

      {/* Ready */}
      <div className="rounded-3xl border border-fuchsia-400/20 bg-linear-to-br from-fuchsia-500/10 to-cyan-500/10 p-6">
        <div className="flex items-start gap-4">
          <div className="text-2xl">🚀</div>

          <div>
            <h3 className="text-base font-semibold text-white">
              You're ready to calculate
            </h3>

            <p className="mt-1 text-sm leading-6 text-zinc-400">
              We now have the deal structure, deliverables, audience,
              creator profile, usage rights, brand offer and your
              negotiation preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



// Result component


function PriceCard({
  label,
  value,
  description,
  featured = false,
}: {
  label: string;
  value: string;
  description: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-6 ${
        featured
          ? "border-fuchsia-400/30 bg-linear-to-br from-fuchsia-500/10 to-cyan-500/10"
          : "border-white/10 bg-white/3"
      }`}
    >
      {featured && (
        <div className="absolute right-4 top-4 rounded-full bg-fuchsia-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-fuchsia-200">
          Target
        </div>
      )}

      <p className="text-sm text-zinc-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-3 text-xs leading-5 text-zinc-500">
        {description}
      </p>
    </div>
  );
}




function BreakdownRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-4 py-3">
      <span className="text-sm text-zinc-400">
        {label}
      </span>

      <span className="text-sm font-medium text-zinc-200">
        ₹{Math.round(value).toLocaleString("en-IN")}
      </span>
    </div>
  );
}


function ConfidenceCard({
  confidence,
}: {
  confidence?: {
    level?: string;
    score?: number;
    reasons?: string[];
  };
}) {
  const confidenceLevels = {
    low: {
      title: "Low confidence",
      description:
        "Some important information is missing, so treat this estimate as a rough starting point.",
    },
    medium: {
      title: "Medium confidence",
      description:
        "The estimate uses several useful inputs, but some variables could still affect the final rate.",
    },
    high: {
      title: "High confidence",
      description:
        "The estimate is based on a relatively complete set of creator, audience, deliverable, and deal inputs.",
    },
  };

  // Normalize the value coming from the API.
  const level = String(
    confidence?.level ?? "medium"
  ).toLowerCase() as keyof typeof confidenceLevels;

  // Safety fallback so the UI can never crash if the API
  // returns an unexpected confidence level.
  const current =
    confidenceLevels[level] ?? confidenceLevels.medium;

  const score = confidence?.score ?? 0;
  const reasons = confidence?.reasons ?? [];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Pricing confidence
          </p>

          <p className="mt-2 text-xl font-semibold text-white">
            {current.title}
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {current.description}
          </p>
        </div>

        <div className="shrink-0 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-white">
            {score}
          </p>

          <p className="text-[10px] uppercase tracking-wider text-zinc-500">
            Score
          </p>
        </div>
      </div>

      {reasons.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
            Why
          </p>

          {reasons.map((reason, index) => (
            <div
              key={`${reason}-${index}`}
              className="flex items-start gap-2 text-sm text-zinc-300"
            >
              <span className="mt-1 text-cyan-400">
                •
              </span>

              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function PricingResultView({
  result,
  onRecalculate,
}: {
  result: any;
  onRecalculate: () => void;
}) {
  const formatMoney = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const evaluation =
    result.offerEvaluation?.evaluation || "unknown";

  const evaluationLabel = {
    good: "Offer is at or above target",
    okay: "Offer is below target but within your range",
    bad: "Offer is below your walk-away price",
  }[evaluation as "good" | "okay" | "bad"] || "Offer evaluated";

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/5 px-3 py-1.5 text-xs text-fuchsia-200">
            <span>✦</span>
            Price analysis complete
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Your deal pricing
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Use these numbers as negotiation guidance, not as a
            guaranteed market rate.
          </p>
        </div>

        <button
          type="button"
          onClick={onRecalculate}
          className="rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-sm text-zinc-300 transition hover:border-white/20 hover:bg-white/6 hover:text-white"
        >
          Recalculate
        </button>
      </div>

      {/* Main price cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <PriceCard
          label="Walk-away"
          value={formatMoney(result.walkAway)}
          description="Don't accept below this without a deliberate trade-off."
        />

        <PriceCard
          featured
          label="Target / Fair Price"
          value={formatMoney(result.target)}
          description="Your primary negotiation target."
        />

        <PriceCard
          label="Opening Ask"
          value={formatMoney(result.openingAsk)}
          description="A starting point that leaves room to negotiate."
        />
      </div>

      {/* Offer evaluation */}
      {result.offerEvaluation && (
        <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Brand offer
              </p>

              <p className="mt-2 text-3xl font-semibold text-white">
                {formatMoney(result.offerEvaluation.offer)}
              </p>

              <p className="mt-2 text-sm text-zinc-400">
                {evaluationLabel}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-left sm:text-right">
              <p className="text-xs text-zinc-500">
                Difference from target
              </p>

              <p className="mt-1 text-xl font-semibold text-white">
                {Math.abs(
                  result.offerEvaluation.gapPercent || 0
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confidence */}
      <div className="grid gap-4 md:grid-cols-2">
        <ConfidenceCard
          confidence={result.confidence}
        />

        {result.assumptions?.length > 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/3 p-6">
            <p className="text-sm font-medium text-white">
              Important assumptions
            </p>

            <div className="mt-4 space-y-2">
              {result.assumptions.map(
                (item: string, index: number) => (
                  <div
                    key={index}
                    className="flex gap-2 text-sm text-zinc-400"
                  >
                    <span className="text-zinc-600">
                      •
                    </span>
                    <span>{item}</span>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Breakdown */}
      {result.deliverables?.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/3 p-6">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Pricing breakdown
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              See what contributes to the calculated target.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {result.deliverables.map(
              (item: any, index: number) => (
                <BreakdownRow
                  key={index}
                  label={
                    item.label ||
                    `Deliverable ${index + 1}`
                  }
                  value={item.total}
                />
              )
            )}

            {result.addons?.map(
              (item: any, index: number) => (
                <BreakdownRow
                  key={`addon-${index}`}
                  label={item.label}
                  value={item.amount}
                />
              )
            )}

            <div className="my-4 border-t border-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                Target price
              </span>

              <span className="text-lg font-semibold text-white">
                {formatMoney(result.target)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Red flags */}
      {result.redFlags?.length > 0 && (
        <div className="rounded-3xl border border-amber-400/10 bg-amber-400/3 p-6">
          <h3 className="text-lg font-semibold text-white">
            Things to check before accepting
          </h3>

          <div className="mt-5 space-y-3">
            {result.redFlags.map(
              (flag: string, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-amber-400/10 bg-amber-400/3 p-4"
                >
                  <span className="text-amber-300">
                    ⚠
                  </span>

                  <p className="text-sm leading-6 text-zinc-300">
                    {flag}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Bottom disclaimer */}
      <div className="rounded-2xl border border-white/5 bg-white/2 p-5 text-center">
        <p className="text-xs leading-5 text-zinc-600">
          Pricing guidance is an estimate based on the information
          you provided. It is not a guaranteed market rate or
          financial advice. Confirm deliverables, rights, payment
          terms and usage in writing.
        </p>
      </div>
    </div>
  );
}
////////


  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-fuchsia-500/20 to-cyan-500/20 text-xl">
            💰
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-white">
              Price Negotiator
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Know your worth before you negotiate.
            </p>
          </div>

        </div>
      </div>

      {/* Disclaimer */}

      <div className="rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-4">
        <p className="text-sm leading-6 text-gray-400">
          Your rate is an estimate based on
          your audience, deliverables, rights
          and deal terms. It is guidance, not
          a guaranteed market rate.
        </p>
      </div>

      {/* Progress */}

      <ProgressSteps step={step} />

      {/* Main form */}


      {result ? (
        <PricingResultView
          result={result}
          onRecalculate={() => {
            setResult(null);
            setStep(1);
          }}
        />
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

        {step === 1 && (
          <DealStep
            value={dealType}
            onChange={setDealType}
          />
        )}

        {step === 2 && (
          <DeliverablesStep
            deliverables={deliverables}
            onUpdate={updateDeliverable}
            onAdd={addDeliverable}
            onRemove={removeDeliverable}
          />
        )}
{step === 3 && (
          AudienceStep({
            dealType,
            audience,
            updateAudience,
          })
)}
        {step === 4 && (
          CreatorProfileStep({
            creator,
            updateCreator,
            toggleLanguage,
          })
)}

       {step === 5 && (
          UsageRightsStep({ usage, updateUsage })
)}

       {step === 6 && (
          BrandTermsStep({ brand, updateBrand })
)}

       {step === 7 && (
          PreferencesStep({ preferences, updatePreferences })
)}




        {/* Navigation */}

        <div className="mt-8 flex justify-between gap-4 border-t border-white/10 pt-6">

          <button
            type="button"
            disabled={step === 1}
            onClick={previousStep}
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ← Back
          </button>

          {step < 7 ? (
            <button
              type="button"
              onClick={nextStep}
              className="rounded-2xl bg-linear-to-r from-fuchsia-500 to-cyan-500 px-7 py-3 text-sm font-medium text-white transition hover:scale-[1.01]"
            >
              Continue →
            </button>
          ) : (
           <button
  type="button"
  onClick={() => {
    console.log("CALCULATE BUTTON CLICKED");
    nextStep();
  }}
  disabled={loading}
  className="rounded-xl bg-linear-to-r from-fuchsia-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
>
  {step === 7
    ? loading
      ? "Calculating..."
      : "Calculate My Price (1 credit)"
    : "Continue"}
</button>
          )}

        </div>
        </div>
      )}
    
    </div>
  );
}

/* =========================================================
   PROGRESS
========================================================= */

function ProgressSteps({
  step,
}: {
  step: Step;
}) {
  const labels = [
    "Deal",
    "Deliverables",
    "Audience",
    "Creator",
    "Rights",
    "Offer",
    "Preferences",
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

      <div className="flex items-center justify-between gap-2">

        {labels.map(
          (label, index) => {
            const number =
              index + 1;

            const active =
              number === step;

            const completed =
              number < step;

            return (
              <div
                key={label}
                className="flex flex-1 items-center"
              >

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition ${
                    active
                      ? "bg-linear-to-r from-fuchsia-500 to-cyan-500 text-white"
                      : completed
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "bg-white/5 text-gray-500"
                  }`}
                >
                  {completed
                    ? "✓"
                    : number}
                </div>

                <span
                  className={`ml-2 hidden text-xs lg:block ${
                    active
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  {label}
                </span>

                {number < 7 && (
                  <div className="mx-2 hidden h-px flex-1 bg-white/10 md:block" />
                )}

              </div>
            );
          }
        )}

      </div>
    </div>
  );
}

/* =========================================================
   STEP 1 — DEAL
========================================================= */

function DealStep({
  value,
  onChange,
}: {
  value: DealType | null;
  onChange: (
    value: DealType
  ) => void;
}) {
  const options: {
    value: DealType;
    title: string;
    description: string;
  }[] = [
    {
      value: "ugc",
      title: "Pure UGC",
      description:
        "The brand posts the content on its own channels.",
    },
    {
      value: "influencer",
      title: "Influencer Post",
      description:
        "You publish the content on your own page.",
    },
    {
      value: "hybrid",
      title: "Hybrid",
      description:
        "You publish the content and the brand can use it.",
    },
    {
      value: "affiliate",
      title: "Affiliate / Commission",
      description:
        "You earn based on sales or commission.",
    },
    {
      value: "gifted",
      title: "Gifted Product",
      description:
        "The brand offers product instead of cash.",
    },
  ];

  return (
    <div>

      <h2 className="text-xl font-semibold text-white">
        What kind of collaboration is this?
      </h2>

      <p className="mt-2 text-sm text-gray-400">
        Choose the arrangement the brand is offering.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">

        {options.map(
          (item) => {
            const selected =
              value === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  onChange(
                    item.value
                  )
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  selected
                    ? "border-cyan-400/50 bg-linear-to-r from-cyan-500/10 to-fuchsia-500/10"
                    : "border-white/10 bg-black/20 hover:border-cyan-400/30 hover:bg-white/5"
                }`}
              >

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <div className="font-medium text-white">
                      {item.title}
                    </div>

                    <div className="mt-2 text-sm leading-5 text-gray-400">
                      {item.description}
                    </div>
                  </div>

                  <div
                    className={`mt-1 h-4 w-4 shrink-0 rounded-full border ${
                      selected
                        ? "border-cyan-300 bg-cyan-300"
                        : "border-white/20"
                    }`}
                  />

                </div>

              </button>
            );
          }
        )}

      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <p className="text-xs leading-5 text-gray-500">
          Not sure? Choose the option closest to
          how the content will actually be used.
          You can adjust it later.
        </p>
      </div>

    </div>
  );
}

/* =========================================================
   STEP 2 — DELIVERABLES
========================================================= */

function DeliverablesStep({
  deliverables,
  onUpdate,
  onAdd,
  onRemove,
}: {
  deliverables: Deliverable[];
  onUpdate: (
    id: string,
    updates: Partial<Deliverable>
  ) => void;
  onAdd: () => void;
  onRemove: (
    id: string
  ) => void;
}) {
  return (
    <div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>
          <h2 className="text-xl font-semibold text-white">
            What are you delivering?
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Add every piece of content the brand expects.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10"
        >
          + Add deliverable
        </button>

      </div>

      <div className="mt-6 space-y-5">

        {deliverables.map(
          (item, index) => (
            <DeliverableCard
              key={item.id}
              item={item}
              index={index}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          )
        )}

      </div>

    </div>
  );
}

/* =========================================================
   DELIVERABLE CARD
========================================================= */

function DeliverableCard({
  item,
  index,
  onUpdate,
  onRemove,
}: {
  item: Deliverable;
  index: number;
  onUpdate: (
    id: string,
    updates: Partial<Deliverable>
  ) => void;
  onRemove: (
    id: string
  ) => void;
}) {
  const availableFormats =
    FORMAT_OPTIONS.filter(
      (format) =>
        format.platform ===
        item.platform
    );

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">

      {/* Card header */}

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-400">
            Deliverable {index + 1}
          </p>

          <h3 className="mt-1 font-medium text-white">
            Content requirement
          </h3>
        </div>

        {index > 0 && (
          <button
            type="button"
            onClick={() =>
              onRemove(item.id)
            }
            className="text-xs text-gray-500 transition hover:text-red-300"
          >
            Remove
          </button>
        )}

      </div>

      {/* Platform + format */}

      <div className="mt-6 grid gap-5 md:grid-cols-2">

        <SelectField
          label="Platform"
          value={item.platform}
          onChange={(value) => {
            const platform =
              value as Platform;

            const firstFormat =
              FORMAT_OPTIONS.find(
                (format) =>
                  format.platform ===
                  platform
              );

            onUpdate(
              item.id,
              {
                platform,
                format:
                  firstFormat?.value ??
                  item.format,
              }
            );
          }}
          options={PLATFORM_OPTIONS.map(
            (item) => ({
              value: item.value,
              label: item.label,
            })
          )}
        />

        <SelectField
          label="Format"
          value={item.format}
          onChange={(value) =>
            onUpdate(
              item.id,
              {
                format:
                  value as DeliverableFormat,
              }
            )
          }
          options={availableFormats.map(
            (item) => ({
              value: item.value,
              label: item.label,
            })
          )}
        />

      </div>

      {/* Quantity + revisions */}

      <div className="mt-5 grid gap-5 md:grid-cols-2">

        <NumberField
          label="Quantity"
          value={item.quantity}
          min={1}
          max={100}
          onChange={(value) =>
            onUpdate(
              item.id,
              {
                quantity: value,
              }
            )
          }
        />

        <NumberField
          label="Included revisions"
          value={item.revisions}
          min={0}
          max={20}
          onChange={(value) =>
            onUpdate(
              item.id,
              {
                revisions: value,
              }
            )
          }
        />

      </div>

      {/* Hooks */}

      <div className="mt-5">

        <NumberField
          label="Hook variants requested"
          value={item.hookVariants}
          min={1}
          max={5}
          onChange={(value) =>
            onUpdate(
              item.id,
              {
                hookVariants: value,
              }
            )
          }
        />

        <p className="mt-2 text-xs text-gray-500">
          Include all requested variations,
          not just the final published video.
        </p>

      </div>

      {/* Toggles */}

      <div className="mt-6 grid gap-3 md:grid-cols-2">

        <ToggleField
          label="Raw footage requested"
          description="Brand receives the original footage."
          checked={
            item.rawFootage
          }
          onChange={(checked) =>
            onUpdate(
              item.id,
              {
                rawFootage:
                  checked,
              }
            )
          }
        />

        <ToggleField
          label="I write the script"
          description="You handle the creative scripting."
          checked={
            item.scriptByCreator
          }
          onChange={(checked) =>
            onUpdate(
              item.id,
              {
                scriptByCreator:
                  checked,
              }
            )
          }
        />

        <ToggleField
          label="Link placement required"
          description="Bio, sticker or another clickable placement."
          checked={
            item.linkRequired
          }
          onChange={(checked) =>
            onUpdate(
              item.id,
              {
                linkRequired:
                  checked,
              }
            )
          }
        />

        <ToggleField
          label="Brand tag / collab required"
          description="Brand tag or collaboration post."
          checked={
            item.brandTagRequired
          }
          onChange={(checked) =>
            onUpdate(
              item.id,
              {
                brandTagRequired:
                  checked,
              }
            )
          }
        />

      </div>

      {/* Stay live */}

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/2 p-4">

        <ToggleField
          label="Post must stay live"
          description="The brand requires the post to remain published."
          checked={
            item.staysLive
          }
          onChange={(checked) =>
            onUpdate(
              item.id,
              {
                staysLive:
                  checked,
              }
            )
          }
        />

        {item.staysLive && (
          <div className="mt-4 max-w-xs">

            <NumberField
              label="Minimum live duration (days)"
              value={
                item.liveDurationDays
              }
              min={1}
              max={3650}
              onChange={(value) =>
                onUpdate(
                  item.id,
                  {
                    liveDurationDays:
                      value,
                  }
                )
              }
            />

          </div>
        )}

      </div>

    </div>
  );
}

/* =========================================================
   REUSABLE INPUTS
========================================================= */

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-300">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40"
      >
        {options.map(
          (option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-black"
            >
              {option.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
  placeholder,
  helpText,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (
    value: number
  ) => void;
  placeholder?: string;
  helpText?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="mb-2 block text-sm text-gray-300">
        {label}
      </label>

      <input
        type="number"
        min={min}
        max={max}
        value={value || ""}
        placeholder={placeholder}
        onChange={(event) => {
          const parsed = event.target.value === ""
            ? 0
            : Number(event.target.value);

          if (
            Number.isNaN(parsed)
          ) {
            return;
          }

          onChange(
            Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min ?? 0, parsed))
          );
        }}
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40"
      />

      {helpText && (
        <p className="text-xs leading-5 text-zinc-500">
          {helpText}
        </p>
      )}
    </div>
  );
}

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onChange(!checked)
      }
      className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition ${
        checked
          ? "border-cyan-400/30 bg-cyan-400/5"
          : "border-white/10 bg-white/2"
      }`}
    >
      <div>
        <div className="text-sm font-medium text-white">
          {label}
        </div>

        <div className="mt-1 text-xs text-gray-500">
          {description}
        </div>
      </div>

      <div
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-linear-to-r from-fuchsia-500 to-cyan-500"
            : "bg-white/10"
        }`}
      >
        <div
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </div>
    </button>
  );
}

/* =========================================================
   PLACEHOLDER
========================================================= */

function PlaceholderStep({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="py-8">

      <h2 className="text-xl font-semibold text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
        {description}
      </p>

      <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-black/20 p-10 text-center">
        <div className="text-3xl">
          ✨
        </div>

        <p className="mt-3 text-sm text-gray-500">
          We'll build this section next.
        </p>
      </div>

    </div>
  );
}
