"use client";

import InstagramPreview from "./instagramPreview";

import WhatsAppPreview from "./whatsappPreview";
import FacebookPreview from "./facebookPreview";
import AmazonPreview from "./amazonPreview";
import {useEffect} from "react";

import {
  X,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import FlipkartPreview from "./flipkartPreview";

import MeeshoPreview from "./meeshoPreview";
import MyntraPreview from "./myntraPreview";
import { motion, AnimatePresence } from "framer-motion";

// ─── Collapsible Accordion Section (mobile only) ────────────────────────────
function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
  icon,
  accentBorder = "border-white/10",
  accentBg = "bg-white/5",
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  accentBorder?: string;
  accentBg?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`overflow-hidden rounded-3xl border ${accentBorder} ${accentBg}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          <span className="text-sm font-semibold text-white">
            {title}
          </span>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Custom hook: is mobile? ─────────────────────────────────────────────────
function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(
      `(max-width: ${breakpoint - 1}px)`
    );

    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile(e.matches);

    handler(mql);
    mql.addEventListener("change", handler as (e: MediaQueryListEvent) => void);

    return () =>
      mql.removeEventListener("change", handler as (e: MediaQueryListEvent) => void);
  }, [breakpoint]);

  return isMobile;
}

interface Props {
  open: boolean;

  onClose: () => void;

  platform: string;

  result: {
    v1: string;
    v2: string;
    v3: string;
  };

  image?: string | null;

  analysis: {
  v1: {
    score: number;
    strengths: string[];
    warnings: string[];
  };

  v2: {
    score: number;
    strengths: string[];
    warnings: string[];
  };

  v3: {
    score: number;
    strengths: string[];
    warnings: string[];
  };
} | null;

analysisLoading: boolean;
price?: string;

imageAnalysis?: any;

imageAnalysisLoading?: boolean;
imageAlreadyAnalyzed?: boolean;

onAnalyzeImage?: () => void;

freeImageAnalysisAvailable?: boolean | null | undefined| "";
}

export default function PreviewModal({
  open,
  onClose,
  platform,
  result,
  image,
  analysis,
analysisLoading,
price,
imageAnalysis,
imageAnalysisLoading,
imageAlreadyAnalyzed,
onAnalyzeImage,
freeImageAnalysisAvailable
}: Props) {

  const mobile = useIsMobile();

    useEffect(() => {
  const handleKeyDown = (
    e: KeyboardEvent
  ) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  window.addEventListener(
    "keydown",
    handleKeyDown
  );

  return () => {
    window.removeEventListener(
      "keydown",
      handleKeyDown
    );
  };
}, [onClose]);


  


  const [activeVariant, setActiveVariant] =
  useState<"v1" | "v2" | "v3">("v1");
 
 const currentAnalysis =
  analysis?.[
    activeVariant as "v1" | "v2" | "v3"
  ];

  const description =
  result?.[activeVariant] || "";
  
const score =
  currentAnalysis?.score || 0;

const strengths =
  currentAnalysis?.strengths || [];

const warnings =
  currentAnalysis?.warnings || [];

  console.log("imageAnalysis:", imageAnalysis);
  if (!open) return null;

  // ── Shared analysis content blocks ──────────────────────────────────────────

  const scoreBlock = (
    <>
      {score === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-lg font-semibold text-white">
            AI Analysis Unavailable
          </p>

          <p className="mt-2 text-sm leading-7 text-gray-400">
            Preview is still available,
            but AI optimization insights
            could not be generated right now.
          </p>
        </div>
      )}

      {score > 0 && (
        <div className="rounded-3xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 p-6">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-fuchsia-300">
            AI Listing Score
          </p>

          <div className="mt-5 flex items-center gap-5">
            {/* Circle */}
            <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border border-fuchsia-500/30 bg-black/40 shadow-[0_0_40px_rgba(217,70,239,0.15)]">
              <div className="absolute inset-2 rounded-full border border-cyan-500/20" />

              <span className="text-3xl font-bold text-white">
                {score > 0 ? `${score}%` : "--"}
              </span>
            </div>

            {/* Meta */}
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold text-white">
                {score >= 85
                  ? "Excellent Listing"
                  : score >= 70
                  ? "Strong Listing"
                  : score >= 55
                  ? "Average Listing"
                  : "Needs Improvement"}
              </p>

              <p className="max-w-xs text-sm leading-6 text-gray-400">
                AI score estimates listing quality using platform formatting behavior, readability, engagement structure, SEO signals, and marketplace compatibility.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const strengthsBlock = (
    <div className="flex flex-col gap-3">
      {strengths.map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 text-sm text-emerald-200"
        >
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          {item}
        </div>
      ))}
    </div>
  );

  const warningsBlock = (
    <div className="flex flex-col gap-3">
      {warnings.map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 text-sm text-amber-200"
        >
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          {item}
        </div>
      ))}
    </div>
  );

  const platformCompatibilityBlock = (
    <div className="flex flex-col gap-3">
      {Object.entries(
        imageAnalysis?.result?.platformFit || {}
      ).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">{key}</span>
            <span className="font-medium text-white">
              {value as number}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const imageAnalysisBlock = imageAnalysis ? (
    <>
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border border-cyan-500/20 bg-black/30 text-2xl font-bold text-white">
          {imageAnalysis?.result?.score}%
        </div>

        <p className="max-w-sm text-sm leading-7 text-gray-400">
          AI evaluated this image for marketplace readiness, visual quality, and platform compatibility.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Strengths */}
        <div>
          <h4 className="mb-3 font-medium text-emerald-300">
            Strengths
          </h4>

          <div className="flex flex-col gap-2">
            {imageAnalysis?.result?.strengths?.map(
              (item: string) => (
                <div key={item} className="text-sm text-gray-300">
                  • {item}
                </div>
              )
            )}
          </div>
        </div>

        {/* Warnings */}
        <div>
          <h4 className="mb-3 font-medium text-amber-300">
            Improvements
          </h4>

          <div className="flex flex-col gap-2">
            {imageAnalysis?.result?.warnings?.map(
              (item: string) => (
                <div key={item} className="text-sm text-gray-300">
                  • {item}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  ) : null;

  // ── Analysis column content ─────────────────────────────────────────────────
  const analysisContent = analysisLoading ? (
    <div className="flex min-h-[320px] flex-col gap-5 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="h-6 w-40 animate-pulse rounded bg-white/10" />
      <div className="h-20 animate-pulse rounded-2xl bg-white/10" />

      <div className="space-y-3">
        <div className="h-4 animate-pulse rounded bg-white/10" />
        <div className="h-4 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
      </div>

      <div className="space-y-3">
        <div className="h-4 animate-pulse rounded bg-white/10" />
        <div className="h-4 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-4 my-8">
      {/* ── Score (always visible) ── */}
      {scoreBlock}

      {/* ── Strengths / Warnings / Platform / Image Analysis ── */}
      {score > 0 && (
        <>
          {mobile ? (
            /* ── MOBILE: collapsible accordions ── */
            <>
              <CollapsibleSection
                title="Strengths"
                defaultOpen={false}
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                accentBorder="border-emerald-500/10"
                accentBg="bg-emerald-500/5"
              >
                {strengthsBlock}
              </CollapsibleSection>

              <CollapsibleSection
                title="Improvements"
                defaultOpen={false}
                icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
                accentBorder="border-amber-500/10"
                accentBg="bg-amber-500/5"
              >
                {warningsBlock}
              </CollapsibleSection>
            </>
          ) : (
            /* ── DESKTOP: flat sections ── */
            <>
              <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-6">
                <h4 className="mb-4 font-semibold text-white">
                  Strengths
                </h4>
                {strengthsBlock}
              </div>

              <div className="rounded-3xl border border-amber-500/10 bg-amber-500/5 p-6">
                <h4 className="mb-4 font-semibold text-white">
                  Improvements
                </h4>
                {warningsBlock}
              </div>
            </>
          )}
        </>
      )}

      {/* ── Platform Compatibility ── */}
      {mobile ? (
        <CollapsibleSection
          title="Platform Compatibility"
          defaultOpen={false}
          accentBorder="border-cyan-500/10"
          accentBg="bg-cyan-500/5"
        >
          {platformCompatibilityBlock}
        </CollapsibleSection>
      ) : (
        <div className="mt-2">
          <h4 className="mb-4 font-medium text-cyan-300">
            Platform Compatibility 
          </h4>
          <p className="text-sm text-gray-400 mb-5">
            How well does your image fit the requirements and best practices of each marketplace?
          </p>
          {platformCompatibilityBlock}
        </div>
      )}

      {/* ── Image Analysis ── */}
      {imageAnalysis && (
        mobile ? (
          <CollapsibleSection
            title="Image Analysis "
            defaultOpen={false}
            accentBorder="border-cyan-500/10"
            accentBg="bg-cyan-500/5"
          >
            {imageAnalysisBlock}
          </CollapsibleSection>
        ) : (
          <div className="rounded-3xl border border-cyan-500/10 bg-cyan-500/5 p-6">
            <h3 className="mb-5 text-lg font-semibold text-white">
              Image Analysis 
            </h3>
            {imageAnalysisBlock}
          </div>
        )
      )}
    </div>
  );

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
  className="flex min-h-screen items-center justify-center p-2 sm:p-4"
  onClick={(e) =>
    e.stopPropagation()
  }
>
{/* ── Modal Container ── */}
<div className="w-full max-w-5xl xl:max-w-[92vw] 2xl:max-w-[85vw] max-h-[90vh] overflow-y-auto xl:overflow-hidden rounded-[32px] border border-white/10 bg-[#050505] p-4 sm:p-6 xl:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <div>
             <div className="flex flex-wrap items-center gap-3">
  
  <h2 className="text-xl sm:text-2xl font-bold text-white">
    Listing Preview
  </h2>

  <div className="rounded-full border border-fuchsia-500/20 shadow-[0_0_20px_rgba(217,70,239,0.15)] bg-fuchsia-500/10 px-4 py-1 text-xs font-medium text-fuchsia-300">
    {platform} Preview
  </div>
</div>

              <p className="mt-1 text-sm text-gray-400">
                AI-powered optimization insights
              </p>
            </div>

           

           <div className="flex flex-wrap items-center justify-end gap-3">
  


  <button
    onClick={onClose}
    className="rounded-2xl border border-white/10 bg-white/5 p-3 text-gray-400 transition hover:bg-white/10 hover:text-white"
  >
    <X className="h-5 w-5" />
  </button>
</div>
          </div>

          {/* Variant Switcher */}
          <div className="mb-5 flex flex-wrap gap-3">
  {[
    {
      key: "v1",
      label: "Emotional",
    },

    {
      key: "v2",
      label: "Features",
    },

    {
      key: "v3",
      label: "Punchy",
    },
  ].map((item) => (
    <button
      key={item.key}
      onClick={() =>
        setActiveVariant(
          item.key as
            | "v1"
            | "v2"
            | "v3"
        )
      }
      className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
        activeVariant === item.key
          ? "bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-lg shadow-fuchsia-500/20"
          : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
      }`}
    >
     <div className="flex flex-col items-start">
  <span className="font-medium">
    {item.label}
  </span>

  <span className="text-[11px] text-gray-300/70">
    {item.key === "v1"
      ? "Story-driven"
      : item.key === "v2"
      ? "SEO-focused"
      : "Short-form"}
  </span>
</div>
    </button>
  ))}
</div>

          {/* ── Split-Panel Grid ── */}
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_420px] 2xl:grid-cols-[1fr_480px]">
            
            {/* ── Preview Column (sticky on xl+) ── */}
            <div className="xl:max-h-[calc(90vh-160px)] xl:overflow-y-auto xl:pr-2" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
           {platform === "Instagram" && (
  <InstagramPreview
    image={image}
    description={description}
           
  />
)}

{platform === "WhatsApp" && (
  <WhatsAppPreview
    image={image}
    description={description}
    
  />
)}

{platform === "Facebook" && (
  <FacebookPreview
    image={image}
    description={description}
    
  />
)}

{platform === "Amazon" && (
  <AmazonPreview
    image={image}
    description={description}
        price={price}
  />
)}

{platform === "Flipkart" && (
  <FlipkartPreview
    image={image}
    description={description}
        price={price}
  />
)}

{platform === "Meesho" && (
  <MeeshoPreview
    image={image}
    description={description}
        price={price}
  />
)}

{platform === "Myntra" && (
  <MyntraPreview
    image={image}
    description={description}
        price={price}
  />
)}
            </div>


            

            {/* ── Analysis Column (scrollable on xl+) ── */}
            <div className="xl:max-h-[calc(90vh-160px)] xl:overflow-y-auto xl:pr-2" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
             
               {image && (
    <div className="flex flex-col gap-2.5">
    <button
      onClick={onAnalyzeImage}
      disabled={
  imageAnalysisLoading ||
  imageAlreadyAnalyzed
}
      className="
relative overflow-hidden rounded-2xl w-full
border border-cyan-500/20
bg-cyan-500/10
px-4 py-2
text-sm font-medium text-cyan-300
transition-all duration-300
hover:bg-cyan-500/20
hover:border-cyan-400/40
hover:shadow-[0_0_25px_rgba(34,211,238,0.15)]
disabled:opacity-50
before:absolute before:inset-0
before:-translate-x-full
before:bg-gradient-to-r
before:from-transparent
before:via-white/10
before:to-transparent
before:transition-transform
before:duration-1000
hover:before:translate-x-full
"
    >
      {
  imageAnalysisLoading
    ? "Analyzing ..."
    : imageAlreadyAnalyzed
    ? "Image already analyzed"
    : "Analyze Product Image (2 Credits)"
}
    </button>

{<p className="mt-2 text-xs text-center text-gray-500">
  {imageAlreadyAnalyzed
    ? "Upload a new image to analyze again."
    : `${freeImageAnalysisAvailable ? '1' : '0'} free AI image analysis available.`}
</p> }
</div>
  )}
              {analysisContent}
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}